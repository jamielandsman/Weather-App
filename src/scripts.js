let apiKey = "88724523008dc9e1be18f6eb6a959b67";

let newDate = new Date();
function formattedDate(formatdate) {
  let date = formatdate.getDate();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri"];
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
todaysDate.innerHTML = formattedDate(newDate);

let storedLatitude;
let storedLongitude;
function decimalToPercent(decimalValue) {
  var percentage = (decimalValue * 100).toFixed(2);
  return percentage;
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

  currentTemperature = Math.round(response.data.list[0].main.temp);
  currentDescription = response.data.list[0].weather[0].description;
  currentLocationName = response.data.city.name;
  currentWind = Math.round(response.data.list[0].wind.speed);
  currentPop = Math.round(decimalToPercent(response.data.list[0].pop));
  currentIcon = response.data.list[0].weather[0].icon;

  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let locationElement = document.querySelector("#city");
  let windElement = document.querySelector("#todaysWind");
  let popElement = document.querySelector("#todaysPop");
  let todayIconElement = document.querySelector("#todaysIcon");

  temperatureElement.innerHTML = `${currentTemperature}°`;
  todayIconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentIcon}@2x.png">`;
  descriptionElement.innerHTML = `${currentDescription}`;
  locationElement.innerHTML = `${currentLocationName}`;
  windElement.innerHTML = `${currentWind}`;
  popElement.innerHTML = `${currentPop}`;
}
let currentTemperature;

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

function getWeatherData(response) {
  let weatherAPIUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${storedLatitude}&lon=${storedLongitude}&appid=${apiKey}&units=metric`;
  axios.get(weatherAPIUrl).then(getTodayDisplayData);
}

function getTodayDisplayData(response) {
  console.log(response);

  currentTemperature = Math.round(response.data.list[0].main.temp);
  currentDescription = response.data.list[0].weather[0].description;
  currentLocationName = response.data.city.name;
  currentWind = Math.round(response.data.list[0].wind.speed);
  currentPop = Math.round(decimalToPercent(response.data.list[0].pop));
  currentIcon = response.data.list[0].weather[0].icon;

  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let locationElement = document.querySelector("#city");
  let windElement = document.querySelector("#todaysWind");
  let popElement = document.querySelector("#todaysPop");
  let todayIconElement = document.querySelector("#todaysIcon");

  temperatureElement.innerHTML = `${currentTemperature}°`;
  todayIconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${currentIcon}.png">`;
  descriptionElement.innerHTML = `${currentDescription}`;
  locationElement.innerHTML = `${currentLocationName}`;
  windElement.innerHTML = `${currentWind}`;
  popElement.innerHTML = `${currentPop}`;
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
    let apiKey = "88724523008dc9e1be18f6eb6a959b67";
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
