import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Monitoreo from './Views/monitoreo';
import Fecha2 from './Views/fecha2';
import Fecha3 from './Views/fecha3';
import Fecha4 from './Views/fecha4';
import Fecha5 from './Views/fecha5';
import Fecha6 from './Views/fecha6';
import Fecha7 from './Views/fecha7';
import Fecha8 from './Views/fecha8';
import Fecha9 from './Views/fecha9';
import Fecha10 from './Views/fecha10';
import Fecha11 from './Views/fecha11';


function App() {
  return (
    <Router basename='/monitoreo'  >
  
      <Routes>
        <Route path="/" element={<Monitoreo />} />
        <Route path="/fecha2" element={<Fecha2 />} />
        <Route path="/fecha3" element={<Fecha3 />} />
        <Route path="/fecha4" element={<Fecha4 />} />
        <Route path="/fecha5" element={<Fecha5 />} />
        <Route path="/fecha6" element={<Fecha6 />} />
        <Route path="/fecha7" element={<Fecha7 />} />
        <Route path="/fecha8" element={<Fecha8 />} />
        <Route path="/fecha9" element={<Fecha9 />} />
        <Route path="/fecha10" element={<Fecha10 />} />
        <Route path="/fecha11" element={<Fecha11 />} />
      </Routes>

  </Router>
  );
}

export default App;
