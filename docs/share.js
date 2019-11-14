/**
    Project Tren
    2018

    Andresito de Guzman
 */

// Initiate Library Helper
let __locationHelper = new LocationHelper();
const db = firebase.database();
var userId = findGetParameter('id');
if(!userId) window.location.replace('/');
$(document).ready(()=>{
  $('.modal').modal();

  clear();

  showActivity('home');

  setStations();
});

function findGetParameter(parameterName) {
  var result = null,
  tmp = [];
  location.search
      .substr(1)
      .split("&")
      .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      });
  return result;
}

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

var findStationById = (id)=>{
  return __stationList.find(obj=>{return obj.id == id;});
}

db.ref(`/ride/${userId}`).on('value', res=>{
  var data = res.val();
  var nearest = __locationHelper.nearest(data.latitude,data.longitude,__stationList);
  
  if(nearest.id == data.to_id){
    try {
      window.navigator.vibrate(1500);
    } catch (error) {
      console.log("Vibration is not supported in the device");
    }
    clear();
    $("meta[name='theme-color']").attr("content","#ffc000");
    showActivity('doneRide');

  } else {

    var bt = "southbound";

    $("#rideCurrentStationName").html(nearest.name);
  
    var from = findStationById(data.from_id);
    var to = findStationById(data.to_id);
  
    $("#rideFromName").html(from.name);
    $("#rideToName").html(to.name);
  
    if(nearest.is_terminal == "TRUE"){
      $("#rideStationWord").html("Terminal");
    } else {
        $("#rideStationWord").html("Station");
    }
  
    if(data.bound == "northbound"){
      var nxt = findStationById(nearest.northbound_next);
      $("#rideNextStation").html(nxt.name);
    } else {
        var nxt = findStationById(nearest.southbound_next);
        $("#rideNextStation").html(nxt.name);
    }
  
    $("#rideDistance").html(data.distance);
    $("#rideApproximate").html(data.approximate);
    $("#rideSpeed").html(data.speed);  

  }

});