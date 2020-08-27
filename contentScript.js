const latLngSelector = '#reveal-card > div > div.widget-reveal-card-container > button.link-like.widget-reveal-card-lat-lng'
const exitButtonSelector = '#reveal-card > div > button.widget-reveal-card-close > span'

const geocodeUrl = 'https://us1.locationiq.com/v1/reverse.php?key=dca29e623666fc&format=json&zoom=14'
const geocodeLookups = ['suburb', 'hamlet', 'locality', 'village', 'town', 'county', 'city']

function closeLatLngDisplay() {
    setTimeout(() => {
        document.querySelector(exitButtonSelector).click()
    }, 100)
}

const scene = document.querySelector('#scene')
scene.addEventListener('click', e => {
    const latLngDisplay = document.querySelector(latLngSelector)

    if(latLngDisplay.textContent) {
        addLocation(latLngDisplay.textContent)
    }
    closeLatLngDisplay()
})

const list = {}
const panel = document.createElement('div')
panel.className = 'panel'

function createLocationElement(latLng) {
    const item = document.createElement('div')
    item.className = 'item'
    item.textContent = latLng

    const input = document.createElement('input')
    input.addEventListener('keypress', e => {
        list[latLng] = input.value
    })
    item.appendChild(input)
    panel.appendChild(item)
    return input
}

async function addLocation(latLng) {
    const input = createLocationElement(latLng)
    panel.scrollTop = panel.scrollHeight

    const [lat, lon] = latLng.split(',')
    const response = await fetch(geocodeUrl + `&lat=${lat}&lon=${lon}`)
    const result = await response.json()
    
    const a = result.address
    for(const area of geocodeLookups) {
        if(a[area]) {
            input.value = a[area]
            list[latLng] = a[area]
            return
        }
    }
    input.value = 'Undefined value'
    list[latLng] = 'Undefined value'
}
document.body.appendChild(panel)
