function initMap() {
    const mapOptions = {
        zoom: 2,
        center: { lat: 0, lng: 0 },
        mapTypeId: 'roadmap',
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
        },
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const legend = document.getElementById('legend');
    const mapTypeSelect = document.getElementById('map-type');
    const eqTypeSelect = document.getElementById('eq-type');
    const clusterCheckbox = document.getElementById('cluster');

    // Función para cargar los datos de terremotos desde USGS
    function loadEarthquakeData() {
        // ... Código de carga de datos de terremotos ...

        // Objeto para agrupar terremotos cercanos
        const markerCluster = new MarkerClusterer(map, [], {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        });

        // Recorre los terremotos y marca cada uno en el mapa
        data.features.forEach((quake) => {
            const coords = quake.geometry.coordinates;
            const magnitude = quake.properties.mag;
            const location = quake.properties.place;
            const date = new Date(quake.properties.time).toLocaleString();

            // Filtrar terremotos según el tipo seleccionado
            if (
                (eqTypeSelect.value === 'all' ||
                    (eqTypeSelect.value === 'significant' && magnitude >= 6) ||
                    magnitude >= parseFloat(eqTypeSelect.value))
            ) {
                const earthquakeIcon = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: 'red',
                    fillOpacity: 0.7,
                    strokeWeight: 1,
                    strokeColor: 'black',
                };

                const marker = new google.maps.Marker({
                    position: { lat: coords[1], lng: coords[0] },
                    map: map,
                    title: 'Magnitud ' + magnitude + ' - ' + location,
                    icon: earthquakeIcon,
                });

                let markerSize = 'small';
                if (magnitude >= 5 && magnitude < 7) {
                    markerSize = 'medium';
                } else if (magnitude >= 7) {
                    markerSize = 'large';
                }

                const infowindow = new google.maps.InfoWindow({
                    content:
                        `<div class="earthquake-details">` +
                        `<p>Magnitud: ${magnitude}</p>` +
                        `<p>Lugar: ${location}</p>` +
                        `<p>Fecha: ${date}</p>` +
                        `</div>`,
                });

                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                });

                // Agregar marcador al grupo de agrupación
                markerCluster.addMarker(marker);

                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.innerHTML = `
                    <div class="circle ${markerSize}"></div>
                    <span>Magnitud ${magnitude}</span>
                `;
                legend.appendChild(legendItem);
            }
        });
    }

    loadEarthquakeData();
}
