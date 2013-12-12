<?php
//ini_set('display_errors',1);
//ini_set('display_startup_errors',1);
//error_reporting(-1);



$foo = file_get_contents("php://input");


// For debugging purposes: check if json has been given in php GET
if(isset($_GET['json'])) $foo = $_GET['json'];


$jdec = json_decode($foo, true);
$db = NULL;

// if no action given, return and die
if(!isset($jdec['action'])) die('{"error":"Action not set"}'); 

// Otherwise switch the action
switch($jdec['action']) {
	case 'create':
		connect();
		create_event($jdec);
		disconnect();
		break;
	case 'read': 
		connect();
		read_event($jdec['idevent']);
		disconnect();
		break;
	case 'browse': 
		connect();
		browse_events();
		disconnect();
		break;
	default:
		die('{"error":"Given action value not supported."}');
}




// Connects to the database
function connect() {
	$db=mysql_connect("localhost", "tvdpbe_wis", "EG8q-8kRx.") or die('Could not connect');
	mysql_select_db("tvdpbe_wis", $db) or die('{"error":"Error selecting database"}');
}

// Disconnects from the database
function disconnect() {
	if($db != NULL) {
		mysql_close($db);
		$db = NULL;
	}
}


// Return all the information from event with given 'idevent'
// TODO ADD ADDRESS
function read_event($idevent) { 

	// Query on 'idevent'
	$sql = "
SELECT title, description, image, startdatetime, enddatetime, pricerange, createdby, food, party, culture, username,streetname, number, postalcode, city, country
FROM events E INNER JOIN users  U on (E.createdby = U.idusers)
INNER JOIN addresses A on (A.idaddresses = E.address)
WHERE idevents = $idevent
";
	$result = mysql_query($sql) or die("Could not query\n$sql\n$result");

	// If there are results (should onle be one row, though)
	if(mysql_num_rows($result)){
	
		// Grab first row
		$row=mysql_fetch_array($result);
	
		$data = array(
		'title' 		=> $row['title'],
		'description' 	=> $row['description'],
		'image' 		=> $row['image'],
		'startdatetime'	=> $row['startdatetime'],
		'enddatetime' 	=> $row['enddatetime'],
		'pricerange' 	=> $row['pricerange'],
		'createdby' 	=> $row['createdby'],
	     'address' 		=> $row['address'],
		'food' 			=> $row['food'],
		'party' 		=> $row['party'],
		'culture' 		=> $row['culture'],
		'username' 		=> $row['username'],
		'address'       => $row['streetname'].' '.$row['number'].', '.$row['postalcode'].' '.$row['city'].', '.$row['country'],
		'addressrule1'       => $row['streetname'].' '.$row['number'],
		'addressrule2'       => $row['postalcode'].' '.$row['city'],
		'addressrule3'       => $row['country']
		);
		// Encode and echo the data
		echo '{"events":';
		echo json_encode($data);
		echo '}';
		
	} else {
		// Nothing returned? Echo empty JSON
		echo '{"error":"No event found for given id"}';
	}
	
}
	
	
// Browse events will display a number of upcoming events
// TODO ADD ADDRESS AND USERNAME AGAIN (they were bugging)
function browse_events() {

	// Query the information of events where start date lies in future
	$sql = "
SELECT title, description, image, startdatetime, enddatetime, pricerange, createdby, address, food, party, culture, username
FROM events E INNER JOIN users  U on (E.createdby = U.idusers) 
WHERE startdatetime > '" . date("Y-m-d H:i:s") . "'
ORDER BY startdatetime ASC
LIMIT 0, 50
";
	$sql = "SELECT idevents, title, description, image, startdatetime, enddatetime, pricerange, createdby, food, party, culture,username
FROM events E INNER JOIN users  U on (E.createdby = U.idusers) 
WHERE startdatetime > '" . date("Y-m-d H:i:s") . "'
ORDER BY startdatetime ASC
LIMIT 0,50
";
	$result = mysql_query($sql) or die("Could not query: \n" . $sql ."\n" . $result);

	// If there are results
	if(mysql_num_rows($result)){
		echo '{"events":[';

		$first = true;

		//  cast results to specific data types
		while($row=mysql_fetch_array($result)){
	
			// With a comma between JSON array objects
			if($first) {
				$first = false;
			} else {
				echo ',';
			}
			
			$data = array(
			'idevents' 		=> $row['idevents'],
			'title' 		=> $row['title'],
			'description' 	=> $row['description'],
			'image' 		=> $row['image'],
			'startdatetime'	=> $row['startdatetime'],
			'enddatetime' 	=> $row['enddatetime'],
			'pricerange' 	=> $row['pricerange'],
			'createdby' 	=> $row['createdby'],
			// 'address' 		=> $row['address'],
			'food' 			=> $row['food'],
			'party' 		=> $row['party'],
			'culture' 		=> $row['culture'],
		    'username' 		=> $row['username']
		);
			// Encode and echo the data
			echo json_encode($data);
		}
		echo ']}';
	} else {
		// No results found; return empty JSON.
		echo '[]';
	}
}

// Helper function that checks whether a field exists in an array
// Return the value if existent, returns alternative otherwise
function ifset($array, $field, $alternative) {
	if(isset($array[$field])) {
		return $array[$field];
	} else {
		return $alternative;
	}
}

// Create an event with given information
// This code assumes the clientside has checked if the necessary elements have been provided.
// TODO ADD ADDRESS
function create_event($jdec) {

	$title = 		ifset($jdec, 'title', '');
	$description = 	ifset($jdec, 'description', '');
	$image =  		ifset($jdec, 'image', '');
	$startdatetime= ifset($jdec, 'startdatetime', date("Y-m-d H:i:s"));
	$enddatetime =	ifset($jdec, 'enddatetime', '');
	$pricerange =  	ifset($jdec, 'pricerange', '');
	$createdby =  	ifset($jdec, 'createdby', '');
	// $address =  	ifset($jdec, 'address', '');
	$food =  		ifset($jdec, 'food', '0');
	$party =  		ifset($jdec, 'party', '0');
	$culture =  	ifset($jdec, 'culture', '0');
	
	$sql = "
INSERT INTO events (title, description, image, startdatetime, enddatetime, pricerange, createdby, food, party, culture)
       VALUES ('$title', '$description', '$image', '$startdatetime', '$enddatetime', '$pricerange', $createdby, $food, $party, $culture)
	   ";
	   
	$result = mysql_query($sql) or die(mysql_error());

	// If insert succeeded, $result will hold the user id
	if($result){
	   
		// grab row
		// $row=mysql_fetch_array($result);
		
		// echo result
		// echo '{"result":'. $row[0] . '}';
		echo '{"result":"true"}';
		
	} else {
		// else return -1
		echo '{"result":"false"}';
	}
}


?>

