/*object literal of sum vars that functions need*/
var _app = {
  default:'hamilton',
  Geokey:'WTxMNkBbA5TRDWcgBTYJdToHxAmhqq3J',
  map: '',
  reg: /^[0-9a-zA-Z\s]+$/,
  pm: /PM/,
  am: /AM/
 };

/*----------------------------------------JS ASYNC REQUESTS-------------------------------------*/


/*
  getGeoCode will
  isIntial = false:
          fetch for lattitude and longitude for searched town
  isIntial = true:
          fetches for default apps latt and long
*/
function getGeoCode(isIntial){

  var srch = document.getElementById('search');
  var location = _app.default;
  var process = processIntialGC;

  if(isIntial==false){
    if(_app.reg.test(srch.value)==true){
      location = srch.value;
      process = processGeoCode;
      srch.value = "";
    }
    else{
      return;
    }
  }
  var url = "https://www.mapquestapi.com/geocoding/v1/address?key="+_app.Geokey+"&location="+location+",NZ";
  fetch(url,{method:'GET'}).then(response => response.json()).then(process,handleGCError);
}


/*
  getWeather

  update map
  update
  calls for sunset and sunrise data using the given coordinates
  calls for weather from openweatherapi using given coordinates
*/
function getWeather(location,lat,lng){
  //get weather from oopen weather api
  if(_app.map==''){
    return;//if map isnt intialized return
  }
  document.getElementById('H1loc').innerHTML= location;
  _app.map.panTo([lat,lng]);
  //make ajax request
  var request = new XMLHttpRequest();
  var data = "latt="+lat+"&long="+lng;
  request.open("POST","php/weather.php",true);
  request.setRequestHeader('content-Type','application/x-www-form-urlencoded');
  request.onreadystatechange = function(){
    if(request.readyState == 4){
      if(request.status == 200){
        var response = request.responseXML;
        processOpeanWeather(response);
      }
    }
  }
  request.send(data);
  //make fetch request
  fetch("php/sun.php",{method:'POST', body: JSON.stringify({lat:lat, lng:lng})}).then(response => response.json()).then(processSunsetSunrise);
}



/*----------------------------------------JS CALLBACKS FUNCTIONS-----------------------------------*/


/*-------------processing of resopnes from GEOCODING------------*/

/*  is callback that is called when getting the intial coordinates
    will intialize map aswell */
function processIntialGC(response){
  var coor = response.results[0].locations[0].displayLatLng;
  _app.map = L.map('mapid').setView([coor.lat,coor.lng],10);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoic2hhYW5uYWdyYSIsImEiOiJja2IxbmdrbjQwMm96MnhsMGh1MHJ1Z3hyIn0.QHXOou-etd4WcPqJKP0nNw'
  }).addTo(_app.map);
  getWeather(_app.default,coor.lat,coor.lng);
  console.log(coor.lat);
}

/*    process GeoCoding response, call getWeather and add to recents  */
function processGeoCode(response){
  var coor = response.results[0].locations[0].displayLatLng;
  var location = response.results[0].providedLocation.location.split(",")[0];
  console.log(location);
  getWeather(location,coor.lat,coor.lng);
  recent.add(location,coor.lat,coor.lng);
}

/*  called when GeoCode api is not fullfilled */
function handleGCError(response){console.log("error with geocode:"+response);}


/*-------------processing of resopnes of get weather------------*/

/*  handles the OpenWeater Api response */
function processOpeanWeather(response){
  var xmlDoc = response;
  var div = document.getElementById("weatherDiv");
  div.innerHTML = "<h4>temperature</h4>";

  var temp = xmlDoc.getElementsByTagName("temperature")[0];
  var feels = xmlDoc.getElementsByTagName("feels_like")[0];

  var currentDiv = document.createElement("div");
  currentDiv.setAttribute("id","currentDiv");
  currentDiv.innerHTML =  "<span id='currentTemp'>"+temp.getAttribute("value")+"&#8451</span><br>"
                          +"<span id='feels'> feels like "+feels.getAttribute("value")+"&#8451</span>";

  var maxminDiv = document.createElement("div");
  maxminDiv.setAttribute("id","maxminDiv");
  maxminDiv.innerHTML = "<span>max : "+temp.getAttribute("max")+"&#8451</span><br>"
                        +"<span>min : "+temp.getAttribute("min")+"&#8451</span>";

  var humidity = xmlDoc.getElementsByTagName("humidity")[0];
  var pressure = xmlDoc.getElementsByTagName("pressure")[0];
  var wind = xmlDoc.getElementsByTagName("speed")[0];
  var table = document.createElement('table');
  table.innerHTML = "<tr><td>humidty</td><td>"+humidity.getAttribute("value")+humidity.getAttribute("unit")+"</td></tr>"
                    +"<tr><td>pressure</td><td>"+pressure.getAttribute("value")+" "+pressure.getAttribute("unit")+"</td></tr>"
                    +"<tr><td>wind</td><td>"+wind.getAttribute("name")+"  "+wind.getAttribute("value")+" "+wind.getAttribute("unit")+"</td></tr>";
  div.appendChild(currentDiv);
  div.appendChild(maxminDiv);
  div.appendChild(table);
}
/*

*/
function processSunsetSunrise(response){
  var res = JSON.parse(response);
  var sr = "<td>sunrise</td><td>"+flip(res.results.sunrise)+"</td>";
  var ss = "<td>sunset</td><td>"+flip(res.results.sunset)+"</td>";

  var container = document.getElementById('sunDiv');
  container.innerHTML = '<table><tr><th><h4>Today\'s sunset/sunrise times</h4></th></tr><tr>'+ss+'</tr><tr>'+sr+'</tr></table>';

  //flip to match nz timezones roughly
  function flip(str){
    if(_app.pm.test(str)==true){
      str = str.replace(_app.pm,"AM");
    }else {
      str = str.replace(_app.am,"PM");
    }
    return str;
  }
}


/*----------------------------------------JS RECENTS FUNCTIONS-----------------------------------*/
/*
  onClick functions given to each list item
*/
function getRecent(name){
  var n = name.innerHTML;
  recent.move(n);
  recent.getWeatherOf(n);
  recent.print();
}

/*
  Recent Search function holds the List that contains recent Searches
  the recent search
  holds:    * name    * lattitude   * longitude
  methods:  * add     * move        * get weather of    * print
*/
function recentSearch(container){

  var _recents = [];
  var _container = container;

  var _list = document.createElement("ul");
  var _hdr = document.createElement("h3");
  _hdr.innerHTML="recents:"
  _container.appendChild(_hdr);
  _container.appendChild(_list);

  // add new object
  this.add = function(name,latt,long){
    for(let i = 0; i < _recents.length; i++){
      if(_recents[i].isLocation(name)==true){
        this.move(name);
        return; //if already in recents just move to top of array
      }
    }
    _recents.push(new location(name,latt,long));
    update();
  }

  //move object to top from array if found
  this.move = function(name){
    for(let i = 0; i < _recents.length; i++){
      if(_recents[i].isLocation(name)==true){
        var selected = _recents[i]
        _recents.splice(i,1);
        _recents.push(selected);
      }
    }
    update();
  }

  //get weather of object with name = name
  this.getWeatherOf = function(name){
    for(let i = 0; i < _recents.length; i++){
      if(_recents[i].isLocation(name)==true){
        getWeather(_recents[i].getName(),_recents[i].getLat(),_recents[i].getLng());
      }
    }
  }

  //updates html with the new order of array
  var update = function(){
    _list.innerHTML = '';
    for(let i = _recents.length-1; i >= 0; i--){
      _list.appendChild(_recents[i].getElement());
      console.log(_recents[i].getName());
    }
  }

  //print to log the name lattitude longitude
  this.print = function(){
    for(let i = 0; i < _recents.length; i++){
      console.log(_recents[i].getName(),_recents[i].getLat(),_recents[i].getLng());
    }
  }

  //locations object
  var location = function(name, latt,long){

    var _name = name;
    var _latt = latt;
    var _long = long;

    var _element = document.createElement("li");
    _element.setAttribute("onClick","getRecent(this)");
    _element.setAttribute("value",_name);
    _element.innerHTML = name;

    //get element
    this.getElement = function(){ return _element; }
    //get name that was searched
    this.getName = function(){ return _name; }
    //get lattitude
    this.getLat = function(){ return _latt; }
    //get longitude
    this.getLng = function(){ return _long; }
    //isLocation return true if matches
    this.isLocation = function(name){
      var res = _name.localeCompare(name)
      if(res==0){ return true; }
      return false;
    }

  }
}
