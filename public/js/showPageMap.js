// convert back the string to an object so we can access to data
const goodCampground = JSON.parse(campground);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: goodCampground.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
});

//add controls to the map
map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(goodCampground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${goodCampground.title}</h3><p>${goodCampground.location}</p>`
            )
    )
    .addTo(map);

