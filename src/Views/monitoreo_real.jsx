import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, LayersControl } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';
import Header from './Components/Header';
import { Spinner } from 'react-bootstrap';


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
  // Add more palettes for additional parameters
};


const center = {
  lat: -3.7491200,
  lng: -73.2538300,
};

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
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("Días");
  const [hours, setHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [minutes, setMinutes] = useState([]);
  const [selectedMinutes, setSelectedMinutes] = useState("");
  const [mapPoints, setMapPoints] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState("0");

  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState("");
  const [nodeData, setNodeData] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(""); // Added state for selected node ID


  const [loading, setLoading] = useState(false);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const displayStep = 200; 
  const initialDisplayCount = 100;

  // Define a mapping of parameter IDs to colors
const parameterColors = {
  1: 'red',    // Replace 1 with the actual parameter ID and 'red' with the desired color
  2: 'blue',   // Replace 2 with the actual parameter ID and 'blue' with the desired color
  3: 'orange',
  4: 'green',
  5: 'yellow',
};




// ESTO ES PARA LOS MOSTRAR LA LISTA DE NODOS 
useEffect(() => {
  const fetchNodes = async () => {
    try {
      const response = await fetch('http://108.181.166.127/identiarbol/identiarbolbackend/public/api/nodosmon');
      const data = await response.json();
      setNodes(data.nodes);
    } catch (error) {
      console.error('Error fetching nodes data:', error);
    }
  };

  fetchNodes();
}, []);


//ESTO ES PARA LOS PARAMETROS

  useEffect(() => {
    const fetchParameterData = async () => {
      try {
        const response = await fetch('http://108.181.166.127/identiarbol/identiarbolbackend/public/api/optionsparmon');
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





  //ESTO ES PARA LAS OPCIONES DE LA FECHA

  useEffect(() => {
    // Función para obtener los datos de la primera API
    const fetchDateData = async () => {
      try {
        const response = await fetch('http://108.181.166.127/identiarbol/identiarbolbackend/public/api/optionsmon');
        const data = await response.json();
        setDates(data.dates);
      } catch (error) {
        console.error('Error fetching date data:', error);
      }
    };

    // Llama a la función para obtener los datos al montar el componente
    fetchDateData();
  }, []);

  //ESTO ES PARA LAS HORAS 
  useEffect(() => {
    // Verifica que se haya seleccionado una fecha antes de llamar a la segunda API
    if (selectedDate!=="Días") {
      // Función para obtener los datos de la segunda API
      const fetchHourData = async () => {
        try {
          const response = await fetch(`http://108.181.166.127/identiarbol/identiarbolbackend/public/api/hoursmon/${selectedDate}`);
          const data = await response.json();
          setHours(data.hours);
        } catch (error) {
          console.error('Error fetching hour data:', error);
        }
      };

      // Llama a la función para obtener los datos cuando cambia la fecha seleccionada
      fetchHourData();
    }
  }, [selectedDate]);

  //ESTO ES PARA LOS MINUTOS

  useEffect(() => {
    // Verifica que se haya seleccionado una hora antes de llamar a la tercera API
    if (selectedHour !==null) {
      // Función para obtener los datos de la tercera API
      const fetchMinuteData = async () => {
        try {
          const response = await fetch(`http://108.181.166.127/identiarbol/identiarbolbackend/public/api/minutesmon/${selectedDate}/${selectedHour}`);
          const data = await response.json();
          setMinutes(data.minutes);
        } catch (error) {
          console.error('Error fetching minute data:', error);
        }
      };

      // Llama a la función para obtener los datos cuando cambia la hora seleccionada
      fetchMinuteData();
    }
  }, [selectedHour]);

  //ESTO ES PARA LOS FILTRAR Y MOSTRAR EN EL MAPA LOS PUNTOS 

  // ESTO ES PARA LOS FILTRAR Y MOSTRAR EN EL MAPA LOS PUNTOS 
  useEffect(() => {
    const fetchMapPoints = async () => {
      try {
        setLoading(true);

        // Fetch points only when the date is selected and a node is selected
        if (selectedDate !== "Días" && selectedNode) {
          // Update the API endpoint to fetch data for the selected node
          const response = await fetch(
            `http://108.181.166.127/identiarbol/identiarbolbackend/public/api/ownermon?dates=${selectedDate}&hours=${selectedHour}&minutes=${selectedMinutes}&parameter=${selectedParameter}&node=${selectedNode}`
          );
          const data = await response.json();
          console.log('API Response:', data);
          console.log('Selected Date:', selectedDate);
          console.log('Filtered Points:', mapPoints);
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
  }, [selectedDate, selectedHour, selectedMinutes, selectedParameter, selectedNode]);

  // ...

  useEffect(() => {
    // Incrementally update the displayedPoints
    const interval = setInterval(() => {
      setDisplayedPoints((prev) => Math.min(prev + displayStep, mapPoints.length));
    }, 1000); // Adjust the interval time as needed

    // Clear the interval when all points are displayed
    if (displayedPoints >= mapPoints.length) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup on unmount or when the effect dependencies change
  }, [displayedPoints, mapPoints, selectedDate, selectedHour, selectedMinutes, selectedParameter,selectedNode]);


  return (
    <>
     {/*  <Header /> */}
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
          {/* PARA MOSTRAR EL SELECT DE LOS NODOS */}

{/* PARA MOSTRAR EL SELECT DE LOS NODOS */}
<select onChange={(e) => setSelectedNode(e.target.value)}>
          <option value="">nodo</option>
          {nodes.map((nodes) => (
            <option 
            key={nodes.nod_int_id} 
            value={nodes.nod_int_id}>
              {nodes.nod_txt_code}
            </option>
          ))}
        </select>



          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="Días">Fecha</option>
              {dates.map(date => (
            <option key={date.dated} value={date.dated}>{date.dated}</option>
             ))}
          </select>

<select onChange={(e) => setSelectedParameter(e.target.value)}>
            <option value="">Parámetro</option>
               {parameters.map(parameter => (
             <option
              key={parameter.par_int_id}
              value={parameter.par_int_id}
              //style={{ backgroundColor: parameterColors[parameter.par_int_id] || 'white' }}
            >
              {parameter.par_txt_name}
            </option>
  ))}
</select>

          <select onChange={(e) => setSelectedHour(e.target.value)}>
            <option value="">Hora</option>
            {hours.map(hour => (
              <option key={hour.hours} value={hour.hours}>{hour.hours}</option>
            ))}
          </select>

          <select onChange={(e) => setSelectedMinutes(e.target.value)}>
            <option value="">Minuto</option>
            {minutes.map(minute => (
              <option key={minute.minutes} value={minute.minutes}>{minute.minutes}</option>
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

{mapPoints && mapPoints.map((point, index) => {
  console.log(mapPoints);
  return (
    <CircleMarker
      key={index}
      center={[parseFloat(point.dat_txt_latitude), parseFloat(point.dat_txt_longitude)]}
      radius={5}
      pathOptions={{ 
        fillColor: 'green', 
        weight: 5 
      }}
    >
      <Popup>
        <p>Parámetro: {point.par_int_id}</p>
        <p>Valor: {point.dat_txt_value}, {point.par_txt_unit}</p>
      </Popup>
    </CircleMarker>
  );
})}


        
          </MapContainer>
    </>
  );
};

export default Monitoreo;