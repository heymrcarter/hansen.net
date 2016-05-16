var GoogleMap = React.createClass({
    propTypes: {
        address: React.PropTypes.string,
        id: React.PropTypes.string.isRequired,
        zoom: React.PropTypes.number.isRequired,
        coordinates: React.PropTypes.object
    },

    componentDidMount: function () {
        var GMap = google.maps.Map;
        var props = this.props;
        
        if (props.address) {
            this.geocodeAddress(props.address, function (latlng) {
                new GMap(document.getElementById(props.id), {
                    zoom: props.zoom,
                    center: latlng
                });
            });
        }

        if (props.coordinates) {
            var latlng = new google.maps.LatLng(props.coordinates.Lat, props.coordinates.Lng);

            new GMap(document.getElementById(props.id), {
                zoom: props.zoom,
                center: latlng
            });
        }
        
    },

    render: function () {
        return (
            <div id={this.props.id}></div>
        );
    },

    geocodeAddress: function (address, callback) {
        var geocoder = new google.maps.Geocoder();
        var requestObj = { address: address };
        var statusTypes = google.maps.GeocoderStatus;

        geocoder.geocode(requestObj, function (results, status) {
            var result = results[0];

            if (status === statusTypes.OK) {
                console.log(result.geometry.location.toJSON());
                callback(result.geometry.location);
            } else {
                callback(new Error('Geocoder error: ' + status));
            }            
        });
    }
});

ReactDOM.render(<GoogleMap coordinates={{Lat: 38.252526, Lng: -85.795454}} id='map' zoom={18} />, document.getElementById('hansen-map'));