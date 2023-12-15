import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, LayersControl, useMap,Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';
//import geojsonRios2 from './mostrarpol/hola.json';

const center = {
  lat: -3.7491200,
  lng: -73.2538300,
};




const Visorcuencananay = () => {
  const googleApiKey = "AIzaSyA68xOsLic_QKxD4EcnwZDrtv-iE09-95M";
  const mapStyles = {
    Aubergine: require("./Stylemaps/aubergine-map-style.json"),
    Dark: require("./Stylemaps/dark-map-style.json"),
    Retro: require("./Stylemaps/retro-map-style.json"),
    Night: require("./Stylemaps/night-map-style.json"),
    Estandar: require("./Stylemaps/standard-map-style.json"),
  };

  const [selectedStyle, setSelectedStyle] = useState("Aubergine");
  const [markers, setMarkers] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);
  const [filteredParIntId, setFilteredParIntId] = useState("all");
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);





/* vista puntos  */
//const [riosCoordinates2, setRiosCoordinates2] = useState([]);
/* 
useEffect(() => {
  if (
    geojsonRios2.features &&
    Array.isArray(geojsonRios2.features) &&
    geojsonRios2.features.length > 0
  ) {
    const riosFeatures = geojsonRios2.features
      .filter((feature) => feature.geometry && feature.geometry.type === 'Point');

    if (Array.isArray(riosFeatures) && riosFeatures.length > 0) {
      setRiosCoordinates2(riosFeatures);
    } else {
      setRiosCoordinates2([]);
    }
  } else {
    setRiosCoordinates2([]);
  }
}, []); */







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


       
        // ...

{/* {Array.isArray(riosCoordinates2) &&
  riosCoordinates2.map((feature, pointIndex) => {
    const { coordinates } = feature.geometry;
    const { dat_txt_value, Marca } = feature.properties;

    const lat = coordinates[1];
    const lng = coordinates[0];

    // Create circular coordinates
    const numPoints = 20; // Number of points on the circumference of the circle
    const radius = 0.0001; // Adjust the radius as needed

    const circleCoordinates = Array.from({ length: numPoints }).map((_, index) => {
      const angle = (360 / numPoints) * index;
      const x = lat + radius * Math.cos((angle * Math.PI) / 180);
      const y = lng + radius * Math.sin((angle * Math.PI) / 180);
      return [x, y];
    });

    // Close the circle by adding the first point to the end
    circleCoordinates.push(circleCoordinates[0]);

    return (
      <Polygon
        key={`rios-circle-${pointIndex}`}
        positions={circleCoordinates}
        fillColor="red"
        color="red"
        weight={15}
        fillOpacity={5}
      >
        <Popup>
          <div>
            <strong>Puntos</strong>
            <p>Nombre: {dat_txt_value}</p>
          
          </div>
        </Popup>
      </Polygon>
    );
  })} */}
  
// ...


     
     
     
     
     
      </MapContainer>
    </>
  );
};


export default Visorcuencananay; 