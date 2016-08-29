function renderAirflowGraph(data) {
    console.log("data : ", data);
    var highlight_color = "#000000";
    var upstream_color = "#2020A0";
    var downstream_color = "#0000FF";

    var nodes = data.nodes;
    console.log("nodes :  ", nodes);
    var edges = data.edges;
    console.log("edges :  ", edges);
    var tasks = data.tasks;
    console.log("tasks :  ", tasks);
    var task_instances = data.task_instances;
    console.log("task_instances :  ", task_instances);


    var execution_date = data.execution_date;
    var arrange = data.arrange;
    var g = dagreD3.json.decode(nodes, edges);
    var duration = 500;
    var stateFocusMap = {
        'no status': false, 'failed': false, 'running': false,
        'queued': false, 'success': false
    };

    var layout = dagreD3.layout().rankDir(arrange).nodeSep(15).rankSep(15);
    var renderer = new dagreD3.Renderer();
    console.log("renderer" , renderer);
    renderer.layout(layout).run(g, d3.select("#dig"));
    inject_node_ids(tasks);
    update_nodes_states(task_instances);

    d3.selectAll("g.node").on("click", function (d) {
        task = tasks[d];
        if (task.task_type == "SubDagOperator")
            call_modal(d, execution_date, true);
        else
            call_modal(d, execution_date);
    });


    function highlight_nodes(nodes, color) {
        nodes.forEach(function (nodeid) {
            my_node = d3.select('#' + nodeid + ' rect');
            my_node.style("stroke", color);
        })
    }

    d3.selectAll("g.node").on("mouseover", function (d) {
        d3.select(this).selectAll("rect").style("stroke", highlight_color);
        highlight_nodes(g.predecessors(d), upstream_color)
        highlight_nodes(g.successors(d), downstream_color)

    });

    d3.selectAll("g.node").on("mouseout", function (d) {
        d3.select(this).selectAll("rect").style("stroke", null);
        highlight_nodes(g.predecessors(d), null)
        highlight_nodes(g.successors(d), null)
    });

    if (blur) {
        d3.selectAll("text").attr("class", "");

    }

    d3.selectAll("div.legend_item.state")
        .style("cursor", "pointer")
        .on("mouseover", function () {
            if (!stateIsSet()) {
                state = d3.select(this).text();
                focusState(state);
            }
        })
        .on("mouseout", function () {
            if (!stateIsSet()) {
                clearFocus();
            }
        });

    d3.selectAll("div.legend_item.state")
        .on("click", function () {
            state = d3.select(this).text();
            color = d3.select(this).style("border-color");

            if (!stateFocusMap[state]) {
                clearFocus();
                focusState(state, this, color);
                setFocusMap(state);

            } else {
                clearFocus();
                setFocusMap();
            }
        });

    d3.select("#searchbox").on("keyup", function () {
        var s = document.getElementById("searchbox").value;
        var match = null;

        if (stateIsSet) {
            clearFocus();
            setFocusMap();
        }

        d3.selectAll("g.nodes g.node").filter(function (d, i) {
            if (s == "") {
                d3.select("g.edgePaths")
                    .transition().duration(duration)
                    .style("opacity", 1);
                d3.select(this)
                    .transition().duration(duration)
                    .style("opacity", 1)
                    .selectAll("rect")
                    .style("stroke-width", "2px");
            }
            else {
                d3.select("g.edgePaths")
                    .transition().duration(duration)
                    .style("opacity", 0.2);
                if (d.indexOf(s) > -1) {
                    if (!match)
                        match = this;
                    d3.select(this)
                        .transition().duration(duration)
                        .style("opacity", 1)
                        .selectAll("rect")
                        .style("stroke-width", "10px");
                }
                else {
                    d3.select(this)
                        .transition()
                        .style("opacity", 0.2).duration(duration)
                        .selectAll("rect")
                        .style("stroke-width", "2px");
                }
            }
        });
        if (match) {
            var transform = d3.transform(d3.select(match).attr("transform"));
            transform.translate = [
                -transform.translate[0] + 520,
                -(transform.translate[1] - 400)
            ];
            transform.scale = [1, 1];

            d3.select("g.zoom")
                .transition()
                .attr("transform", transform.toString());
            renderer.zoom_obj.translate(transform.translate);
            renderer.zoom_obj.scale(1);
        }
    });


    // Injecting ids to be used for parent/child highlighting
    // Separated from update_node_states since it must work even
    // when there is no valid task instance available
    function inject_node_ids(tasks) {
        $.each(tasks, function (task_id, task) {
            $('tspan').filter(function (index) {
                return $(this).text() === task_id;
            })
                .parent().parent().parent()
                .attr("id", task_id);
        });
    }


    // Assigning css classes based on state to nodes
    function update_nodes_states(task_instances) {
        $.each(task_instances, function (task_id, ti) {
            $('tspan').filter(function (index) {
                return $(this).text() === task_id;
            })
                .parent().parent().parent()
                .attr("class", "node enter " + ti.state)
                .attr("data-toggle", "tooltip")
                .attr("data-original-title", function (d) {
                    // Tooltip
                    task = tasks[task_id];
                    tt = "Task_id: " + ti.task_id + "<br>";
                    tt += "Run: " + ti.execution_date + "<br>";
                    if (ti.run_id != undefined) {
                        tt += "run_id: <nobr>" + ti.run_id + "</nobr><br>";
                    }
                    tt += "Operator: " + task.task_type + "<br>";
                    tt += "Started: " + ti.start_date + "<br>";
                    tt += "Ended: " + ti.end_date + "<br>";
                    tt += "Duration: " + ti.duration + "<br>";
                    tt += "State: " + ti.state + "<br>";
                    return tt;
                });
        });
    }

    function clearFocus() {
        d3.selectAll("g.node")
            .transition(duration)
            .style("opacity", 1);
        d3.selectAll("g.node rect")
            .transition(duration)
            .style("stroke-width", "2px");
        d3.select("g.edgePaths")
            .transition().duration(duration)
            .style("opacity", 1);
        d3.selectAll("div.legend_item.state")
            .style("background-color", null);
    }

    function focusState(state, node, color) {
        d3.selectAll("g.node")
            .transition(duration)
            .style("opacity", 0.2);
        d3.selectAll("g.node." + state)
            .transition(duration)
            .style("opacity", 1);
        d3.selectAll("g.node." + state + " rect")
            .transition(duration)
            .style("stroke-width", "10px")
            .style("opacity", 1);
        d3.select("g.edgePaths")
            .transition().duration(duration)
            .style("opacity", 0.2);
        d3.select(node)
            .style("background-color", color);
    }

    function setFocusMap(state) {
        for (var key in stateFocusMap) {
            stateFocusMap[key] = false;
        }
        if (state != null) {
            stateFocusMap[state] = true;
        }
    }

    function stateIsSet() {
        for (var key in stateFocusMap) {
            if (stateFocusMap[key]) {
                return true
            }
        }
        return false
    }

    function error(msg) {
        $('#error_msg').html(msg);
        $('#error').show();
        $('#loading').hide();
        $('#chart_section').hide(1000);
        $('#datatable_section').hide(1000);
    }

    d3.select("#refresh_button").on("click",
        function () {
            $("#loading").css("display", "block");
            $("div#svg_container").css("opacity", "0.2");
            // idanta marchali. jquery use chesukunnadu. ippudu avasaram ledu, but marchali.
            $.get(
                "/admin/airflow/object/task_instances",
                {dag_id: "{{ dag.dag_id }}", execution_date: "{{ execution_date }}"})
                .done(
                    function (task_instances) {
                        update_nodes_states(JSON.parse(task_instances));
                        $("#loading").hide();
                        $("div#svg_container").css("opacity", "1");
                        $('#error').hide();
                    }
                ).fail(function (jqxhr, textStatus, err) {
                error(textStatus + ': ' + err);
            });
        }
    );
}