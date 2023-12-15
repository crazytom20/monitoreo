import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';

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
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [colorGradient, setColorGradient] = useState(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://108.181.166.127/identiarbol/identiarbolbackend/public/api/datos');
        console.log('API Response:', response.data);

        if (response.data && typeof response.data === 'object') {
          const datos = response.data.datos;

          if (datos && Array.isArray(datos)) {
            const newMarkers = datos.map(item => ({
              position: [parseFloat(item.dat_txt_latitude), parseFloat(item.dat_txt_longitude)],
              name: `${item.dat_txt_latitude}, ${item.dat_txt_longitude}`,
              par_int_id: item.par_int_id,
              humidity: parseFloat(item.dat_txt_value),
              par_txt_name: item.par_txt_name,
              dat_txt_unit: item.dat_txt_unit,
            }));
            setMarkers(newMarkers);

            const groupedData = {};
            newMarkers.forEach(marker => {
              const key = marker.par_int_id;
              if (!groupedData[key]) groupedData[key] = [];
              groupedData[key].push(marker.position);
            });

            const heatMapData = Object.entries(groupedData).map(([key, value]) => ({
              id: key,
              positions: value,
              humidity: newMarkers.find(marker => marker.par_int_id === key)?.humidity || 0,
              dat_txt_value: newMarkers.find(marker => marker.par_int_id === key)?.dat_txt_value || 0,
            }));

            setHeatMapData(heatMapData);

            const colorMapData = {};
            newMarkers.forEach((marker, index) => {
              colorMapData[marker.par_int_id] = getRandomColor();
            });
            setColorMap(colorMapData);

            const maxHumidity = Math.max(...newMarkers.map(marker => marker.dat_txt_value));
            const minHumidity = Math.min(...newMarkers.map(marker => marker.dat_txt_value));
            setColorGradient({ 0.4: 'blue', 0.65: 'lime', 1: 'red' }); // Default gradient

            if (!isNaN(maxHumidity) && !isNaN(minHumidity) && maxHumidity !== minHumidity) {
              setColorGradient({
                0.4: 'blue',
                0.65: 'lime',
                0.8: 'yellow', // Add more color stops as needed
                1: 'red',
              });
            }
          } else {
            console.error('La propiedad "datos" no es un array:', datos);
          }
        } else {
          console.error('La respuesta de la API no es un objeto JSON:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleStyleChange = newStyle => {
    setSelectedStyle(newStyle);
  };

  const handleParIntIdChange = event => {
    const newParIntId = event.target.value;

    const filtered = newParIntId === "all"
      ? markers
      : markers.filter(marker => marker.par_int_id === newParIntId);

    const color = colorMap[newParIntId];

    setFilteredMarkers(filtered);
    setFilteredParIntId(newParIntId);
    setSelectedColor(color);
  };

  const handleHeatMapClick = event => {
    const { lat, lng } = event.latlng;

    const clickedMarker = markers.find(marker => marker.position[0] === lat && marker.position[1] === lng);

    setSelectedMarkerData(clickedMarker);
    // Update selected markers
    setSelectedMarkers([clickedMarker]);
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <MapContainer center={center} zoom={11} style={{ position: 'relative', height: '990px' }}>
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

            <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1001 }}>
              <select onChange={handleParIntIdChange} value={filteredParIntId || ""}>
                <option value="all">All</option>
                {Array.from(new Set(markers.map(marker => marker.par_int_id))).map(parIntId => (
                  <option key={parIntId} value={parIntId}>
                    {parIntId}
                  </option>
                ))}
              </select>
            </div>

            {/* Render selected markers */}
            {selectedMarkers.map(marker => (
              <Marker key={marker.name} position={marker.position}>
                <Popup>
                  <div>
                    <p>{`par_int_id: ${marker.par_int_id}`}</p>
                    <p>{`par_txt_name: ${marker.par_txt_name}`}</p>
                    <p>{`dat_txt_value: ${marker.dat_txt_value}`}</p>
                    <p>{`par_txt_unit: ${marker.dat_txt_unit}`}</p>
                    <p>{`dat_txt_longitude: ${marker.position[1]}`}</p>
                    <p>{`dat_txt_latitude: ${marker.position[0]}`}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            <MapHeatLayer
              heatMapData={heatMapData}
              selectedParIntId={filteredParIntId}
              colorGradient={colorGradient}
              onClick={handleHeatMapClick}
            />
          </MapContainer>
        </div>
      </div>

      {selectedMarkerData && (
        <div className="row">
          <div className="col-12">
            <div className="selected-marker-info">
              <h3>Selected Marker Data</h3>
              <p>par_int_id: {selectedMarkerData.par_int_id}</p>
              <p>par_txt_name: {selectedMarkerData.par_txt_name}</p>
              <p>dat_txt_value: {selectedMarkerData.dat_txt_value}</p>
              <p>par_txt_unit: {selectedMarkerData.dat_txt_unit}</p>
              <p>dat_txt_longitude: {selectedMarkerData.position[1]}</p>
              <p>dat_txt_latitude: {selectedMarkerData.position[0]}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MapHeatLayer = ({ heatMapData, selectedParIntId, colorGradient, onClick }) => {
  const map = useMap();

  

  useEffect(() => {
    const filteredHeatMapData = heatMapData
      .filter(data => selectedParIntId === "all" || String(data.id) === selectedParIntId)
      .flatMap(data => data.positions.map(position => ({ position, humidity: data.humidity })));

    const heatLayer = L.heatLayer(filteredHeatMapData.map(data => [...data.position, data.humidity]), {
      gradient: colorGradient || { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
    }).addTo(map);

    heatLayer.on('click', onClick);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [heatMapData, map, selectedParIntId, colorGradient, onClick]);

  return null;
};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default Visorcuencananay;
