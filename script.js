const apiKey = "-------------------------------------------";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const historyDiv = document.getElementById("history");
const consoleOutput = document.getElementById("consoleOutput");

window.onload = function () {
    loadHistory();
};

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
});

async function getWeather(city) {

    consoleOutput.innerHTML += "1️⃣ Sync Start\n";
    console.log("Sync Start");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    console.log("Request URL:", url);

    try {
        consoleOutput.innerHTML += "2️⃣ Start Fetching (Async)\n";
        console.log("Start Fetching");

        const response = await fetch(url);

        consoleOutput.innerHTML += "3️⃣ Fetch Completed\n";
        console.log("Fetch Completed");

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.json();

        consoleOutput.innerHTML += "4️⃣ Data Received\n";
        console.log("Data Received");

        displayWeather(data);
        saveToHistory(city);

    } catch (error) {
        weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
        consoleOutput.innerHTML += "❌ Error: " + error.message + "\n";
        console.log("Error:", error.message);
    }

    consoleOutput.innerHTML += "5️⃣ Sync End\n\n";
    console.log("Sync End");
}

function displayWeather(data) {
    weatherResult.innerHTML = `
        <p><strong>City</strong> <span>${data.name}, ${data.sys.country}</span></p>
        <p><strong>Temp</strong> <span>${data.main.temp} °C</span></p>
        <p><strong>Weather</strong> <span>${data.weather[0].description}</span></p>
        <p><strong>Humidity</strong> <span>${data.main.humidity}%</span></p>
        <p><strong>Wind</strong> <span>${data.wind.speed} m/s</span></p>
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