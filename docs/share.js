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
  let result = null;
  tmp = [];
  location.search.substr(1).split("&").forEach((item) => {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  });
  return result;
}

let clear = ()=>{
  $(".preloader").fadeOut();
  $(".activity").hide();
};

let showActivity = (title) => $(`#${title}Activity`).fadeIn();

let setStations = ()=>{
  $("#needsStations").html("");
  $("#stationsModalList").html("");
  $.each(__stationList,(index,val)=>{
      const i = val.id;
      const n = val.name;
      const c = val.city;
      $(".need-stations").append(`<option value="${i}">${n}</option>`);
      $("#stationsModalList").append(`<li class="collection-item"><b>${n} Station</b><br>${c}</li>`);
  });
}

var findStationById = (id)=> __stationList.find(obj => { return obj.id == id; });

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
  
    $("#rideStationWord").html(nearest.is_terminal == "TRUE" ? "Terminal" : "Station");

    if(data.bound == "northbound"){
        $("#rideNextStation").html((findStationById(nearest.northbound_next)).name);
    } else {
        $("#rideNextStation").html((findStationById(nearest.southbound_next)).name);
    }
  
    $("#rideDistance").html(data.distance);
    $("#rideApproximate").html(data.approximate);
    $("#rideSpeed").html(data.speed);  

  }

});
