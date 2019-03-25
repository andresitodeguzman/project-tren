angular.module('system',[]).component('system',{
    templateUrl:'app/activity/system/system.template.html',
    controller: function systemController(){
        
        this.isDark = window.data.ui.dark;
        this.currentId = false;
        this.currentSystem = false;
        this.stations = window.data.stations;
        this.systems = window.data.systems;
        
        // add all controller functions here
        this.$onInit = ()=>{
            window.ui.update();
            if(window.location.hash.substring(13)){
				this.currentId = window.location.hash.substring(13);
            	this.currentSystem =  window.systems.getById(this.currentId);
                this.stations = window.stations.filter('system_id',this.currentId);
            }
                                 
        };
        
        this.exit = ()=>{
				$("#bsExit").fadeIn();
            	setTimeout(()=>{
                	window.location.replace("#!home");    
                },150);
        }
        
                
    }
});