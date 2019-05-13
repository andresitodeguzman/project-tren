/**
    Project Tren
    2018

    Andresito de Guzman
 */

// Initiate Library Helper
let __locationHelper = new LocationHelper();

// Initialization scripts
$(document).ready(()=>{   
    // Instantiate UI Elements
    $('.modal').modal();
    $('.dropdown-trigger').dropdown();

    // Clear view
    clear();

    // Show Main Activity
    showActivity('main');

    // Asynchronously prepare data
    setStations();
    setMyPlaces();
    setPreviousRides();
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

$("#deleteAllPreviousRideButton").click(()=>{
    deleteAllPreviousRides();
});

$("#closeChooserButton").click(()=>{
    clear();
    $("meta[name='theme-color']").attr("content","#ffc000");
    $("#showRideButton").show();
    showActivity("main");
}); 

$("#closeRideButton").click(()=>{
    window.location.reload();
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

$("#doneRideExitButton").click(()=>{
    clear();
    $("meta[name='theme-color']").attr("content","#eeeeee");
    showActivity('main');
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
    $("#stationsModalList").html("");
    $.each(__stationList,(index,val)=>{
        var i = val.id;
        var n = val.name;
        var c = val.city;
        var optTpl = `<option value="${i}">${n}</option>`;
        var listTpl = `
            <li class="collection-item">
                <b>${n} Station</b><br>
                ${c}
            </li>
        `;
        $(".need-stations").append(optTpl);
        $("#stationsModalList").append(listTpl);
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
                    <h5 class="blue-grey-text text-darken-3">
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
            var apxt = __locationHelper.getApproximateTime(dist,3.7);
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
                        <span style="font-size:13pt;color:black;"><b>Going to ${n}</b></span><br>
                        <font size="-1" class="grey-text">${f} → ${t}</font>
                    </p>
                </li>
            </a>
            <a onclick="ride('${tid}','${fid}')" href="#!" class="modal-close">
                <li class="collection-item">
                    <p>
                        <span style="font-size:13pt;color:black;"><b>Going from ${n}</b></span><br>
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
    $("meta[name='theme-color']").attr("content","#455a64");

    if(!navigator.share){
        $("#shareRideButton").hide();
    }

    showActivity('ride');

    var successPosition = (pos)=>{
        // Create variables for the coordinates
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        var sp = pos.coords.speed;

        // Use 3.7 as base speed if equal or lower than
        sp = __locationHelper.transformSpeed(sp);

        // Get the nearest station and distance using Pythagoras Equirectagular
        var nearest = __locationHelper.nearest(lat,lon,__stationList);
        var dist = __locationHelper.distance(lat,lon,to.latitude,to.longitude);

        // Get the time using speed per given distance
        var appx = __locationHelper.getApproximateTime(dist,sp);
        // Remove unecessary trailing numbers w/o rounding it off
        appx = Math.trunc(appx);

        $("#shareRideButton").click(()=>{
            if(navigator.share){
                navigator.share({
                    title: `I'm currently at ${nearest.name} Station of LRT-1`,
                    text: `I just wanted to let you know that I am currently at ${nearest.name}. You may also track and share at which exact @officialLRT1 station you're nearby with Project Tren!`,
                    url: "https://bit.ly/project-tren"
                })
                    .then(()=>{
                        M.toast({html:"Succcessfully shared your current location!",durationLength:3000});
                    })
                    .catch();
            } else {
                M.toast({html:"Share isn't available on your device",durationLength:3000});
            }
        });

        // Someting to do when user arrived at the destination
        if(nearest.id == to_id){
            // Try to vibrate
            try {
                window.navigator.vibrate(1500);
            } catch (error) {
                console.log("Vibration is not supported in the device");
            }
            // Clear view
            clear();
            // Reset theme color
            $("meta[name='theme-color']").attr("content","#ffc000");
            // Show done riding activity
            showActivity('doneRide');
            // Clear watcher 
            navigator.geolocation.clearWatch(watchid);

            var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

            var date = new Date();
            var dte = date.getMonth();
            dte = months[dte];
            var dy = date.getDate();
            var yr = date.getFullYear();
            var inst = `${dte} ${dy}, ${yr}`;

            addToPreviousRides(from.name,to.name,inst);
        }

        // Declare for use later
        var csn = $("#rideCurrentStationName").html();

        // Show to UI the metrics and current location
        $("#rideCurrentStationName").html(nearest.name);
        $("#rideDistance").html(Math.trunc(dist));
        $("#rideApproximate").html(appx);
        $("#rideSpeed").html(Math.trunc(pos.coords.speed));

        // Decide whether the current station is a terminal or not
        if(nearest.is_terminal == "TRUE"){
            $("#rideStationWord").html("Terminal");
        } else {
            $("#rideStationWord").html("Station");
        }

        // Check if north/south bound then detect next station
        if(bt == "northbound"){
            var nxt = findStationById(nearest.northbound_next);
            $("#rideNextStation").html(nxt.name);
        } else {
            var nxt = findStationById(nearest.southbound_next);
            $("#rideNextStation").html(nxt.name);
        }
        
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

var getPreviousRides = ()=>{
    if(!localStorage.getItem("tren-prevrides")){
        localStorage.setItem("tren-prevrides",JSON.stringify([]));
        return [];
    } else {
        return JSON.parse(localStorage.getItem("tren-prevrides"));
    }    
}

var addToPreviousRides = (from_name,to_name,date)=>{
    var prevrides = getPreviousRides();
    var array = {
        from_name:from_name,
        to_name:to_name,
        date:date
    };
    prevrides.unshift(array);
    localStorage.setItem("tren-prevrides",JSON.stringify(prevrides));
    setPreviousRides();
}

var setPreviousRides = ()=>{
    var prevrides = getPreviousRides();
    $("#previousRideList").html("");
    prevrides.forEach((elem,index)=>{
        var tpl = `
            <div class="card hoverable">
                <div class="card-content">
                    <span class="card-title" style="font-size:15pt !important;">
                        <i class="material-icons">place</i> ${elem.from_name} Station → ${elem.to_name} Station
                    </span>
                    <p>
                        <i class="material-icons tiny">today</i> ${elem.date}
                    </p>
                </div>
                <div class="card-action">
                    <a class="red-text text-lighten-3" href="#!" onclick="deletePreviousRide('${index}')"><i class="material-icons">delete</i></a>
                </div>
            </div>
        `;
        $("#previousRideList").append(tpl);
    });

    var ht = $("#previousRideList").html();
    if(ht == ""){
        var tpl = `
            <br>
                <center>
                    <h5 class="blue-grey-text text-darken-3">
                        All the rides you've made will be here
                    </h5>
                </center>
            <br>
        `;
        $("#previousRideList").html(tpl);
    }
} 

var deletePreviousRide = (id)=>{
    var prevrides = getPreviousRides();
    prevrides.splice(id,1);
    localStorage.setItem("tren-prevrides",JSON.stringify(prevrides));
    M.toast({html:"Previous Ride deleted successfully!",durationLength:3000});
    setPreviousRides();
};

var deleteAllPreviousRides = ()=>{
    localStorage.setItem("tren-prevrides",JSON.stringify([]));
    M.toast({html:"All previous rides are deleted successfully!",durationLength:3000});
    setPreviousRides();
}

var findStationById = (id)=>{
    return __stationList.find(obj=>{return obj.id == id;});
}

var getPreLocationMessage = ()=>{
  var msg = localStorage.getItem("tren-prelocation-msg");
  if(!msg){
    return "I just wanted to let you know that I am currently at ";
  } else {
    return msg;
  }
}

var setPreLocationMessage = (msg)=>{
  localStorage.setItem("tren-prelocation-msg",msg);
}
