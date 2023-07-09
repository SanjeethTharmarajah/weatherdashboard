//declaring global variables
var searchEl = document.getElementById("searchcity");
var historyEl = document.getElementById("historyDiv");
var toppanelEl = document.getElementById("currentcity1");
var bottompanelEl = document.getElementById("5dayforecast");
var historyArr = [];
var location1;
var weatherurl;
var err1;
var currentCity2;
var tmpdate1;
var tmpdate2;
var cnt = 0;
//function to search city
//this funtions adds history button aswell
//this function also stores history in local storage
function searchcity (){
    if(searchEl.value != ""){
        if(historyArr.includes(searchEl.value.toUpperCase()) == false){
            historyArr.push(searchEl.value.toUpperCase());
            const btn = document.createElement("button");
            btn.textContent = searchEl.value.toUpperCase();
            btn.setAttribute("data-values", btn.textContent);
            btn.addEventListener("click", (event)=>{searchhistory(event, btn.dataset.values.toLowerCase());});
            historyEl.appendChild(btn);
        }
        currentCity2 = searchEl.value.toUpperCase();
        getlocation(searchEl.value.toLowerCase());
        sethistory();
    }
    else {
        alert("Please enter a city !");
    }
    
}
//get latitude and longitutde location based on city
function getlocation(city) {
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=8f765bd4a4f0c2fbec6ddbde2401a652';
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        setlocation(data);
    }); 
}
//gets weather based on supplied latitutde and longitude
function setlocation(data){
    if(data.length !== 0){
        err1 = false;
        location1='lat=' + data[0].lat + '&lon=' + data[0].lon;
        weatherurl = 'https://api.openweathermap.org/data/2.5/forecast?' + location1 + '&cnt=100&units=metric' + '&appid=8f765bd4a4f0c2fbec6ddbde2401a652';
        getweather(weatherurl);
    }
    else {
        err1 = true;
        showweather(data);
    }  
        
}
//fetches weather to display
function getweather(url1){
    fetch(url1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        showweather(data);
    }); 
}
//displays weather along with 5 day forecast
function showweather(data) { 
    var htmldata1 = "";
    var forecasthtml = "";
    if(err1 === false){
        var date1 = new Date(data.list[0].dt_txt);
        var day1 = date1.getDate();
        var month1 = date1.getMonth();
        var year1 = date1.getFullYear();
        tmpdate1 = day1 + '/'  + month1 + '/' + year1;
        
        htmldata1+= '<font size="5" color="black"><b>' + currentCity2 + '<b></font> ';
        htmldata1+= '<font size="5" color="black"><b> (' + day1 + '/'  + month1 + '/' + year1 + ') <b></font> '
        htmldata1+='<img src="https://openweathermap.org/img/wn/' + data.list[0].weather[0].icon + '.png">';
        htmldata1+='<br><br><b>Temp: ' + data.list[0].main.temp + ' <sup>0</sup> C</b>';
        htmldata1+='<br><br><b>Wind: ' + data.list[0].wind.speed + ' MPH</b>';
        htmldata1+='<br><br><b>Humidity: ' + data.list[0].main.humidity + ' %</b>';
        toppanelEl.innerHTML = htmldata1;
        bottompanelEl.innerHTML="";
        cnt =1;
        for(var i=1; i<=100; i++){
            forecasthtml = "";
            var date2 = new Date(data.list[i].dt_txt);
            var day2 = date2.getDate();
            var month2 = date2.getMonth();
            var year2 = date2.getFullYear();
            tmpdate2 = day2 + '/'  + month2 + '/' + year2;
            if(tmpdate1 != tmpdate2){
                cnt++;
                tmpdate1 = tmpdate2;
                if(cnt<=6){
                    forecasthtml+= '<div class="forecastcard">';
                    forecasthtml+= '<font size="5"><b> (' + day2 + '/'  + month2 + '/' + year2 + ') <b></font> '
                    forecasthtml+='<img src="https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '.png">';
                    forecasthtml+='<br><br><b>Temp: ' +data.list[i].main.temp + ' <sup>0</sup> C</b>';
                    forecasthtml+='<br><br><b>Wind: ' + data.list[i].wind.speed + ' MPH</b>';
                    forecasthtml+='<br><br><b>Humidity: ' + data.list[i].main.humidity + ' %</b>';
                    forecasthtml+= '</div>';
                    bottompanelEl.innerHTML+= forecasthtml;
                }
            }
           
            
        }
        

    }
    else {
        toppanelEl.innerHTML = '<font size="5" color="black"><b>Search Result Not Found !<b></font> ';
        bottompanelEl.innerHTML="";
    }
}
//gets history from history button
function searchhistory(event, city) {
    event.preventDefault();
    event.stopPropagation();
    currentCity2 = city.toUpperCase();
    getlocation(city);
}
// sets history in local storage
function sethistory(){
    var storehistory;
    storehistory = JSON.stringify(historyArr);
    localStorage.setItem("history", storehistory);
}

// gets the history from local storage
function gethistory(){
  var historyAll = localStorage.getItem("history");
  if(JSON.parse(historyAll) != null){
    historyArr = JSON.parse(historyAll);
    for(var i =0; i<historyArr.length; i++){
        const btn = document.createElement("button");
        btn.textContent = historyArr[i].toUpperCase();
        btn.setAttribute("data-values", btn.textContent);
        btn.addEventListener("click", (event)=>{searchhistory(event, btn.dataset.values.toLowerCase());});
        historyEl.appendChild(btn);
    }
  }
}
//gets history from local storage and displays it
gethistory();