<?php

ini_set('display_errors', 'On');
//$ch = curl_init("http://intel03:9200/sandytweets/_search");

ini_set("display_errors", "on");
error_reporting(E_ALL);
require './Elastica/vendor/autoload.php';
date_default_timezone_set("UTC");

function addmarkup($index, $document, $docid, $data)
{
	#$url = "http://intel03:9200/" . $index . "/" . $document . "/" . $docid . "/_update";
	$url = "http://ibn134:9200/" . $index . "/" . $document . "/" . $docid . "/_update";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_VERBOSE, 1);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, TRUE);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	
	$http_result = curl_exec($ch);
	$error = curl_error($ch);
	$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

	curl_close($ch);

	if ($error)
	{
		print "error:$error<br />";
	}

	return $error. " " . $url . " " . $http_result . " " . $http_code;
}

/*$mymarkup = array();
$mymarkup["script"] = "ctx._source.markup = {\"poweroutageon\": " . $_POST["markup"]["poweroutageon"] .
",\"poweroutageoff\":" . $_POST["markup"]["poweroutageoff"] .
", \"flooding\":" . $_POST["markup"]["poweroutageoff"] .
", \"feet\":" . $_POST["markup"]["feet"] .
", \"crime\":" . $_POST["markup"]["crime"] .
", \"foodshortage\":" . $_POST["markup"]["foodshortage"];*/

try
{
	$mymarkup = "{\"script\":\"ctx._source.markup = {\\\"poweroutageon\\\": " . $_POST["markup"]["poweroutageon"] . 
	",\\\"poweroutageoff\\\":" . $_POST["markup"]["poweroutageoff"] . 
	",\\\"poweroutageunk\\\":" . $_POST["markup"]["poweroutageunk"] . 
	", \\\"flooding\\\":" . $_POST["markup"]["flooding"] . 
	", \\\"feet\\\":" . $_POST["markup"]["feet"] . 
	", \\\"crimetrue\\\":" . $_POST["markup"]["crimetrue"] . 
	", \\\"crimefalse\\\":" . $_POST["markup"]["crimefalse"] . 
	", \\\"crimenull\\\":" . $_POST["markup"]["crimenull"] . 
	", \\\"foodtrue\\\":" . $_POST["markup"]["foodtrue"] . 
	", \\\"foodfalse\\\":" . $_POST["markup"]["foodfalse"] . 
	", \\\"foodshortage\\\":" . $_POST["markup"]["foodshortage"] . 
	"};\"}";
	
	
	echo addmarkup($_POST["index"], $_POST["item"], $_POST["record"], $mymarkup);
}
catch (Exception $e) 
{
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

//echo "<script> console.Log(\" ERROR!!!!\");</script>"

?>
