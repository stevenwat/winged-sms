<div class="form-style-5" class="bulk-sms-container">
	<form name="bulkSmsForm">
		<div class="row bulk-sms-first-row">
			<div class="col-sm-6">
				<label for="selectcustomerlist" class="bulk-customerlist-label">
					<i class="fa fa-list-alt icon-size" aria-hidden="true"></i>  Contact List:
				</label>
				<!-- This needs to be changed to a drop down box populated with customer lists -->
				<div class="input-group bulk-sms-drop-down-container">
					<select ng-model="selectedContactList" ng-change="bulkUpdateTable()" style="width:99%;">
						<option ng-repeat="x in contactlist" value="{{x.name}}">{{x.name}}</option>
					</select>
					<span class="input-group-btn">
						<button type="button" id="BulkAddCustomerListButton" class="btn btn-xs" ng-click="bulkAddCustomerList()"><i class="fa fa-plus" style="font-size: 0.73em;" aria-hidden="true"></i></button>
					</span>					
				</div>
			</div>
			<div class="col-sm-6" style="height:3.7rem; margin-top:4.5rem;">
				<button type="button" id="BulkAddRecipientButton" class="button" ng-disabled="bulkSmsForm.bulkrecipientfield.$invalid" ng-click="bulkAddRecipient($event)"><i class="fa fa-user-plus button-icon" aria-hidden="true"></i>Add Contact</button>
			</div>
		</div>
	
		<div class="row">
			<div class="col-sm-12" >
				<div class= "bulk-sms-grid-container">	
					<div id="grid3" ui-grid="gridBulkContactList" class="grid" style="color: black;"></div>
				</div>
				<div class="bulk-sms-clear-grid-container">
					<button type="button" id="BulkClearDataGrid" class="button" ng-click="bulkClearGrid()"><i class="fa fa-trash button-icon" aria-hidden="true"></i>Clear</button>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12 bulk-sms-message-box-container">
				<textarea id="bulkmessagebox" name="bulkmessagebox" placeholder="Message to send"
					ng-model="bulkmessagebox"
					ng-pattern="/^[a-zA-Z0-9\.\$\,\'\%\!\s]+$/" required>
				</textarea>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-6">
				<label for="bulkjob" class="label-style"><i class="fa fa-calendar icon-size" aria-hidden="true"></i>  Schedule:</label>
				<div class="input-group bulk-sms-input">									
					<span class="input-group-addon">							 
						<input datetime-picker ng-model="bulkNewDate"/>	
					</span>				
				</div>   
			</div>
			<div class="col-sm-6 bulk-sms-send-container">
				<button class="btn" ng-click="bulkSendTaskToCloud()"><i class="fa fa-paper-plane button-icon" aria-hidden="true"></i>Send</button>
			</div>
		</div>
	</form>
</div>