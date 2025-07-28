import React from "react";
import { Container, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "../../../App.css"

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/loginpage");
  };

  const handleRegister = () => {
    navigate("/registration");
  };

  return (
    <div className="container-fluid ">
      {/* Navbar */}
      <div className="bg-danger text-white fw-bold ps-4">
        <Navbar expand="lg" className="mb-4 mt-2 ">
          <Navbar.Brand as={Link} to="/">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd1Y_LHU5cIbQ1GOxw3x6yJVNv9IiGdsJQqZkFC0BnQBsRzJg2Z1Zg2pddadXpycxaDzo&usqp=CAU" // ← your image URL here
              alt="Samvad Portal Logo"
              height="60"
              className="d-inline-block align-top rounded-5"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto pe-4">
              <Nav.Link as={Link} to="/designation">
                Designation
              </Nav.Link>
              <Nav.Link as={Link} to="/bankmaster">
                Bank Master
              </Nav.Link>
              <Nav.Link as={Link} to="/basedepartment">
                Base Department
              </Nav.Link>
              <Nav.Link as={Link} to="/employee">
                Employee
              </Nav.Link>

              {/* Dropdown for more links */}
              <NavDropdown
                id="more-nav-dropdown"
                title="More"
                className="bg-danger text-white fw-bold dropdown-menu-center"
         
                style={{ backgroundColor: "#dc3545" }}
              >
                <div className=" dpmenu ">
                  <NavDropdown.Item
                    as={Link}
                    to="/districtsnew"
                    className="bg-danger fw-bold">
                    Districts New
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/division"
                    className="bg-danger fw-bold"
                  >
                    Division
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/financialyear"
                    className="bg-danger fw-bold"
                  >
                    Financial Year
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/newspaper"
                    className="bg-danger fw-bold"
                  >
                    Newspaper
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/office"
                    className="bg-danger fw-bold"
                  >
                    Office
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/officofficer"
                    className="bg-danger fw-bold"
                  >
                    Officofficer
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/officer"
                    className="bg-danger fw-bold"
                  >
                    Officer
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/officerlevel"
                    className="bg-danger fw-bold"
                  >
                    Officerlevel
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/ratecategory"
                    className="bg-danger fw-bold"
                  >
                    RateCategory
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/taxmaster"
                    className="bg-danger fw-bold"
                  >
                    TaxMaster
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/unitconvert"
                    className="bg-danger fw-bold"
                  >
                    UnitConvert
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/unitmaster"
                    className="bg-danger fw-bold"
                  >
                    UnitMaster
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uploadcategory"
                    className="bg-danger fw-bold"
                  >
                    UploadCategory
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uploadfileextension"
                    className="bg-danger fw-bold"
                  >
                    UploadFileExtension
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/uploadfilesize"
                    className="bg-danger fw-bold"
                  >
                    UploadFileSize
                  </NavDropdown.Item>
                </div>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      {/* Main Content */}
      <Container className="text-center">
        <h1 className="mb-4">Welcome to Samvad Portal</h1>
        <p className="lead">Please login or register to continue</p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button variant="primary" onClick={handleLogin}>
            <i className="bi bi-box-arrow-in-right"></i> Login
          </Button>
          <Button variant="success" onClick={handleRegister}>
            <i className="bi bi-person-plus"></i> Register
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;
