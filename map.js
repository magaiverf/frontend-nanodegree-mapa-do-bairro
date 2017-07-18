var map;
var markers = [];
var largeInfowindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -29.913258, lng: -51.186192},
        zoom: 13
    });

    largeInfowindow = new google.maps.InfoWindow();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < barberShops.length; i++) {
        // Get the position from the location array.
        var position = { lat: barberShops[i].lat, lng: barberShops[i].lng };
        var title = barberShops[i].name;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            barberShop: barberShops[i]
        });
        
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
    }

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {         
            getSuggestionBeard();     
            
            // set animations
            marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function() {
                marker.setAnimation(null);
            }, 3000);

            // Clear the infowindow content to give the streetview time to load.
            infowindow.marker = marker;
            infowindow.setContent(`
                <div>
                    <h1>${marker.title}</h1>
                    <p>${marker.barberShop.address}</p>
                    <p>${marker.barberShop.phone}</p>
                    <p>${marker.barberShop.info}</p>
                    <div id="suggestionImg">
                        <p>Suggestion:</p>
                    </div>
                </div>
            `);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }

        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }

    function getSuggestionBeard() {
        var url  = `https://pixabay.com/api/?key=5892711-e00266706940738350c6eaa7d&q=beard+man&image_type=photo`;

        $.ajax({
            method: 'GET',
            url: url,
            success: function(data) {
                // get a image from the result, by default the result return 20 images
                var id = _.random(0, 19);

                var objImg = data.hits[id];
                $('#suggestionImg').append($('<img>').attr('src', objImg.previewURL));                            
            },
            error: function() {
                $('#suggestionImg').append($('<p>').text('Error on load suggestion image, please try again later.'));
            }
        });
    }

    $('#btnFilter').click(function() {
        var filter = $('#filter').val();
        
        // hide all markers
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        var bounds = new google.maps.LatLngBounds();

        if (filter.length > 0) {
            var selectedMarkers = _.filter(markers, function(b){ 
                return _.includes(b.title.toLowerCase(), filter.toLowerCase()); 
            });
            
            showMarkers(selectedMarkers, bounds);
        } else {
            showMarkers(markers, bounds);
        }
        
        map.fitBounds(bounds);
    });

    function showMarkers(markers, bounds) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);                        
        }
    }

    $(document).on("click", ".barberShops a", function() {
        var barberShop = $(this).text();

        var marker = _.find(markers, function(m) {
            return m.title === barberShop;
        });                                       

        populateInfoWindow(marker, largeInfowindow);                    
    });
}