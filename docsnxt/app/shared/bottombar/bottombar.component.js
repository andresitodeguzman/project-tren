angular.module('bottombar').component('bottombar',{
  templateUrl: 'app/shared/bottombar/bottombar.template.html',
  controller: function bottombarController(){
    this.list = [
      "a","b","c"
    ];
  }
});