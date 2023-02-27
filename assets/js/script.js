// 5-Day Forecast API call //
// Declare variable to store searched city 
var city = "";
const APIKey = "655f440e2edd3fdcfbfbcd81a9465bc3";

var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature")
var currentHumidity = $("#humidity")
var currentWindSpeed = $("#wind-speed")

var sCity=[];

// searches the city to see if it exists in the entries from the storage
function find(c) {
    for (var i=0; i<sCity.length; i++) {
        if(c.toUpperCase()===sCity[i]) {
            return -1;
        }
    }
    return 1;
}

function displayWeather(event) {
    event.preventDefault();
    if(searchCity.val().trim()!=="") {
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

// Function that builds URL with ajax
function currentWeather(city) {
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response) {
        console.log(response);

        var weatherIcon= response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/"+ weatherIcon +"@2x.png";
        var date = new Date(response.dt*1000).toLocaleDateString();