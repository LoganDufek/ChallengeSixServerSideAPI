// DOM elements
var buttonEl = document.getElementById("search");
var displayCity = document.getElementById("display");
var pastCity = document.getElementById("CityHistory");
var forecast = document.getElementById("ForecastArea")
var currentMoment = moment().format('(M/D/YYYY)');
var textField = document.getElementById("EnterCity")
var cityCount = 0;
// Empty Arrays to store relevant data
var pageIndex = [];
var forecastIndex = [];

//Function to find and display the weather upon button click
function findWeather() {

    //First, set any existing html elements to null because they will be rebuilt
    displayCity.innerHTML = ""
    forecast.innerHTML = ""
    //Value of seach area is set as userInput
    var userInput = document.querySelector('.EnterCity').value;

    //Set variable is passed into the fetch request to obtain the useful data
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial&appid=7d9892aa7b472563716938b17ffcc18a")
        //First then method to parse the data into JSON
        .then(function (response) {
            return response.json();

        })
        //Second then method to use that parsed data
        .then(function (response) {

            //Set the textfield back to empty
            textField.value = "";

            console.log(response)

            //Series of createElement methods to hold the new data that's aquired
            var chosenCity = document.createElement("div");
            chosenCity.className = "DisplayAreaOne";
            var cityTitle = document.createElement("h3");
            var weatherIcon = document.createElement("img");
            var temperature = document.createElement("p");
            var windSpeed = document.createElement("p");
            var humidity = document.createElement("p");
            //Specific latitude and longitude coordinates stored to be used in next fetch request
            var lat = response.coord.lat
            var lon = response.coord.lon
            var cityButton = document.createElement("button")
            var fiveDayForecast = document.createElement("h3")
            currentdate = Date(response.dt);

            //Assign these areas their relavant attributes based on JSON data
            fiveDayForecast.textContent = "5 Day Forecast:";
            cityButton.className = "HistoryButton";
            cityTitle.innerHTML = response.name + " " + currentMoment;
            weatherIcon.setAttribute('src', "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
            temperature.innerHTML = "Temp: " + response.main.temp + "°F";
            windSpeed.innerHTML = "Wind: " + response.wind.speed + "MPH";
            humidity.innerHTML = "Humidity: " + response.main.humidity + "%";
            cityButton.innerHTML = response.name;
            cityButton.setAttribute('id', cityCount)

            //Append those created elements to the DOM
            displayCity.appendChild(chosenCity);
            chosenCity.appendChild(cityTitle);
            cityTitle.appendChild(weatherIcon);
            chosenCity.appendChild(temperature);
            chosenCity.appendChild(windSpeed);
            chosenCity.appendChild(humidity);
            pastCity.appendChild(cityButton);
            displayCity.appendChild(fiveDayForecast);

            //Second fetch request which takes in lat and lon variables defined above
            fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7d9892aa7b472563716938b17ffcc18a"
            )
                //First then method to parse the data into JSON
                .then(function (response) {
                    return response.json();

                })
                //Second then method to use that parsed data
                .then(function (response) {
                    console.log(response)

                    //Does the same thing as the previous second function, just specifically with uvIndex
                    var uvIndex = document.createElement("p");

                    var uvSpecific = document.createElement("span");
                    uvSpecific.innerHTML = response.current.uvi

                    //Checks the interger value of the returned data and conditionally adds the relevant styling class
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
                    //Appends the data to the DOM
                    chosenCity.appendChild(uvIndex);
                    uvIndex.appendChild(uvSpecific);


                    //For loop that gets the data for the next 5 days
                    for (i = 1; i < 6; i++) {
                        //Set intial forecast date to 1, so that it will always start by grabbing the next day instead of current day
                        forecast = 1

                        //Series of createElement methods to hold the new data that's aquired
                        var forecastDate1 = moment().add(i, 'day').format('M/D/YYYY');
                        var dayOne = document.createElement("div");
                        dayOne.className = "forecast"
                        dayOne.innerHTML = "<h4>" + forecastDate1 + "</h4>"
                        var forecastWeather = document.createElement("img")
                        var forecastTemp = document.createElement("p")
                        var forecastWind = document.createElement("p")
                        var forecastHumidity = document.createElement("p")

                        //Assign these areas their relavant attributes based on JSON data
                        var forecastIocn = forecastWeather.setAttribute('src', "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png");
                        forecastTemp.innerHTML = "Temp: " + response.daily[i].temp.day + "°F"
                        forecastWind.innerHTML = "Wind: " + response.daily[i].wind_gust + "MPH";
                        forecastHumidity.innerHTML = "Humidity: " + response.daily[i].humidity + "%"

                        //Append those created elements to the DOM
                        displayCity.appendChild(dayOne);
                        dayOne.appendChild(forecastWeather);
                        dayOne.appendChild(forecastTemp);
                        dayOne.appendChild(forecastWind);
                        dayOne.appendChild(forecastHumidity);

                        //Create Array Object to be pushed to the empty array
                        var forecastIndexObj = {
                            forecastWeatherIcon: forecastIocn,
                            forecastTemperature: forecastTemp.innerHTML,
                            forecastWindSpeed: forecastWind.innerHTML,
                            forecastHumidityPercentage: forecastHumidity.innerHTML

                        }
                        //Push that data to the array
                        forecastIndex.push(forecastIndexObj)


                    }
                    //Create Array Object to be pushed to the empty array
                    var pageIndexObj = {
                        id: cityCount,
                        cityName: cityTitle.innerHTML,
                        cityTemp: temperature.innerHTML,
                        cityWind: windSpeed.innerHTML,
                        cityHumidity: humidity.innerHTML,
                        cityUvIndex: uvSpecific.innerHTML
                    }


                    //Push that data to the array
                    pageIndex.push(pageIndexObj)
                    console.log(pageIndex)
                    //Run save page function to store data to localStorage
                    savePage()
                });




        })
    //Increase the cityCount variable by 1 to give it a unique ID
    cityCount++
};

//Function that is very simmilar to findWeather(), it just fires upon history button click and does not re-save the data
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
//Function that sets those arrays to localStorage
function savePage() {

    localStorage.setItem("Page", JSON.stringify(pageIndex));
    localStorage.setItem("Forecast", JSON.stringify(forecastIndex));
}

//Function that loads the data from localStorage, parses it, and runs it through thr reloadCity function
function loadPage() {

    var i = pastCity.getAttribute('id')

    var pageIndex = localStorage.getItem("Page");

    pageIndex = JSON.parse(pageIndex);

    displayCity.innerHTML = ""
    forecast.innerHTML = ""

    reloadCity(pageIndex[i]);

};

//Event listeners for both main functions, to be called on relevant button clicks
document.getElementById("search").addEventListener("click", findWeather)
document.getElementById("CityHistory").addEventListener("click", loadPage)

