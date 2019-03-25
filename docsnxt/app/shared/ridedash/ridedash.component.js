angular.module('ridedash',[]).component('ridedash',{

    templateUrl:'app/shared/ridedash/ridedash.template.html',
    controller: function rideDashController(){
        
        this.dark = window.data.ui.dark;
        
        // Props
        this.$onInit = ()=>{
            console.log("called");
        }
        
    }

});