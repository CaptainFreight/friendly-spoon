<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="css/style.css">
  <script src="js/script.js"></script>

<link href="https://fonts.googleapis.com/css2?family=Hepta+Slab:wght@400;500&family=Roboto+Slab:wght@200;300;400;500&family=Spartan:wght@500;600;700&display=swap" rel="stylesheet"> 
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""/>

  <!-- Make sure you put this AFTER Leaflet's CSS -->
  <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
    integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
    crossorigin=""></script>

  <title>Weather Watcher</title>
</head>
<body>
  <div id="sidebar">
    <div id="titleDiv">
      <h1>New Zealand Tourist Information</h1>
    </div>
    <div id="searchDiv">
      <form onsubmit="getGeoCode(false);return false">
        <input id="search" type="search" autocomplete="off">
        <input id="go" type="submit" value="go">
      </form>
    </div>
    <div id="recentDiv">

    </div>
  </div>

  <div id="page">
    <div id="mapid">

    </div>
    <div id="nameDiv">
      <h1 id="H1loc"></h1>
    </div>
    <div id="sunDiv">

    </div>
    <div id="weatherDiv">

    </div>
  </div>
</body>
<script type="text/javascript">
  getGeoCode(true);
  var container = document.getElementById('recentDiv');
  var recent = new recentSearch(container);
</script>
</html>
