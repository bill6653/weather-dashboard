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
        
        // Convert the temperature to fahrenheit
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
// function to display the 5-day forecast for the current city.
function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}
// adds the passed city on the search history
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search when the list group item is clicked in search history
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

// render function
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("city-name"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("city-name"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("city-name");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click",clearHistory);
