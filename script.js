const apiKey = "4314e4106afd75081eacaa268c3fc071";

window.onload = function () {

    const searchBtn = document.getElementById("searchBtn");
    const cityInput = document.getElementById("cityInput");
    const weatherResult = document.getElementById("weatherResult");
    const historyDiv = document.getElementById("history");
    const consoleOutput = document.getElementById("consoleOutput");

    loadHistory();

    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();

        if (!city) {
            alert("Please enter a city name");
            return;
        }

        getWeather(city);
    });

    async function getWeather(city) {

        log("1️⃣ Sync Start");

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        try {
            log("2️⃣ Start Fetching");

            const response = await fetch(url);

            log("3️⃣ Fetch Completed");

            if (!response.ok) {
                throw new Error("City not found or API error");
            }

            const data = await response.json();

            log("4️⃣ Data Received");

            displayWeather(data);
            saveToHistory(city);

        } catch (error) {
            weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
            log("❌ Error: " + error.message);
        }

        log("5️⃣ Sync End\n");
    }

    function displayWeather(data) {
        weatherResult.innerHTML = `
            <p><strong>City:</strong> ${data.name}, ${data.sys.country}</p>
            <p><strong>Temp:</strong> ${data.main.temp} °C</p>
            <p><strong>Weather:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
        `;
    }

    function saveToHistory(city) {
        let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

        if (!history.includes(city)) {
            history.push(city);
            localStorage.setItem("weatherHistory", JSON.stringify(history));
        }

        loadHistory();
    }

    function loadHistory() {
        historyDiv.innerHTML = "";

        let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

        history.forEach(city => {
            const btn = document.createElement("button");
            btn.textContent = city;
            btn.onclick = () => getWeather(city);
            historyDiv.appendChild(btn);
        });
    }

    function log(message) {
        consoleOutput.innerHTML += message + "\n";
        console.log(message);
    }
};