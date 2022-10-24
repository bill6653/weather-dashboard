
var owmAPI = "0a79fcd39d8f75343c924bb6535d87f4";
var currentCity = "";
var lastCity = "";


var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}


var getCurrentConditions = (event) => {
    
    let city = $('#search-city').val();
    currentCity= $('#search-city').val();
    
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + owmAPI;
    fetch(queryURL)
    .then(handleErrors)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
        
        saveCity(city);
        $('#search-error').text("");
        
        let currentWeatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        
        let currentTimeUTC = response.dt;
        let currentTimeZoneOffset = response.timezone;
        let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
        let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
        
        renderCities();

        getFiveDayForecast(event);

        $('#header-text').text(response.name);

        let currentWeatherHTML = `
        <h3>${response.name} ${currentMoment.format("(MM/DD/YY")}<img src=${currentWeatherIcon}"></h3>
        <ul class="list-unstyled">
        <li>Temperature: ${response.main.temp}$#8457;</li>
        <li>Humidity: ${response.main.humidity}%</li>
        <li id="uvIndex">UV Index:</li>
        </ul>`;

        $('#current-weather').html(currentWeatherHTML);

        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        let uvQueryURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "$lon=" +longitude + "&APPID=" + owmAPI;

        uvQueryURL = "https://cors-anywhere.herokuapp.com/" + uvQueryURL;

        fetch(uvQueryURL)
        .then(handleErrors)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let uvIndex = response.value;
            $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
            if (uvIndex>=0 && uvIndex<3){
                $('#uvVal').attr("class", "uv-favorable");
            } else if (uvIndex>=3 && uvIndex<8){
                $('#uvVal').attr("class", "uv-moderate");
            } else if (uvIndex>=8){
                $('#uvVal').attr("class", "uv-severe");
            }
        });
    })
}

        