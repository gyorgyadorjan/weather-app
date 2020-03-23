async function main() {
    console.time("runtime");

    // Check if Geolocation is not supported by the browser
    if (!navigator.geolocation) {
        $(".error > p").append("Geolocation is not supported by this browser.");
        $(".sk-chase").addClass("d-none");
        $(".error").removeClass("d-none");
        return;
    }

    // Get geolocation
    let position = await this.getCoordinates().catch((error) => {
        // Error handling for geolocation
        $(".error > p").append(`Error code ${error.code}. ${error.message}.`);
        $(".sk-chase").addClass("d-none");
        $(".error").removeClass("d-none");
    });

    // Stop execution if there was an error with geolocation
    if (!position) return;

    // API call for weather data
    let weatherAPI = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=c10b45d9c21fc69d07bb0361ca76bd05`);
    let weatherAPIJSON = await weatherAPI.json();

    // Error handling for weather data
    if (weatherAPIJSON.cod !== 200) {
        $(".error > p").append(`Error while requesting data from openweathermap!<br/>Error message: ${weatherAPIJSON.message}`);
        $(".sk-chase").addClass("d-none");
        $(".error").removeClass("d-none");
        return;
    }

    // Extract the needed information
    let weather = {
        "cityAndCountry": `${weatherAPIJSON.name}, ${weatherAPIJSON.sys.country}`,
        "temperature": Math.floor(weatherAPIJSON.main.temp * 10) / 10,
        "temperatureDescription": weatherAPIJSON.weather[0].description,
        "iconSrc": `https://openweathermap.org/img/wn/${weatherAPIJSON.weather[0].icon}@2x.png`,
    };

    // Populate weather container with information
    $("h5").append(weather.cityAndCountry);
    $("img").attr({
        src: weather.iconSrc,
        alt: weather.temperatureDescription,
    });
    $("h2").append(`${weather.temperature} °C`);
    $("h6").append(weather.temperatureDescription);

    $(".sk-chase").animate({opacity: 0}, 800, function() {
        // Animation complete
        // Hide loading screen
        $(".sk-chase").addClass("d-none");

        // Show weather container
        $(".weatherContainer").removeClass("d-none");
    });

    console.timeEnd("runtime");
}

// Geolocation promise function
function getCoordinates() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

// start JS
main();