<?php

ini_set('display_errors', 'On');
//$ch = curl_init("http://intel03:9200/sandytweets/_search");

ini_set("display_errors", "on");
error_reporting(E_ALL);
require './Elastica/vendor/autoload.php';
date_default_timezone_set("UTC");

function addmarkup($index, $document, $docid, $data)
{
	$url = "http://intel03:9200/" . $index . "/" . $document . "/" . $docid . "/_update";

	//print "URL: $url<br />";
	/** use a max of 256KB of RAM before going to disk */
	/*$fp = fopen('php://temp/maxmemory:25000', 'w');
	if (!$fp)
	{
		die('could not open temp memory data');
	}

	fwrite($fp, $data);
	fseek($fp, 0);*/

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_VERBOSE, 1);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, 1);
	//curl_setopt($ch, CURLOPT_PUT, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	//curl_setopt($ch, CURLOPT_INFILE, $fp);
	//curl_setopt($ch, CURLOPT_INFILESIZE, strlen($data));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	
	print "$data<br />";

	print "execute<br />";
	/*$http_result = curl_exec($ch);
	$error = curl_error($ch);
	$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);*/

	curl_close($ch);
	//fclose($fp);

	print "result:$http_result<br />";
	print "code:$http_code<br />";
	print "result:$http_result<br />";
	if ($error)
	{
		print "error:$error<br />";
	}

	return $error;
}

//$mymarkup = "{\"script\":\"ctx._source.markup12 = {\\\"party\\\":false,\\\"flood\\\":74};\"}";

/*$mymarkup = array();
$mymarkup["script"] = "ctx._source.markup12 = {\"poweroutageon\": " . $_POST["markup"]["poweroutageon"] .
",\"poweroutageoff\":" . $_POST["markup"]["poweroutageoff"] .
", \"flooding\":" . $_POST["markup"]["poweroutageoff"] .
", \"feet\":" . $_POST["markup"]["feet"] .
", \"crime\":" . $_POST["markup"]["crime"] .
", \"foodshortage\":" . $_POST["markup"]["foodshortage"];*/
try
{
	$mymarkup = "{\"script\":\"ctx._source.markup12 = {\\\"poweroutageon\\\": " . $_POST["markup"]["poweroutageon"] . 
	",\\\"poweroutageoff\\\":" . $_POST["markup"]["poweroutageoff"] . 
	", \\\"flooding\\\":" . $_POST["markup"]["poweroutageoff"] . 
	", \\\"feet\\\":" . $_POST["markup"]["feet"] . 
	", \\\"crime\\\":" . $_POST["markup"]["crime"] . 
	", \\\"foodshortage\\\":" . $_POST["markup"]["foodshortage"] . "}}";
	
	//print $mymarkup;
	//addmarkup("testingupdatepropagation", "dataitem", "144152148442140424_13290050", $mymarkup);
	//print $mymarkup;
	echo addmarkup($_POST["index"], $_POST["item"], $_POST["record"], json_encode($mymarkup));
}
catch (Exception $e) 
{
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

//echo "<script> console.Log(\" ERROR!!!!\");</script>"

?>
