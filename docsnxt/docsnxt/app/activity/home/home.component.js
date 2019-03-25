angular.module('home',['navbar','bottombar']).component('home',{
  
  templateUrl: 'app/activity/home/home.template.html',
  controller: function homeController(){
    // Some code here
    this.isDark  = window.data.ui.dark;
    this.headerMessage = "Afternoon rush? We'll get home soon";
    this.stations = window.data.stations;
    this.systems = window.data.systems;
    this.recentStations = window.data.recents.stationList;
      
    this.sList = [];
    this.sList.lrt1 = (this.stations.filter(obj=>{if(obj.system_id == 1) return obj})).slice(0,5);
    this.sList.lrt2 = (this.stations.filter(obj=>{if(obj.system_id == 2) return obj})).slice(0,5);
    this.sList.mrt3 = (this.stations.filter(obj=>{if(obj.system_id == 3) return obj})).slice(0,5);
      
    this.$onInit = ()=>{        
      window.ui.update();
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