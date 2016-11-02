<?php
$responseJSON = array("table"=>"Error", "highcharts"=>"Error", "news"=>"Error");

    //$arr = array ('a'=>1,'b'=>2,'c'=>3,'d'=>4,'e'=>5);

    //echo json_encode($arr); // {"a":1,"b":2,"c":3,"d":4,"e":5}
	if (isset($_GET["symbol"])&&isset($_GET["table"])) //if more info is clicked display table 2
		{
			//echo"More info clicked!";
			$symbol=$_GET["symbol"];
			$url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=".$symbol;
			$json = file_get_contents($url);
			$jsonObj = json_decode($json);
			//echo $jsonObj->Status;
			if($jsonObj->Status=="SUCCESS"){
/*
		                            header('Content-Type: application/json');
*/

				 //return jsonObj obtained
			    $responseJSON["table"]=$json;

            }
		}
    if (isset($_GET["symbol"])&&isset($_GET["highcharts"])) //if more info is clicked display table 2
		{
			//echo"More info clicked!";
			$symbol=$_GET["symbol"];
        
$url="http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7b%22Normalized%22:false,%22NumberOfDays%22:1095,%22DataPeriod%22:%22Day%22,%22Elements%22:%5b%7b%22Symbol%22:%22".$symbol."%22,%22Type%22:%22price%22,%22Params%22:%5b%22ohlc%22%5d%7d%5d%7d";
		$json = file_get_contents($url);	
        $jsonObj = json_decode($json);
			//echo $jsonObj->Status;
		
				 //return jsonObj obtained

			    $responseJSON["highcharts"]=$json;

            }	
        if (isset($_GET["symbol"])&&isset($_GET["news"])){
            			$symbol=$_GET["symbol"];

    $accountKey = 'ETa1Wcik5ryVOJEpU/AfX6VDMBmYM1YHNFYcpcY+qz0';

    $ServiceRootURL =  'https://api.datamarket.azure.com/Bing/Search/v1/News';

//AAPL is hardcoded obtain from URL symbol
    $WebSearchURL = $ServiceRootURL . '?Query=%27'.$symbol.'%27&$format=json';

//username and password
    $context = stream_context_create(array(
	'http' => array(
		'request_fulluri' => true,
		'header'  => "Authorization: Basic " . base64_encode($accountKey . ":" . $accountKey)
	)
    ));

    $response = file_get_contents($WebSearchURL, 0, $context);
			    $responseJSON["news"]=$response;
                            header('Content-Type: application/json');

            			        echo $_GET['callback']. '(' . json_encode($responseJSON) . ');';

            
        }

    if (isset($_GET["symbol"])&&isset($_GET["autocomplete"])) //if more info is clicked display table 2
    {
        
			//echo"More info clicked!";
			$symbol=$_GET["symbol"];
      $symbol=  trim($symbol);
        if(strlen($symbol)>0){
			$url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$symbol;
			$json = file_get_contents($url);
			$jsonObj = json_decode($json,true);
			//echo $jsonObj->Status
            $result=array();
                    for($x = 0; $x < count($jsonObj); $x++)
                    {
                            $s= $jsonObj[$x]['Symbol'].' - '.$jsonObj[$x]['Name'].' - ('.$jsonObj[$x]['Exchange'].')';
                     array_push($result,$s);       
                    }
            }
				 //return jsonObj obtained
                header('Access-Control-Allow-Origin: *');  
                header('Content-Type: application/json');

            echo json_encode($result);

        	

        
  }
if (isset($_GET["favorites"])&&isset($_GET["fav"])) //if more info is clicked display table 2
    
        {
			//echo"More info clicked!";
			$symbol=$_GET["favorites"];
                        $result=array();

             for($x = 0; $x < count($symbol); $x++)
                    {
                 
                 $url = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=".$symbol[$x];
			     $json = file_get_contents($url);
                 			         $jsonObj = json_decode($json);

                 if($jsonObj->Status=="SUCCESS")
                 {

                     array_push($result,$jsonObj); 
                            
                 }
                                
                                                            }
                            header('Content-Type: application/json');
			        echo $_GET['callback']. '(' . json_encode($result) . ');';


			

        
  }

    
    



?>