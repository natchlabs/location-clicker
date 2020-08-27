const scene = document.querySelector('#scene')
scene.addEventListener('click', e => {
    const text = document.querySelector('#reveal-card > div > div.widget-reveal-card-container > button.link-like.widget-reveal-card-lat-lng')
    console.log(text.textContent)
    if(text.textContent) appendItem(text.textContent)
    setTimeout(() => document.querySelector('#reveal-card > div > button.widget-reveal-card-close > span').click(), 100)
    
    console.log(list)
})

const list = {}
const panel = document.createElement('div')
panel.className = 'panel'

async function appendItem(latLng) {
    const item = document.createElement('div')
    item.className = 'item'
    item.textContent = latLng

    const input = document.createElement('input')
    item.appendChild(input)
    input.addEventListener('keypress', e => {
        list[latLng] = input.value
    })
    panel.appendChild(item)
    panel.scrollTop = panel.scrollHeight

    const url = 'https://us1.locationiq.com/v1/reverse.php?key=dca29e623666fc&format=json&zoom=14'
    const [lat, lon] = latLng.split(',')
    const request = await fetch(url + `&lat=${lat}&lon=${lon}`)
    const response = await request.json()
    console.log(response)
    
    const a = response.address
    const lookups = ['suburb', 'hamlet', 'locality', 'village', 'town', 'county', 'city']
    for(const name of lookups) {
        if(a[name]) {
            input.value = a[name]
            list[latLng] = a[name]
            break
        }
        else {
            input.value = 'Undefined value'
            list[latLng] = 'Undefined value'
        }
    }

}
document.body.appendChild(panel)
