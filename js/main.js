async function main() {
    console.time("runtime");

    // API call for geo location => [status, message, countryCode, city, lat, lon]
    let ipAPI = await fetch("http://ip-api.com/json/?fields=49362");
    let ipAPIJSON = await ipAPI.json();

    if (ipAPIJSON.status === "fail") {
        // TODO: error handling => ipAPIJSON.message
        return;
    }

    // API call for weather data
    let weatherAPI = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${ipAPIJSON.lat}&lon=${ipAPIJSON.lon}&units=metric&APPID=c10b45d9c21fc69d07bb0361ca76bd05`);
    let weatherAPIJSON = await weatherAPI.json();

    if (weatherAPIJSON.cod !== 200) {
        // TODO: error handling => weatherAPIJSON.message
        return;
    }

    // Extract the needed information
    let weather = {
        "cityAndCountry": `${ipAPIJSON.city}, ${ipAPIJSON.countryCode}`,
        "temperature": Math.floor(weatherAPIJSON.main.temp),
        "temperatureDescription": weatherAPIJSON.weather[0].description,
        "iconSrc": `http://openweathermap.org/img/wn/${weatherAPIJSON.weather[0].icon}@2x.png`,
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

// start JS
main();