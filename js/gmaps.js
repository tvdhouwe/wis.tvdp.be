var map = null;
var geocoder = null;
var markerIndex = 0;
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService(); 

// display template
//var output = "Your current position is: " + currentLocation.toString() + "  " +map.getZoom();
//document.getElementById("currentPosition").innerHTML = output;
//get value template
// 	var loc = document.getElementById("geoLoc").value;

//for making event markers
var eventAddresses = new Array();
eventAddresses[0] = "Tervuursestraat 99, 3000 Leuven";
eventAddresses[1] = "Elegemstraat 25, 1700 Dilbeek";
eventAddresses[2] = "chaussée d'Ixelles, 368 - 1050 Bruxelles";

var eventNames = new Array();
eventNames[0] = "Event1";
eventNames[1] = "Event2";
eventNames[2] = "Event3";

var eventDescriptions = new Array();
eventDescriptions[0] = "Ngoan make event1 yeah .";
eventDescriptions[1] = "Dont do anything in this day .";
eventDescriptions[2] = "Really like the way youre .";

var address = "chaussée d'Ixelles, 268 - 1050 Bruxelles";
var eventName = "Ngoan created";
var eventDescription = "This is the only one event in your life =D";
var currentPlace;
var destinationPlace = "chaussée d'Ixelles, 168 - 1050 Bruxelles";
var distance;

//create the map show the current position
function createMap(options,divInString) {
	geocoder = new google.maps.Geocoder();
	if(arguments.length == 0){
		options = 
		{
			zoom: 11,
			center: new google.maps.LatLng(-34.397, 150.644),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	}
	map = new google.maps.Map(document.getElementById(divInString), options);
	directionsDisplay.setMap(map); 
	directionsDisplay.setPanel(document.getElementById('directions-panel'));
	//getCurrentLocation();
}

function getCurrentLocation() {
	var onError = function(error) {
		alert("Could not get the current location.");
	};
	
	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(
			function(position) {			
				var currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(currentLocation);
				map.setZoom(15);
				setCurrentLocation(currentLocation); //would be use when calculate the route to another address
			}, 
			onError
		);
	}else{
		onError();
	}
}


//create event markers for many events will be loaded from database when user first open our website
function createEventMarkers(){
	for(var i =0; i<eventAddresses.length;i++){
		doGeocoding(eventAddresses[i], eventNames[i], eventDescriptions[i]);
	}
}

//create event marker for one event, use when use create one event we need to make a marker for that event also
function createOneEventMarker(){
	doGeocoding(address, eventName, eventDescription);
}


//give and address and the name, it will place a marker to the address with the name
function doGeocoding(paraAddress, paraEventName, paraEventDescription){
	var geocoderRequest = {
	          address: paraAddress
	        };
	geocoder.geocode(geocoderRequest, function geoCallbackFunction(results, status){
		if (status == google.maps.GeocoderStatus.OK) {	
			map.setCenter(results[0].geometry.location);
			map.setZoom(11);
		}
		createMarker(results[0].geometry.location, paraEventName, paraEventDescription);
	});
}
//this is for place the marker
function createMarker(location, paraEventName, paraEventDescription){
	var contentString = "<div class='box' id='box_" + (markerIndex++) + "'>" + paraEventDescription + "</div>";			
	var newPopup = new google.maps.InfoWindow({
	       content: "holding" //content will be set later
 	});	
	var marker = new google.maps.Marker(
		{ 
			map: map,
			position: location,
			title: paraEventName,
			html: contentString
		});	
	
	google.maps.event.addListener(marker, "click",function() {
        	newPopup.setContent(this.html);	
        	newPopup.open(map, this);
    	});

}

//maybe when user choose to see an event, they can have the option to get route from current position to the event address
//cal the route and distance 
function setCurrentLocation(currentLocation) {
	currentPlace = currentLocation.toString();
}
function calcRoute() {
	var selectedMode = document.getElementById('mode').value;
	
	var request = {
	    origin:currentPlace,
	    destination:destinationPlace,
	    travelMode: google.maps.TravelMode[selectedMode]

	  };
	 directionsService.route(request, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(result);
	      getDistance(result.routes[0].legs[0].distance.value);
	    }
	  }); 
}
function getDistance(routeDistance){
	//the distance will be in meter ;D dont know where to display this 
	distance = routeDistance;
}
