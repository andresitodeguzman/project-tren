angular.module('station',[]).component('station',{
    
    templateUrl:'app/activity/station/station.template.html',
    controller: function stationController(){
        
        this.isDark = window.data.ui.dark;
        this.systems = window.systems;
        this.currentId = null;
        this.currentStation = null;
        
        this.$onInit = ()=>{
            window.ui.update();
            if(window.location.hash.substring(14)){
				this.currentId = window.location.hash.substring(14);
                this.currentStation = window.stations.getById(this.currentId);
            }
        };
        
    }
    
});