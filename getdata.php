<?php
//$ch = curl_init("http://intel03:9200/sandytweets/_search");

ini_set("display_errors", "on");
error_reporting(E_ALL);
require './Elastica/vendor/autoload.php';
date_default_timezone_set("UTC");

function __autoload_elastica($class)
{
	$path = str_replace('\\', '/', substr($class, 1));

	if (file_exists('/home/oleg2/public_html/TweetMine/' . $path . '.php'))
	{
		require_once ('/home/oleg2/public_html/TweetMine/' . $path . '.php');
	}
}

function getsandypoints($start, $end, $txt, $sdate, $edate)
{
	$elasticaClient = new \Elastica\Client( array(
		'host' => 'intel03',
		'port' => 9200
	));

	$elasticaQueryRange = new Elastica\Query\Range();
	$elasticaFuzzy = new Elastica\Filter\Term();
	$elasticaFilterRange = new Elastica\Filter\NumericRange();
	$elasticaFilterAnd = new Elastica\Filter\BoolAnd();

	// Create the actual search object with some data.
	$elasticaQuery = new Elastica\Query();

	$elasticaFilterRange -> addField("instagram.location.longitude", array(
		"from" => -76,
		"to" => -68
	));
	$elasticaFilterRange -> addField("instagram.location.latitude", array(
		"from" => 36,
		"to" => 44
	));

	$elasticaQueryRange -> addField("instagram.created_time", array(
		"from" => date("U", (int)$sdate),
		"to" => date("U", (int)$edate)
	));

	if ($txt != "")
	{
		$elasticaFuzzy -> setTerm("instagram.caption.text", $txt);
		$elasticaFilterAnd -> addFilter($elasticaFuzzy);
	}

	$elasticaFilterAnd -> addFilter($elasticaFilterRange);
	$elasticaQuery -> setFilter($elasticaFilterAnd);
	$elasticaQuery -> setQuery($elasticaQueryRange);
	$elasticaQuery -> addSort("instagram.created_time");
	$elasticaQuery -> setFields(array(
		"created_time",
		"caption",
		"location",
		"id",
		"poweroutageon",
		"poweroutageoff",
		"foodshortage",
		"crime",
		"flood",
		"feet"
	));

	$elasticaIndex = $elasticaClient -> getIndex("instagramsandy");

	$elasticaQuery -> setFrom($start);
	// Where to start?
	$elasticaQuery -> setLimit($end);
	// How many?

	//Search on the index.
	$elasticaResultSet = $elasticaIndex -> search($elasticaQuery);

	$elasticaResults = $elasticaResultSet -> getResults();
	$totalResults = $elasticaResultSet -> getTotalHits();

	$res = array();

	foreach ($elasticaResults as $elasticaResult)
	{
		array_push($res, $elasticaResult -> getData());
	}

	//array_push($res, $elasticaQuery -> getQuery());

	return $res;
}

function gettweetpoints($start, $end, $txt, $sdate, $edate)
{
	$elasticaClient = new \Elastica\Client( array(
		'host' => 'intel03',
		'port' => 9200
	));

	$elasticaQueryRange = new Elastica\Query\Range();
	$elasticaFuzzy = new Elastica\Filter\Term();
	$elasticaFilterRange = new Elastica\Filter\Range();
	$elasticaFilterAnd = new Elastica\Filter\BoolAnd();

	// Create the actual search object with some data.
	$elasticaQuery = new Elastica\Query();

	$elasticaFilterRange -> addField("tweet.coordinates.coordinates", array(
		"from" => -76,
		"to" => -68
	));
	$elasticaFilterRange -> addField("tweet.coordinates.coordinates", array(
		"from" => 36,
		"to" => 44
	));

	$elasticaQueryRange -> addField("tweet.created_at", array(
		"from" => date("Y-m-d G:i:s", (int)$sdate),
		"to" => date("Y-m-d G:i:s", (int)$edate)
	));

	if ($txt != "")
	{
		$elasticaFuzzy -> setTerm("tweet.text", $txt);
		$elasticaFilterAnd -> addFilter($elasticaFuzzy);
	}

	$elasticaFilterAnd -> addFilter($elasticaFilterRange);
	$elasticaQuery -> setFilter($elasticaFilterAnd);
	$elasticaQuery -> setQuery($elasticaQueryRange);
	$elasticaQuery -> addSort("tweet.created_at");

	$elasticaQuery -> setFields(array(
		"id_str",
		"created_at",
		"text",
		"geo",
		"poweroutageon",
		"poweroutageoff",
		"foodshortage",
		"crime",
		"flood",
		"feet"
	));

	$elasticaIndex = $elasticaClient -> getIndex("twittersandy");

	$elasticaQuery -> setFrom($start);
	// Where to start?
	$elasticaQuery -> setLimit($end);
	// How many?

	//Search on the index.
	$elasticaResultSet = $elasticaIndex -> search($elasticaQuery);

	$elasticaResults = $elasticaResultSet -> getResults();
	$totalResults = $elasticaResultSet -> getTotalHits();

	$res = array();

	foreach ($elasticaResults as $elasticaResult)
	{
		array_push($res, $elasticaResult -> getData());
	}

	return $res;
}

//Or using anonymous function PHP 5.3.0>=
spl_autoload_register(function($class)
{

	if (file_exists('/home/oleg/public_html/TweetMine/' . $class . '.php'))
	{
		require_once ('/home/oleg/public_html/TweetMine/' . $class . '.php');
	}

});

$start = (isset($_POST["start"]) ? $_POST["start"] : 0);

$end = (isset($_POST["end"]) ? $_POST["end"] : 2000);

$twittxt = (isset($_POST["twittext"]) ? $_POST["twittext"] : "");
$pictxt = (isset($_POST["pictext"]) ? $_POST["pictext"] : "");
$sdate = $_POST["sdate"];
$edate = $_POST["edate"];

spl_autoload_register('__autoload_elastica');

header('Content-Type: application/json');
$hsh = array();
$hsh["tweets"] = gettweetpoints($start, $end, $twittxt, $sdate, $edate);
$hsh["pics"] = getsandypoints($start, $end, $pictxt, $sdate, $edate);

echo json_encode($hsh);
?>

