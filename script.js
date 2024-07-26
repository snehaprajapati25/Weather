const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const countryOutput = document.querySelector('.country');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind_kmp');
const tempOutput = document.querySelector('.temp_c');
const feelslike = document.querySelector('.feelslike_c');
const winddir = document.querySelector('.wind_dir');
const visibility = document.querySelector('.vis_km');
const pressure = document.querySelector('.pressure_in');
const precip = document.querySelector('.precip_mm');
const windDegreeOutput = document.querySelector('.wind_degree');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const name1 = document.querySelector('.name1');


/* default city when page load */
let cityInput = "Delhi";

form.addEventListener('submit', (e) => {

	if (search.value.length == 0) {
		alert('Please type in a city name');
	} else {
		cityInput = search.value;
		fetchWeatherData();
		search.value = "";
		app.style.opacity = "0";
	}
	e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
	const weekday = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	return weekday[new Date(`${month}-${day}-${year}`).getDay()];
};


function fetchWeatherData(lat, lon) {
	let url = `https://api.weatherapi.com/v1/current.json?key=e7557a9b593e4e88ba304012240407&q=`;
	if (lat && lon) {
		url += `${lat},${lon}`;
	} else {
		url += cityInput;
	}
	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			temp.innerHTML = data.current.temp_c + "&#176;";
			conditionOutput.innerHTML = data.current.condition.text;
			const date = data.location.localtime;
			const y = parseInt(date.substr(0, 4));
			const m = parseInt(date.substr(5, 2));
			const d = parseInt(date.substr(8, 2));
			const time = date.substr(11);

			dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
			timeOutput.innerHTML = time;

			nameOutput.innerHTML = data.location.name;
			countryOutput.innerHTML = data.location.country;
			name1.innerHTML = data.location.name;

			const iconUrl = `https:${data.current.condition.icon}`;
			icon.src = iconUrl;
			icon.alt = data.current.condition.text;


			tempOutput.innerHTML = data.current.temp_c + "&#176;C";
			feelslike.innerHTML = data.current.feelslike_c + "&#176;C";
			humidityOutput.innerHTML = data.current.humidity + "%";
			cloudOutput.innerHTML = data.current.cloud + "%";
			windOutput.innerHTML = data.current.wind_kph + "km/h";
			windDegreeOutput.innerHTML = data.current.wind_degree + "&#176;";
			winddir.innerHTML = data.current.wind_dir;
			visibility.innerHTML = data.current.vis_km + "km";
			pressure.innerHTML = data.current.pressure_in;
			precip.innerHTML = data.current.precip_mm + "mm";


			/* set time of the day */

			let timeOfDay = data.current.is_day ? "day" : "night"
			const code = data.current.condition.code;


			if (code == 1000) {
				app.style.backgroundImage = `url(./images/${timeOfDay}/clear.avif)`;
				btn.style.background = "#e5ba92";
				if (timeOfDay == "night") {
					btn.style.background = "#181e27";
					app.style.backgroundImage = `url(./images/${timeOfDay}/clear1.avif)`;
				}
			}
			else if (
				code == 1003 ||
				code == 1006 ||
				code == 1009 ||
				code == 1030 ||
				code == 1069 ||
				code == 1087 ||
				code == 1135 ||
				code == 1273 ||
				code == 1276 ||
				code == 1279 ||
				code == 1282
			) {
				app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
				btn.style.background = "#fa6d1b";
				if (timeOfDay == "night") {
					btn.style.background = "#181e27";
					app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy1.avif)`;
				}
			} else if (
				code == 1063 ||
				code == 1069 ||
				code == 1072 ||
				code == 1150 ||
				code == 1153 ||
				code == 1180 ||
				code == 1183 ||
				code == 1186 ||
				code == 1189 ||
				code == 1192 ||
				code == 1195 ||
				code == 1204 ||
				code == 1207 ||
				code == 1240 ||
				code == 1243 ||
				code == 1246 ||
				code == 1252
			) {
				app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.avif)`;
				btn.style.background = "#647d75";
				if (timeOfDay == "night") {
					btn.style.background = "#325c80";
					app.style.backgroundImage = `url(./images/${timeOfDay}/rainy1.avif)`;
				}
			} else {
				app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.avif)`;
				btn.style.background = "#4d72aa";
				if (timeOfDay == "night") {
					btn.style.background = "#1b1b1b";
					app.style.backgroundImage = `url(./images/${timeOfDay}/snowy1.avif)`;
				}
			}
			app.style.opacity = "1";
		})
		.catch(() => {
			alert('city not found, please try again');
			app.style.opacity = "1";
		});

}

function getUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			position => {
				const lat = position.coords.latitude;
				const lon = position.coords.longitude;
				fetchWeatherData(lat, lon);
			},
			error => {
				if (error.code === error.PERMISSION_DENIED) {
					alert('Location access denied. Showing weather for the default city.');
				}
				fetchWeatherData(); // Fallback to default city if location access is denied
			}
		);
	} else {
		fetchWeatherData(); // Fallback if browser doesn't support Geolocation API
	}
}

getUserLocation();
app.style.opacity = "1";

//Set an interval to refresh the weather data every 5 minutes (600000 milliseconds)
setInterval(() => {
    fetchWeatherData();
}, 300000); // 300000 ms = 5 minutes
