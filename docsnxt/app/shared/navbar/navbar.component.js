angular.module('navbar').component('navbar',{
    templateUrl:'app/shared/navbar/navbar.template.html',
    controller: function navbarController(){
        this.color = "transparent";
        this.shadow = "z-depth-0";
        this.title = "Hello PH";
        this.titleColor = "white-text";

      // Some controller functions here
    }
});