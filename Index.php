<html ng-app="myApp">
	<head>
  		<meta charset="utf-8">
  		<meta name="viewport" content="width=device-width, initial-scale=1">
  		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> 
  		
		<link rel="stylesheet" href="styles/quick-sms.css">
		<link rel="stylesheet" href="styles/overview.css">
		<link rel="stylesheet" href="styles/contact-list.css">
		<link rel="stylesheet" href="styles/bulk-sms.css">
		<link rel="stylesheet" href="styles/email-sms.css">
		<link rel="stylesheet" href="styles/index.css">
		<link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.min.css">
	  	
		<!-- Firebase required libraries  -->
		<script src="https://www.gstatic.com/firebasejs/3.3.0/firebase.js"></script>
		<script src="https://www.gstatic.com/firebasejs/3.3.0/firebase-app.js"></script>
		<script src="https://www.gstatic.com/firebasejs/3.3.0/firebase-auth.js"></script>
		<script src="https://www.gstatic.com/firebasejs/3.3.0/firebase-database.js"></script> 	
			
		<!-- <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script> -->
		
		<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js"></script>		
		<script data-require="jquery@*" data-semver="2.1.1" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script src="https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"></script>
			
		<!-- <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.8.3/angular-material.min.css"> -->
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.2/angular-material.min.css">	
  		<script src="wingedLogin.js"></script>
  		<!-- Custom Alert Boxes -->
  		<!-- https://github.com/t4t5/sweetalert -->
  		
  		<script src="sweetalert-master/dist/sweetalert.min.js"></script> 
		<link rel="stylesheet" type="text/css" href="sweetalert-master/dist/sweetalert.css">
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-route.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js"></script>
		<script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/svg-assets-cache.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-messages.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.0.7/angular-material.min.js"></script>
		
		<!-- Angular date time input implementation -->
		<link rel="stylesheet" href="DateTime/angularjs-datetime-picker.css" />
 		<script src="DateTime/angularjs-datetime-picker.js"></script>
 		
 		<!-- UI Grid -->
 		<link rel="stylesheet" type="text/css" href="angular-ui-grid/ui-grid.min.css"/>
 		<script src="angular-ui-grid/ui-grid.min.js"></script>
 		
 		<!-- Papa Parse for Contact List Upload -->
 		<script src="PapaParse/papaparse.min.js"></script> 	
	</head>
	<div class="overlay"></div>
	<body ng-controller="userCtrl" class="transparent-bg">
    	<header>
		</header>
		<section>
			<div class="container form-style-5 div-header-container">
				<legend><img class="img-winged-style" src="images/xxs-100x100-blue.png" alt="some_text"><!-- <span class="number"></span> --> 
					<div class="div-title-style">Winged Sms</div>
					<div class="div-logoff-button-style">	
						<button class="btn btn-xs" ng-click="logoffButton()">
							<i class="fa fa-sign-out" aria-hidden="true"></i>
							Log Off
						</button>
					</div>
					<div class="div-logon-button-style">
						<button class="btn btn-xs" ng-click="loginButton()">
							<i class="fa fa-sign-in" aria-hidden="true"></i>
							Login
						</button>
					</div>
					<div class="div-logon-button-style">
						<button class="btn btn-xs" ng-click="RegisterButton()">
							Register
						</button>
					</div>
				</legend>
				<br>
			</div>
			<div id="exTab3" class="container">	
				<ul  class="nav nav-pills">
					<li class="active"><a  href="#1b" data-toggle="tab" ng-click="RefreshGrid(1)"><i class="fa fa-list-alt icon-size" aria-hidden="true"></i>  Overview</a></li>
					<li class="button-margins"><a href="#2b" data-toggle="tab" ng-click="RefreshGrid(2)"><i class="fa fa-address-card-o icon-size" aria-hidden="true"></i>  Contact List</a></li>
					<li class="button-margins"><a href="#3b" data-toggle="tab" ng-click="RefreshGrid(3)"><i class="fa fa-th-list icon-size" aria-hidden="true"></i>  Bulk SMS</a></li>
				  	<!--  <li class="button-margins"><a href="#4b" data-toggle="tab" ng-click="RefreshGrid(4)"><i class="fa fa-reply icon-size" aria-hidden="true"></i> Email SMS</a></li>-->
				  	<li class="button-margins"><a href="#5b" data-toggle="tab" ><i class="fa fa-paper-plane icon-size" aria-hidden="true"></i>  Quick SMS</a></li>
				</ul>
				<div class="tab-content clearfix rounded-edges content-holder borders-first main-container" style=""> 
					<div class="tab-pane active" id="1b">
						<?php include 'overviewNew.php';?>
					</div>
					<div class="tab-pane" id="2b">
						<?php include 'contactListUpload.php';?>
					</div>
					<div class="tab-pane" id="3b">
						<?php include 'bulkSms.php';?>
					</div>
					<!-- <div class="tab-pane" id="4b">
						<h3>Waiting for availability</h3>
					</div> -->
					<div class="tab-pane" id="5b">
						<?php include 'quickSmsNew.php';?>
					</div>
				</div>		
			</div>
			<div ng-show="loader.loading" class="loading-screen">
				<h4 style="color:white;"><b>Sending...</b></h4>
				<i class="fa fa-cog fa-spin fa-3x fa-fw white-spinner"></i>
			</div>
		</div>
		</section>
		<footer class="container grad1 footer-gradient">
			<div class="footer-outisde" style="display:none;">
				<div class="footer-inside">
					<br><p class="footer-add-padding">Footer Text</p>
				</div>
			</div>
		</footer>
	</body>
</html>

