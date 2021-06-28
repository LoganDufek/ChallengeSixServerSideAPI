var buttonEl = document.getElementById("search");
var displayCity = document.getElementById("display");
var pastCity = document.getElementById("CityHistory");
var forecast = document.getElementById("ForecastArea")
var currentMoment = moment().format('(M/D/YYYY)');

function findWeather() {
    displayCity.innerHTML = ""
    var userInput = document.querySelector('.EnterCity').value;

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial&appid=7d9892aa7b472563716938b17ffcc18a")
        .then(function (response) {
            return response.json();

        })
        .then(function (response) {
            console.log(response)

            var chosenCity = document.createElement("div");
            chosenCity.className = "DisplayAreaOne";
            var cityTitle = document.createElement("h3");
            var weatherIcon = document.createElement("img");
            var temperature = document.createElement("p");
            var windSpeed = document.createElement("p");
            var humidity = document.createElement("p");
            var lat = response.coord.lat
            var lon = response.coord.lon
            var cityButton = document.createElement("button")
            var fiveDayForecast = document.createElement("h3")
            fiveDayForecast.textContent = "5 Day Forecast:";
            currentdate = Date(response.dt)
            console.log(currentdate)

            cityButton.className = "HistoryButton";


            cityTitle.innerHTML = response.name + " " + currentMoment;
            // cityTitle.textContent = moment().format('(MMMM Do YYYY)');
            weatherIcon.setAttribute('src', "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
            temperature.innerHTML = "Temp: " + response.main.temp + "°F";
            windSpeed.innerHTML = "Wind: " + response.wind.speed + "MPH";
            humidity.innerHTML = "Humidity: " + response.main.humidity + "%";
            cityButton.innerHTML = response.name;

            displayCity.appendChild(chosenCity);
            chosenCity.appendChild(cityTitle);
            cityTitle.appendChild(weatherIcon);
            chosenCity.appendChild(temperature);
            chosenCity.appendChild(windSpeed);
            chosenCity.appendChild(humidity);
            pastCity.appendChild(cityButton);
            displayCity.appendChild(fiveDayForecast);
            fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7d9892aa7b472563716938b17ffcc18a"
            )
                .then(function (response) {
                    return response.json();

                })
                .then(function (response) {
                    console.log(response)
                    var uvIndex = document.createElement("p");
                    uvIndex.innerHTML = "UV Index: " + response.current.uvi;
                    chosenCity.appendChild(uvIndex);
                    for (i = 1; i < 6; i++) {
            
                        forecast = 1

                        var forecastDate1 = moment().add(i, 'day').format('M/D/YYYY');
                        var dayOne = document.createElement("div");
                        dayOne.className = "forecast"
                        dayOne.innerHTML = "<h4>" + forecastDate1 + "</h4>"
                        var forecastWeather = document.createElement("img")
                        var forecastTemp = document.createElement("p")


                        forecastWeather.setAttribute('src', "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png");
                        forecastTemp.innerHTML = "Temp: " + response.daily[i].temp.day + "°F"

                        displayCity.appendChild(dayOne)
                        dayOne.appendChild(forecastWeather)
                        dayOne.appendChild(forecastTemp)
                    }
                });
        })


    // var chosenCity = document.createElement("div");
    // chosenCity.classList.add("DisplayAreaOne")
    // chosenCity.innerHTML = "Hello";
    // displayCity.appendChild(chosenCity);

};


document.getElementById("search").addEventListener("click", findWeather)

