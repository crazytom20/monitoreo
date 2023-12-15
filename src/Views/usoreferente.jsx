import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, LayersControl } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';

const center = {
  lat: -3.7491200,
  lng: -73.2538300,
};

const Fecha2 = () => {
  const googleApiKey = "AIzaSyA68xOsLic_QKxD4EcnwZDrtv-iE09-95M";
  const mapStyles = {
    Aubergine: require("./Stylemaps/aubergine-map-style.json"),
    Dark: require("./Stylemaps/dark-map-style.json"),
    Retro: require("./Stylemaps/retro-map-style.json"),
    Night: require("./Stylemaps/night-map-style.json"),
    Estandar: require("./Stylemaps/standard-map-style.json"),
  };

  const [selectedStyle, setSelectedStyle] = useState("Aubergine");

 


  return (
    <>
      <MapContainer center={center} zoom={13} style={{ height: '100vh' }}>
        <LayersControl position="topright">
          {Object.keys(mapStyles).map(style => (
            <LayersControl.BaseLayer
              key={style}
              checked={style === selectedStyle}
              name={style + ' Map'}
            >
              <ReactLeafletGoogleLayer apiKey={googleApiKey} type="roadmap" styles={mapStyles[style]} />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>

        {/* AGREAGR LO DEMAS POR FAVOR */}
    
      </MapContainer>
    </>
  );
};

export default Fecha2;
