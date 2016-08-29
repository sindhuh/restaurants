function renderAirflowTree(data) {
   // console.log("reaching renderAirflowTree")
    var barHeight = 20;
    var axisHeight = 40;
    var square_x = 500;
    var square_size = 10;
    var square_spacing = 2;
    var margin = {top: barHeight / 2 + axisHeight, right: 0, bottom: 0, left: barHeight / 2},
        width = 960 - margin.left - margin.right,
        barWidth = width * 0.9;

    var i = 0, duration = 400, root, node;

    var tree = d3.layout.tree().nodeSize([0, 25]);
    var nodes = tree.nodes(data);
    var nodeobj = {};
    for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        nodeobj[node.name] = node;
    }

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var svg = d3.select("svg")
    //.attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("class", "level")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.x0 = 0;
    data.y0 = 0;

    if (nodes.length == 1)
        var base_node = nodes[0];
    else
        var base_node = nodes[1];

    var num_square = base_node.instances.length;
    var extent = d3.extent(base_node.instances, function (d, i) {
        var dttm = new Date(d.execution_date);
        dttm.setHours(dttm.getHours() + 7)
        return dttm;
    });
    var xScale = d3.time.scale()
        .domain(extent)
        .range([
            square_size / 2,
            (num_square * square_size) + ((num_square - 1) * square_spacing) - (square_size / 2)
        ]);

    d3.select("svg")
        .insert("g")
        .attr("transform",
            "translate(" + (square_x + margin.left) + ", " + axisHeight + ")")
        .attr("class", "axis").call(
        d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .ticks(2)
    )
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "start");
    function node_class(d) {
        var sclass = "node";
        if (d.children === undefined && d._children === undefined)
            sclass += " leaf";
        else {
            sclass += " parent";
            if (d.children === undefined)
                sclass += " collapsed"
            else
                sclass += " expanded"
        }
        return sclass;
    }

    update(root = data);
    function update(source) {

        // Compute the flattened node list. TODO use d3.layout.hierarchy.
        var nodes = tree.nodes(root);

        var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);
        var width = square_x + (num_square * (square_size + square_spacing)) + margin.left + margin.right + 50;
        d3.select("svg").transition()
            .duration(duration)
            .attr("height", height)
            .attr("width", width);

        d3.select(self.frameElement).transition()
            .duration(duration)
            .style("height", height + "px");

        // Compute the "layout".
        nodes.forEach(function (n, i) {
            n.x = i * barHeight;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        var nodeEnter = node.enter().append("g")
            .attr("class", node_class)
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .style("opacity", 1e-6);

        nodeEnter.append("circle")
            .attr("r", (barHeight / 3))
            .attr("class", "task")
            .attr("data-toggle", "tooltip")
            .attr("title", function (d) {
                var tt = "";
                if (d.operator != undefined) {
                    tt += "operator: " + d.operator + "<br/>";
                    tt += "depends_on_past: " + d.depends_on_past + "<br/>";
                    tt += "upstream: " + d.num_dep + "<br/>";
                    tt += "retries: " + d.retries + "<br/>";
                    tt += "owner: " + d.owner + "<br/>";
                    tt += "start_date: " + d.start_date + "<br/>";
                    tt += "end_date: " + d.end_date + "<br/>";
                }
                return tt;
            })
            .attr("height", barHeight)
            .attr("width", function (d, i) {
                return barWidth - d.y;
            })
            .style("fill", function (d) {
                return d.ui_color;
            })
            .attr("task_id", function (d) {
                return d.name
            })
            .on("click", toggles);

        var text = nodeEnter.append("text")
            .attr("dy", 3.5)
            .attr("dx", barHeight / 2)
            .text(function (d) {
                return d.name;
            });

        if (blur) {
            text.attr("class", "blur");
        }

        nodeEnter.append('g')
            .attr("class", "stateboxes")
            .attr("transform",
                function (d, i) {
                    return "translate(" + (square_x - d.y) + ",0)";
                })
            .selectAll("rect").data(function (d) {
            return d.instances;
        })
            .enter()
            .append('rect')
            .on("click", function (d) {
                if (d.task_id === undefined) {
                    window.location = '/admin/dagrun/edit/?id=' + d.id;
                }
                else if (nodeobj[d.task_id].operator == 'SubDagOperator')
                    call_modal(d.task_id, d.execution_date, true);
                else
                    call_modal(d.task_id, d.execution_date);
            })
            .attr("class", function (d) {
                return "state " + d.state
            })
            .attr("data-toggle", "tooltip")
            .attr("rx", function (d) {
                return (d.run_id != undefined) ? "5" : "0"
            })
            .attr("ry", function (d) {
                return (d.run_id != undefined) ? "5" : "0"
            })
            .style("shape-rendering", function (d) {
                return (d.run_id != undefined) ? "auto" : "crispEdges"
            })
            .style("stroke-width", function (d) {
                return (d.run_id != undefined) ? "2" : "1"
            })
            .style("stroke-opacity", function (d) {
                return d.external_trigger ? "0" : "1"
            })
            .attr("title", function (d) {
                s = "Task_id: " + d.task_id + "<br>";
                s += "Run: " + d.execution_date + "<br>";
                if (d.run_id != undefined) {
                    s += "run_id: <nobr>" + d.run_id + "</nobr><br>";
                }
                s += "Operator: " + d.operator + "<br>"
                if (d.start_date != undefined) {
                    s += "Started: " + d.start_date + "<br>";
                    s += "Ended: " + d.end_date + "<br>";
                    s += "Duration: " + d.duration + "<br>";
                    s += "State: " + d.state + "<br>";
                }
                return s;
            })
            .attr('x', function (d, i) {
                return (i * (square_size + square_spacing));
            })
            .attr('y', -square_size / 2)
            .attr('width', 10)
            .attr('height', 10)
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .style('stroke-width', 3)
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .style("stroke-width", function (d) {
                        return (d.run_id != undefined) ? "2" : "1"
                    })
            });


        // Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            })
            .style("opacity", 1);

        node.transition()
            .duration(duration)
            .attr("class", node_class)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            })
            .style("opacity", 1);

        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .style("opacity", 1e-6)
            .remove();

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(tree.links(nodes), function (d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        $('#loading').remove()
    }

    function set_tooltip() {
        $("rect.state").tooltip({
            html: true,
            container: "body",
        });
        $("circle.task").tooltip({
            html: true,
            container: "body",
        });

    }

    function toggles(clicked_d) {
        // Collapse nodes with the same task id
        d3.selectAll("[task_id='" + clicked_d.name + "']").each(function (d) {
            if (clicked_d != d && d.children) {
                d._children = d.children;
                d.children = null;
                update(d);
            }
        });

        // Toggle clicked node
        if (clicked_d._children) {
            clicked_d.children = clicked_d._children;
            clicked_d._children = null;
        } else {
            clicked_d._children = clicked_d.children;
            clicked_d.children = null;
        }
        update(clicked_d);
        set_tooltip();
    }

    // Toggle children on click.
    function click(d) {
        if (d.children || d._children) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
            set_tooltip();
        }
    }

    set_tooltip();
}