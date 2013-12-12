
var wisApp = angular.module('wisApp', ['ngRoute', 'ngAnimate'])
.directive('testdirective', function() {
  return function(scope, element, attrs) {
  	 if(scope.$index != -1 && $('#accordion').hasClass('ui-accordion')) $("#accordion").accordion("refresh").accordion( "option", "active", true ); ;
    scope.$watch('$last',function(v){
      if (v && !$('#accordion').hasClass('ui-accordion')) $("#accordion").accordion({active: false,
            collapsible: true});
		    
    });
    
  };
})

wisApp.controller('goId', function(){

   return "test";

});

wisApp.filter('dateInMillis', function() {
    return function(dateString) {
        return Date.parse(dateString);
    };
});

wisApp.filter('isStatus', function () {
    return function (events, st) {

        var items = {
            st: st
        };
        var out = [];
        if (items.st == undefined) {
            items.st = {
                food: "1",
                party: "1",
                culture: "1"
            };
        } else {
            if (items.st.food == undefined) items.st.food = "1";
            if (items.st.party == undefined) items.st.party = "1";
            if (items.st.culture == undefined) items.st.culture = "1";
        }

        for (i = 0; i < events.length; i++) {
            if (events[i].food == "1" && items.st.food == "1" || events[i].party == "1" && items.st.party == "1" || events[i].culture == "1" && items.st.culture == "1") {

                out.push(events[i]);
            }


        }

        return out;


    };
});

wisApp.factory('eventsFactory',function($http) {


 return {
      getEventsBrowse: function(sendData,callback) {

          $http.post('json/events.php',sendData).success(callback);
      }
  };

});


var controllers = {};
controllers.eventBrowser = function($scope,$http,eventsFactory) {

    eventsFactory.getEventsBrowse({action:"browse"},function(results) {
        $scope.events = results.events;


    });
};

controllers.eventReader = function($scope,$http,eventsFactory) {


};
controllers.home = function($scope,$http,eventsFactory) {
    resetGMaps();

 $scope.setReadEvent = function(n){
        var nn = parseInt(n);
        eventsFactory.getEventsBrowse({action:"read",idevent:nn},function(results) {
            $scope.readEvent = results.events;
            calcRoute($scope.readEvent.address);
        });



    }

$scope.$on('$viewContentLoaded', function() {
 $("#addCalendarEvent")
            .click(function () {
                window.open('http://www.google.com/calendar/event?action=TEMPLATE&text=Eating%20out&dates=20131115T153000Z/20131115T160000Z&details=Lets%20try%20the%20food%20out%20there&location=School%20Restaurant%20&trp=true&sprop=&sprop=name:', 'mywindow', 'width=400,height=400')
            });
    createMap({
        center: new google.maps.LatLng(50.85034,4.35171),
        zoom: 10
    }, "map_home");
});

$("li[mn]").removeClass("active"); 
$("li[id='mn_home']").addClass("active"); //set correct menu item active

/*
eventsFactory.getEventsBrowse({action:"read",idevent:"3"},function(results) {
      $scope.events = results.events;

  });
*/



$scope.reloadEvents = function () {

eventsFactory.getEventsAsync(
    function(results) {

      $scope.events = results.events;
  });

}


};
controllers.intro = function($scope) {
    resetGMaps();
$("li[mn]").removeClass("active"); 
$("li[id='mn_intro']").addClass("active"); //set correct menu item active
 
$scope.$on('$viewContentLoaded', function() {

    google.maps.Map.prototype.clearOverlays = function() {
        for (var i = 0; i < markersArray.length; i++ ) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
    $('#map_intro').width(window.innerWidth-10);
	createMap({
        center: new google.maps.LatLng(50.85034,4.35171),
        zoom: 10
    }, "map_intro");
    createEventMarkers();

    $('#map_intro').width(window.innerWidth);


});


};

controllers.calendar = function($scope) {
$("li[mn]").removeClass("active"); 
$("li[id='mn_cal']").addClass("active"); //set correct menu item active
 
$scope.$on('$viewContentLoaded', function() {
handleAuthClick()
});

};

controllers.profile = function($scope) {
$("li[mn]").removeClass("active"); 
$("li[id='mn_prof']").addClass("active"); //set correct menu item active

};

controllers.signup = function($scope) {
$("li[mn]").removeClass("active"); 
$("li[id='mn_signup']").addClass("active"); //set correct menu item active

    $scope.master = {};

    $scope.update = function(user) {
        $scope.master = angular.copy(user);
    };

    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(user) {
        return angular.equals(user, $scope.master);
    };

    $scope.reset();


};

//begin footer code
controllers.footer = function($scope) {
    $scope.$on('$viewContentLoaded', function() {

				$('#login-trigger')
                    .click(function () {
                        $(this)
                            .next('#login-content')
                            .slideToggle({
                                direction: "up"
                            }, 300);
                        $(this)
                            .toggleClass('active');
                        if ($(this)
                            .hasClass('active')) $(this)
                            .find('span')
                            .html('&#x25BC;')
                        else $(this)
                            .find('span')
                            .html('&#x25B2;')
                    })
         
                $('#signup-trigger')
                    .click(function () {
                        $(this)
                            .next('#signup-content')
                            .slideToggle({
                                direction: "up"
                            }, 300);
                        $(this)
                            .toggleClass('active');
                       
                        if ($(this)
                            .hasClass('active')) $(this)
                            .find('span')
                            .html('&#x25BC;')
                        else $(this)
                            .find('span')
                            .html('&#x25B2;')
                    })
       
                $('#create-trigger')
                    .click(function () {
                    	$(this)
                            .next('#create-content')
                            .slideToggle({
                                direction: "up"
                            }, 300);
                        $(this)
                            .toggleClass('active');
                        if ($(this)
                            .hasClass('active')) $(this)
                            .find('span')
                            .html('&#x25BC;')
                        else $(this)
                            .find('span')
                            .html('&#x25B2;')
                    })
    });
};
//end footer code


wisApp.controller(controllers);



wisApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'views/intro.html',
        controller: 'intro'
      }).
      when('/events', {
        templateUrl: 'views/home.html',
        controller: 'home'
      }).
      when('/calendar', {
        templateUrl: 'views/calendar.html',
        controller: 'calendar'
      }).
      when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'profile'
      }).
      when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'signup'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

$(function() {

    window.onresize = doALoadOfStuff;

    function doALoadOfStuff(x) {
        $('#map_intro').width(window.innerWidth);
    };

});



