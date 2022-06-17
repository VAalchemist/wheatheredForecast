var searchFormEl = document.querySelector('#search-form');
var cityInputEl = document.querySelector('#city');
var cityContainerEl = document.querySelector('#city-container');


var key = "672c08ae2ee298d34f90eec1a6db0ce9";

var formSubmitHandler = function (event) {
    event.preventDefault();


    var cityName = cityInputEl.value;
    cityInputEl.value = ""

    if (cityName) {
        getWeather(cityName);
    } else {
        alert('Please enter a City Name');
    };
}
var getWeather = function (cityName) {

    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key`;
    var currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`

    fetch(currentWeather)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    console.log(data);
                    var recentSearch = JSON.parse(localStorage.getItem("weatherApi")) || []
                    recentSearch.push(cityName)
                    localStorage.setItem("weatherApi",JSON.stringify(recentSearch))
                    displaySearch();
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    getForecast(lat, lon, cityName);

                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Openweathermap');
        });
};

searchFormEl.addEventListener("submit", formSubmitHandler)

var getForecast = function (lat, lon, cityName) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutelyhourlyalerts&appid=${key}&units=imperial`
    fetch(weatherUrl)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    console.log(data);
                    displayCities(data, cityName);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Openweathermap');
        });
}
function displayCities(apiresult, cityName) {
    var uvIndex = apiresult.current.uvi 
     if (uvIndex < 3) {
        document.getElementById('uvIndex').classList.add("bg-success")
    } else if (uvIndex <= 7) {
        document.getElementById('uvIndex').classList.add("bg-warning")       
    } else if (uvIndex >= 8) {
        document.getElementById('uvIndex').classList.add("bg-danger")
    }else {
        document.getElementById('uvIndex').classList.add("bg-info")
    }
    document.getElementById('returnedCity').textContent = cityName + "   " + new Date().toDateString()
    document.getElementById('temp').textContent = "Temp : " + apiresult.current.temp
    document.getElementById('humidity').textContent = "Humidity : " + apiresult.current.humidity
    document.getElementById('wind').textContent = "Wind : " + apiresult.current.wind_speed
    document.getElementById('uvIndex').textContent = "UVIndex : " + apiresult.current.uvi 
    document.getElementById('icon').setAttribute('src', `https://openweathermap.org/img/wn/${apiresult.current.weather[0].icon}@2x.png`)
    var daily = apiresult.daily
    var html = ""
    for (let i = 1; i < 6; i++) {
        html += ` <div class="card text-white bg-secondary m-1" style="max-width: 9rem;">
        <div class="card-header">Day: ${i}</div>
        <div class="card-body">
        <img src="https://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png"/>
          <p class="card-text">Temp: ${daily[i].temp.day}</p>
          <p class="card-text">Wind: ${daily[i].wind_speed}</p>
          <p class="card-text">Humidity: ${daily[i].humidity}</p>
        </div>
      </div>`
    }
    document.getElementById('fiveday').innerHTML = html

    

}
function displaySearch () {
    var recentSearch = JSON.parse(localStorage.getItem("weatherApi")) || []
    var html = ""
    for (let i = 0; i<recentSearch.length;i++) {
        html += ` <button data-city="${recentSearch[i]}" onclick = "history(event)" class="recentCity m-1 btn btn-secondary" id="city-${i}">${recentSearch[i]}</button>`
    }
    document.getElementById("location").innerHTML = html
}

displaySearch();

function clearHistory() {
    localStorage.clear();
    window.location.reload();
};


function history(event){
    var city = event.target.textContent
    console.log(city);
    getWeather(city)
}