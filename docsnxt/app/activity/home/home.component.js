angular.module('home',['navbar','bottombar']).component('home',{
  
  templateUrl: 'app/activity/home/home.template.html',
  controller: function homeController(){
    // Some code here
    this.isDark  = window.data.ui.dark;
    this.headerMessage = "Morning is surely great!";
    this.stations = window.data.stations;
    this.systems = window.data.systems;
    this.recentStations = window.data.ride.pastRides;
    this.nearestStations = [];
      
    this.sList = [];
    this.sList.lrt1 = (this.stations.filter(obj=>{if(obj.system_id == 1) return obj})).slice(0,5);
    this.sList.lrt2 = (this.stations.filter(obj=>{if(obj.system_id == 2) return obj})).slice(0,5);
    this.sList.mrt3 = (this.stations.filter(obj=>{if(obj.system_id == 3) return obj})).slice(0,5);
      
    this.$onInit = ()=>{        
      window.ui.update();
      if('geolocation' in navigator){          
          navigator.geolocation.getCurrentPosition(succ=>{
              window.data.ride.currentCoursePosition = succ.coords;
             this.nearestStations = window.stations.nearbyStations(succ.coords.latitude,succ.coords.longitude);
          }, err=>{
              console.log(err);
          });
      }
        
      setTimeout(()=>{
          if('geolocation' in navigator){
              navigator.geolocation.getCurrentPosition(succ=>{
                  
                  console.log(succ);
                  
              },err=>{
                 console.log(err); 
              });
          }
      },40000);  
        
    };

  this.hideModal = (ans)=>{
   	console.log(ans);
  	$("#stationModal").fadeOut(); 
  };
 
  this.showModal = ()=>{
    $("#stationModal").fadeIn();
  }
  

      
  }
    
});
