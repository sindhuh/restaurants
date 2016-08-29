var datatron = angular.module('datatron');

datatron.controller('indexController', function ($scope) {
    $scope.message = 'indexController!';

});

datatron.controller('saladController', function ($scope, $routeParams) {
    var mapping = [{name: "Green Salad", description: "Green Salad"},
        {name: "Green Curry", description: "Green Curry tends to be one of the tasty curries of Thai cuisine. Green curry features beef but it could also be prepared with chicken, pork or prawns."},
        {name: "Son Tum Salad", description: "Green Salad"},
        {name: "*Mango Salad", description: "Green Salad"},
        {name: "Beef Salad", description: "Green Salad"},
        {name: "Green Salad", description: "Green Salad"},
        {name : "Green Salad", description: "Green Salad"}];
        {}
        for (var i = 0; i < mapping.length; i++) {
            if (mapping[i].name == $routeParams.name) {
                $scope.saladName = mapping[i].name;
                $scope.description = mapping[i].description;
            }
        }
});

datatron.controller('dashboardController', function ($scope) {
    $scope.salads = [{
        name: "Green Salad",
        med: 25,
        large: 45
    }, {
        name: "Son Tum Salad",
        med: 25,
        large: 45
    }, {
        name: "*Mango Salad",
        med: 25,
        large: 45
    }, {
        name: "Beef Salad",
        med: 25,
        large: 45
    }];

    $scope.appetizers = [{
        name: "Fresh Roll", price: "25pcs/$45"
    }, {
        name: "Crispy Roll", price: "25pcs/$45"
    }, {
        name: "Golden Triangle Tofu", price: "20pcs/$18"
    }, {
        name: "Roti Pa Nang", price: "20pcs/$18"
    }, {
        name: "Basil Rolls", price: "20pcs/$18"
    }, {
        name: "Crispy Cheese Puff", price: "40pcs/$25"
    }, {
        name: "Satay", price: "25pcs/$40"
    }];

    $scope.StirFry = [{
        name: "cashew",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "Siam",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "Mix Veggies",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "Broccoli",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "Ginger",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "Bassil",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 155
    }, {
        name: "Eggplant",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "Fresh Chilli",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 155
    }, {
        name: "Prik King",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "Sweet & Sour",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 115,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }]

    $scope.friedRice_Noodles = [
        {
            name: "House Fried Rice",
            med_veggies: 40,
            med_pork: 50,
            large_veggies: 110,
            large_pork: 120,
            large_beef: 130,
            large_prawn: 150
        }, {
            name: "Brown Rice Fried Rice",
            med_veggies: 45,
            med_pork: 55,
            large_veggies: 115,
            large_pork: 125,
            large_beef: 135,
            large_prawn: 155
        }, {
            name: "Pineapple Fried Rice",
            med_veggies: 45,
            med_pork: 55,
            large_veggies: 115,
            large_pork: 125,
            large_beef: 135,
            large_prawn: 155
        }, {
            name: "Spicy Fried Rice",
            med_veggies: 40,
            med_pork: 50,
            large_veggies: 110,
            large_pork: 120,
            large_beef: 130,
            large_prawn: 150
        }, {
            name: "See Ew Noodle",
            med_veggies: 45,
            med_pork: 55,
            large_veggies: 115,
            large_pork: 125,
            large_beef: 135,
            large_prawn: 155
        }, {
            name: "Pad Thai Noodle",
            med_veggies: 40,
            med_pork: 50,
            large_veggies: 110,
            large_pork: 120,
            large_beef: 130,
            large_prawn: 150
        }, {
            name: "Kee Moe Noodle",
            med_veggies: 45,
            med_pork: 55,
            large_veggies: 115,
            large_pork: 125,
            large_beef: 135,
            large_prawn: 155
        }];

    $scope.signatureCurries = [{
        name: "Yellow Curry",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 150
    }, {
        name: "Red Curry",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 150
    }, {
        name: "Green Curry",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 150
    }, {
        name: "Pa Nang Curry",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 150
    }, {
        name: "Mussaman Curry",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 150
    }, {
        name: "Pineapple Curry",
        med_veggies: 50,
        med_pork: 60,
        large_veggies: 120,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }, {
        name: "*Pumpkin Curry",
        med_veggies: 45,
        med_pork: 55,
        large_veggies: 110,
        large_pork: 120,
        large_beef: 130,
        large_prawn: 150
    }, {
        name: "* Mango Curry",
        med_veggies: 50,
        med_pork: 60,
        large_veggies: 120,
        large_pork: 125,
        large_beef: 135,
        large_prawn: 155
    }]

    $scope.smallTable = [{name: "Jasmine Rice", med: 15, large: 30}, {
        name: "Brown Rice",
        med: 25,
        large: 50
    }, {name: "*Mango Sticky Rice", med: "sold by order"},
        {name: "Fried Banana", med: "20pcs/$15"}]

    $scope.saladDetail = function (salad) {
        console.log("reaching salad detali");


        // $location.path('#/user/' + client.tagid);
    };
});


