<!-- http://ui-grid.info/  -->
<label class="label-style contact-list-label-style">
	<i class="fa fa-address-book icon-size contact-list-icon-style" aria-hidden="true"></i><span class="contact-list-header"> Contact Lists:</span>
</label>
<!--  t r b l  -->
<div class="contact-list-data-grid-style">	
	<!-- Removed the ng-if="!refresh" because the API can now be refresh via onRegisterApi: registerGridApiSec on the grid instantiation -->
	<div id="grid2" ui-grid="gridContactList" class="grid" style="color: black;"></div>
</div>
<div class="contact-list-button-container">
	<label class="custom-file-upload contact-list-file-upload-button">
		<input type="file" name="File Upload" id="csvFileUpload" accept=".csv"/>
		<i class="fa fa-cloud-upload"></i>  Upload
	</label> 	
</div>