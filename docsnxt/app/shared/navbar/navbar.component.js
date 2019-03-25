angular.module('navbar',[]).component('navbar',{
    templateUrl:'app/shared/navbar/navbar.template.html',
    controller: function navbarController(){
        this.color = "grey lighten-3";
        this.shadow = "z-depth-0";
        this.title = "";
        this.titleColor = "black-text";

      // Some controller functions here
    }
});