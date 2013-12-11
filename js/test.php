
<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$foo = file_get_contents("php://input");
$jdec = json_decode($foo, true);
//$jdec bevat de GET request vanuit ajsc.js bv {nr:'10'} => $jdec["nr"]


$db=mysql_connect("localhost", "tvdpbe_wis", "EG8q-8kRx.") or die('Could not connect');
mysql_select_db("tvdpbe_wis", $db) or die('');

$result = mysql_query("SELECT title, description, image, food, party, culture, createdby, username FROM events E INNER JOIN users  U on (E.createdby = U.idusers)") or die('Could not query');

if(mysql_num_rows($result)){
    echo '{"events":[';

    $first = true;

    while($row=mysql_fetch_array($result)){
        //  cast results to specific data types

        if($first) {
            $first = false;
        } else {
            echo ',';
        }
        $data = array(
        'title' => $row['title'],
        'description' => $row['description'],
        'image' => $row['image'],
        'food' => $row['food'],
        'party' => $row['party'],
        'username' => $row['username'],
        'userid' => $row['createdby'],
        'culture' => $row['culture']
    );
        echo json_encode($data);
    }
    echo ']}';
} else {
    echo '[]';
}


?>

