// Initialize Firebase
var config = {
	apiKey: "AIzaSyBJuOR5zkArCFC2S_GDDBE3vObN188idKI",
    authDomain: "gcm-firebase-e36f2.firebaseapp.com",
    databaseURL: "https://gcm-firebase-e36f2.firebaseio.com",
    projectId: "gcm-firebase-e36f2",
    storageBucket: "gcm-firebase-e36f2.appspot.com",
    messagingSenderId: "913559924253"
};

firebase.initializeApp(config);

var app = angular.module("myApp", ["firebase"]);
app.requires.push('angularjs-datetime-picker');
app.requires.push('ui.grid');
app.requires.push('ui.grid.edit');
app.requires.push('ngMaterial');


app.controller("userCtrl", function($scope, $firebaseObject, $timeout, $mdDialog) {

	$scope.recipients = [];
	$scope.tasks = [];
	$scope.contactlist = [];
	$scope.contactlistdetails = [];
	$scope.bulkrecipients = [];
	var ref;

	$scope.loader = {
			loading: false,
			taskName: "",
			taskStatus: ""
		};
	
	document.getElementById('csvFileUpload').addEventListener('change', upload, false);
	
	$scope.loginButton = function() {
		var email = "xxxxx";
		var password ="xxxx";
		
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(result){
			//document.getElementById("loggedIn").innerHTML = "";
			console.log("here");
			result.getToken().then(function(token){
		        $scope.userLoginToken = token;
		        console.log(token);
		        console.log(grabUserId());
		        //console.log(firebase.database().ref('/'+ grabUserId()));
		        //console.log(firebase.database().ref('/'+ grabUserId()+'/').val());
		    });
			$scope.$apply();
		}, function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;	
			console.log(errorCode + ": Could not login, your username or password is incorrect.");
			console.log(errorCode + " " + errorMessage);
	  	});			
	};	
	
	$scope.logoffButton = function() {
		console.log("Log off clicked");
		firebase.auth().signOut().then(function() {
			console.log("Log off function called");
			$scope.recipients = [];
			$scope.tasks = [];
			$scope.contactlist = [];
			$scope.contactlistdetails = [];
			$scope.bulkrecipients = [];
			$scope.recipients.length = 0;
			$scope.contactlist.length = 0;
			$scope.contactlistdetails.length = 0;
			$scope.bulkrecipients.length = 0;	
			$scope.gridContactList.data = [];
			$scope.gridContactList.length = 0;
			$scope.gridOptions.data = [];
			$scope.gridOptions.length = 0;
			$scope.gridBulkContactList.data = [];
			$scope.gridBulkContactList.data.length = 0;
			$scope.$apply();
		}, function(error) {
			console.log("Error when log off function called");
			$scope.recipients = [];
			$scope.tasks = [];
			$scope.contactlist = [];
			$scope.contactlistdetails = [];
			$scope.bulkrecipients = [];
			$scope.recipients.length = 0;
			$scope.contactlist.length = 0;
			$scope.contactlistdetails.length = 0;
			$scope.bulkrecipients.length = 0;	
			$scope.gridContactList.data = [];
			$scope.gridContactList.length = 0;
			$scope.gridOptions.data = [];
			$scope.gridOptions.length = 0;
			$scope.gridBulkContactList.data = [];
			$scope.gridBulkContactList.data.length = 0;
			$scope.$apply();
		});		
	};
	
	$scope.testButtons = function() {
		console.log($scope.tasks);
	};
		
	firebase.auth().onAuthStateChanged(function(user) {
		console.log("At Autho state changed");
		if (user) {
			console.log("Inside onAuthStateChanged.");
			$scope.showDiv = true;
			//ref = firebase.database().ref('/'+ grabUserId()+'/TaskList');
			ref = firebase.database().ref('/'+ grabUserId()+'/');
			ref.on("value", function(snapshot){
				if (angular.isDefined($scope.tasks) || angular.isDefined($scope.contactlist)){
					if ($scope.tasks != null){
						$scope.tasks = [];
					}
					if ($scope.contactlist != null){
						$scope.contactlist = [];
					}
				}				
				$scope.tasks = [];
				$scope.contactlist = [];			
				var data = snapshot.val();
				for (var newKey in data){
					console.log(newKey);
					switch(newKey){
						case "TaskList":
							var taskListData = snapshot.child("TaskList").val();
							for (var key in taskListData){
								if (taskListData.hasOwnProperty(key)){
									var createdBy = snapshot.child("TaskList").child(key).child("CreatedBy").val();
									var creationTime = snapshot.child("TaskList").child(key).child("CreationTime").val();
									var timeToSend = snapshot.child("TaskList").child(key).child("TimeToSend").val();
									var message = snapshot.child("TaskList").child(key).child("Message").val();
									var overViewRecipients = snapshot.child("TaskList").child(key).child("Recipients").val();
									var status = snapshot.child("TaskList").child(key).child("Status").val();
									var messageType = snapshot.child("TaskList").child(key).child("Type").val();
									//Message has been received by the phone wps gateway and screen can be returned to normal
									if(key == $scope.loader.taskName && status =="Pending"){
										$scope.loader.loading = false;
										$scope.loader.taskName = "";
										$(".overlay").hide();
										if (messageType == "Quick-Sms"){
											swal("Task Status Updated", "Quick Sms received and now pending.", "success");
										}else if (messageType == "Bulk-Sms"){
											swal("Task Status Updated", "Bulk Sms received and now pending.", "success");
										}
									}
									if (timeToSend.trim().length > 0 & key.trim().length > 0 & overViewRecipients.length > 0 & messageType.length > 0 & 
											status.trim().length > 0 & messageType.trim().length > 0){
										$scope.tasks.push({
											timetosend: timeToSend,
											taskname: key,
											recipients: overViewRecipients,
											messagebox: message,
											status: status,
											messagetype: messageType,
											createdon: creationTime
										});								
									}
									else {
										console.log("Error", "One of the compulsory fields has not been filled in within one of " + grabUserId() + " tasks");
										swal("Ooops", "One compulsory fields has not been filled in within one of yours tasks.");
									}
								}	
							}
							break;
						case "Contacts":
							var contactListData = snapshot.child("Contacts").val();
							for (var key in contactListData){
								if (contactListData.hasOwnProperty(key)){
									var createdBy = snapshot.child("Contacts").child(key).child("CreatedBy").val();
									//console.log(createdBy);
									var createdTime = snapshot.child("Contacts").child(key).child("CreatedTime").val();
									//console.log(createdTime);
									if(createdBy.trim().length > 0 & createdTime.trim().length > 0 & key.length > 0){
										$scope.contactlist.push({
											name: key,
											createdtime: createdTime,
											createdby: createdBy
										});
									}
								}
							}
							break;
					}
				}		
				//May not be necessary
				$scope.gridOptions.data = $scope.tasks;
				$scope.gridContactList.data = $scope.contactlist;
				$scope.$apply();
				$timeout(function() {
					$scope.gridApi.core.handleWindowResize();
					$scope.gridApiSec.core.handleWindowResize();
					$scope.gridApiThird.core.handleWindowResize();
				}, 0);
			});	
		} else {
			$scope.showDiv = false;
			tasks = [];
			tasks.length = 0;
			//$scope.reloadDataShow = false;
			//list = [];
			//list.length = 0;
			//$scope.contacts =[];
		}
	});	
	
	/*
	 * --------------------------------------------------------------------Register New User Module-----------------------------------------------------------------------------
	 */	
		
	$scope.RegisterButton = function(ev){
		/*console.log("Register button clicked");
	    $.ajax({url: "notifyWings.php?messageToSend=" + "."
	    	+ "&messageType=" + "Update-Task"
	        + "&taskName=" + "test4"
	        + "&userID=" + grabUserId() 
	        + "&userToken=" + grabUserToken(), 
	        success: function(result){
	        	window.alert(result);
	        },
	        error: function(xhr, ajaxOptions, thrownError){
	        	window.alert(thrownError);
	        }
	    });*/
		$mdDialog.show({
			templateUrl: "registerNewAccount.html",
		    targetEvent: ev,
		    controller: RegisterDialogController
		});

	};	
	
	function RegisterDialogController($scope, $mdDialog) {
		$scope.closeRegisterDialog = function(){
			$mdDialog.cancel();
		};
		$scope.saveRegisterDialog = function(){
			console.log("Save register dialog clicked");
		};				
	}	

	
	/*
	 * --------------------------------------------------------------------Overview Module-----------------------------------------------------------------------------
	 */	
	
	$scope.gridOptions = {onRegisterApi: registerGridApi};
	
	function registerGridApi(gridApi) {
	    $scope.gridApi = gridApi;
	}
	$scope.gridOptions.columnDefs = [{
        name: 'Timetosend',
        field: 'timetosend',
        cellFilter: 'date:\'yyyy-MM-dd h:mm a\'',				//Automatically converts to required time zone based on client settings
        width: "*",
        enableHiding: false
    }, {
        name: 'Taskname',
        field: 'taskname',
        width: "*",
        enableHiding: false
    },  {
        name: 'Recipients',
        field: 'recipients',
        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.parseRecipients(row.entity.recipients)}}</div>',
        width: "*",
        enableHiding: false,
        enableColumnMenu: false
    }, {
        name: 'Messagebox',
        field: 'messagebox',
        width: "*",
        resizable: true,
        enableHiding: false
    }, {
        name: 'Status',
        field: 'status',
        width: "*",
        enableHiding: false
    }, {
        name: 'Messagetype',
        field: 'messagetype',
        width: "*"
    }, {
        name: 'Createdon',
        field: 'createdon',
        cellFilter: 'date:\'yyyy-MM-dd h:mm a\'',
        width: "*"
    }, {
        name: 'Delete',
        cellTemplate: '<button class="btn primary" ng-click="grid.appScope.DeleteTask(row)" style="margin-left: 10%"><i class="fa fa-trash" aria-hidden="true"></i></button>',
        width: "7%",
        enableHiding: false,
        enableColumnMenu: false
    }];
	
	$scope.gridOptions.data = $scope.tasks;

	$scope.parseRecipients= function (jsonArray){
		var jString = "";
		try{
			for (var i = 0; i < (jsonArray.length); i++){
				jString = jString + ' ' + jsonArray[i] + ' ';
			} 
		}catch(error){
			console.log(error);
		}
		return jString;
	};
	
	$scope.DeleteTask = function(row) {
		/*Check user session is still valid here */
		
		/*Check the task should be deleted- should ping the phone here too*/
		swal({
			  title: "Are you sure?",
			  text: "Please confirm the deletion of this task.",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Yes, delete it.",
			  cancelButtonText: "No, cancel deletion.",
			  closeOnConfirm: true,
			  closeOnCancel: true
			},
			function(isConfirm){
				if (isConfirm) {
					var index = $scope.gridOptions.data.indexOf(row.entity);
					var taskToDelete = "";
					taskToDelete = $scope.tasks[index].taskname;
					console.log(taskToDelete);
					$scope.tasks.splice(index, 1);
					/*remove task from firebase cloud*/
					$timeout(function(){
						firebase.database().ref('/'+ grabUserId() +'/TaskList/' + taskToDelete).remove();
					});
					/*remove task from the phone if it exists*/
					$timeout(function(){
						console.log("Inside function");
						//------------------------------Ping phone or sms gateway here------------------------------
						//Will require task name and message type
					    $.ajax({url: "notifyWings.php?messageToSend=" + "."
					    	+ "&messageType=" + "Delete-Task"
					        + "&taskName=" + taskToDelete
					        + "&userID=" + grabUserId() 
					        + "&userToken=" + grabUserToken(), 
					        success: function(result){
					        	window.alert(result);
					        },
					        error: function(xhr, ajaxOptions, thrownError){
					        	window.alert(thrownError);
					        }
					    });
					    //------------------------------------------------------------------------------------------
					});
					
				}
			}
		);	  

    };
    
	/*
	 * --------------------------------------------------------------------Contact List Module-----------------------------------------------------------------------------
	 */	
	    
    /*
     * Data Grid only requires the on RegisterApi method because the UI is getting refreshed in the RefreshGrid function
     */
    $scope.gridContactList = {onRegisterApi: registerGridApiSec};
   
	function registerGridApiSec(gridApiSec) {
	    $scope.gridApiSec = gridApiSec;
	}
	$scope.gridContactList.columnDefs = [{
        name: 'ContactList',
        field: 'name',
        width: "*",
        enableHiding: false
    }, {
        name: 'CreatedTime',
        field: 'createdtime',
        type: 'date',
        cellFilter: 'date:\'yyyy-MM-dd h:mm a\'',
        width: "*",
        enableHiding: false
    },  {
        name: 'CreatedBy',
        field: 'createdby',
        width: "*",
        enableHiding: false,
        enableColumnMenu: false
    },  {
        name: 'Edit',
        //cellTemplate: '<md-button class="btn primary aria-label" ng-click="grid.appScope.EditContactList($event, row)" style="margin-left: 10%"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></md-button>',
        cellTemplate: '<button class="btn primary" aria-label="Edit" ng-click="grid.appScope.EditContactList($event, row)" style="margin-left: 10%"><i class="fa fa-pencil-square-o"></i></button>',
        //cellTemplate: '<md-button class="btn primary md-raised md-warn" aria-label="Edit" ng-click="grid.appScope.EditContactList($event, row)" style="margin-left: 10%"><i class="fa fa-pencil-square-o"></i></button>',
        width: "7%",
        enableHiding: false,
        enableColumnMenu: false
    },{
        name: 'Delete',
        //cellTemplate: '<button class="btn primary" ng-click="grid.appScope.DeleteContactList(row)" style="margin-left: 10%"><i class="fa fa-trash" aria-hidden="true"></i></button>',
        cellTemplate: '<button class="btn primary" ng-click="grid.appScope.DeleteContactList(row)" style="margin-left: 10%"><i class="fa fa-trash"></i></button>',
        width: "7%",
        enableHiding: false,
        enableColumnMenu: false
    }];   
	
	$scope.gridContactList.data = $scope.contactlist;
	
	$scope.DeleteContactList = function(row) {
		/*Check user session is still valid here */
		/*Check the task should be deleted- should ping the phone here too*/
		swal({
			  title: "Are you sure?",
			  text: "Please confirm the deletion of this contact list.",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Yes, delete it.",
			  cancelButtonText: "No, cancel deletion.",
			  //closeOnConfirm: true,
			  //closeOnCancel: true
			},
			function(isConfirm){
				if (isConfirm) {
					var index = $scope.gridContactList.data.indexOf(row.entity);
					var contactListToDelete = "";
					console.log($scope.contactlist[index]);
					contactListToDelete = $scope.contactlist[index].name;	
					console.log(contactListToDelete);
					$scope.contactlist.splice(index, 1);
					/*remove task from firebase cloud*/
					$timeout(function(){
						firebase.database().ref('/'+ grabUserId() +'/Contacts/' + contactListToDelete).remove();
					});
				};
			}
		);	  

    };	
    	 
    $scope.EditContactList = function(ev,row) {
		//console.log("Edit contact list clicked");
		//var index = $scope.gridContactList.data.indexOf(row.entity);
		//console.log(row.entity.name);
		ref = firebase.database().ref('/'+ grabUserId()+'/Contacts/' + row.entity.name + '/');
		var createdBy = "";
		var createdTime = "";
		ref.on("value", function(snapshot){
			var data = snapshot.val();
			createdTime = data.CreatedTime;
			createdBy = data.CreatedBy;
			//$scope.contactlistdetails = [];
			if (angular.isDefined($scope.contactlistdetails)){
				if ($scope.contactlistdetails != null){
					$scope.contactlistdetails = [];
				}
			}			
			for (var newKey in data){
				if(newKey !== "CreatedBy" & newKey !== "CreatedTime"){
					/*console.log(snapshot.child(newKey).child("Email").val());
					console.log(snapshot.child(newKey).child("FirstName").val());
					console.log(snapshot.child(newKey).child("Subscribed").val());
					console.log(snapshot.child(newKey).child("Surname").val());*/
					var ContactListData = {
						ListName: row.entity.name,
						Mobile: newKey,
						CreatedBy: createdBy,
						CreatedTime: createdTime,
						Email: snapshot.child(newKey).child("Email").val(),
						FirstName: snapshot.child(newKey).child("FirstName").val(),
						Subscribed: snapshot.child(newKey).child("Subscribed").val(),
						Surname: snapshot.child(newKey).child("Surname").val()
					};
					//console.log(ContactListData);
					$scope.contactlistdetails.push(ContactListData);
				}
			}
		});
		console.log($scope.contactlistdetails);
		$mdDialog.show({
			//scope: $scope,
		    //hasBackdrop: true,
		    //parent: angular.element(document.body),
			/*					---------------------------------------------------------MAY NEED TO CHANGE THIS BACK-----------------------------------------------------------				*/
			templateUrl: "contactListDialogNew.html",
		    targetEvent: ev,
		    locals: {
		    	contactlistdetails: $scope.contactlistdetails
		    },
		    controller: DialogController
		});
		/*.then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});*/
	};    
	
	
	function DialogController($scope, $mdDialog, contactlistdetails) {
		//$scope.contactlistdetails = contactlistdetails;
		//Create Data Grid for edit contact dialog
	    $scope.gridContactListDetails = {onRegisterApi: registerGridApiForth};
	    
		function registerGridApiForth(gridApiForth) {
		    $scope.gridApiForth = gridApiForth;
		}
		
		/*A temporary variable within a dialog within the contact list tab, it provides the interim for the dialog allowing 'Yes' to transform into true for the grid*/
		$scope.userSubscribed = true;
		
		$scope.gridContactListDetails = { 
			data: contactlistdetails, 
			enableCellSelection: true,
			enableCellEdit: true,
			enableRowSelection: false,
		/*};			
	
		$scope.gridContactListDetails.columnDefs = [{*/
			columnDefs: [{
		        name: 'Mobile',
		        field: 'Mobile',
		        width: "*",
		        enableCellSelection: true,
		        enableCellEdit: true,
		        enableHiding: false
		    },  {
		    	name: 'FirstName',
		    	field: 'FirstName',
		        width: "*",
		        enableCellSelection: true,
		        enableHiding: false, 
		        enableCellEdit: true,
		        enableColumnMenu: false
		    },	{
		    	name: 'Surname',
		    	field: 'Surname',
		        width: "*",
		        enableCellSelection: true,
		        enableHiding: false,
		        enableCellEdit: true,
		        enableColumnMenu: false  
		    },	{
		    	name: 'Email',
		    	field: 'Email',
		        width: "*",
		        enableCellSelection: true,
		        enableHiding: false,
		        enableCellEdit: true,
		        enableColumnMenu: false 	
		    },	{ 
		    	name: 'Subscribed',
		    	field: 'Subcribed',
		    	//Adding the gettSetter: true allows the model to be bound to a function
		    	cellTemplate: '<input type="checkbox" ng-model=userSubscribed ng-init="userSubscribed=grid.appScope.SetSubscribed(row)" ng-model-options="{ getterSetter: true }" ng-click="grid.appScope.ChangeSubscribed(row)">',
		    	width: '*',
		        enableHiding: false,
		        enableCellEdit: false,
		        enableColumnMenu: false
		        /*},  {
		        name: 'Edit',
		        cellTemplate: '<button class="btn primary" aria-label="Edit" ng-click="grid.appScope.EditContactList($event, row)" style="margin-left: 10%"><i class="fa fa-pencil-square-o"></i></button>',
		        width: "7%",
		        enableHiding: false,
		        enableColumnMenu: false
		    },{
		        name: 'Delete',
		        //cellTemplate: '<button class="btn primary" ng-click="grid.appScope.DeleteContactList(row)" style="margin-left: 10%"><i class="fa fa-trash" aria-hidden="true"></i></button>',
		        cellTemplate: '<button class="btn primary" ng-click="grid.appScope.DeleteContactList(row)" style="margin-left: 10%"><i class="fa fa-trash"></i></button>',
		        width: "7%",
		        enableHiding: false,
		        enableColumnMenu: false*/
		    }] 	
		};
		
		/*Converts the variable for the checkbox to a usable format for the Dialog UI grid.
		 * returns true or false*/
		
		$scope.SetSubscribed = function(row){
			var patt = /^(yes||Yes||YES||y||Y)$/;
			subscribed = row.entity.Subscribed;
			if (angular.isDefined(subscribed)){
				userSubscribed = patt.test(subscribed);	
				return userSubscribed;
			}
			else{
				userSubscribed = false;
				return userSubscribed;
			}
		};
		
		$scope.ChangeSubscribed = function(row){
			var i = grabIndexUsingMobile(row.entity.Mobile);
			var patt = /^(yes||Yes||YES||y||Y)$/;
			if(patt.test($scope.contactlistdetails[i].Subscribed)){
				$scope.contactlistdetails[i].Subscribed = 'No';	
			}
			else{
				$scope.contactlistdetails[i].Subscribed = 'Yes';
			}
		};
			
		$scope.contactlistdetails =  contactlistdetails;
			
		$scope.closeDialog = function() {
			$mdDialog.cancel();
		};
		$scope.saveDialog = function() {
			//Bug here-- cannot save more than one line at once
			console.log(contactlistdetails);
			$timeout(function() {
				var listName = $scope.contactlistdetails[0].ListName;
				for(var i = 0; i< $scope.contactlistdetails.length; i++){
					//Check data here for validation issues
					var tempData = {
						Email: $scope.contactlistdetails[i].Email,
						FirstName: $scope.contactlistdetails[i].FirstName,
						Surname: $scope.contactlistdetails[i].Surname,
						Subscribed: $scope.contactlistdetails[i].Subscribed
					};	
					firebase.database().ref('/'+ grabUserId()+'/Contacts/'+ listName + '/'+ $scope.contactlistdetails[i].Mobile).set(tempData);
					tempData = {};
				} 
				//$scope.gridApi.core.handleWindowResize();
				//$scope.gridApiSec.core.handleWindowResize();
			}, 0);
			//$mdDialog.hide();
			$mdDialog.cancel();
		};
		
	};	

	function upload(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();		
	    if (!browserSupportFileUpload()) {	
	        alert('The File APIs are not fully supported in this browser!');
	    } else {
	    	//var data = null;
	        var file = evt.target.files[0];
	        console.log(isEmpty(file));
	        //if(isEmpty(file)){
		        console.log("Inside upload");
		        try{
		        	parseData(file, grabData);
		        	console.log(evt);
		        }catch(err){
		        	/*Displays on cancel*/
		        	if(!isEmpty(file)){
		        		swal("Could not upload your .csv file, please check the required format and try again.");
		    	    	console.log(evt);
		        	}
		        };	        	
	       /* }
	        else{	
	        	swal("No file was selected");
	        }*/
	    };
	} 

	function browserSupportFileUpload() {
	    var isCompatible = false;
	    if (window.File && window.FileReader && window.FileList && window.Blob) {
	    	isCompatible = true;
	    }
	    return isCompatible;
	}	

	function parseData(file, callBack){
	    Papa.parse(file, {	
	    	header: true,
	        dynamicTyping: false,
	        complete: function(results) {
	        	console.log("Inside Parse");
	        	//data = results;
	        	//console.log(results.data[0]["Header1"]);
	        	//document.getElementById("testThiss").innerHTML = results.data[1][0];
	        	callBack(results.data);
	        },
	        error: function(err, file, inputElem, reason){
	        	console.log(reason);
	    	}
	    });    	
	}
	
	function grabData(data){
		var errorLog = "";
		swal({
			title: "Contact List Name",
			text: "Please enter a name for your new contact list:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "List Name"
		},
		function(inputValue){
			if (inputValue === false){
				//reset event listener YAY it works
				console.log("HERE","HERE");
				document.getElementById("csvFileUpload").value = null;				
				return "";
			}
			if (inputValue === "") {
				swal.showInputError("You need to write something!");
				return false;
			}
			if (data.length > 0 && grabUserId().length != -1){
				var now = new Date();
				var creationTime = new Date(now).toISOString();
				var reqListVars = {
					CreatedTime: creationTime,
					CreatedBy: grabUserEmail()										
				};			  
				errorLog = "Error log: ";
				
				/*
				 * outputSpreadSheetUploadErrors: Checks the header has the appropriate columns: Email, FirstName, Surname, Subscribed and Email
				 * Checks the formatting of each cell to make sure the values are correct.
				 * Adds meaningful data to the error output if necessary.
				 */ 
				
				errorLog = outputSpreadSheetUploadErrors(data);
				if(!isAlphaNumeric(inputValue)){
					errorLog = errorLog +  "Task name contains characters that are not alphanumeric (A-Z, 0-9).\n";
				}
				if (errorLog == "Error log: "){	
					var updates = {};
					updates['/'+ grabUserId() +'/Contacts/'+ inputValue+'/'] = reqListVars;
					console.log("UPDATES: " + updates);
					firebase.database().ref().update(updates);	
					//for each element of the .csv file - minus one to remove the header
					for (var i = 0; i < (data.length); i++){	
					//for (var i = 0; i < (data.length-1); i++){	
						try{
							//if(!compareData(data[i]["Mobile"])){
							//-------------------------------------------WILL REQUIRE ERROR CHECKING HERE TO MAKE SURE THE .CSV FIELDS ARE VALID--------------------------------
							//var newKey = firebase.database().ref('Contacts').push().key;
							//console.log(newKey);
							var postData = {
								Email: data[i]["Email"],
								FirstName: data[i]["FirstName"],
								Surname: data[i]["Surname"],
								Subscribed: data[i]["Subscribed"]
							};							
							var secUpdates = {};
							//firebase.database().ref('/'+ grabUserId() +'/Contacts/'+ inputValue +'/').child(data[i]["Mobile"]);
							secUpdates['/'+ grabUserId() +'/Contacts/'+ inputValue +'/'+ data[i]["Mobile"]] = postData;
							console.log(secUpdates);
							firebase.database().ref().update(secUpdates);
						} catch(err){
							//swal("Error","Error: " + err + "could not load spreadsheet, please make sure your spreadsheet has the following headers: Email, Mobile, Name, Subscribed", "failure");
							swal("Error","Error: " + err + "could not load spreadsheet, please make sure your spreadsheet has the following headers: Email, Mobile, Name, Subscribed", "error");
						}	
					}						
				}
				document.getElementById("csvFileUpload").value = null;			
			}
			if (errorLog == "Error log: "){
				swal("Uploaded!", "Your .csv file has been uploaded.", "success");
			} else{
				swal("Error", errorLog);
				//reset the event listener
				document.getElementById("csvFileUpload").value = null;	
			}
		});
	}   	
	
	function compareData(mobileNumber){
		for (var j = 0; j < $scope.contacts.length; j ++){
			//console.log(typeof(mobileNumber));
			//console.log(typeof($scope.contacts[j].mobile));
			if (parseInt(mobileNumber) == $scope.contacts[j].mobile)
				return true;
		}	
		return false;
	}
	
	/*
	 * --------------------------------------------------------------------Bulk Sms Module-----------------------------------------------------------------------------
	 */
	$scope.gridBulkContactList = {onRegisterApi: registerGridApiThird};
		
		function registerGridApiThird(gridApiThird) {
		    $scope.gridApiThird = gridApiThird;
		}
		$scope.gridBulkContactList.columnDefs = [{
	        name: 'email',
	        field: 'Email',
	        width: "*",
	        enableHiding: false
	    }, {
	        name: 'firstname',
	        field: 'FirstName',
	        width: "*",
	        enableHiding: false
	    },  {
	        name: 'subscribed',
	        field: 'Subscribed',
	        width: "*",
	        enableHiding: false,
	        enableColumnMenu: false
	    }, {
	        name: 'surname',
	        field: 'Surname',
	        width: "*",
	        resizable: true,
	        enableHiding: false
	    }, {
	        name: 'mobile',
	        field: 'Mobile',
	        width: "*",
	        enableHiding: false
	    }, /*{
	        name: 'Delete',
	        cellTemplate: '<button class="btn primary" ng-click="grid.appScope.BulkDelete(row)" style="margin-left: 10%"><i class="fa fa-trash" aria-hidden="true"></i></button>',
	        width: "7%",
	        enableHiding: false,
	        enableColumnMenu: false
	    }*/];
		
		$scope.gridBulkContactList.data = $scope.bulkrecipients;
		
		$scope.BulkDelete = function(row) {
			/*Check user session is still valid here */
			
			/*Check the task should be deleted- should ping the phone here too*/
			swal({
				  title: "Are you sure?",
				  text: "Please confirm the deletion of this task.",
				  type: "warning",
				  showCancelButton: true,
				  confirmButtonColor: "#DD6B55",
				  confirmButtonText: "Yes, delete it.",
				  cancelButtonText: "No, cancel deletion.",
				  closeOnConfirm: true,
				  closeOnCancel: true
				},
				function(isConfirm){
					if (isConfirm) {
						var index = $scope.bulkrecipients.data.indexOf(row.entity);
						$scope.bulkrecipients.splice(index, 1);
						/*remove task from firebase cloud
						$timeout(function(){
							firebase.database().ref('/'+ grabUserId() +'/TaskList/' + taskToDelete).remove();
						});*/
					}
				}
			);	  
	    };
	    
	/*HERE*/
	$scope.bulkAddRecipient = function(ev){
		//console.log($scope.bulkrecipients);
		//console.log($scope.gridBulkContactList.data);
			
		if(typeof $scope.bulkrecipients[0] !== 'undefined'){
			$mdDialog.show(
				{
				//scope: $scope,
			    //hasBackdrop: true,
			    //parent: angular.element(document.body),
				templateUrl: "bulkSmsDialog.html",	
			    targetEvent: ev,
			    locals: {
			    	bulkcontactlistdetails: $scope.bulkrecipients
			    },
			    //clickOutsideToClose:true,
			    controller: BulkDialogController
			});			
		}else{
			$mdDialog.show({
				//scope: $scope,
			    //hasBackdrop: true,
			    //parent: angular.element(document.body),
				templateUrl: "bulkSmsDialog.html",
			    targetEvent: ev,
			    locals: {
			    	bulkcontactlistdetails: $scope.bulkrecipients
			    },
			    //clickOutsideToClose:true,
			    controller: BulkDialogController
			});
		}

	};
	
	//BulkDialogController.$inject = ['$mdDialog', 'bulkcontactlistdetails'];
	
	function BulkDialogController($scope, $mdDialog, bulkcontactlistdetails) {
		$scope.bulkcontactlistdetails = bulkcontactlistdetails;
		console.log(bulkcontactlistdetails);
		$scope.bulkCloseDialog = function() {
			$mdDialog.cancel();
		};
		$scope.bulkAddDialog = function(bulkcontactlistdetails) {
			var errorLog = "";
			console.log("Bulk Contact List");
			//console.log($scope.bulkcontactlistdetails[0]);
			if(!testName($scope.bulksurname)){
				errorLog = errorLog + "Surname has invalid characters.\n";
			}
			if(!testName($scope.bulkfirstname)){
				errorLog = errorLog + "First Name has invalid characters.\n";
			}
			if(!testEmail($scope.bulkemail)){
				errorLog = errorLog + "Email address is invalid.\n";
			}
			if(!testMobile($scope.bulkmobile)){
				errorLog = errorLog + "Mobile number is invalid.\n";
			}
			if(!($scope.bulksubscribed)){
				errorLog = errorLog + "A customer must be subscribed to receive an sms.\n";
			}
			if (errorLog===""){
				console.log("No errors were found");
				/*will not require firebase update yet..user can still cancel the task at this stage...should only update the data grid UI*/
				if (grabUserEmail()){
					var now = new Date();
					var createdTimeTemp = new Date(now).toISOString();
					var bulksub = "";
					if ($scope.bulksubscribed){
						bulksub = "Yes";
					}else{
						bulksub = "No";
					}
					var tempBulkContactListData = {
							ListName: "Manually added",
							Mobile: $scope.bulkmobile,
							CreatedBy: grabUserEmail(),
							CreatedTime: createdTimeTemp,
							Email: $scope.bulkemail,
							FirstName: $scope.bulkfirstname,
							Subscribed: bulksub,
							Surname: $scope.bulksurname
					};
					console.log($scope.bulkcontactlistdetails[0]);
					//Check the mobile number is not in the list already
					var warningLog = "Warning:\n";	
					var lineToRemove = null;
					if ($scope.bulkcontactlistdetails.length > 0 ){
						for (var k = 0; k < $scope.bulkcontactlistdetails.length; k++){
							if ($scope.bulkmobile == $scope.bulkcontactlistdetails[k].Mobile){
								warningLog = warningLog + $scope.bulkmobile + " is already in the list, would you like to still add this entry?\n";
								lineToRemove = k;
								break;
							}
						}						
					}
					if (warningLog != "Warning:\n"){
						swal({
							title: "Warning",
							text: "The mobile about to be added is already in the list, would you like to keep the existing entry or replace it?",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Yes, keep it",
							cancelButtonText: "No, replace it",
							closeOnConfirm: false,
							closeOnCancel: false
						},
						function(isConfirm){
							if (isConfirm) {
								//swal types warning, error, success, and info
								swal("Cancelled", "The existing list entry was not overwritten", "warning");
							} else {
								console.log(lineToRemove);
								swal("Replaced", "The existing list entry was overwritten", "success");
								try{
									$scope.bulkcontactlistdetails.splice(lineToRemove, 1);
									$scope.bulkcontactlistdetails.push(tempBulkContactListData);	
									//requires a UI update after the splice
									$timeout(function() {
										$scope.gridApiSec.core.handleWindowResize();
									}, 0);
								}
								catch(ex){
									console.log("Line to remove index was not found");
									console.log(ex);
								}
							}
						});
					}else{
						//Update bulklistdetails which references bulkrecipients <-- the link to the bulk sms datagrid ui
						$scope.bulkcontactlistdetails.push(tempBulkContactListData);								
					}
				}
				else{
					swal({
						title: "ErrorLog",
						text: "Could not identify the current user.",
						type: "error",
						confirmButtonText: "Close"
					});
				}
			}
			else{
				swal({
					title: "ErrorLog",
					text: errorLog,
					type: "error",
					confirmButtonText: "Close"
				});
			}
			console.log($scope.bulkemail);
			$mdDialog.cancel();
		};
	};
	
	//$scope.bulkUpdateTable = function(){
	$scope.bulkAddCustomerList = function(){
		ref = firebase.database().ref('/'+ grabUserId()+'/Contacts/' + $scope.selectedContactList + '/');
		/*if (angular.isDefined($scope.bulkrecipients)){
			if ($scope.bulkrecipients != null){
				$scope.bulkrecipients = [];
			}
		}*/
		//Required to be commented out so that if a recipient is manually added to the dialog, it will not be wiped out if the list is changed.
		var createdBy = "";
		var createdTime = "";
		ref.on("value", function(snapshot){
			var data = snapshot.val();
			createdTime = data.CreatedTime;
			createdBy = data.CreatedBy;	
			var warningLog = "Warning:\nWould you like to replace the current entry?\n";	
			var arrayOfElementDuplicateIndexes = [];
			//Calculates the positions of duplicates prior to 
			for (var newKey in data){
				if(newKey !== "CreatedBy" & newKey !== "CreatedTime"){
					//Double check there are not duplicate mobiles in the Bulk Sms field
					if ($scope.bulkrecipients.length > 0 ){
						for (var k = 0; k < $scope.bulkrecipients.length; k++){
							if (newKey == $scope.bulkrecipients[k].Mobile){
								warningLog = warningLog + "\n" + newKey + " is already in the list on line "+ k + ".\n";
								arrayOfElementDuplicateIndexes.push(k);
								break;
							}
						}						
					}
				}
			}
			if("Warning:\nWould you like to replace the current entry?\n" != warningLog){
				swal({
					title: "Warning",
					text: warningLog,
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, replace it",
					cancelButtonText: "No, keep it",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function(isConfirm){
					for (var newKey in data){
						var bulkContactListData = {
							ListName: $scope.selectedContactList,
							Mobile: newKey,
							CreatedBy: createdBy,
							CreatedTime: createdTime,
							Email: snapshot.child(newKey).child("Email").val(),
							FirstName: snapshot.child(newKey).child("FirstName").val(),
							Subscribed: snapshot.child(newKey).child("Subscribed").val(),
							Surname: snapshot.child(newKey).child("Surname").val()
						};		
						if(newKey !== "CreatedBy" & newKey !== "CreatedTime"){
							var elementInGrid = false;
							for (var l = 0; l < arrayOfElementDuplicateIndexes.length; l++){
								if (newKey == $scope.bulkrecipients[arrayOfElementDuplicateIndexes[l]].Mobile){
									elementInGrid = true;
									break;
								}
							}
							if (isConfirm) {	
								if (elementInGrid){
									//Remove the old line here and add in the new if possible
									//At the index position where there is a duplicate, remove 1 element, then add bulkContactListData <- new data
									$scope.bulkrecipients.splice((arrayOfElementDuplicateIndexes[l]),1,bulkContactListData);  
								}else{
									$scope.bulkrecipients.push(bulkContactListData);
								}
							}
							else{
								//Dialog function will push bulk recipients here if the user answers "no" to add duplicates
								//Adds only new elements
								if (elementInGrid == false){
									$scope.bulkrecipients.push(bulkContactListData);
								}
							}	
							$timeout(function(){
								$scope.gridApiThird.core.handleWindowResize();
							}, 0);
							$scope.gridBulkContactList.data = $scope.bulkrecipients;
							warningLog = "Warning:\nWould you like to replace the current entry?\n";
						}
					}
				});				
			}else{
				for (var newKey in data){
					if(newKey !== "CreatedBy" & newKey !== "CreatedTime"){
						var bulkContactListData = {
							ListName: $scope.selectedContactList,
							Mobile: newKey,
							CreatedBy: createdBy,
							CreatedTime: createdTime,
							Email: snapshot.child(newKey).child("Email").val(),
							FirstName: snapshot.child(newKey).child("FirstName").val(),
							Subscribed: snapshot.child(newKey).child("Subscribed").val(),
							Surname: snapshot.child(newKey).child("Surname").val()
						};
						//Update bulklistdetails which references bulkrecipients <-- the link to the bulk sms datagrid ui
						$scope.bulkrecipients.push(bulkContactListData);		
						$scope.gridBulkContactList.data = $scope.bulkrecipients;
						$scope.gridApiThird.core.handleWindowResize();
						warningLog = "Warning:\nWould you like to replace the current entry?\n";
					}
				}	
				$timeout(function(){
					$scope.gridApiThird.core.handleWindowResize();
				}, 0);
			}
		});
		//Update UI
		$scope.gridBulkContactList.data = $scope.bulkrecipients;
	};
	
	/*Clear the datagrid UI within BulkSms tab*/
	$scope.bulkClearGrid = function(){
		swal({
			title: "Are you sure?",
			text: "Delete your current list from this tab?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it",
			closeOnConfirm: true
		},
		function(){
			$scope.gridBulkContactList.data = [];
			$scope.bulkrecipients = [];
			$scope.bulkrecipients.length = 0;
			$scope.gridBulkContactList.length = 0;
			$scope.gridApiSec.core.handleWindowResize();
		});	
	};
	
	/*$scope.bulkAddCustomerList = function(){
		console.log("test");
	};*/	
	
	$scope.bulkSendTaskToCloud = function() {
		if(document.getElementById("bulkmessagebox").value.length < 1){
			console.log("Fail here, at the bulk send");
			swal("Oops...","Please provide a message to send.");
		}
		else{
			if($scope.bulkrecipients.length == 0){
				swal("Oops...","Please provide a recipient.");
			}
			else {
				if (grabUserId().length != -1){
					var isoDate = new Date($scope.bulkNewDate).toISOString();
					var now = new Date();
					
					/*
					 * Remove all invalid characters from the message
					 * /gi regex modifiers in javacsript /g changes the match pattern scope to global, i ignores the case
					 */ 
						
					if (!testSmsMessage($scope.bulkmessagebox)){
						sweetAlert("An invalid character was detected, please remove it and try resending the message.");
					}	
					else{
						//Extract the mobile numbers out of the current list
						var bulkrecipientlist = [];
						for (var i = 0; i < $scope.bulkrecipients.length;i ++){
							bulkrecipientlist.push($scope.bulkrecipients[i].Mobile);
						}
						if (isoDate){			
							var creationTime = new Date(now).toISOString();
							var postData = {
								CreationTime: creationTime,
								CreatedBy: grabUserEmail(),
								TimeToSend: isoDate,
								Status: 'Sending',
								Message: $scope.bulkmessagebox,
								Recipients: bulkrecipientlist,
								Type: 'Bulk-Sms'
							};		
							swal(	  //Close on confirm changed to true
									{ title: "Task Name",   text: "Input a new Task Name:",   type: "input",   showCancelButton: true,   closeOnConfirm: true,   animation: "slide-from-top",   inputPlaceholder: "Task Name Here." }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("Task requires a name.");     return false;   }
										//title: "Task Name",   text: "Input a new Task Name:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Task Name Here." }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("Task requires a name.");     return false;   }      
										$timeout(function(){
											//Check input value is not currently within the list
											//Check input value is alpha numeric
											console.log(postData);
											firebase.database().ref('/'+ grabUserId() +'/TaskList/' + inputValue).set(postData);
											$scope.loader.loading = true;
											$(".overlay").show();
											$scope.loader.taskName = inputValue;											
											//------------------------------Ping phone or sms gateway here------------------------------
											//Will require task name and message type
											if(postData.Message.length > 0) {
										        $.ajax({url: "notifyWings.php?messageToSend=" + postData.Message
										        	+ "&messageType=" + "Bulk-Sms"
										        	+ "&taskName=" + inputValue
										        	+ "&userID=" + grabUserId() 
										        	+ "&userToken=" + grabUserToken(), 
										        	success: function(result){
										        		//window.alert(result);
										        		$timeout(function(){
										        			if($scope.loader.taskName != ""){
										        				$scope.loader.taskName = "";
										        				$(".overlay").hide();
										        				$scope.loader.loading = false;
										        				swal("Sending the message timed out please try again late.");
										        			}
										        		},10000);
										        	},
										        	error: function(xhr, ajaxOptions, thrownError){
										        		//window.alert(thrownError);
								        				$scope.loader.taskName = "";
								        				$(".overlay").hide();
								        				$scope.loader.loading = false;
										        		swal("Sending the message failed please try again late.");
										        	}
										        });				
											} 
											else{
												window.alert("Please enter some text to send.");
											}	
											//------------------------------------------------------------------------------------------
											
											swal("Task List Updated.", inputValue +" added to the task list.", "success");
										}
									);
								}
							);						
						}
						else {
							swal("Oops", "Please provide a valid date/time.");
						};	
					};
				}else {
					swal("Oops","User is not currently logged in, please login and resubmit.");
				}
			}
		}
		//Output Recipients First
		console.log($scope.bulkrecipients);
	};		

	
	/*
	 * ------------------------------------------------------------------------Quick Sms Module------------------------------------------------------------------------
	 */
	$scope.addRecipient = function() {
		if (angular.isDefined($scope.recipients)){
			try {
				if(document.getElementById("recipientField").value.length == 10){
					if(checkRecipient(document.getElementById("recipientField").value) == -1){
						if(testMobile(document.getElementById("recipientField").value)){
							$scope.recipients.push(document.getElementById("recipientField").value);
						}
						else{
							swal("Oops...", "Please remove invalid characters from the number.");
						}	
					}
					else {
						swal("Oops...", "This number is already in the list.");
					}
				}
				else if(document.getElementById("recipientField").value.length != 10){
					swal("Oops...", "Please provide a 10 digit mobile number.");
				}
			}
			catch(error){
				swal("Oops...", "Something irregular occured, please contact your system administrator. " + err.message);
			}
		}
	};	
	
	$scope.deleteRecipient = function(id) {
		$timeout(function(){
			$scope.recipients.splice(grabKeyIndex(id),1);
		});
	};
	
	$scope.sendTaskToCloud = function(){
		if(document.getElementById("messagebox").value.length < 1){
			swal("Oops...","Please provide a message to send.");
		}
		else{
			if($scope.recipients.length == 0){
				swal("Oops...","Please provide a recipient.");
			}
			else{
				if(grabUserId().length != -1){
					var isoDate = new Date($scope.newDate).toISOString();
					var now = new Date();
					var tempMessage = "";
					/*
					 * Remove all invalid characters from the message
					 * /gi regex modifiers in javacsript /g changes the match pattern scope to global, i ignores the case
					 */ 
					tempMessage = $scope.messagebox;
					if (!testSmsMessage($scope.messagebox)){
						sweetAlert("An invalid character was detected, please remove it and try resending the message.");
					}
					else{
						if (isoDate){
							var creationTime = new Date(now).toISOString();
							var postData = {
								CreationTime: creationTime,
								CreatedBy: grabUserEmail(),
								TimeToSend: isoDate,
								Status: 'Sending',
								Message: $scope.messagebox,
								Recipients: $scope.recipients,
								Type: 'Quick-Sms'
							};
							//console.log(firebase.database().ref('/'+ grabUserId() +'/TaskList'));
							swal(
								{   title: "Task Name",   text: "Input a new Task Name:",   type: "input",   showCancelButton: true,   closeOnConfirm: true,   animation: "slide-from-top",   inputPlaceholder: "Task Name Here." }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("Task requires a name.");     return false;   }      
									$timeout(function(){
										//Check input value is not currently within the list
										//Check input value is alpha numeric
										firebase.database().ref('/'+ grabUserId() +'/TaskList/' + inputValue).set(postData);
										$scope.loader.loading = true;
										$(".overlay").show();
										$scope.loader.taskName = inputValue;
										//------------------------------Ping phone or sms gateway here------------------------------
										
										//Will require task name and message type
										if(postData.Message.length > 0) {
											//Add black overlay
									        $.ajax({url: "notifyWings.php?messageToSend=" + postData.Message
									        	+ "&messageType=" + "Quick-Sms"
									        	+ "&taskName=" + inputValue
									        	+ "&userID=" + grabUserId() 
									        	+ "&userToken=" + grabUserToken(), 
									        	success: function(result){
									        		//window.alert(result);
									        		//Wait 10 seconds before timing out the task and hiding the loading bars again
									        		$timeout(function(){
									        			if($scope.loader.taskName != ""){
									        				$scope.loader.taskName = "";
									        				$(".overlay").hide();
									        				$scope.loader.loading = false;
									        				swal("Sending the message timed out please try again late.");
									        			}
									        		}, 10000);
													//$(".overlay").show();
													//$scope.loader.loading = true;
													//$scope.loader.taskName = inputValue;
									        	},
									        	error: function(xhr, ajaxOptions, thrownError){
									        		//window.alert(thrownError);
							        				$scope.loader.taskName = "";
							        				$(".overlay").hide();
							        				$scope.loader.loading = false;
									        		swal("Sending the message timed out please try again late.");
									        	}
									        });		
										} 
										else{
											window.alert("Please enter some text to send.");
										}	
										//------------------------------------------------------------------------------------------

										//$scope.loader.taskStatus = "Sending";
										//swal("Task List Updated.", inputValue +" added to the task list.", "success");
									});
								}/*function(){
									  alert("Deleted!");
								}*/
							);
						}
						else{
							swal("Oops", "Please provide a valid date/time.");
						};	
					}
				}
				else{
					swal("Oops","User is not currently logged in, please login and resubmit.");
				};
				
			};
		};		
	};	
	

	/*
	 * ------------------------------------------------------------------------Generic Functions-------------------------------------------------------------------
	 */
	
	//Checks if the sms-message falls within the ascii range of 1-127
	function testSmsMessage(smsMessage){
		//Javascript recognises any variables that start with / as a reg exp object /pattern/modifiers which is the same as new RegExp("");
		//var patt = /[^\x00-\x7F]/g;
		var patt = /^[a-zA-Z0-9 \'\`\.\/\&]+$/;
		return patt.test(smsMessage);
	}
	
	function testMobile(mobileNo){
		var patt = /^[0-9]{10,10}$/;
		return patt.test(mobileNo);
	}
	
	function testEmail(email){
		var patt = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		return patt.test(email);
	}
	
	function testName(name){
		//var patt = /[^\x00-\x7F]+$/;  
		var patt = /^[a-zA-Z0-9 \'\`\.\/\&\(\)\-]+$/;
		return patt.test(name);
	}
	
	function testSubscribed(subscribed){
		var patt = /^(yes||YES||Yes||no||No||NO||y||Y||n||N)$/;
		return patt.test(subscribed);
	}
	
	function isNumber(number){
		var patt = /^[0-9]+$/;
		return patt.test(number);
	}
	
	function isAlphaNumeric(alphaNumeric){
		var patt = /^[0-9A-Za-z ]+$/;
		return patt.test(alphaNumeric);		
	}
	
	function outputSpreadSheetUploadErrors(data){
		console.log(data);
		var errorOutput = "Error log: ";
		var fileColumnDefs = ["Email", "FirstName", "Surname","Subscribed", "Mobile"];
		//Checks the headers of the spreadsheet file are euqal to the column definitions
		for (var l = 0; l <  fileColumnDefs.length; l++){
			for (var k = 0; k < Object.keys(data[0]).length; k++){
				if (fileColumnDefs[l]==Object.keys(data[0])[k]){
					break;
				}
				if (k == (Object.keys(data[0]).length-1)){
					errorOutput = errorOutput + "Column " + fileColumnDefs[l] + " was not found.\n";
					break;
				}
			}					
		}	
		//Checks the value of each cell to ensure they meet the require criteria. E.g. Mobile is 10 digits long.
		console.log("Spreadsheet rows " & data.length-1);
		for (var j = 0; j < data.length-1; j++){
			if(data[j]["Email"] != ""){
				if(!testEmail(data[j]["Email"])){
					console.log("Failed email" + data[j]["Email"]);
					errorOutput = errorOutput + "Invalid character in the email field on line " + (j+2) + '.\n';
				}			
			}
			if(!testName(data[j]["FirstName"])){
				console.log("Failed firstname" + data[j]["FirstName"]);
				errorOutput = errorOutput + "Invalid character in the first name field on line " + (j+2) + '.\n';
			}		
			if(data[j]["Surname"] != ""){
				if(!testName(data[j]["Surname"])){
					console.log("Failed surname");
					errorOutput = errorOutput + "Invalid character in the surname field on line " + (j+2) + '.\n';
				}				
			}
			if(!testSubscribed(data[j]["Subscribed"])){
				console.log("Failed subscribed");
				errorOutput = errorOutput + "Invalid character in the subscribed field on line " + (j+2) + '.\n';
			}
			if(!testMobile(data[j]["Mobile"])){
				console.log("Failed mobile");
				errorOutput = errorOutput + "Invalid character in the mobile field on line " + (j+2) + '.\n';
			}
		}	
		return errorOutput;
	}
	
	$scope.RefreshGrid = function(page){
		$timeout(function() {
			$scope.gridApi.core.handleWindowResize();
			$scope.gridApiSec.core.handleWindowResize();
			$scope.gridApiThird.core.handleWindowResize();
		}, 0);
		window.scrollTo(0,0);
	};
	
	/*Grab index of recipient value*/ 
	function grabKeyIndex(key){
		for (var i = 0; i < $scope.recipients.length; i++){
			if ($scope.recipients[i] == key){
				return i;
			}
		}
		return key;
	}
	
	/*Check if the recipient is within the display unordered list on the Quick Sms tab*/
	function checkRecipient(recipient){
		var i = 0;
		for (i = 0; i < ($scope.recipients.length); i++){
			if ($scope.recipients[i] == recipient){
				return i;
			}
		}
		return -1;
	}
	
	function grabIndexUsingMobile(mobile){
		var i = 0;
		for (i = 0; i < ($scope.contactlistdetails.length); i++){
			if ($scope.contactlistdetails[i].Mobile == mobile){
				return i;
			}
		}
		return -1;
	}	
	
	function grabUserId(){
		return firebase.auth().currentUser.uid;
	}
	
	function grabUserEmail(){
		return firebase.auth().currentUser.email;
	}
	
	function grabUserToken(){
		return firebase.auth().currentUser.refreshToken;
	}
	
	function isEmpty(obj) {
	    if (obj == null) return true;
	    //console.log("obj not null");
	    if (obj.length > 0)    return false;
	    //console.log("obj length equal to 0");
	    if (obj.length === 0)  return true;
	    //console.log("obj length equal to 0");
	    if (typeof obj !== "object") return true;
	    //console.log("obj not equal to object type");
	    for (var key in obj) {
	        if (hasOwnProperty.call(obj, key)) return false;
	    }
	    //console.log("obj has properties");
	    return true;
	}	
  
});