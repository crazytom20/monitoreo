import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from './LOGO2.png';


const Header = () => {
    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="shadow" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            height: '100px'
        }}>
            <Navbar.Brand href="#" onClick={() => navigate("/")} style={{ marginLeft: '15px', display: 'flex', alignItems: 'center' }}>
                <img 
                    src={logo}
                    width="50"
                    height="50"
                    className="d-inline-block align-top"
                    alt="Logo de Mi Aplicación" 
                />
                <span style={{ marginLeft: '10px', color: 'green', fontWeight: 'bold' }}>MONITOREO</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar>
                <Nav className="ml-auto" style={{ paddingRight: '15px', marginLeft: 'auto' }}>

                    {/* Menú Concurso */}
                    <NavDropdown title={<span style={{ color: 'green' }}>ELEGIR FECHAS</span>} id="concurso-dropdown">                        
                        
                        <NavDropdown.Item onClick={() => navigate("/fecha3")} style={{ color: 'green' }}>2023-11-14</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha4")} style={{ color: 'green' }}>2023-11-16</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha5")} style={{ color: 'green' }}>2023-11-17</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha6")} style={{ color: 'green' }}>2023-11-18</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha2")}style={{ color: 'green' }}>2023-11-19</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha7")}style={{ color: 'green' }}>2023-11-22</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha8")}style={{ color: 'green' }}>2023-11-23</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha9")}style={{ color: 'green' }}>2023-11-25</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha10")}style={{ color: 'green' }}>2023-11-28</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate("/fecha11")}style={{ color: 'green' }}>2023-12-01</NavDropdown.Item>
                
                    </NavDropdown>

                </Nav>
            </Navbar>
        </Navbar>
    );
}

export default Header;
