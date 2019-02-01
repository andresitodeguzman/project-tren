angular.module('projectTrenApp').config([
  '$routeProvider',
  function config($routeProvider){
    $routeProvider
      .when('/',{template:"<home></home>"})
      .otherwise('/');
  }
]);