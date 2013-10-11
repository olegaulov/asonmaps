<?php
$id = $_GET["id"];
$type = $_GET["type"];
$str = ""
if($type == "image")
{
	str .= "<img src=\"http://bluegrit.cs.umbc.edu/~oleg2/instagrams/hurricanesandy/$id.jpg\" />";
}
				
				
/*
str .= "<input id=\"poweroutage\" type=\"checkbox\"/>Power Outage";
str .= "<input id=\"flooding\" type=\"text\" />";
str .= "<input id=\"crime\" type=\"checkbox\"/>Crime";
str .= "<input id=\"foodshortage\" type=\"checkbox\"/>Food Shortage";
*/

return $str;
?>

