<?php
$id = $_GET["id"];
$type = $_GET["type"];
$st = "";

ini_set("error_log", "/home/adprice1/public_html/error.log");
ini_set("log_errors", "on");

if($type == "image")
{
	$st .= "<img src=\"http://bluegrit.cs.umbc.edu/~oleg2/instagrams/hurricanesandy/$id.jpg\" /><br />";
}		

$st .= "<input id=\"poweroutage\" type=\"checkbox\" onclick=\"showdiv('powerctl')\"/>Power Outage";
$st .= "<div id=\"powerctl\" style=\"display:none\">";
$st .= "<input id=\"poweroutageon\" name=\"onoff\" type=\"radio\" />Power On";
$st .= "<input id=\"poweroutageoff\" name=\"onoff\" type=\"radio\" />Power Off</div><br />";
$st .= "<input id=\"flooding\" type=\"checkbox\" onclick=\"showdiv('feet')\" />Flooding <input type=\"text\" id=\"feet\" style=\"display:none\" /><br />";
$st .= "<input id=\"crime\" type=\"checkbox\"/>Crime<br />";
$st .= "<input id=\"foodshortage\" type=\"checkbox\"/>Food Shortage<br />";
$st .= "<button onclick=\"senddata('$id')\">Save Data</button>";

$st .= "<script type=\"text/javascript\">$('#feet').spinner({max:20, min:1})</script>";

echo $st;
?>

