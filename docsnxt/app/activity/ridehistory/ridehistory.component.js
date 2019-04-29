angular.module('ridehistory',[]).component('ridehistory',{
    
    templateUrl:'app/activity/ridehistory/ridehistory.template.html',
    controller: function rideHistoryController(){
        
        this.isDark = window.data.ui.dark;   
        this.pastRides = [];
        this.stations = window.stations;
        
        this.$onInit = ()=>{
            window.ui.update();
            this.pastRides = window.ride.getPastRides();
        }
    }

});