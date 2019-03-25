angular.module('ride',['ridedash']).component('ride',{
    templateUrl:'app/activity/ride/ride.template.html',
    controller: function rideController(){
        
        this.isDark = window.data.ui.dark;
        
        // add all controller functions here
        this.$onInit = ()=>{
            $("#bsExit").hide();
            $("#bsEnter").fadeOut();
            
            $("body").removeClass("grey");
            $("body").removeClass("lighten-4");
            $("body").addClass("blue-grey");
            $("body").addClass("darken-4");
		
           	$("meta[name=theme-color]").attr("content","#263238");
            
        };
        
        this.exit = ()=>{
				$("#bsExit").fadeIn();
            	setTimeout(()=>{
                	window.location.replace("#!home");    
                },150);
        }
        
                
    }
});