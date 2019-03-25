window.stations = {
    
    data(){
        if(!window.data.stations){
            return [];
        } else {
            return window.data.stations;
        }
    },
    
    find(key,value){
        return this.data().find(obj=>{
            if(obj[key] == value) return obj;
        });
    },
    
    filter(key,value){
        return this.data().filter(obj=>obj[key] == value);
    },
    
    getById(id){
        return this.find('id',id);
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
        window.data.stations.forEach(obj=>{
            obj.distance = this.PythagorasEquirectangular(lat,lon,obj.latitude,obj.longitude);
            list.push(obj);
        });
        return list;
    },
    
    nearestOne(lat,lon){
        var dist = this.getDistances(lat,lon);
        return dist.find(obj=>{
            if(obj.distance < 0.20) return obj;
        });
    },
    
    nearbyStations(lat,lon){
     	var dist = this.getDistances(lat,lon);
        return dist.filter(obj=>{
            if(obj.distance < 1) return obj;
        });
    },
            
};
