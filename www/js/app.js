// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('crash', [
  'ionic','ionic.service.core',
  'ngCordova',
  'crash.eventService',
  'crash.userService',
  'crash.popupService',
  'crash.loadingService',
  'crash.cameraService',
  'crash.S3',
  'crash.sendGrid',
  'crash.crashEventObj',
  'crash.event',
  'crash.eventWitness',
  'crash.eventPhoto',
  'crash.eventPerson',
  'crash.eventFinal',
  'crash.history',
  'crash.profile',
  'crash.signin',
  'crash.createAccount',
  'ngOpenFB',
  'crash.Testing',
  'crash.location'
])

.run(function($ionicPlatform, ngFB) {
  // Facebook App ID
  ngFB.init({appId: '1516257468694166'});



  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider

  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/user-signin.html',
    controller: 'SigninController as signinCl',
    data : {
      authenticate : false
    }
  })

  .state('createAccount', {
    url: '/createAccount',
    templateUrl: 'templates/user-create-account.html',
    controller: 'CreateController as createAccountCl',
    data : {
      authenticate : false
    }
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  // Event Tab
  .state('tab.event', {
    url: '/event',
    views: {
      'tab-event': {
        templateUrl: 'templates/tab-event.html',
        controller: 'EventController as eventCl',
      }
    },
    data : {
      authenticate : true
    }
  })

  // Profile Tab
  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileController as profileCl',
      }
    },
    data : {
      authenticate : true
    }
  })

  // History Tab
  .state('tab.history', {
    url: '/history',
    views: {
      'tab-history': {
        templateUrl: 'templates/tab-history.html',
        controller: 'HistoryController as historyCl'
      }
    },
    data : {
      authenticate : true
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/event');

  /***
    On every single call to the server, the httpProvider intercepts the call and attaches the current token to the header
  ***/
  $httpProvider.interceptors.push('AttachToken');

})

/***
  Attach the user's token to the header of the server call
  Store the token into the header
***/
.factory('AttachToken', function($window){
  return {
    request : function(object){
      var jwt = $window.localStorage.getItem('com.crash');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
})

/***
  Everytime the route changes, check if the url data.authenticate property is true, check if a session token exists, otherwise redirect the user back to the sign in page
***/
.run(function($rootScope, $state, UserService, $window){

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

    // var token = $window.sessionStorage.getItem('fbAccessToken');

    // if(token) {
    //   $window.localStorage.setItem('com.crash', token);
    // }
    if (toState.data.authenticate && !UserService.isAuthorized()) {
      $state.go('signin');
      event.preventDefault();
    }
  });

});
