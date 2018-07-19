let __locationHelper = new LocationHelper();

$(document).ready(()=>{   
    $('.modal').modal();
    clear();
    showActivity('main');
    setStations();
    setMyPlaces();
});

let clear = ()=>{
    $(".preloader").fadeOut();
    $(".activity").hide();
};

let showActivity = (title)=>{
    $(`#${title}Activity`).fadeIn();
};

let setStations = ()=>{
    $("#needsStations").html("");
    $.each(__stationList,(index,val)=>{
        var i = val.id;
        var n = val.name;
        var optTpl = `<option value="${i}">${n}</option>`;
        $(".need-stations").append(optTpl);
    });
}

let getMyPlaces = ()=>{
    if(!localStorage.getItem("tren-myplaces")){
        localStorage.setItem("tren-myplaces",JSON.stringify([]));
        return [];
    } else {
        return JSON.parse(localStorage.getItem("tren-myplaces"));
    }
};

let setMyPlaces = ()=>{
    var myplaces = getMyPlaces();
    $("#myplacesContainer").html("");
    $.each(myplaces,(id,val)=>{
        var n = val.name;
        var t = val.to;
        var f = val.from;
        var eta = val.eta;

        var tpl = `
            <div class="card hoverable">
                <div class="card-content">
                    <span class="card-title">${n}</span>
                    <p>
                        <i class="material-icons tiny">place</i> ${t}<br>
                        <i class="material-icons tiny">place</i> ${f}<br>
                        <i class="material-icons tiny">timer</i> ${eta} mins
                    </p>
                </div>
                <div class="card-action">
                    <a class="blue-grey-text" href="#!"><i class="material-icons">navigation</i></a>
                    <a class="red-text text-lighten-3" href="#!"><i class="material-icons">delete</i></a>
                </div>
            </div>
        `;

        $("#myplacesContainer").append(tpl);
    });

    var mplc = $("#myplacesContainer").html();
    if(mplc == ""){
        var tpl = `
            <br>
                <center>
                    <h5 class="grey-text text-lighten-1">
                        Add Home or Work to your places
                    </h5>
                </center>
            <br>
        `;
        $("#myplacesContainer").html(tpl);
    }
}

var addMyPlaces = ()=>{
    var n = $("#addmplName").val();
    var f = $("#addmplFrom").val();
    var t = $("#addmplTo").val();

    if(!n){
        M.toast({html:"Name is Required",durationLength:3000});
    } else {
        if(f==t){
            M.toast({html:"You cannot set both From and To at the same station", durationLength:3000});
        } else{
            var snf = findStationById(f);
            var snt = findStationById(t);

            lt1 = snf.latitude;
            ln1 = snf.longitude;
            lt2 = snt.latitude;
            ln2 = snt.longitude;

            var dist = __locationHelper.distance(lt1,ln1,lt2,ln2);
            var apxt = __locationHelper.getApproximateTime(dist,6.7);
            var apmin = Math.trunc(apxt);
            var array = {
                name: n,
                from: snf.name,
                from_id: snf.id,
                to: snt.name,
                to_id: snt.id,
                eta: apmin
            };

            var myplaces = getMyPlaces();
            myplaces.push(array);
            localStorage.setItem("tren-myplaces",JSON.stringify(myplaces));
            M.toast({html:`${n} added successfully!`, durationLength:3000});

            $("#addmplName").val("");
            $("#addmplTo").val("");
            $("#addmplFrom").val("");
            
            $('#addMyPlacesModal').modal('close');

            setMyPlaces();
            
        }
    }
}; 

var findStationById = (id)=>{
    return __stationList.find(obj=>{return obj.id == id;});
}