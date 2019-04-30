angular.module('ride',['ridedash']).component('ride',{
    templateUrl:'app/activity/ride/ride.template.html',
    controller: function rideController(){
        
        this.isDark = window.data.ui.dark;
        this.positionWatcher = null;
        
        // add all controller functions here
        this.$onInit = ()=>{
            $("#bsExit").hide();
            $("#bsEnter").fadeOut();
            
            $("body").removeClass("grey");
            $("body").removeClass("lighten-4");
            $("body").addClass("blue-grey");
            $("body").addClass("darken-4");
		
           	$("meta[name=theme-color]").attr("content","#263238");
            
            if('geolocation' in navigator){
                this.positionWatcher = navigator.geolocation.watchPosition(succ=>{
                    window.ride.updateCurrent(succ.coords);
                    this.currentStation = window.stations.nearestOne(succ.coords.latitude,succ.coords.longitude);
                    
                    console.log(JSON.stringify(succ));
                    $(".currentStation").html(`${this.currentStation.name} Station`);
                    console.log(this.currentStation);
                    if(!this.currentStation){
                        if(!window.data.ride.currentStation){
                            $("#rideInterface").hide();
                            $("#noNearbyStation").show();
                        }
                    } else {
                        window.ride.updateCurrent(this.currentStation);
                        console.log('Updated');
                        console.log(this.currentStation);
                    }
                    
                }, err=>{
                 	console.log(err);
                });
            } else {
                $("#geolocationNotAllowed").show();
                $("#rideInterface").hide();
            }
            
        };
        
        this.exit = ()=>{
            $("#bsExit").fadeIn();
            setTimeout(()=>{
                window.location.replace("#!home");    
            },150);
        }
        
        this.clearWatcher = ()=>{
            if('geolocation' in navigator){
                navigator.geolocation.clearWatch(this.positionWatcher);
            }
        }
        
                
    }
});
