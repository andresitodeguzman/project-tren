window.ride = {
  
    
    updateCurrent: obj=>{
        localStorage.setItem('current-location',JSON.stringify(obj));
    	window.data.ride.currentLocation = obj;
    },
    
    updateCourse: obj=>{
        localStorage.setItem('course-location',JSON.stringify(obj));
    	window.data.ride.currentCourseLocation = obj;
    },
    
    setDestination: id=>{
        localStorage.setItem('destination',id);
        window.data.ride.destination = id;
    },
    
    getPastRides: ()=>{
        /*try {
          var obj = JSON.parse(localStorge.getItem('previous-rides'));
          window.data.ride.pastRides = obj;
          return obj;
        } catch(e){
          return [];
        } */
        
        return window.data.ride.pastRides;
    }
    
    
};