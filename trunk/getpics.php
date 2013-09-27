<?php

ini_set("display_errors", "on");
error_reporting(E_ALL);
require './Elastica/vendor/autoload.php';

function __autoload_elastica ($class) 
{
    $path = str_replace('\\', '/', substr($class, 1));

    if (file_exists('/home/adprice1/public_html/TweetMine/' . $path . '.php')) 
    {
        require_once('/home/adprice1/public_html/TweetMine/' . $path . '.php');
    }
}


//Or using anonymous function PHP 5.3.0>=
spl_autoload_register(function($class)
{

   if (file_exists('/home/adprice1/public_html/TweetMine/' . $class . '.php')) 
   {
        require_once('/home/adprice1/public_html/TweetMine/' . $class . '.php');
   }

});

spl_autoload_register('__autoload_elastica');

//$data = $_POST["dataset"];
$start = $_POST["start"];
$end = $_POST["end"];

header('Content-Type: application/json');

$elasticaClient = new \Elastica\Client(array('host' => 'localhost', 'port' => 9200));

$elasticaQueryString = new Elastica\Query\QueryString();
$elasticaQueryRange = new Elastica\Query\Range();
$elasticaQueryRange->addField("instagram.location.longitude", array("from" => -87, "to" => -85));
$elasticaQueryRange->addField("instagram.location.latitude", array("from" => 39, "to" => 41));

$elasticaIndex = $elasticaClient->getIndex("sandyinstagram");//'sandytweets');

// Create the actual search object with some data.
$elasticaQuery = new Elastica\Query();

$elasticaQuery->setFrom($start);    // Where to start?
$elasticaQuery->setLimit($end);   // How many?
$elasticaQuery->setQuery($elasticaQueryRange);

//Search on the index.
$elasticaResultSet = $elasticaIndex->search($elasticaQuery);

$elasticaResults  = $elasticaResultSet->getResults();
$totalResults = $elasticaResultSet->getTotalHits();

$res = array();

foreach ($elasticaResults as $elasticaResult) 
{
    array_push($res, $elasticaResult->getData());
}

echo json_encode($res);

?>
