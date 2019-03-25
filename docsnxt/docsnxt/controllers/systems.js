window.systems = {
    
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
    }
    
};
