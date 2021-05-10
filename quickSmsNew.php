<div class="form-style-5">
	<form name="quickSmsForm">
		<div class="row quick-sms-first-row">
			<div class="col-sm-6">
				<label for="recipientField" class="label-style">
					<i class="fa fa-envelope-open-o icon-size" aria-hidden="true"></i>  Recipient:
				</label>
				<div class="input-group">
					<input type="text" name="field5" placeholder="Recipient" id="recipientField" style="width:99%;" ng-model="mobile" name="recipientfield" ng-pattern="/^[0-9]{10,10}$/" required>
					<span class="input-group-btn">
						<button type="button" id="AddRecipientButton" class="btn btn-xs" ng-disabled="quickSmsForm.recipientfield.$invalid" ng-click="addRecipient()"><i class="fa fa-plus" style="font-size: 0.73em;" aria-hidden="true"></i></button>
					</span>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-6" >
				<ul id="unorderedList" name="unorderedList">
					<li ng-repeat="recipient in recipients" class="line-style"> 
						<span>{{  recipient  }}</span>
						<button class="w3-btn w3-ripple" ng-click="deleteRecipient(recipient)"><i class="fa fa-trash" aria-hidden="true"></i></button>
					</li>
				</ul>
			</div>
			<div class="col-sm-6 quick-sms-messagebox-container">
				<textarea id="messagebox" name="messagebox" placeholder="Message to send"
					ng-model="messagebox">
				<!-- ng-pattern="/^[a-zA-Z0-9\.\$\,\'\%\!\s]+$/" required -->
				</textarea>
			</div>
		</div>
		<div class="row quick-sms-last-row">
			<div class="col-sm-6">
				<label for="job" class="label-style"><i class="fa fa-calendar icon-size" aria-hidden="true"></i>  Schedule:</label>
				<div class="input-group">									
					<span class="input-group-addon">							
						<input datetime-picker ng-model="newDate"/>		
					</span>				
				</div>   
			</div>
			<div class="col-sm-6">
				<button class="btn quick-sms-send-button" ng-click="sendTaskToCloud()"><i class="fa fa-paper-plane button-icon" aria-hidden="true"></i>Send</button>
			</div>
		</div>
	</form>
</div>
