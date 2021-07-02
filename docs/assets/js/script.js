var buttonEl = document.getElementById("search");
var displayCity = document.getElementById("display");
var pastCity = document.getElementById("CityHistory");
var forecast = document.getElementById("ForecastArea")
var currentMoment = moment().format('(M/D/YYYY)');
var cityCount = 0;
var pageIndex = [];
var forecastIndex = [];

function findWeather() {

    displayCity.innerHTML = ""
    forecast.innerHTML = ""
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
            weatherIcon.setAttribute('src', "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
            temperature.innerHTML = "Temp: " + response.main.temp + "°F";

            windSpeed.innerHTML = "Wind: " + response.wind.speed + "MPH";
            humidity.innerHTML = "Humidity: " + response.main.humidity + "%";
            cityButton.innerHTML = response.name;
            cityButton.setAttribute('id', cityCount)

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

                    var uvSpecific = document.createElement("span");
                    uvSpecific.innerHTML = response.current.uvi

                    if (parseInt(response.current.uvi) <= 3) {
                        uvSpecific.classList.add('low');
                    }
                    if (parseInt(response.current.uvi) <= 6 && parseInt(response.current.uvi) >= 3) {
                        uvSpecific.classList.add('moderate')
                    }
                    if (parseInt(response.current.uvi) >= 6 && parseInt(response.current.uvi) <= 8) {
                        uvSpecific.classList.add('high')
                    }
                    if (parseInt(response.current.uvi) >= 8) {
                        uvSpecific.classList.add('veryhigh')
                    }

                    uvIndex.innerHTML = "UV Index: ";
                    chosenCity.appendChild(uvIndex);
                    uvIndex.appendChild(uvSpecific);





                    for (i = 1; i < 6; i++) {

                        forecast = 1

                        var forecastDate1 = moment().add(i, 'day').format('M/D/YYYY');
                        var dayOne = document.createElement("div");
                        dayOne.className = "forecast"
                        dayOne.innerHTML = "<h4>" + forecastDate1 + "</h4>"
                        var forecastWeather = document.createElement("img")
                        var forecastTemp = document.createElement("p")
                        var forecastWind = document.createElement("p")
                        var forecastHumidity = document.createElement("p")


                        var forecastIocn = forecastWeather.setAttribute('src', "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png");
                        forecastTemp.innerHTML = "Temp: " + response.daily[i].temp.day + "°F"
                        forecastWind.innerHTML = "Wind: " + response.daily[i].wind_gust + "MPH";
                        forecastHumidity.innerHTML = "Humidity: " + response.daily[i].humidity + "%"

                        displayCity.appendChild(dayOne);
                        dayOne.appendChild(forecastWeather);
                        dayOne.appendChild(forecastTemp);
                        dayOne.appendChild(forecastWind);
                        dayOne.appendChild(forecastHumidity);

                        var forecastIndexObj = {
                            forecastWeatherIcon: forecastIocn,
                            forecastTemperature: forecastTemp.innerHTML,
                            forecastWindSpeed: forecastWind.innerHTML,
                            forecastHumidityPercentage: forecastHumidity.innerHTML

                        }
                        forecastIndex.push(forecastIndexObj)


                    }
                    var pageIndexObj = {
                        id: cityCount,
                        cityName: cityTitle.innerHTML,
                        cityTemp: temperature.innerHTML,
                        cityWind: windSpeed.innerHTML,
                        cityHumidity: humidity.innerHTML,
                        cityUvIndex: uvSpecific.innerHTML
                    }



                    pageIndex.push(pageIndexObj)
                    console.log(pageIndex)
                    savePage()
                });




        })


    cityCount++
};

function reloadCity() {
    displayCity.innerHTML = ""
    forecast.innerHTML = ""
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
            var fiveDayForecast = document.createElement("h3")
            fiveDayForecast.textContent = "5 Day Forecast:";
            currentdate = Date(response.dt)
            console.log(currentdate)




            cityTitle.innerHTML = response.name + " " + currentMoment;
            weatherIcon.setAttribute('src', "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
            temperature.innerHTML = "Temp: " + response.main.temp + "°F";

            windSpeed.innerHTML = "Wind: " + response.wind.speed + "MPH";
            humidity.innerHTML = "Humidity: " + response.main.humidity + "%";

            displayCity.appendChild(chosenCity);
            chosenCity.appendChild(cityTitle);
            cityTitle.appendChild(weatherIcon);
            chosenCity.appendChild(temperature);
            chosenCity.appendChild(windSpeed);
            chosenCity.appendChild(humidity);
            displayCity.appendChild(fiveDayForecast);

            // pageIndex[i] = [
            //     localStorage.setItem("City", JSON.stringify(cityTitle.innerHTML)),
            //     localStorage.setItem("Wind", JSON.stringify(windSpeed.innerHTML)),

            // ];

            fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7d9892aa7b472563716938b17ffcc18a"
            )
                .then(function (response) {
                    return response.json();

                })
                .then(function (response) {
                    console.log(response)

                    var uvIndex = document.createElement("p");

                    var uvSpecific = document.createElement("span");
                    uvSpecific.innerHTML = response.current.uvi

                    if (parseInt(response.current.uvi) <= 3) {
                        uvSpecific.classList.add('low');
                    }
                    if (parseInt(response.current.uvi) <= 6 && parseInt(response.current.uvi) >= 3) {
                        uvSpecific.classList.add('moderate')
                    }
                    if (parseInt(response.current.uvi) >= 6 && parseInt(response.current.uvi) <= 8) {
                        uvSpecific.classList.add('high')
                    }
                    if (parseInt(response.current.uvi) >= 8) {
                        uvSpecific.classList.add('veryhigh')
                    }

                    uvIndex.innerHTML = "UV Index: ";
                    chosenCity.appendChild(uvIndex);
                    uvIndex.appendChild(uvSpecific);





                    for (i = 1; i < 6; i++) {

                        forecast = 1

                        var forecastDate1 = moment().add(i, 'day').format('M/D/YYYY');
                        var dayOne = document.createElement("div");
                        dayOne.className = "forecast"
                        dayOne.innerHTML = "<h4>" + forecastDate1 + "</h4>"
                        var forecastWeather = document.createElement("img")
                        var forecastTemp = document.createElement("p")
                        var forecastWind = document.createElement("p")
                        var forecastHumidity = document.createElement("p")


                        var forecastIocn = forecastWeather.setAttribute('src', "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png");
                        forecastTemp.innerHTML = "Temp: " + response.daily[i].temp.day + "°F"
                        forecastWind.innerHTML = "Wind: " + response.daily[i].wind_gust + "MPH";
                        forecastHumidity.innerHTML = "Humidity: " + response.daily[i].humidity + "%"

                        displayCity.appendChild(dayOne);
                        dayOne.appendChild(forecastWeather);
                        dayOne.appendChild(forecastTemp);
                        dayOne.appendChild(forecastWind);
                        dayOne.appendChild(forecastHumidity);


                    }




                });




        })


}

function savePage() {

    localStorage.setItem("Page", JSON.stringify(pageIndex));
    localStorage.setItem("Forecast", JSON.stringify(forecastIndex));
}

function loadPage() {

    var i = pastCity.getAttribute('id')

    var pageIndex = localStorage.getItem("Page");

    pageIndex = JSON.parse(pageIndex);

    displayCity.innerHTML = ""
    forecast.innerHTML = ""

    reloadCity(pageIndex[i]);

};

document.getElementById("search").addEventListener("click", findWeather)
document.getElementById("CityHistory").addEventListener("click", loadPage)

