var react = require('react');
var ReactDOM = require('react-dom');
google = google || window.google;

var GoogleMap = react.createClass({
    propTypes: {
        address: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        zoom: React.PropTypes.number.isRequired
    },

    componentDidMount: function () {
        var GMap = google.maps.Map;
        var MapEvents = google.maps.MapEvents;

        MapEvents.addDomListener(window, 'load', function () {
            this.geocodeAddress(this.props.address, function (latlng) {
                new GMap(document.getElementById(this.props.id), {
                    zoom: this.props.zoom,
                    center: latlng
                });
            });
        });
    },

    render: function () {
        return (
            <div id={this.props.id}></div>
        );
    },

    geocodeAddress: function (address, callback) {
        var geocoder = new google.maps.geocoder();
        var requestObj = { address: address };
        var statusTypes = google.maps.GeocoderStatus;

        geocoder.geocode(requestObj, function (results, status) {
            var result = results[0];

            if (status === statusTypes.ERROR) {
                callback(new Error('Geocoder error: ' + result));
            }

            callback(result.geometry.location);
        });
    }
});

module.exports = GoogleMap;

ReactDOM.render(<GoogleMap address='2612 W Chestnut St. Louisville, KY 40211' id='map' zoom={18} />, document.getElementById('hansen-map'));