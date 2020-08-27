// selectors to get relevant google maps elements
const latLngSelector = '#reveal-card > div > div.widget-reveal-card-container > button.link-like.widget-reveal-card-lat-lng'
const exitButtonSelector = '#reveal-card > div > button.widget-reveal-card-close > span'

// url for geocoder and relevant strings to check in the address property of the response
const geocodeUrl = 'https://us1.locationiq.com/v1/reverse.php?key=dca29e623666fc&format=json&zoom=14'
const geocodeLookups = ['suburb', 'hamlet', 'locality', 'village', 'town', 'county', 'city']

// close the google maps latLng display; this saves the user a click having to do it themselves every single time
function closeLatLngDisplay() {
    setTimeout(() => {
        document.querySelector(exitButtonSelector).click()
    }, 100)
}

// event listener to register relevant clicks and run the script
const scene = document.querySelector('#scene')
scene.addEventListener('click', e => {
    const latLngDisplay = document.querySelector(latLngSelector)

    if(latLngDisplay.textContent) {
        addLocation(latLngDisplay.textContent)
    }
    closeLatLngDisplay()
})

// append an element to the panel representing a location; returns the input so it can be accessed
function createLocationElement(latLng) {
    const item = document.createElement('div')
    item.className = 'item'
    item.textContent = latLng

    const input = document.createElement('input')
    // allow the user to manually override the geocoder
    input.addEventListener('keypress', e => {
        list[latLng] = input.value
    })
    item.appendChild(input)
    panel.appendChild(item)
    return input
}

// add a location to the panel by reading the latLng from google maps and using a geocoder to get the name of the place
async function addLocation(latLng) {
    const input = createLocationElement(latLng)
    panel.scrollTop = panel.scrollHeight

    const [lat, lon] = latLng.split(',')
    const response = await fetch(geocodeUrl + `&lat=${lat}&lon=${lon}`)
    const result = await response.json()
    
    // read the response and get the most local property of the place name possible (i.e. prefer the town name over the city name)
    const a = result.address
    for(const area of geocodeLookups) {
        if(a[area]) {
            input.value = a[area]
            list[latLng] = a[area]
            return
        }
    }
    // if this fails, give an undefined value
    input.value = 'Undefined value'
    list[latLng] = 'Undefined value'
}

const list = {}

const panel = document.createElement('div')
panel.className = 'panel'

const copyButton = document.createElement('div')
copyButton.className = 'copyButton'
// lets the user copy the data to the clipboard so that it can be extracted from the extension
copyButton.addEventListener('click', e => {
    navigator.clipboard.writeText(JSON.stringify(list))
})

document.body.appendChild(panel)
document.body.appendChild(copyButton)