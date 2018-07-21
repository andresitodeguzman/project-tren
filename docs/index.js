let __locationHelper = new LocationHelper();

$(document).ready(()=>{   
    $('.modal').modal();
    clear();
    showActivity('main');
    setStations();
    setMyPlaces();
});

$("#showChooserButton").click(()=>{
    clear();
    $("meta[name='theme-color']").attr("content","#607d8b");
    showActivity("chooser");

    if('geolocation' in navigator){
        var successPosition = (pos)=>{
            var coords = pos.coords;
            var lt = coords.latitude;
            var ln = coords.longitude;
            var nearest = __locationHelper.nearest(lt,ln,__stationList);
            $("#from").val(nearest.id);
        };
        var errorPosition = (err)=>{
            if(err.code == 1){
                var tpl = `
                    <br>
                    <center>
                        <p><span class="card-title"><br>
                            <i class="material-icons large">location_disabled</i><br><br>
                            Please enable location services
                        </span></p>
                    </center>
                    <br>
                `;
                $("#chooserCardContent").html(tpl);
                $("#showRideButton").hide();
            } else {
                if(err.code == 2){
                    M.toast({html:"Cannot get your current position at this time", durationLength:3000});                    
                }
            }
        };
        navigator.geolocation.getCurrentPosition(successPosition,errorPosition);
    } else {
        var tpl = `
        <br>
        <center>
           <p><span class="card-title"><br>
                <i class="material-icons large">location_disabled</i><br><br>
                Geolocation Services<br>is not available in your device.
           </span></p>
        </center>
        <br>
        `;
        $("#chooserCardContent").html(tpl);
        $("#showRideButton").hide();
    }

});

$("#closeChooserButton").click(()=>{
    clear();
    $("meta[name='theme-color']").attr("content","#ffc000");
    $("#showRideButton").show();
    showActivity("main");
}); 

$("#closeRideButton").click(()=>{
    clear();
    $("meta[name='theme-color']").attr("content","#ffc000");
    showActivity("main");
}); 

$("#showRideButton").click(()=>{
    var f = $("#from").val();
    var t = $("#to").val();
    if(f == t){
        M.toast({html:"Destination cannot be the same from the origin",durationLength:3000});
    } else {
        ride(f,t);
    }
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
                        <i class="material-icons tiny">place</i> ${f}<br>
                        <i class="material-icons tiny">place</i> ${t}<br>
                        <i class="material-icons tiny">timer</i> ~${eta} mins
                    </p>
                </div>
                <div class="card-action">
                    <a class="blue-grey-text" href="#!" onclick="askRideMyPlaces('${id}')"><i class="material-icons">navigation</i></a>
                    <a class="red-text text-lighten-3" href="#!" onclick="deleteMyPlaces('${id}')"><i class="material-icons">delete</i></a>
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

            var dist = __locationHelper.distance(lt1,ln1,lt2,ln2)/1000;
            var apxt = __locationHelper.getApproximateTime(dist,6.7);
            var apmin = Math.trunc(apxt/1000);
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

var deleteMyPlaces = (id)=>{
    var myplaces = getMyPlaces();
    myplaces.splice(id,1);
    localStorage.setItem("tren-myplaces",JSON.stringify(myplaces));
    M.toast({html:"Place deleted successfully!", durationLength:3000});
    setMyPlaces();
};

var askRideMyPlaces = (id)=>{
    var myplaces = getMyPlaces();
    var place = myplaces[id];
    if(!place){
        M.toast({html:"Cannot find place",durationLength:3000});
        return;
    }
    var n = place.name;
    var f = place.from;
    var fid = place.from_id;
    var t = place.to;
    var tid = place.to_id;
    var tpl = `
        <ul class="collection">
            <a onclick="ride('${fid}','${tid}')" href="#!" class="modal-close">
                <li class="collection-item">
                    <p>
                        <span style="font-size:13pt;color:black;"><b>Going from ${n}</b></span><br>
                        <font size="-1" class="grey-text">${f} → ${t}</font>
                    </p>
                </li>
            </a>
            <a onclick="ride('${tid}','${fid}')" href="#!" class="modal-close">
                <li class="collection-item">
                    <p>
                        <span style="font-size:13pt;color:black;"><b>Going to ${n}</b></span><br>
                        <font size="-1" class="grey-text">${t} → ${f}</font>
                    </p>
                </li>
            </a>
        </ul>
    `;
    $("#rideMyPlacesButtons").html(tpl);
    $("#rideMyPlacesModal").modal("open");
}

var ride = (from_id,to_id)=>{
    var from = findStationById(from_id);
    var to = findStationById(to_id);

    var stationlist = __stationList;
    
    var diff = +from.id - +to.id;
    
    var bt = "southbound";
    if(Math.sign(diff) == -1){
        bt = "southbound";
    } else {
        bt = "northbound";
        stationlist.reverse();
    }

    $("#rideFromName").html(from.name);
    $("#rideToName").html(to.name);

    clear();
    $("meta[name='theme-color']").attr("content","#607d8b");
    showActivity('ride');

    var successPosition = (pos)=>{
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        var sp = pos.coords.speed;
        sp = __locationHelper.transformSpeed(sp);
        
        var nearest = __locationHelper.nearest(lat,lon,__stationList);
        var dist = __locationHelper.distance(lat,lon,nearest.latitude,nearest.longitude);
        var appx = __locationHelper.getApproximateTime(dist,sp);
        appx = Math.trunc(appx);

        if(nearest.id == to_id){
            alert("You are now at the station");
            navigator.geolocation.clearWatch(watchid);
        }

        var csn = $("#rideCurrentStationName").html();

        $("#rideCurrentStationName").html(nearest.name);
        $("#rideDistance").html(Math.trunc(dist));
        $("#rideApproximate").html(appx);
        $("#rideSpeed").html(Math.trunc(pos.coords.speed));

        if(nearest.is_terminal == "TRUE"){
            $("#rideStationWord").html("Terminal");
        } else {
            $("#rideStationWord").html("Station");
        }

        if(bt == "northbound"){
            var nxt = findStationById(nearest.northbound_next);
            $("#rideNextStation").html(nxt.name);
        } else {
            var nxt = findStationById(nearest.southbound_next);
            $("#rideNextStation").html(nxt.name);
        }

        var rsts = `
            Speed: ${pos.coords.speed}<br>
            Distance: ${dist}<br>
            Time: ${appx}<br>
        `;
        $("#rawstats").html(rsts);

        if(csn != nearest.name){
            $("#rideCurrentStation").hide();
            $("#rideCurrentStation").fadeIn();
        }

    };

    var errorPosition = (err)=>{
        if(err.code == 1){
            M.toast({html:"Please enable geolocation services",durationLength:3000});
        } else {
            if(err.code == 2){
                M.toast({html:"Cannot determine current location", durationLength:3000});
            } else {
                if(err.code == 3){
                    M.toast({html:"Geolocation service timed out", durationLength:3000});
                } else {
                    M.toast({html:"An error occurred", durationLength:3000});
                }
            }
        }
    };

    var options = {
        enableHighAccuracy:true,
        maximumAge:0,
    }

    var watchid = navigator.geolocation.watchPosition(successPosition,errorPosition,options);
    
}

var findStationById = (id)=>{
    return __stationList.find(obj=>{return obj.id == id;});
}