angular.module('bottombar',[]).component('bottombar',{
  templateUrl: 'app/shared/bottombar/bottombar.template.html',
  controller: function bottombarController(){
      
    this.isDark = window.data.ui.dark;
    this.list = [
      "a","b","c"
    ];
    
    this.$onInit = ()=>{
        
    }      
  }
});