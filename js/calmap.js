/*___________
|  CALENDAR  |
 ____________*/
 
 
 function showEvent(myevents){
 $('#calendar').fullCalendar({
 
  events: myevent
 });
 }
 
  var clientId = '840677805517-039p2jc2v17aesf4pf19evmhvm0n2b68.apps.googleusercontent.com';
    var apiKey = 'AIzaSyDMYqPc522nXn00x95hu3sRWunD47J7NNQ';
    var scopes = 'https://www.googleapis.com/auth/calendar';
    
    
    //set the API key 
    function handleClientLoad() {
    	  gapi.client.setApiKey(apiKey);
    	  window.setTimeout(checkAuth,1);
    	  //checkAuth();
    	}
	//check if API key is valid
    	function checkAuth() {
    	  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
    	      handleAuthResult);
    	}

    	function handleAuthResult(authResult) {
    	  var authorizeButton = document.getElementById('authorize-button');
    	  if (authResult) {
    	    authorizeButton.style.visibility = 'hidden';
    	    makeApiCall();
    	  } else {
    	    authorizeButton.style.visibility = '';
    	    authorizeButton.onclick = handleAuthClick;
    	   }
    	}

    	function handleAuthClick(event) {
    	  gapi.auth.authorize(
    	      {client_id: clientId, scope: scopes, immediate: false},
    	      handleAuthResult);
    	  return false;
    	}
    	
    	
    	/*gets events */
    	function makeApiCall() {
    		  gapi.client.load('calendar', 'v3', function() {
    			  var request = gapi.client.calendar.events.list({
    				  'calendarId': 'primary'
    			  });
    		          
    			  request.execute(function(resp) {
    				    
    				  showCalendar(resp.items);
    			   });
    		  });
    		  
    		  
    		}
    	
 function showCalendar(events){   
		  $('#calendar').fullCalendar({
			  theme: true,
			  header: {
				  left: 'prev,next today',
				  center: 'title',
				  right: 'month,agendaWeek,agendaDay'
			  },
			  editable: true,
			  events:function(start,end,callback)
		        {
		            var event = []; var color; var start; var end;
		            for (var i = 0; i < events.length; i++){
		            	
		            	//get color from user calendar and display it in ur calendar
		            	switch(events[i].colorId){
		            		case '1':
		            			color = "#A4BDFC";
		            			break;
		            		case '2':
		            			color = "#7AE7BF";
		            			break;
		            		case '3':
		            			color = "#DBADFF";
		            			break;
		            		case '4':
		            			color = "#FF88FC";
		            			break;
		            		case '5':
		            			color = "#FBD75B";
		            			break;
		            		case '6':
		            			color = "#FFB878";
		            			break;
		            		case '7':
		            			color = "#46D6DB";
		            			break;
		            		case '8':
		            			color = "#E1E1E1";
		            			break;
		            		case '9':
		            			color = "#5484ED";
		            			break;
		            		case '10':
		            			color = "#51B749";
		            			break;
		            		case '11':
		            			color = "#DC2127";
		            			break;
		            		default:
		            			color = "#FBD75B";
		            	}
		            	
		            	//get the date when user doesnt specify time or datetime when given the time
		            	if(events[i].start.date != null){
		            		start = events[i].start.date;
		            		end = events[i].end.date;
		            	}else{
		            		start = events[i].start.dateTime;
		            		end = events[i].end.dateTime;
		            	}
		            	
		            	event.push({
		                	title: events[i].summary,
		                	start: start,
		                	end: end,
		                	allDay: false,
		                	color: color
		            	});
		            }
		            callback(event);
		        },
		        timeFormat: 'H(:mm)'
  		});  
 }
 
   
   