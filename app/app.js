'use strict';

var datatron = angular.module('datatron', [ 'ngRoute', 'ngResource']);

    datatron.config(function ($routeProvider) {

    $routeProvider
        .when('/dashboard', {
            templateUrl: 'pages/dashboard.html',
            controller: 'dashboardController'
        })
        .when('/salad/:name', {
            templateUrl: 'pages/saladDetail.html',
            controller: 'saladController'

        })
        .otherwise({redirectTo: '/dashboard'});
});
