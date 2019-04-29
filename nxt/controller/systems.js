window.systems = {
    
    get(){
        return window.data.systems;
    },
    
    data(){
        if(!window.data.systems){
            return [];
        } else {
            return window.data.systems;
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
    
    mapSystems(array){
        var ar = [];
        array.forEach(obj=>{
            obj.station = this.getById(obj.system_id);
            ar.push(obj);
        });        
        return ar;
    }
    
};
