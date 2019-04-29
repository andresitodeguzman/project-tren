window.stations = {
  
    // gets all
    get(){
        return window.data.stations;
    },
    
    getById(id){
        return window.data.stations[id];
    },
    
    // returns obj based on key-value
    find(key,value){
        return (this.get()).find(obj=>{if(obj[key] == value) return obj;});
    },
    
    // filters based on key-value
    filter(key,value){
        return (this.get().filter(obj=>{if(obj[key] == value) return obj;}));
    },
    
    degToRad(i){
        return +i * Math.PI / 180;    
    },
    
    PythagorasEquirectangular(lat1, lon1, lat2, lon2){
        lat1 = this.degToRad(lat1);
        lat2 = this.degToRad(lat2);
        lon1 = this.degToRad(lon1);
        lon2 = this.degToRad(lon2);
        var R = 6371; // Earth's radius in km
        var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;
        return d;
    },
    
    distance(lat1,lon1,lat2,lon2){
        return PythagorasEquirectangular(lat1,lon1,lat2,lon2);
    },
    
    getDistances(lat,lon){
        var list = [];
        this.get.forEach(obj=>{
            obj.distance = this.PythagorasEquirectangular(lat,lon,obj.latitude,obj.longitude);
            list.push(obj);
        });
        return list;
    },
    
    nearestOne(lat,lon){
        var dist = this.getDistances(lat,lon);
        return dist.find(obj=>{
            if(obj.distance < 0.30) return obj;
        });
    },
    
    nearbyStations(lat,lon){
     	var dist = this.getDistances(lat,lon);
        return dist.filter(obj=>{
            if(obj.distance < 1) return obj;
        });
    },
    
    getNextStations(id){
        var obj = this.getById(id);
        return {
            northbound: this.getById(obj.northbound_next),
            southbound: this.getById(obj.southbound_next)           
        };
    },
    
    getTransferStations(id){
        var obj = this.getById(id);
        if(obj){
            try {
                var tmpObj = [];
                obj.transfer_stations.forEach(elem=>{
                   tmpObj.push(this.getById(elem)); 
                });
                return tmpObj;
            } catch(e){
              return [];  
            }
        } else {
            return [];
        }
    },
    
    route(from_id,to_id){
        var from = this.getById(from_id);
        var to = this.getById(to_id);
        
       	if(from.system_id == to.system_id){
            //get next stations
            var slist = this.filter('system_id',from.system_id);
            // loop then move northbound 
        } else{
            // locate transfer station of next station
            console.log("not same station");
        }
    },
    
    routeLocalSystem(from,to){
        var from = this.getById(from_id);
        var to = this.getById(to_id);
        
        var slist = this.filter('system_id',from.system_id);
        var nbFltr = slist;
        var sbFltr = slist;
        var nbPtr = null;
        var sbPtr = null;
        
        while(nbPtr.id !== to.id){
            
        }
        
       	//move nb
        //move sb
    }
    
};