import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import heroImage from "../../assets/images/heroimage.jpg"
import LoginMenu from "./LoginMenu";



import "../../App.css";

const MainPage = () => {
  return (
    <div className="container-fluid">
      {/* style={{ backgroundColor: "#BAD7E9" }} */}
      <div className="text-white fw-bold ps-4 bg-danger">
        <Navbar  className="mb-2 mt-2 ">
          <Navbar.Brand to="/">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd1Y_LHU5cIbQ1GOxw3x6yJVNv9IiGdsJQqZkFC0BnQBsRzJg2Z1Zg2pddadXpycxaDzo&usqp=CAU"
              height="60"
              className="d-inline-block align-top rounded-5"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto pe-4">
              <Nav.Link to="#" className="fw-bold Navitem">
                Home
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Login
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Notice Board
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Advertisement Board
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Report
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Search Hoardings
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Download Forms
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Contact Us
              </Nav.Link>
              <Nav.Link to="#" className="fw-bold Navitem">
                Old View
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <div style={{ position: "relative", width: "100%", height: "22rem", overflow: "hidden" }}>
  <img
    src={heroImage}
    // src={'https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA'}
    alt=""
    style={{
      width: "100%",
      height: "22rem",
  
      display: "block"
    }}
  />
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "22rem",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }}
  />
</div>
<div style={{ position: "absolute",top:200,left:350, color:"white"}}className="text-center" >
    <h1>Welcome to Official Website of <br/>
Chhattisgarh Samvad</h1>
<p>(An Associate Organization of D.P.R. RAIPUR, CHHATTISGARH)</p>
</div>
<LoginMenu/>
 </div>
  );
};

export default MainPage;


