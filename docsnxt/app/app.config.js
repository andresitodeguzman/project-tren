angular.module('projectTrenApp').config([
  '$routeProvider',
  function config($routeProvider){
    $routeProvider
      .when('/',{template:"<home></home>"})
      .when('/home',{template:"<home></home>"})
      .when('/ride',{template:"<ride></ride>"})
      .when('/more',{template:"<more></more>"})
      .when('/system',{template:"<system></system>"})
      .when('/ride/history',{template:"<ridehistory></ridehistory>"})
      .when('/about',{template:"<about></about>"})
      .when('/station',{template:"<station></station>"})
      .otherwise('/');
  }
]);