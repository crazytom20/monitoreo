import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, LayersControl, useMap,Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';
import geojsonRios2 from './mostrarpol/hola.json';

const center = {
  lat: -3.7491200,
  lng: -73.2538300,
};

const Legend = ({ colors, labels }) => (
  <div style={{ position: 'absolute', bottom: '50px', right: '10px', zIndex: 1001 }}>
    {colors.map((color, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
        <div style={{ width: '20px', height: '20px', backgroundColor: color, marginRight: '5px' }}></div>
        <span>{labels[index]}</span>
      </div>
    ))}
  </div>
);

function getColorByHumidity(humidity) {
  const percentage = parseFloat(humidity);
  if (percentage >= 0 && percentage <= 30) {
    return 'blue'; // Sky Blue for low humidity
  } else if (percentage > 30.00 && percentage <= 60.00) {
    return 'green'; // Lime Green for moderate humidity
  } else if (percentage > 60.00 && percentage <= 80.00) {
    return 'yellow'; // Red for high humidity
  } else if (percentage > 80.00 && percentage <= 90.00) {
    return 'orange'; // Blue for very high humidity
  }else if (percentage > 90.00 && percentage <= 100.00) {
    return 'red'; // Blue for very high humidity
  }
}

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
const [riosCoordinates2, setRiosCoordinates2] = useState([]);

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
}, []);





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://108.181.166.127/identiarbol/identiarbolbackend/public/api/datos');
        console.log('API Response:', response.data);

        if (response.data && typeof response.data === 'object') {
          const datos = response.data.datos;

          if (datos && Array.isArray(datos)) {
            const newMarkers = datos.map(item => ({
              position: [parseFloat(item.dat_txt_latitude), parseFloat(item.dat_txt_longitude), item.dat_txt_value],
              name: `${item.par_int_id},${item.par_txt_name},${item.dat_txt_value},${item.par_txt_unit},${item.dat_txt_latitude}, ${item.dat_txt_longitude}`,
              par_int_id: item.par_int_id,
              humidity: parseFloat(item.dat_txt_value),
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
            }));

            setHeatMapData(heatMapData);

            const colorMapData = {};
            newMarkers.forEach((marker, index) => {
              if (marker.par_int_id === "1") {
                colorMapData[marker.par_int_id] = getColorByHumidity(marker.humidity);
              } else if (marker.par_int_id === "2") {
                // Asigna color para par_int_id 2
                colorMapData[marker.par_int_id] = 'green';// color correspondiente;
              } else if (marker.par_int_id === "3") {
                // Asigna color para par_int_id 3
                colorMapData[marker.par_int_id] = 'purple';// color correspondiente;
              }
              // Agrega más bloques para otros par_int_id según sea necesario
            });
            setColorMap(colorMapData);
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

        {filteredMarkers.map((marker, index) => (
          <CircleMarker
            key={index}
            center={marker.position}
            radius={8}
            
            fillOpacity={0}
            color={'transparent'}
          >
            <Popup>{marker.name}</Popup>
          </CircleMarker>
        ))}
        <MapHeatLayer heatMapData={heatMapData} selectedParIntId={filteredParIntId} />
        <Legend colors={['orange', 'lime', 'red', 'blue', 'black']} labels={['Low Humidity', 'Moderate Humidity', 'High Humidity', 'Very High Humidity', 'Extremely High Humidity']} />
        {Array.isArray(riosCoordinates2) &&
            riosCoordinates2.map((feature, pointIndex) => {
              const { coordinates } = feature.geometry;
              const { Nombre, Tipo, Marca } = feature.properties;

              const lat = coordinates[1];
              const lng = coordinates[0];

              const squareCoordinates = [
                [lat - 0.0001, lng - 0.0001],
                [lat - 0.0001, lng + 0.0001],
                [lat + 0.0001, lng + 0.0001],
                [lat + 0.0001, lng - 0.0001]
              ];

              return (
                <Polygon
                  key={`rios-square-${pointIndex}`}
                  positions={squareCoordinates}
                  fillColor="red"
                  color="red"
                  weight={15}
                  fillOpacity={5}
                >
                  <Popup>
                    <div>
                      <strong>MINERÍA ILEGAL</strong>
                      <p>Nombre: {Nombre}</p>
                      <p>Tipo: {Tipo}</p>
                      <p>Marca: {Marca}</p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

     
     
     
     
     
      </MapContainer>
    </>
  );
};

const MapHeatLayer = ({ heatMapData, selectedParIntId }) => {
  const map = useMap();

  useEffect(() => {
    const filteredHeatMapData = heatMapData
      .filter(data => selectedParIntId === "all" || String(data.id) === selectedParIntId)
      .flatMap(data => data.positions);

    const colorByValue = {};

    filteredHeatMapData.forEach(position => {
      const value = position[2];
      if (!colorByValue[value]) {
        colorByValue[value] = getColorByHumidity(value);
      }
    });

    filteredHeatMapData.forEach(position => {
      const value = position[2];
      const color = colorByValue[value];

      L.circleMarker(position, {
        radius: 8,
        fillColor: color,
        fillOpacity: 0.7,
        color: 'transparent',
      }).addTo(map);
    });

  }, [heatMapData, map, selectedParIntId]);

  return null;
};

export default Visorcuencananay;