
var wisApp = angular.module('wisApp', ['ngRoute', 'ngAnimate'])
.directive('testdirective', function() {
  return function(scope, element, attrs) {
  	 if(scope.$index != -1 && $('#accordion').hasClass('ui-accordion')) $("#accordion").accordion("refresh") ;
    scope.$watch('$last',function(v){
      if (v && !$('#accordion').hasClass('ui-accordion')) $("#accordion").accordion();    
		    
    });
    
  };
})

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
      getEventsBrowse: function(callback) {
          $http.post('json/events.php',{action:"browse"}).success(callback);
      }
  };
})


var controllers = {};

controllers.home = function($scope,$http,eventsFactory) {





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


eventsFactory.getEventsBrowse(function(results) {
      $scope.events = results.events;
    
  });

$scope.reloadEvents = function () {

eventsFactory.getEventsAsync(function(results) {

      $scope.events = results.events;
  });

}


};
controllers.intro = function($scope) {
$("li[mn]").removeClass("active"); 
$("li[id='mn_intro']").addClass("active"); //set correct menu item active
 
$scope.$on('$viewContentLoaded', function() {
//createMapIntro();

	createMap({
        center: new google.maps.LatLng(50.85034,4.35171),
        zoom: 10
    }, "map_intro");
    createEventMarkers();

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

};

//begin footer code
controllers.footer = function($scope) {


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





