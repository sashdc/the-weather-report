let cityNameEl = document.getElementById('cityinput')
let currentDate = new Date();
let cityList= []
let searchHistoryEl = document.querySelector('.search-history')
var date = new Date();
const month = date.toLocaleString('default', { month: 'short' });
console.log(month);
var curDate = date.getDate() + "/" +  month +"/"+ date.getFullYear()


console.log(JSON.parse(localStorage.getItem("Saved-Cities")))

// loads previously saved cities in local storage as buttons if there are cities there
if (JSON.parse(localStorage.getItem("Saved-Cities")) !== null)
  {cityList =  JSON.parse(localStorage.getItem("Saved-Cities"))
  for (i=0; i<cityList.length; i++){
  let cityBtn = document.createElement('button')
  cityBtn.innerText=cityList[i].toUpperCase()
  cityBtn.classList.add('btn', 'btn-success', 'btn,-blockn', 'm-1' )
  let searchHistory = document.querySelector(".search-history")
  searchHistory.appendChild(cityBtn)
}}



// getting the current weather through the api using the lat and lon
function getWeather(lat,lon, type){
   let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=87b635d8d76e97c5eaab6ef42831deea`
   console.log(apiUrl)
   fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      // populates the current weather element with data from response
      document.getElementById('icon').src= `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
      document.getElementById('cur-temp').innerText= "Temp: " +Math.floor(data.main.temp) +'°C'
      document.getElementById('cur-wind').innerText= "Wind Speed: "+ data.wind.speed + 'm/s'
      document.getElementById('cur-humidity').innerText= "Humidity: " +data.main.humidity + "%"
})}

// gets the  5 day forecast using lat lon and populates the elements
function getForecast(lat,lon, type){
   let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=87b635d8d76e97c5eaab6ef42831deea`
   console.log(apiUrl)
   fetch(apiUrl)

    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (i=7;i<40; i+=8){
      // populates 5 day cards with necessary details from response
      document.getElementById(`five-icon-${i}`).src= `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`
      let fiveDate = new Date(data.list[i].dt_txt)
      console.log(fiveDate)
      // get the date for the 5 day forecast
      let fiveDay = fiveDate.toLocaleString('default', { weekday: 'short' });
      document.getElementById(`${i}`).innerText= fiveDay + " " +  fiveDate.getDate() + "/" +  month +"/"+ fiveDate.getFullYear()
      document.getElementById(`five-temp-${i}`).innerText= "Temp: " +Math.floor(data.list[i].main.temp) +'°C'
      document.getElementById(`five-wind-${i}`).innerText= "Wind Speed: "+ data.list[i].wind.speed + 'm/s'
      document.getElementById(`five-hum-${i}`).innerText= "Humidity: " +data.list[i].main.humidity + "%"
    }
})}

// get the lat and lon for the city on entering the city name and clicking search button
let formSubmitHandler = function (event){
   let cityName = $('#city').val() || event.target.innerText.toLowerCase()
   console.log(cityName)
   let coordApi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=87b635d8d76e97c5eaab6ef42831deea`
   event.preventDefault();
   cityNameEl = ""
   fetch(coordApi)
      .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // stops further functions adn sends an alert if the city is invalid
        if (!data[0]){
          alert("Location not found \n please enter valid city.")
        console.log("No results.")
        } else {
             saveCity(cityName) 

        // takes the lat and lon from response to call the weather detals as well as the country name and cde to generate a flag
        let lat = data[0].lat;
      let lon = data[0].lon;
      console.log(lat)
      console.log(lon)
      let countryCode = data[0].country.toLowerCase()
      console.log(countryCode)
      getWeather(lat, lon);
      document.getElementById('chosencity').innerText=cityName.toUpperCase() +"," + data[0].country 
      document.getElementById('flag').src = `https://raw.githubusercontent.com/hampusborgos/country-flags/main/png100px/${countryCode}.png`
      document.getElementById('currentdate').innerText = curDate
      getForecast(lat, lon);
      }
      
    });
}

// save previous searches as buttons, but only if the item isn't already in there
function saveCity(city){
    if (!cityList.includes(city)){
    cityList.push(city)
    console.log(cityList)
    localStorage.setItem("Saved-Cities", JSON.stringify(cityList))
    let cityBtn = document.createElement('button')
    cityBtn.innerText=city.toUpperCase()
    cityBtn.classList.add('btn', 'btn-success', 'btn,-blockn', 'm-1')
    let searchHistory = document.querySelector(".search-history")
    searchHistory.appendChild(cityBtn)}
}

// give button clickability and function
cityNameEl.addEventListener('submit', formSubmitHandler);
searchHistoryEl.addEventListener('click', formSubmitHandler)