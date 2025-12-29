const APIkey = 'HsE4klHCKxFhJsvpec8wbdrB7F2ejkwOQvwdDeF3';
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${APIkey}`;

function error() {
    const error = document.getElementById("apod-loading");
    document.getElementById("apod-image").classList.add("hidden");
    console.log(error);
}
error()

function hideLoader() {
    document.querySelector("#apod-loading").classList.add("hidden");
    document.querySelector("#apod-image").classList.remove("hidden");
}

function showLoader() {
    document.querySelector("#apod-loading").classList.remove("hidden");
    document.querySelector("#apod-image").classList.add("hidden");
    document.getElementById("apod-title").innerHTML = "Loading...";
    document.getElementById("apod-date-detail").innerHTML = '<i class="far fa-calendar mr-2"></i>Loading...';
    document.getElementById("apod-explanation").innerHTML = "Loading description...";
    document.getElementById("apod-copyright").classList.add("hidden");
    document.getElementById("apod-explanation").innerHTML = "Loading description...";
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
        displayAPOD(dataJson);
    }
    catch (err) {
        console.log(err);
        hideLoader();
    }
}

function setInitialDate() {
    const dateField = document.getElementById("apod-date-input");
    const date = new Date();
    const dateFormatted = date.toLocaleDateString('us-en', { month: "short", day: "2-digit", year: "numeric" });
    const dateValue = `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`;
    dateField.setAttribute("value", dateValue);
    dateField.value = dateValue;
    dateField.nextElementSibling.innerHTML = dateFormatted
}

function displayAPOD(APOD) {

    // displaying image
    const img = document.getElementById('apod-image');
    img.onload = () => {
        hideLoader();
    }
    img.onerror = () => {
        hideLoader();
    }
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