let cityNameEl = document.getElementById('cityinput')
let currentDate = new Date();
let cityList= []
let searchHistoryEl = document.querySelector('.search-history')
var date = new Date();
const month = date.toLocaleString('default', { month: 'short' });
console.log(month);
var curDate = date.getDate() + "/" +  month +"/"+ date.getFullYear()


console.log(JSON.parse(localStorage.getItem("Saved-Cities")))

// loads previously saved cities as buttons if there are cities there
if (JSON.parse(localStorage.getItem("Saved-Cities")) !== null)
  {cityList =  JSON.parse(localStorage.getItem("Saved-Cities"))
  for (i=0; i<cityList.length; i++){
  let cityBtn = document.createElement('button')
  cityBtn.innerText=cityList[i].toUpperCase()
  cityBtn.classList.add('btn', 'btn-success', 'btn,-blockn', 'm-3')
  let searchHistory = document.querySelector(".search-history")
  searchHistory.appendChild(cityBtn)
}}

//  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=87b635d8d76e97c5eaab6ef42831deea`

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
      document.getElementById('icon').src= `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
      document.getElementById('cur-temp').innerText= "Temp: " +Math.floor(data.main.temp) +'°C'
      document.getElementById('cur-wind').innerText= "Wind Speed: "+ data.wind.speed + 'm/s'
      document.getElementById('cur-humidity').innerText= "Humidity: " +data.main.humidity + "%"
})}

// gets the  day forecast using lat lon and populates the elements
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
        console.log(data.list[i])
      document.getElementById(`five-icon-${i}`).src= `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`
      document.getElementById(`${i}`).innerText= date.getDate()++ + "/" +  month +"/"+ date.getFullYear()
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
   fetch(coordApi)
      .then(function (response) {

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // if (data.length === 0){
        if (!data[0]){
          alert("location not found")
        console.log("No results.")
        } else {
             saveCity(cityName) 

        // return;
        let lat = data[0].lat;
      let lon = data[0].lon;
      console.log(lat)
      console.log(lon)
      getWeather(lat, lon);
      document.getElementById('chosencity').innerText=cityName.toUpperCase() +"," + data[0].country 
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
    cityBtn.classList.add('btn', 'btn-success', 'btn,-blockn', 'm-3')
    let searchHistory = document.querySelector(".search-history")
    searchHistory.appendChild(cityBtn)}
}

// give button clickability and function
cityNameEl.addEventListener('submit', formSubmitHandler);
searchHistoryEl.addEventListener('click', formSubmitHandler)