<?php
	//http://localhost/CurlTest3/CurlTest3.php?to=cscpRwlVzac:APA91bHmBY6qPJV-4d_1oqRbg67Vdhasjfh1kKOmhT-35xrotxPinZ28sqoiK-NMi-NetXFSw3fD5Z0zafsudeC3gdxJk4b-Yidi96kJUTb4uyUO0G3wIqcjDTnZgmLzO39gUL-n67Xl
	// API access key from Google API's Console
	define( 'API_ACCESS_KEY', 'AIzaSyBJuOR5zkArCFC2S_GDDBE3vObN188idKI' );
	$message = $_GET['messageToSend'];
	$messageType = $_GET['messageType'];
	$taskName = $_GET['taskName'];	
	$refreshedToken = $_GET['userToken'];
	//debug_to_console( $refreshedToken );
	
	$userID = $_GET['userID'];
	$registrationIds = 'cEVcfBlPODM:APA91bGa2_aKqcUy9DfgTAqcsZhkPQSBcNgQG15Fqv8Detn2DkrwWMMgeWHT5PEjsp8o15jDgrlRYdmLO7ouiaCAULL-Scq63NAA86coPKw5eG0uB1XbFgs5t9KAksEUwmfAIA248GGp';

	// prep the bundle
	$msg = array
	(
		'message' 	=> $message,
		'userID'	=> $userID,	
		'messageType'	=> $messageType,
		'taskName' 		=>	$taskName,
		'refreshedToken'	=> $refreshedToken,
	);
	$fields = array
	(
		'to' 	=> $registrationIds,
		'data'			=> $msg
	);
	$headers = array
	(
		'Authorization: key=' . API_ACCESS_KEY,
		'Content-Type: application/json'
	);
	 
	$ch = curl_init();
	curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
	curl_setopt( $ch,CURLOPT_POST, true );
	curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
	curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
	$result = curl_exec($ch );
	curl_close( $ch );
	echo $result;
	
	function debug_to_console( $data ) {
	
		if ( is_array( $data ) )
			$output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
		else
			$output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";
		echo $output;
	}
?>