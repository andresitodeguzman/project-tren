angular.module('projectTrenApp').config([
  '$routeProvider',
  function config($routeProvider){
    $routeProvider
      .when('/',{template:"<home></home>"})
      .when('/ride',{template:"<ride></ride>"})
      .otherwise('/');
  }
]);