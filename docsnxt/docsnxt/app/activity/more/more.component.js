angular.module('more',['navbar','bottombar']).component('more',{
  
  templateUrl: 'app/activity/more/more.template.html',
  controller: function moreController(){
    // Some code here
    this.stations = window.data.stations;
    this.$onInit = ()=>{
    };
            
  }
  
});