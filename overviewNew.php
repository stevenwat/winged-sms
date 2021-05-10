<!-- http://ui-grid.info/  -->

<label class="label-style overview-label-style">
	<i class="fa fa-calendar-o icon-size overview-icon-style" aria-hidden="true"></i> Scheduled Tasks:
</label>
<div class="overview-grid-style">	
	<!-- <div id="grid1" ui-grid="{ data: tasks }" class="grid" style="color: black;"></div> -->
	<!-- Removed the ng-if="!refresh" because the API can now be refresh via onRegisterApi: registerGridApiSec on the grid instantiation -->
	<div id="grid1" ui-grid="gridOptions" class="grid" style="color: black;"></div>
</div>
