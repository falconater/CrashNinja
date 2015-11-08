angular.module('crash.eventPerson', [])

.controller('EventPersonController', function($ionicSlideBoxDelegate, LoadingService, PopupService, UserService, CrashEventObj, $state) {

  var self = this;
  // ngModel
  self.crashDriver = {};
  // ngModel
  self.allUsers = []; // all of the user's USERNAMES , fnames & lnames in the database
  // ngModel Flag
  self.enterManual = false;

  /*** In the future, this should create a new account for the user you enter and then send them an email telling them to confirm their account ***/

  // Reset Input Fields
  self.crashDriverMaster = {
    fname : '',
    lname : '',
    dob : '',
    phone : '',
    email : '',
    license : '',
    licenseState : '',
    insurance : '',
    policy : '',
    agent : '',
    agentEmail : ''
  };

  /***
    should clear the form everytime this is switched
  ***/
  self.switchInput = function(){
    // Console Log
    console.log('switch input...');
    // Reverse Flag
    self.enterManual = !self.enterManual;
    // Reset Input Fields
    self.crashDriver = angular.copy(self.crashDriverMaster);
  };

  /***
    // RUNS when the user clicks on a user to save into the crash event object
    retreive the user's information by their username
    save the crash driver obj into the CrashEventObj.crashEvent object
    (Future: only be able to retreive non personal data of the other user)
    Retreive the rest of the user's information
  ***/
  self.getUser = function(username){
    // Console Log
    console.log('Get user : ', username);
    // Show Loader
    LoadingService.showLoader();
    // Factory Function
    UserService.getAccountByUsername(username)
      .then(function(user){
        // Console Log
        console.log('crash driver returned from DB : ', user);
        // Set ngModel
        self.crashDriver = user;
        // Set Service Object
        CrashEventObj.crashEvent.crashDriver = self.crashDriver;
        // Show Success
        PopupService.showSuccess();
        // Hide Loader
        LoadingService.hideLoader();
        // Navigation
        $ionicSlideBoxDelegate.next();
        // Console Log Service Object
        console.log('CrashEventObj : ', CrashEventObj);
      })
      .catch(function(err){
        // Alert Error
        PopupService.showAlert(err.data.error);
        // Hide Loader
        LoadingService.hideLoader();
      });
  };

  /***
    After manually entering the crash driver's information
    save the crash user obj into the CrashEventObj.crashEvent object
  ***/
  self.saveDriver = function(){
    // Console Log
    console.log('Save Driver...');
    // Show Loader
    LoadingService.showLoader();
    // Set Service Object
    CrashEventObj.crashEvent.crashDriver = self.crashDriver;
    // Reset Input Fields
    self.crashDriver = angular.copy(self.crashDriverMaster);
    // Show Success
    PopupService.showSuccess();
    // Hide Loader
    LoadingService.hideLoader();
    // Navigation
    $ionicSlideBoxDelegate.next();
  };

  /***
    // RUNS AT THE BEGINNING, when ionic slide box is loaded
    get all of the users (some of their info) that exist so that you can search through and filter the user you are looking for
  ***/
  self.getAllUsers = function(){
    // Console Log
    console.log('Getting all users...');
    // Factory Function
    UserService.readAllUsers()
      .then(function(allUsers){
        // Console Log
        console.log('All users in db : ', allUsers);
        // Set ngModel
        self.allUsers = allUsers.data;
      })
      .catch(function(err){
        // Alert Error
        PopupService.showAlert(err.data.error);
      });
  };

});
