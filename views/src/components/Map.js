import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { API_KEY } from '../utils/auth';
import Pin from './Pin';
//import SearchBar from './SearchBar';

class Map extends Component {
  state = {
    isMarked: false,
    markerCoord: {},
  }

  static defaultProps = {
    center: {
      lat: 49.252738,
      lng: -123.115472
    },
    zoom: 12
  };

  onMapClick = ({ x, y, lat, lng, event }) => {
    this.setState({
      isMarked: true,
      markerCoord: {
        lat: lat,
        lng: lng
      }
    })
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onClick={this.onMapClick}
        >
          <Pin
            lat={this.state.markerCoord.lat}
            lng={this.state.markerCoord.lng}
            text="Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;