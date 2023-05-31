let apiKey = "a7f21cd1d63d83c38a0a146ab8875ffd";

function formattedDate(formatdate) {
  let date = formatdate.getDate();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let day = days[formatdate.getDay()];
  let year = formatdate.getFullYear();
  let hour = formatdate.getHours();
  let minutes = formatdate.getMinutes();
  let options = { hour: "numeric", minute: "numeric", hour12: true };
  let formattedTime = newDate.toLocaleString(undefined, options);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[formatdate.getMonth()];

  return `${day} ${month} ${date}, ${formattedTime}`;
}
let todaysDate = document.querySelector("#todaysDate");
let newDate = new Date();
todaysDate.innerHTML = formattedDate(newDate);

let storedLatitude;
let storedLongitude;
let city;
let country;

function decimalToPercent(decimalValue) {
  var percentage = (decimalValue * 100).toFixed(2);
  return percentage;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2 fiveDay">
        <div class="forcastDay">${formatDay(forecastDay.dt)}</div>
          
        <img
                src="http:openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }.png"
                alt=""
                width="42"
              />

              <div>
                <span class="tempLow">${Math.round(forecastDay.temp.min)}</span>
                <span class="col tempHigh">${Math.round(
                  forecastDay.temp.max
                )}</span>
              </div>
            </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        storedLatitude = position.coords.latitude;
        storedLongitude = position.coords.longitude;
        getWeatherData();
      },
      function (error) {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function getTodayDisplayData(response) {
  console.log(response);
  currentTemperature = Math.round(response.data.current.temp);
  currentDescription = response.data.current.weather[0].description;
  currentWind = Math.round(response.data.current.wind_speed);
  currentPop = Math.round(decimalToPercent(response.data.daily[0].pop));
  currentIcon = response.data.current.weather[0].icon;
  forecast = response.data.daily;

  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let locationElement = document.querySelector("#city");
  let windElement = document.querySelector("#todaysWind");
  let popElement = document.querySelector("#todaysPop");
  let todayIconElement = document.querySelector("#todaysIcon");

  temperatureElement.innerHTML = `${currentTemperature}°`;
  todayIconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentIcon}.png">`;
  descriptionElement.innerHTML = `${currentDescription}`;
  locationElement.innerHTML = `${city}, ${country}`;
  windElement.innerHTML = `${currentWind}`;
  popElement.innerHTML = `${currentPop}`;

  getTodayMessage(currentPop, currentTemperature, currentIcon);
  toggleCurrentTemp(currentTemperature);
  displayForecast(response);
}

function getTodayMessage(currentPop, currentTemperature, currentIcon) {
  let alertMessage = document.querySelector("#alert");
  if (currentPop >= 50) {
    alertMessage.innerHTML = 'Keep <i class="fas fa-umbrella"></i> handy today';
  } else if (currentTemperature <= 14) {
    alertMessage.innerHTML = 'Grab those <i class="fas fa-mitten"></i> today!';
  } else if (currentIcon === "01d") {
    alertMessage.innerHTML = "Beautiful weather today!";
  } else {
    alertMessage.innerHTML = "";
  }
}

function toggleCurrentTemp() {
  function showFahrenheit(event) {
    event.preventDefault();
    let fahrenheitTemperature = Math.round(
      (`${currentTemperature}` * 9) / 5 + 32
    );

    let fTemp = document.querySelector("#temperature");
    fTemp.innerHTML = `${fahrenheitTemperature}°`;

    toggleUnitSwitch();
  }

  function showCelsius(event) {
    event.preventDefault();

    let cTemp = document.querySelector("#temperature");
    cTemp.innerHTML = `${currentTemperature}°`;

    toggleUnitSwitch();
  }

  function toggleUnitSwitch() {
    let clink = document.querySelector("#celsius");
    clink.classList.toggle("selectedUnit");

    let flink = document.querySelector("#fahrenheit");
    flink.classList.toggle("selectedUnit");
  }

  let fahrenheitLink = document.querySelector("#fahrenheit");
  fahrenheitLink.addEventListener("click", showFahrenheit);

  let celsiusLink = document.querySelector("#celsius");
  celsiusLink.addEventListener("click", showCelsius);

  let currentButton = document.querySelector("#currentLocation");
  currentButton.addEventListener("click", getUserLocation);
}

function getWeatherData(response) {
  let weatherAPIUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${storedLatitude}&lon=${storedLongitude}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
  axios.get(weatherAPIUrl).then(getTodayDisplayData);
}

function search() {
  let searchForm = document.getElementById("search-form");
  let locationInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let location = locationInput.value.trim();
    let [city, country] = location.split(",");

    geocodingCityCountry(city, country);
  });

  function geocodingCityCountry(city, country) {
    let apiKey = "a7f21cd1d63d83c38a0a146ab8875ffd";
    let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${apiKey}`;
    axios.get(apiUrl).then(function (response) {
      storedLatitude = response.data[0].lat;
      storedLongitude = response.data[0].lon;
      getWeatherData();
    });
  }

  geocodingCityCountry("New York", "US");
}

toggleCurrentTemp();
search();
