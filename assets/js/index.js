const APIkey = 'HsE4klHCKxFhJsvpec8wbdrB7F2ejkwOQvwdDeF3';
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${APIkey}`;

//* DONE navigation logic

function toggleScreens() {
    const screenButtons = document.querySelectorAll("nav a");
    const screens = document.querySelectorAll("section");
    screenButtons.forEach(button => {
        button.addEventListener("click", () => {
            screenButtons.forEach(screenbutton => {
                screenbutton.classList.remove("bg-blue-500/10", "text-blue-400");
                screenbutton.classList.add("text-slate-300", "hover:bg-slate-800");
            });
            button.classList.remove("text-slate-300", "hover:bg-slate-800");
            button.classList.add("bg-blue-500/10", "text-blue-400");
            screens.forEach(screen => {
                screen.classList.add("hidden");
                if (screen.id === button.dataset.section) {
                    screen.classList.remove("hidden");
                }
            });
        });
    });
}

toggleScreens();


//* DONE Today in space

function displayError() {
    const error = document.getElementById("apod-loading");
    error.classList.remove("hidden");
    document.getElementById("apod-image").classList.add("hidden");
    document.getElementById("apod-image").nextElementSibling.classList.add("hidden");
    const icon = error.querySelector("i");
    icon.querySelector("svg").classList.replace("fa-spinner", "fa-triangle-exclamation");
    icon.querySelector("svg").classList.remove("fa-spin");
    icon.classList.replace("text-blue-400", "text-red-400")
    icon.nextElementSibling.innerHTML = "Failed to load image";
    document.getElementById("apod-title").classList.add("hidden");
    document.getElementById("apod-date-detail").innerHTML = '<i class="far fa-calendar mr-2"></i>Invalid Date';
    document.getElementById("apod-explanation").classList.add("hidden");
    document.getElementById("apod-copyright").classList.add("hidden");
    document.getElementById("apod-date-info").innerHTML = "Invalid Date";
    document.getElementById("apod-date").innerHTML = "Astronomy Picture of the Day - Invalid Date";
}

function hideLoader() {
    document.querySelector("#apod-loading").classList.add("hidden");
    document.querySelector("#apod-image").classList.remove("hidden");
}

function showLoader() {
    const loading = document.getElementById("apod-loading");
    const icon = loading.querySelector("i");
    icon.querySelector("svg").classList.replace("fa-triangle-exclamation", "fa-spinner");
    icon.querySelector("svg").classList.add("fa-spin");
    icon.classList.replace("text-red-400", "text-blue-400");
    icon.nextElementSibling.innerHTML = "Loading today's image...";
    document.getElementById("apod-title").classList.remove("hidden");
    document.getElementById("apod-explanation").classList.remove("hidden");
    document.getElementById("apod-copyright").classList.remove("hidden");
    loading.classList.remove("hidden");
    document.querySelector("#apod-image").classList.add("hidden");
    document.getElementById("apod-title").innerHTML = "Loading...";
    document.getElementById("apod-date-detail").innerHTML = '<i class="far fa-calendar mr-2"></i>Loading...';
    document.getElementById("apod-explanation").innerHTML = "Loading description...";
    document.getElementById("apod-copyright").classList.add("hidden");
    document.getElementById("apod-date-info").innerHTML = "Loading...";
}

function AddEventToAPODButton() {
    const button = document.querySelector('#today-apod-btn');
    button.addEventListener('click', () => {
        setInitialDate();
        getAPOD();
    });
}

async function getAPOD(date = "today") {
    try {
        let data;
        // check if user needs todays date
        if (date == "today") {
            data = await fetch(APOD_URL);
        }
        // check if user needs a custom date
        else {
            data = await fetch(`${APOD_URL}&date=${date}`);
        }

        // get data and display it
        const dataJson = await data.json();
        if (dataJson.code === 400) {
            throw new Error(dataJson.msg);
        }
        else {
            displayAPOD(dataJson);
        }
    }
    catch (err) {
        displayError();
    }
}

function setInitialDate() {
    const dateField = document.getElementById("apod-date-input");
    const date = new Date();
    const dateFormatted = date.toLocaleDateString('us-en', { month: "short", day: "2-digit", year: "numeric" });
    const dateValue = `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`;
    dateField.setAttribute("value", dateValue);
    dateField.value = dateValue;
    dateField.nextElementSibling.innerHTML = dateFormatted;
    dateField.setAttribute("max", dateValue);
}

function displayAPOD(APOD) {

    // displaying image
    let img = document.getElementById('apod-image');
    let newElement;

    if (APOD.media_type === "video") {
        img.nextElementSibling.classList.add("hidden");
        newElement = document.createElement("iframe");
        newElement.src = APOD.url;
        newElement.id = 'apod-image';
        newElement.classList = 'w-full h-full object-cover hidden';
        newElement.allowFullscreen = true;
    } else {
        img.nextElementSibling.classList.remove("hidden");
        newElement = document.createElement("img");
        newElement.classList = 'w-full h-full object-cover hidden';
        newElement.id = 'apod-image';
        newElement.src = APOD.url || "./assets/images/placeholder.webp";
    }

    img.replaceWith(newElement);
    img = newElement;
    img.onload = () => {
        hideLoader();
    }
    img.onerror = () => {
        hideLoader();
    }

    // opening full res img
    APOD.hdurl ?
        img.nextElementSibling.querySelector("button").addEventListener('click', () => {
            window.open(APOD.hdurl);
        }) :
        img.nextElementSibling.querySelector("button").style.display = "none";

    // formatting date
    const dateformatted = new Date(APOD.date).toLocaleDateString(
        "en-us",
        {
            month: "long",
            day: "2-digit",
            year: "numeric"
        }
    );

    // displaying date in all locations
    document.getElementById("apod-date").innerHTML = `Astronomy Picture of the Day - ${dateformatted}`;
    document.querySelector("#apod-date-detail").innerHTML = `<i class="far fa-calendar mr-2"></i> ${dateformatted}`;
    document.getElementById("apod-date-info").innerHTML = `${dateformatted}`;

    // display title
    document.getElementById("apod-title").innerHTML = APOD.title;

    // display explanation
    document.getElementById("apod-explanation").innerHTML = APOD.explanation;

    // display copyrights
    if (APOD.copyright) {
        document.getElementById("apod-copyright").innerHTML = `© ${APOD.copyright}`;
        document.getElementById("apod-copyright").style.remove = "hidden";
    } else { document.getElementById("apod-copyright").classList.add("hidden"); }

    // display media type
    document.getElementById("apod-media-type").innerHTML = APOD.media_type;
}

function setDateChosen() {
    const dateField = document.getElementById("apod-date-input");
    dateField.addEventListener("change", () => {
        dateField.setAttribute("value", dateField.value);
        const dateFormatted = new Date(dateField.value).toLocaleDateString('us-en', { month: "short", day: "2-digit", year: "numeric" });
        dateField.nextElementSibling.innerHTML = dateFormatted;
    });
}

function AddEventToLoadButton() {
    const loadButton = document.getElementById("load-date-btn");
    loadButton.addEventListener("click", () => {
        showLoader();
        getAPOD(document.getElementById("apod-date-input").value);
    });
}

getAPOD();
setInitialDate();
AddEventToAPODButton();
AddEventToLoadButton();
setDateChosen();


//* DONE Launches

const launches_URL = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"

async function getLaunches() {
    const launches = await fetch(launches_URL);
    const launchesJson = await launches.json();
    displayFeatured(launchesJson.results[0]);
    displayLaunches(launchesJson.results);
}

function displayFeatured(featured) {
    const fulldate = new Date(featured.net);
    const date = fulldate.toLocaleDateString('us-en', {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    })
    const time = fulldate.toLocaleTimeString('us-en', {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "utc",
        timeZoneName: "short",
    });
    const daysRemaining = Math.ceil((fulldate - new Date()) / (1000 * 60 * 60 * 24));
    document.querySelector("#featured-launch #status").innerHTML = featured.status.abbrev;
    document.querySelector("#featured-launch #title").innerHTML = featured.name;
    document.querySelector("#featured-launch #service-prodvider").innerHTML = featured.launch_service_provider.name;
    document.querySelector("#featured-launch #name").innerHTML = featured.rocket.configuration.name;
    document.querySelector("#featured-launch #launch-date").innerHTML = date;
    document.querySelector("#featured-launch #launch-time").innerHTML = time;
    document.querySelector("#featured-launch #location").innerHTML = featured.pad.location.name;
    document.querySelector("#featured-launch #country").innerHTML = featured.pad.country.name;
    document.querySelector("#featured-launch #description").innerHTML = featured.mission.description;

    const daysLeft = document.querySelector("#featured-launch #days-left");
    if (daysRemaining > 0) {
        daysLeft.classList.remove("hidden");
        daysLeft.querySelector("div p:first-child").innerHTML = daysRemaining;
    }
    else {
        daysLeft.classList.add("hidden");
    }

    const img = document.querySelector("#featured-launch #rocket-img");
    featured.image.image_url ?
        img.src = featured.image.image_url :
        img.src = "./assets/images/launch-placeholder.png";
    img.onerror = () => {
        img.src = "./assets/images/launch-placeholder.png";
    }
    img.alt = featured.name;
}

function displayLaunches(launches) {
    let blackbox = ``;
    for (let i = 1; i < launches.length; i++) {
        const fulldate = new Date(launches[i].net);
        const date = fulldate.toLocaleDateString('us-en', {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
        const time = fulldate.toLocaleTimeString('us-en', {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "utc",
            timeZoneName: "short",
        });
        blackbox += `
        <div
            class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
            <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                <img src= ${launches[i].image.image_url ? launches[i].image.image_url : '/assets/images/launch-placeholder.png'} alt="Falcon 9 Block 5 | Pandora / Twilight rideshare mission" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute top-3 right-3">
                <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                    ${launches[i].status.abbrev}
                </span>
                </div>
            </div>
            <div class="p-5">
                <div class="mb-3">
                <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    ${launches[i].name}
                </h4>
                <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${launches[i].launch_service_provider.name}
                </p>
                </div>
                <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${date}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${time}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launches[i].rocket.configuration.name}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${launches[i].pad.location.name}</span>
                </div>
                </div>
                <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                    Details
                </button>
                <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <i class="far fa-heart"></i>
                </button>
                </div>
            </div>
        </div>
        `
    }
    document.querySelector("#launches-grid").innerHTML = blackbox;
    document.querySelectorAll("#launches-grid img").forEach(img => {
        img.onerror = () => {
            img.src = "./assets/images/launch-placeholder.png";
        };
    });
}

getLaunches();


// TODO: PLANETS

const planets_URL = "https://solar-system-opendata-proxy.vercel.app/api/planets";

function addEventToPlanets(){
    document.querySelectorAll("#planets-grid .planet-card").forEach(card => {
        card.addEventListener("click", () => {
            getPlanet(card.dataset.planetId);
        });
    });
}

let planetsData;
(async function getPlanetData(){
    const planets = await fetch(planets_URL);
    const planetsJson = await planets.json();
    planetsData = planetsJson;
})();

function getPlanet(planet){
    planetsData.bodies.forEach(planetJson => {
        if (planetJson.englishName.toLowerCase() === planet) {
            displayPlanet(planetJson);
            return;
        }
    });
}

function displayPlanet(planetData){
    console.log(planetData);
    document.querySelector("#planet-detail-image").src = `./assets/images/${planetData.englishName.toLowerCase()}.png`;
    document.querySelector("#planet-detail-name").innerHTML = planetData.englishName;
    document.querySelector("#planet-detail-description").innerHTML = planetData.description;
    document.querySelector("#planet-distance").innerHTML = (planetData.semimajorAxis / 1000000).toFixed(1) + "M km";
    document.querySelector("#planet-radius").innerHTML = Math.round(planetData.meanRadius) + " km";
    document.querySelector("#planet-mass").innerHTML = `${planetData.mass.massValue} x 10<sup>${planetData.mass.massExponent}</sup> kg`;
    document.querySelector("#planet-density").innerHTML = (planetData.density).toFixed(2) + " g/cm³";
    document.querySelector("#planet-orbital-period").innerHTML = (planetData.sideralOrbit).toFixed(2) + " days";
    document.querySelector("#planet-rotation").innerHTML = (planetData.sideralRotation).toFixed(2) + " hours";
    document.querySelector("#planet-moons").innerHTML = planetData.moons ? planetData.moons.length : "0";
    document.querySelector("#planet-gravity").innerHTML = planetData.gravity + " m/s²";


    document.querySelector("#planet-discoverer").innerHTML = planetData.discoveredBy ? planetData.discoveredBy : "Known since antiquity";
    document.querySelector("#planet-discovery-date").innerHTML = planetData.discoveryDate ? planetData.discoveryDate : "Ancient times";
    document.querySelector("#planet-body-type").innerHTML = planetData.bodyType;
    document.querySelector("#planet-volume").innerHTML = `${planetData.vol.volValue} x 10<sup>${planetData.vol.volExponent}</sup> km³`;
    
    
    document.querySelector("#planet-perihelion").innerHTML = (planetData.perihelion/1000000).toFixed(1) + "M km";
    document.querySelector("#planet-aphelion").innerHTML = (planetData.aphelion/1000000).toFixed(1) + "M km";
    document.querySelector("#planet-eccentricity").innerHTML = planetData.eccentricity;
    document.querySelector("#planet-inclination").innerHTML = (planetData.inclination).toFixed(2) + "°";
    document.querySelector("#planet-axial-tilt").innerHTML = (planetData.axialTilt).toFixed(2) + "°";
    document.querySelector("#planet-temp").innerHTML = planetData.avgTemp + "°C";
    document.querySelector("#planet-escape").innerHTML = (planetData.escape/1000).toFixed(2) + " km/s";
}

addEventToPlanets();