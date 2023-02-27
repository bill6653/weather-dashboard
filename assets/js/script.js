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

        //parse the response for name of city
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconURL+">");
        
        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
        // Display the Humidity
        $(currentHumidity).html(response.main.humidity + "%");
        //Display Wind speed and convert to MPH
        var ws=response.wind.speed;
        var windsMPH=(ws*2.237).toFixed(1);

        $(currentWindSpeed).html(windsMPH+"MPH");
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("city-name"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("city-name",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("city-name",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}