angular.module('about',[]).component('about',{
   templateUrl:'app/activity/about/about.template.html',
   controller: function aboutController(){
       
       this.isDark = window.data.ui.dark;
       
       this.$onInit = ()=>{
           
           window.ui.update();
           
       }
       
   }
});