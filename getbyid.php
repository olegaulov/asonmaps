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

$st .= "<input id=\"poweroutage\" type=\"checkbox\"/>Power Outage";
$st .= "<br /><input id=\"flooding\" type=\"text\" />";
$st .= "<br /><input id=\"crime\" type=\"checkbox\"/>Crime<br />";
$st .= "<input id=\"foodshortage\" type=\"checkbox\"/>Food Shortage";

echo $st;
?>

