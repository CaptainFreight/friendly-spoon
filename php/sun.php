<?php

  $req_str = file_get_contents('php://input');
  $req = json_decode($req_str);

  $url = 'https://api.sunrise-sunset.org/json?lat='.$req->lat.'&lng='.$req->lng.'&date=today';
  $connection = curl_init($url);
  curl_setopt($connection, CURLOPT_RETURNTRANSFER, true);
  $response = curl_exec($connection);
  curl_close($connection);

  $response = json_encode($response);
  echo $response;
?>
