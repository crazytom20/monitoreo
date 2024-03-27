import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, LayersControl } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';
import { Spinner } from 'react-bootstrap';
import Header from './Components/Header';
import './Components/css/legend.css'

const center = {
  lat: -3.7491200,
  lng: -73.2538300,
};
 

//COLORES DATOS
const parameterPalettes = {
  1: [
    { range: [0, 30], color: 'lightblue' },
    { range: [31, 60], color: 'green' },
    { range: [61, 80], color: 'yellow' },
    { range: [81, 90], color: 'orange' },
    { range: [91, 100], color: 'red' },
  ],
  2: [
    { range: [20, 29.9], color: 'blue' },
    { range: [30, 33.90], color: 'yellow' },
    { range: [34, 37.90], color: 'lime' },
    { range: [38, 39.90], color: 'pink' },
    { range: [40, 100], color: 'red' },
  ],
  3: [
    { range: [0, 200], color: 'blue' },
    { range: [200, 500], color: 'green' },
    { range: [500, 1000], color: 'yellow' },
    { range: [1000, 2000], color: 'orange' },
    { range: [2000, 5000], color: 'purple' },
  ],
  4: [
    { range: [0, 200], color: 'blue' },
    { range: [200, 500], color: 'green' },
    { range: [500, 1000], color: 'yellow' },
    { range: [1000, 2000], color: 'orange' },
    { range: [2000, 5000], color: 'purple' },
  ],
  5: [
    { range: [0, 2.99], color: 'lime' },
    { range: [3, 5.99], color: 'yellow' },
    { range: [6, 7.99], color: 'orange' },
    { range: [8, 10.99], color: 'red' },
    { range: [11, 50.99], color: 'purple' },
  ]
  // Add more palettes for additional parameters
};


const parameterColorG = {
  1: [
    {color: 'green' },
  ]
  // Add more palettes for additional parameters
};

const Monitoreo = () => {
  const googleApiKey = "AIzaSyCBkSTyfrkxXe5LiYLZZTRtKvQqSHt289Y";
  const mapStyles = {
    Aubergine: require("./Stylemaps/aubergine-map-style.json"),
    Dark: require("./Stylemaps/dark-map-style.json"),
    Retro: require("./Stylemaps/retro-map-style.json"),
    Night: require("./Stylemaps/night-map-style.json"),
    Estandar: require("./Stylemaps/standard-map-style.json"),
  };

  const [selectedStyle, setSelectedStyle] = useState("Aubergine");
  const [apiData, setApiData] = useState([]);
  const [selectedNode, setSelectedNode] = useState('');
  const [optionsData, setOptionsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [hoursData, setHoursData] = useState([]);
  const [selectedHour, setSelectedHour] = useState('');
  const [minutesData, setMinutesData] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const displayStep = 1000; 
  const initialDisplayCount = 100;
  const [selectedMinutes, setSelectedMinutes] = useState("");
  const [parameters, setParameters] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("0");

  // Define a mapping of parameter IDs to colors
  const parameterColors = {
    1: 'red',    // Replace 1 with the actual parameter ID and 'red' with the desired color
    2: 'blue',   // Replace 2 with the actual parameter ID and 'blue' with the desired color
    3: 'orange',
    4: 'green',
    5: 'yellow',
  };
  


// Define los colores y rangos de temperatura para la leyenda
const legendData = {
 
  1: [
    { label: 'LEYENDA' },
    { color: 'lightblue', label: '0-30 %' },
    { color: 'green', label: '31-60 %' },
    { color: 'yellow', label: '61-80 %' },
    { color: 'orange', label: '81-90 %' },
    { color: 'red', label: '91-100 %' },
  ],
  2: [
    { label: 'LEYENDA' },
    { color: 'blue', label: '20-29.9 °C' },
    { color: 'yellow', label: '30-33.9 °C' },
    { color: 'lime', label: '34-37.9 °C' },
    { color: 'pink', label: '38-39.9 °C' },
    { color: 'red', label: '40-100 °C' },
  ],
  3: [
    { label: 'LEYENDA' },
    { color: 'blue', label: '0-200 ppm' },
    { color: 'yellow', label: '200-500 ppm' },
    { color: 'lime', label: '500-1000 ppm' },
    { color: 'pink', label: '1000-2000 ppm' },
    { color: 'red', label: '2000-5000 ppm' },
  ],
  4: [
    { label: 'LEYENDA' },
    { color: 'blue', label: '0-200 ppm' },
    { color: 'yellow', label: '200-500 ppm' },
    { color: 'lime', label: '500-1000 ppm' },
    { color: 'pink', label: '1000-2000 ppm' },
    { color: 'red', label: '2000-5000 ppm' },
  ],
  5: [
    { label: 'LEYENDA' },
    { color: 'lime', label: '0 - 2' },
    { color: 'yellow', label: '3 - 5' },
    { color: 'orange', label: '6 - 7' },
    { color: 'red', label: '8 - 10' },
    { color: 'purple', label: '11 - 50' },
  ],
  // Add legend data for other parameters
};

  // Función para renderizar la leyenda
  // Función para renderizar la leyenda
  const renderLegend = () => (
    <div className="legend">
      {legendData[selectedParameter] && legendData[selectedParameter].map((item, index) => (
        <div key={index} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: item.color }} />
          <div className="legend-label">{item.label}</div>
        </div>
      ))}
    </div>
  );


  //ESTO ES PARA LOS PARAMETROS

  useEffect(() => {
    const fetchParameterData = async () => {
      try {
        const response = await fetch('https://identiarbol.org/identiarbolbackend/public/api/optionsparmon');
        const data = await response.json();
        setParameters(data.parameters);
      } catch (error) {
        console.error('Error fetching parameter data:', error);
      }
    };
  
    fetchParameterData();
  }, []);



  
//ESTO ES PARA SELECCIONAR LOS DIAS, HORAS, MINUTOS
useEffect(() => {
  setDisplayedPoints(0); // Reset displayedPoints when selectedDate, selectedHour, or selectedMinutes changes
}, [selectedDate, selectedHour, selectedMinutes]);



useEffect(() => {
  // Verifica si mapPoints está definido antes de continuar
  if (!mapPoints) {
    return;
  }

  // Incrementa de forma incremental los displayedPoints
  const interval = setInterval(() => {
    setDisplayedPoints((prev) => Math.min(prev + displayStep, mapPoints.length));
  }, 1000); // Ajusta el tiempo del intervalo según sea necesario

  // Limpia el intervalo cuando se muestran todos los puntos
  if (displayedPoints >= mapPoints.length) {
    clearInterval(interval);
  }

  return () => clearInterval(interval); // Limpieza al desmontar o cuando cambien las dependencias del efecto
}, [displayedPoints, mapPoints, selectedDate, selectedHour, selectedMinutes, selectedParameter, selectedNode]);


  
  // Fetch nodes data on component mount(NODOS)
  useEffect(() => {
    const fetchNodesData = async () => {
      try {
        const response = await fetch(
          'https://identiarbol.org/identiarbolbackend/public/api/nodosmon'
        );
        const data = await response.json();
        setApiData(data.node);
      } catch (error) {
        console.error('Error fetching nodes data:', error);
      }
    };

    fetchNodesData();
  }, []);
  // Fetch options data when selectedNode changes(FECHA)
  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        if (selectedNode) {
          const response = await fetch(
            `https://identiarbol.org/identiarbolbackend/public/api/optionsmon/${selectedNode}`
          );
          const data = await response.json();
          setOptionsData(data.dates);
        }
      } catch (error) {
        console.error('Error fetching options data:', error);
      }
    };

    fetchOptionsData();
  }, [selectedNode]);

  // Fetch hours data when selectedDate changes (HORA)
  useEffect(() => {
    const fetchHoursData = async () => {
      try {
        if (selectedDate) {
          const response = await fetch(
            `https://identiarbol.org/identiarbolbackend/public/api/hoursmon/${selectedDate}/${selectedNode}`
          );
          const data = await response.json();
          setHoursData(data.hours);
        }
      } catch (error) {
        console.error('Error fetching hours data:', error);
      }
    };

    fetchHoursData();
  }, [selectedDate, selectedNode]);

  // Fetch minutes data when selectedHour changes(MINUTOS)
  useEffect(() => {
    const fetchMinutesData = async () => {
      try {
        if (selectedHour) {
          const response = await fetch(
            `https://identiarbol.org/identiarbolbackend/public/api/minutesmon/${selectedDate}/${selectedHour}/${selectedNode}`
          );
          const data = await response.json();
          setMinutesData(data.minutes);
        }
      } catch (error) {
        console.error('Error fetching minutes data:', error);
      }
    };

    fetchMinutesData();
  }, [selectedHour, selectedDate, selectedNode]);


  // PARA MOSTRAR LOS PUNTOS EN EL MAPA 
  useEffect(() => {
    const fetchMapPoints = async () => {
      try {
        setLoading(true);
  
        // Fetch points only when the date is selected and a node is selected
        if (selectedDate !== "Días" && selectedNode) {
          // Update the API endpoint to fetch data for the selected node
          const response = await fetch(
            `https://identiarbol.org/identiarbolbackend/public/api/ownermon?dates=${selectedDate}&hours=${selectedHour}&minutes=${selectedMinutes}&parameter=${selectedParameter}&node=${selectedNode}`
          );
          const data = await response.json();
          
  
          setMapPoints(data.puntus);
          setDisplayedPoints(initialDisplayCount);
        }
      } catch (error) {
        console.error('Error fetching map points:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMapPoints();
  }, [selectedDate, selectedHour, selectedMinutes, selectedNode, selectedParameter]);
  

  
  
  return (
    <> <Header />
   
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
       
     
  

        <div style={{ position: 'absolute', top: 10, left: 500, zIndex: 1000 }}>

        <select onChange={(e) => setSelectedParameter(e.target.value)}>
            <option value="">Parámetro</option>
               {parameters.map(parameter => (
             <option
              key={parameter.par_int_id}
              value={parameter.par_int_id}
             // style={{ backgroundColor: parameterColors[parameter.par_int_id] || 'white' }}
            >
              {parameter.par_txt_name}
            </option>
  ))}
</select>


          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
          >
            <option value="">APARATOS</option>
            {apiData && apiData.map((node) => (
              <option key={node.nod_int_id} value={node.nod_int_id}>
                {node.nod_txt_code}
              </option>
            ))}
          </select>

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">FECHA</option>
            {optionsData && optionsData.map((option) => (
              <option key={option.dated} value={option.dated}>
                {option.dated}
              </option>
            ))}
          </select>

          <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}
          >
            <option value="">HORA</option>
            {hoursData && hoursData.map((hour) => (
              <option key={hour.hours} value={hour.hours}>
                {hour.hours}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSelectedMinutes(e.target.value)}>
            <option value="">MINUTO</option>
            {minutesData && minutesData.map((minute) => (
              <option key={minute.minutes} value={minute.minutes}>
                {minute.minutes}
              </option>
            ))}
          </select>

          

        </div>

        {loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', color:'white',transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}

{mapPoints && selectedParameter==0 ? mapPoints

    .map((point, index) => {
    
      // Determine the color based on the parameter ID and value
      let parameterColor = 'black'; // Default to black if no color is found
    
      // Check if the parameter is the one you want to colorize
    
        const value = parseFloat(point.dat_txt_value);
    
        // Find the color range for the selected parameter
        const colorPalette = parameterColorG[point.par_int_id];
    
        if (colorPalette) {
          // Map the value to the corresponding color range
          for (const {color } of colorPalette) {

            console.log(colorPalette);
           
              parameterColor = color;
              break;
            
          }
        } else {
          // Handle the case when the parameter is not found in the color palettes
          // You can choose to set a default color or skip rendering these points
          parameterColor = 'gray'; // Set a default color, or you can use 'return null;' to skip rendering
        }
     
    
      if (parameterColor === 'gray') {
        return null; // Skip rendering points with unknown parameter or use another color as needed
      }
    
      return (
        <CircleMarker
          key={index}
          center={[parseFloat(point.dat_txt_latitude), parseFloat(point.dat_txt_longitude)]}
          radius={5}
          pathOptions={{ 
            fillColor: parameterColor, 
            fillOpacity:1,
            color: parameterColor,
          weight:5 }}
        >
<Popup>
    <h2></h2>
    <p><strong>Parámetro:</strong> {point.par_int_id}</p>
    <p>Valor: {point.dat_txt_value}, {point.par_txt_unit}</p>
    <p>Fecha: {point.dat_txt_datecreation}</p>
</Popup>



        </CircleMarker>
      );
    }): mapPoints &&   mapPoints.slice(0, displayedPoints).map((point, index) => {
     // console.log(point);
      // Determine the color based on the parameter ID and value
      let parameterColor = 'black'; // Default to black if no color is found
    
      // Check if the parameter is the one you want to colorize
      if (point.par_int_id == selectedParameter) {
        const value = parseFloat(point.dat_txt_value);
    
        // Find the color range for the selected parameter
        const colorPalette = parameterPalettes[selectedParameter];
    
        if (colorPalette) {
          // Map the value to the corresponding color range
          for (const { range, color } of colorPalette) {
            if (value >= range[0] && value <= range[1]) {
              parameterColor = color;
              break;
            }
          }
        } else {
          // Handle the case when the parameter is not found in the color palettes
          // You can choose to set a default color or skip rendering these points
          parameterColor = 'gray'; // Set a default color, or you can use 'return null;' to skip rendering
        }
      } else {
        // Handle the case when the point's parameter ID doesn't match the selected parameter
        // You can choose to set a default color or skip rendering these points
        parameterColor = 'gray'; // Set a default color, or you can use 'return null;' to skip rendering
      }
    
      if (parameterColor === 'gray') {
        return null; // Skip rendering points with unknown parameter or use another color as needed
      }
    
      return (
        <CircleMarker
          key={index}
          center={[parseFloat(point.dat_txt_latitude), parseFloat(point.dat_txt_longitude)]}
          radius={5}
          pathOptions={{ 
            fillColor: parameterColor, 
            fillOpacity:1,
            color: parameterColor,
          weight:5 }}
        >
          <Popup>
            <p>Parametro: {point.par_int_id}</p>
            <p>Valor: {point.dat_txt_value},{point.par_txt_unit}</p>
            <p>Fecha: {point.dat_txt_datecreation}</p>
          </Popup>
        </CircleMarker>
      );
    })
        
    
    
}
        
    
{renderLegend()}

      </MapContainer>
    
    </>
  );
};

export default Monitoreo;