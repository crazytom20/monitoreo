import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap, CircleMarker, Popup } from 'react-leaflet';
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

const colorPalette = {
  Bajo: 'lightblue',
  Moderado: 'green',
  Alto: 'yellow',
  'Muy alto': 'orange',
  'Extremadamente alto': 'red',
};


//paletas de colores 
  //HUMEDAD
const getHumidityColor = (humidity) => {
  if (humidity <= 30) {
    return colorPalette.Bajo;
  } else if (humidity <= 60) {
    return colorPalette.Moderado;
  } else if (humidity <= 80) {
    return colorPalette.Alto;
  } else if (humidity <= 90) {
    return colorPalette['Muy alto'];
  } else {
    return colorPalette['Extremadamente alto'];
  }
};

  //TEMPERATURA 
  

const Monitoreo = () => {
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
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

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
              humidityColor: getHumidityColor(parseFloat(item.dat_txt_value)),
              par_txt_name: item.par_txt_name,
              par_txt_unit: item.par_txt_unit,
              dat_txt_value: item.dat_txt_value,
              dat_txt_datecreation: item.dat_txt_datecreation.split(' ')[0],
            }));

            setMarkers(newMarkers);
            setOriginalData(newMarkers);

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
              dat_txt_datecreation: newMarkers.find(marker => marker.par_int_id === key)?.dat_txt_datecreation || "",
            }));

            setHeatMapData(heatMapData);

            const colorMapData = {};
            newMarkers.forEach((marker, index) => {
              colorMapData[marker.par_int_id] = marker.humidityColor;
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

            // Obtén las fechas únicas y establece el estado.
            const uniqueDates = Array.from(new Set(newMarkers.map(marker => marker.dat_txt_datecreation)));
            setUniqueDates(uniqueDates);

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

  const handleDateChange = async (event) => {
    const newSelectedDate = event.target.value;

    const filteredByDate = newSelectedDate === "all"
      ? originalData
      : originalData.filter(marker => marker.dat_txt_datecreation === newSelectedDate);

    setFilteredData(filteredByDate);
    setSelectedDate(newSelectedDate);

    const colorMapData = {};
    filteredByDate.forEach((marker, index) => {
      colorMapData[marker.par_int_id] = marker.humidityColor;
    });
    setColorMap(colorMapData);

    const maxHumidity = Math.max(...filteredByDate.map(marker => marker.dat_txt_value));
    const minHumidity = Math.min(...filteredByDate.map(marker => marker.dat_txt_value));
    setColorGradient({ 0.4: 'blue', 0.65: 'lime', 1: 'red' }); // Default gradient

    if (!isNaN(maxHumidity) && !isNaN(minHumidity) && maxHumidity !== minHumidity) {
      setColorGradient({
        0.4: 'blue',
        0.65: 'lime',
        0.8: 'yellow', // Add more color stops as needed
        1: 'red',
      });
    }

    setUniqueDates(Array.from(new Set(filteredByDate.map(marker => marker.dat_txt_datecreation))));

    const groupedData = {};
    filteredByDate.forEach(marker => {
      const key = marker.par_int_id;
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push(marker.position);
    });

    const heatMapData = Object.entries(groupedData).map(([key, value]) => ({
      id: key,
      positions: value,
      humidity: filteredByDate.find(marker => marker.par_int_id === key)?.humidity || 0,
      dat_txt_value: filteredByDate.find(marker => marker.par_int_id === key)?.dat_txt_value || 0,
      dat_txt_datecreation: newSelectedDate,
    }));

    setHeatMapData(heatMapData);
  };

  const handleParIntIdChange = event => {
    const newParIntId = event.target.value;

    const filtered = newParIntId === "all"
      ? filteredData // Usamos filteredData en lugar de markers para mostrar solo los parámetros de la fecha seleccionada
      : filteredData.filter(marker => marker.par_int_id === newParIntId);

    const color = colorMap[newParIntId];

    setFilteredMarkers(filtered);
    setFilteredParIntId(newParIntId);
    setSelectedColor(color);
  };

  const handleHeatMapClick = event => {
    const { lat, lng } = event.latlng;

    const clickedMarker = filteredMarkers.find(marker => marker.position[0] === lat && marker.position[1] === lng);

    setSelectedMarkerData(clickedMarker);
  };

  const handleMarkerClick = (marker) => {
    // Lógica para manejar el clic en el marcador, si es necesario
    console.log('Marker clicked:', marker);
  };

  return (
    <>
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1001 }}>
            <select onChange={handleDateChange} value={selectedDate || ""}>
              <option value="all">FECHAS</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 1001 }}>
              <br />
              <select onChange={handleParIntIdChange} value={filteredParIntId || ""}>
                <option value="all">PARAMETRO</option>
                {Array.from(new Set(filteredData.map(marker => marker.par_int_id))).map(parIntId => (
                  <option key={parIntId} value={parIntId}>
                    {parIntId}
                  </option>
                ))}
              </select>
            </div>

      <MapContainer center={center} zoom={14} style={{ height: '100vh' }}>
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
            <br />



            {filteredMarkers.map(marker => (
              <CircleMarker
                key={marker.name}
                center={marker.position}
                color={'transparent'} // Establecer el color del borde como transparente
                fillColor={'transparent'} // Establecer el color de relleno como transparente
                onClick={() => handleMarkerClick(marker)}
              >
                <Popup>
                  <div>
                    <p>par_int_id: {marker.par_int_id}</p>
                    <p>par_txt_name: {marker.par_txt_name}</p>
                    <p>dat_txt_value: {marker.dat_txt_value}</p>
                    <p>par_txt_unit: {marker.par_txt_unit}</p>
                    <p>dat_txt_datecreation: {marker.dat_txt_datecreation}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            <MapHeatLayer
              filteredHeatMapData={heatMapData}
              selectedParIntId={filteredParIntId}
              colorGradient={colorGradient}
              onClick={handleHeatMapClick}
            />
          </MapContainer>

      {selectedMarkerData && (
        <div className="row">
          <div className="col-12">
            <div className="selected-marker-info">
              <h3>Selected Marker Data</h3>
              <p>par_int_id: {selectedMarkerData.par_int_id}</p>
              <p>par_txt_name: {selectedMarkerData.par_txt_name}</p>
              <p>dat_txt_value: {selectedMarkerData.dat_txt_value}</p>
              <p>par_txt_unit: {selectedMarkerData.par_txt_unit}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MapHeatLayer = ({ filteredHeatMapData, selectedParIntId, colorGradient, onClick }) => {
  const map = useMap();

  useEffect(() => {
    const filteredData = filteredHeatMapData
      .filter(data => selectedParIntId === "all" || String(data.id) === selectedParIntId)
      .flatMap(data => data.positions.map(position => ({ position, humidity: data.humidity })));

      const heatLayer = L.heatLayer(filteredData.map(data => [...data.position, data.humidity]), {
        gradient: colorGradient || { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
      }).addTo(map);
      
      

    heatLayer.on('click', onClick);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [filteredHeatMapData, map, selectedParIntId, colorGradient, onClick]);

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

export default Monitoreo;