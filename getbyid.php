<?php
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

$id = $_GET["id"];
$type = $_GET["type"];
$st = "";
$db = $_GET["db"];
$tbl = "";

ini_set("error_log", "/home/adprice1/public_html/error.log");
ini_set("log_errors", "on");

$elasticaClient = new \Elastica\Client( array(
	'host' => 'ibn134',#'intel03',
	'port' => 9200
));

$elasticaQueryMatch = new Elastica\Query\Match();
$elasticaFuzzy = new Elastica\Filter\Term();
//$elasticaFilterRange = new Elastica\Filter\Range();
//$elasticaFilterAnd = new Elastica\Filter\BoolAnd();

// Create the actual search object with some data.
$elasticaQuery = new Elastica\Query();

if ($type == "image")
{
	$st .= "<img width=\"80%\" src=\"http://bluegrit.cs.umbc.edu/~oleg/instagrams/hurricanesandy/$id.jpg\" /><br />";
	$tbl = "instagram";
	//$db = "instagramsandy";
	$elasticaQueryMatch -> setField("instagram.id", $id);
}
else
{
	$st .= "<img width=\"80%\" src=\"/asonmaps/tweetpin.png\" /><br />";
	$tbl = "tweet";
	//$db = "twittersandy";
	$elasticaQueryMatch -> setField("tweet.id", $id);
}

//$elasticaFilterAnd -> addFilter($elasticaFilterRange);
//$elasticaQuery -> setFilter($elasticaFuzzy);
$elasticaQuery -> setQuery($elasticaQueryMatch);

$elasticaIndex = $elasticaClient -> getIndex($db);
$elasticaResultSet = $elasticaIndex -> search($elasticaQuery);

$elasticaResults = $elasticaResultSet -> getResults();
$totalResults = $elasticaResultSet -> getTotalHits();

$res = array();

foreach ($elasticaResults as $elasticaResult)
{
	array_push($res, $elasticaResult -> getData());
}

if (isset($res[0]["markup"]))
{
	$st .= "<input id=\"poweroutage\" type=\"checkbox\" onclick=\"showdiv('powerctl')\" " . (isset($res[0]["markup"]["poweroutageunk"]) ? "checked=\"checked\"" : "") . "/>Power Outage";
	$st .= "<div id=\"powerctl\" " . (isset($res[0]["markup"]["poweroutageunk"]) ? "" : "style=\"display:none\"") . " >";
	$st .= "<input id=\"poweroutageon\" name=\"ponoff\" type=\"radio\" " . (isset($res[0]["markup"]["poweroutageon"]) ? "checked=\"checked\"" : "") . " />Power On";
	$st .= "<input id=\"poweroutageoff\" name=\"ponoff\" type=\"radio\" " . (isset($res[0]["markup"]["poweroutageoff"]) ? "checked=\"checked\"" : "") . "\" />Power Off</div><br />";
	
	$st .= "<input id=\"flooding\" type=\"checkbox\" onclick=\"showdiv('feet')\"" . (isset($res[0]["markup"]["flooding"]) && isset($res[0]["markup"]["feet"]) && 0 != strcmp($res[0]["markup"]["feet"], "") ? "checked=\"checked\"" : "") . "/>Flooding ";
	$st .= "<input type=\"text\" id=\"feet\" style=\"display:" . (isset($res[0]["markup"]["flooding"]) && isset($res[0]["markup"]["feet"]) && 0 != strcmp($res[0]["markup"]["feet"], "") ? "auto" : "none") . "\" value=\"" . (isset($res[0]["markup"]["feet"]) ? $res[0]["markup"]["feet"] : "") . "\" /><br />";

	$st .= "<input id=\"crime\" type=\"checkbox\" onclick=\"showdiv('crimectl')\"" . (isset($res[0]["markup"]["crime"]) && $res[0]["markup"]["crime"] ? "checked=\"checked\"" : "") . "/>Crime<br />";
	$st .= "<div id=\"crimectl\" style=\"" . (isset($res[0]["markup"]["crime"]) ? "" : "display:none") . "\">";

	if (isset($res[0]["markup"]["crime"]))
	{
		$st .= "<input id=\"crimetrue\" name=\"conoff\" type=\"radio\"" . ($res[0]["markup"]["crime"] ? "checked=\"checked\"" : "") . " />True";
		$st .= "<input id=\"crimefalse\" name=\"conoff\" type=\"radio\"" . (!$res[0]["markup"]["crime"] ? "checked=\"checked\"" : "") . " />False";
	}
	else
	{
		$st .= "<input id=\"crimetrue\" name=\"conoff\" type=\"radio\" />True";
		$st .= "<input id=\"crimefalse\" name=\"conoff\" type=\"radio\" />False";
	}

	$st .= "</div><br />";

	$st .= "<input id=\"foodshortage\" type=\"checkbox\" onclick=\"showdiv('foodctl')\"" . (isset($res[0]["markup"]["foodshortage"]) && $res[0]["markup"]["foodshortage"] ? "checked=\"checked\"" : "") . "/>Food Shortage<br />";
	$st .= "<div id=\"foodctl\" style=\"" . (isset($res[0]["markup"]["foodshortage"]) ? "" : "display:none") . "\">";
	
	if (isset($res[0]["markup"]["foodshortage"]))
	{
		$st .= "<input id=\"foodtrue\" name=\"fonoff\" type=\"radio\"" . ($res[0]["markup"]["foodshortage"] ? "checked=\"checked\"" : "") . "\" />True";
		$st .= "<input id=\"foodfalse\" name=\"fonoff\" type=\"radio\"" . (!$res[0]["markup"]["foodshortage"] ? "checked=\"checked\"" : "") . "\" />False";
	}
	else
	{
		$st .= "<input id=\"foodtrue\" name=\"fonoff\" type=\"radio\" />True";
		$st .= "<input id=\"foodfalse\" name=\"fonoff\" type=\"radio\" />False";
	}
	$st .= "</div><br />";
}
else
{
	$st .= "<input id=\"poweroutage\" type=\"checkbox\" onclick=\"showdiv('powerctl')\"/>Power Outage";
	$st .= "<div id=\"powerctl\" style=\"display:none\">";
	$st .= "<input id=\"poweroutageon\" name=\"ponoff\" type=\"radio\" />Power On";
	$st .= "<input id=\"poweroutageoff\" name=\"ponoff\" type=\"radio\" />Power Off</div><br />";

	$st .= "<input id=\"flooding\" type=\"checkbox\" onclick=\"showdiv('feet')\"/>Flooding ";
	$st .= "<input type=\"text\" id=\"feet\" style=\"display:none\" /><br />";

	$st .= "<input id=\"crime\" type=\"checkbox\" onclick=\"showdiv('crimectl')\"/>Crime<br />";

	$st .= "<div id=\"crimectl\" style=\"display:none\">";

	$st .= "<input id=\"crimetrue\" name=\"conoff\" type=\"radio\" />True";
	$st .= "<input id=\"crimefalse\" name=\"conoff\" type=\"radio\" />False";

	$st .= "</div><br />";
	$st .= "<input id=\"foodshortage\" type=\"checkbox\" onclick=\"showdiv('foodctl')\"/>Food Shortage<br />";

	$st .= "<div id=\"foodctl\" style=\"display:none\">";
	$st .= "<input id=\"foodtrue\" name=\"fonoff\" type=\"radio\" />True";
	$st .= "<input id=\"foodfalse\" name=\"fonoff\" type=\"radio\" />False";

	$st .= "</div><br />";
}

/*
 $st .= "<input id=\"poweroutageon\" name=\"ponoff\" type=\"radio\" " . (isset($res[0]["markup"]) && $res[0]["markup"]["poweroutageon"] ? "checked=\"checked\"" : "") . " />Power On";
 $st .= "<input id=\"poweroutageoff\" name=\"ponoff\" type=\"radio\" " . (isset($res[0]["markup"]) && $res[0]["markup"]["poweroutageoff"] ? "checked=\"checked\"" : "") . "\" />Power Off</div><br />";

 $st .= "<input id=\"flooding\" type=\"checkbox\" onclick=\"showdiv('feet')\"" . (isset($res[0]["markup"]) && $res[0]["markup"]["flooding"] ? "checked=\"checked\"" : "") . "/>Flooding ";
 $st .= "<input type=\"text\" id=\"feet\" style=\"display:none\" value=\"" . (isset($res[0]["markup"]) ? $res[0]["markup"]["feet"]:"") . "\" /><br />";
 $st .= "<input id=\"crime\" type=\"checkbox\" onclick=\"showdiv('crimectl')\"" . (isset($res[0]["markup"]) && isset($res[0]["markup"]["crime"]) ? "checked=\"checked\"" : "") . "/>Crime<br />";

 $st .= "<div id=\"crimectl\" style=\"" . (isset($res[0]["markup"]) && $res[0]["markup"]["flooding"] ? "" : "display:none") . "\">";
 $st .= "<input id=\"crimetrue\" name=\"conoff\" type=\"radio\"" . (isset($res[0]["markup"]) && $res[0]["markup"]["crime"] ? "checked=\"checked\"" : "") . " />True";
 $st .= "<input id=\"crimefalse\" name=\"conoff\" type=\"radio\"" . (isset($res[0]["markup"]) && !$res[0]["markup"]["crime"] ? "checked=\"checked\"" : "") . " />False</div><br />";

 $st .= "<input id=\"foodshortage\" type=\"checkbox\" onclick=\"showdiv('foodctl')\"" . (isset($res[0]["markup"]) && $res[0]["markup"]["foodshortage"] ? "checked=\"checked\"" : "") . "/>Food Shortage<br />";

 $st .= "<div id=\"foodctl\" style=\"" . (isset($res[0]["markup"]) && $res[0]["markup"]["foodshortage"] ? "" : "display:none") . "\">";
 $st .= "<input id=\"foodtrue\" name=\"fonoff\" type=\"radio\"" . (isset($res[0]["markup"]) && $res[0]["markup"]["foodshortage"] ? "checked=\"checked\"" : "") . "\" />True";
 $st .= "<input id=\"foodfalse\" name=\"fonoff\" type=\"radio\"" . (isset($res[0]["markup"]) && !$res[0]["markup"]["foodshortage"] ? "checked=\"checked\"" : "") . "\" />False</div><br />";
 */

$st .= "<button onclick=\"senddata('$db', '$tbl', '$id')\">Save Data</button>";

$st .= "<script type=\"text/javascript\">$('#feet').spinner({max:20, min:-1})</script>";

echo $st;
?>

