<?php
$lat = $_POST['latt'];
$lng = $_POST['long'];

//$url = 'api.openweathermap.org/data/2.5/weather?lat='.$lat.'&lon='.$lng.'&mode=xml&appid=080dc6290a9ed33017aaf0856898d08b&units=metric';
$url = 'http://api.openweathermap.org/data/2.5/weather?lat='.$lat.'&lon='.$lng.'&mode=xml&appid=080dc6290a9ed33017aaf0856898d08b&units=metric';
$connection = curl_init($url);
curl_setopt($connection, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($connection);
curl_close($connection);
header( 'Content-type: text/xml' );
echo $response;
?>
