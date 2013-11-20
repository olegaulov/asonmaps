<?php
$id = $_GET["id"];
$type = $_GET["type"];
$st = "";
$db = "";
$tbl = "";

ini_set("error_log", "/home/adprice1/public_html/error.log");
ini_set("log_errors", "on");

if($type == "image")
{
	$st .= "<img width=\"80%\" src=\"http://bluegrit.cs.umbc.edu/~oleg2/instagrams/hurricanesandy/$id.jpg\" /><br />";
	$tbl = "instagram";
	$db = "instagramsandy";
}	
else 
{
	$st .= "<img width=\"80%\" src=\"/asonmaps/tweetpin.png\" /><br />";
	$tbl = "tweet";
	$db = "twittersandy";
}	

$st .= "<input id=\"poweroutage\" type=\"checkbox\" onclick=\"showdiv('powerctl')\"/>Power Outage";
$st .= "<div id=\"powerctl\" style=\"display:none\">";
$st .= "<input id=\"poweroutagenull\" name=\"ponoff\" type=\"radio\" />Unknown";
$st .= "<input id=\"poweroutageon\" name=\"ponoff\" type=\"radio\" />Power On";
$st .= "<input id=\"poweroutageoff\" name=\"ponoff\" type=\"radio\" />Power Off</div><br />";
//use spinner
$st .= "<input id=\"flooding\" type=\"checkbox\" onclick=\"showdiv('feet')\" />Flooding <input type=\"text\" id=\"feet\" style=\"display:none\" /><br />";
$st .= "<input id=\"crime\" type=\"checkbox\" onclick=\"showdiv('crimectl')\"/>Crime<br />";
$st .= "<div id=\"crimectl\" style=\"display:none\">";
$st .= "<input id=\"crimenull\" name=\"conoff\" type=\"radio\" />Unknown";
$st .= "<input id=\"crimetrue\" name=\"conoff\" type=\"radio\" />True";
$st .= "<input id=\"crimefalse\" name=\"conoff\" type=\"radio\" />False</div><br />";
$st .= "<input id=\"foodshortage\" type=\"checkbox\" onclick=\"showdiv('foodctl')\"/>Food Shortage<br />";
$st .= "<div id=\"foodctl\" style=\"display:none\">";
$st .= "<input id=\"foodnull\" name=\"fonoff\" type=\"radio\" />Unknown";
$st .= "<input id=\"foodtrue\" name=\"fonoff\" type=\"radio\" />True";
$st .= "<input id=\"foodfalse\" name=\"fonoff\" type=\"radio\" />False</div><br />";
$st .= "<button onclick=\"senddata('$db', '$tbl', '$id')\">Save Data</button>";

$st .= "<script type=\"text/javascript\">$('#feet').spinner({max:20, min:-1})</script>";

echo $st;
?>

