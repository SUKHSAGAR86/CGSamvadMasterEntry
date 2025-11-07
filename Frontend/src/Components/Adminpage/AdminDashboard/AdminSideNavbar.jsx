import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BsListCheck,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";
import { Collapse } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminSideNavbar = ({ isCollapsed, toggleSidebar, toggleCollapse }) => {
  const location = useLocation();

  const [isEmDropdownOpen, setIsEmDropdownOpen] = useState(false);
  const [isMasterDropdownOpen, setIsMasterDropdownOpen] = useState(false);

  // List of all routes under the "EM Masters" dropdown
  const emMasterRoutes = [
    "/jobtype",
    "/jobunit",
    "/mapjobtypeproductiontype",
    "/mapvendorcategory",
    "/mapvendorgroup",
    "/mapworktypejobtype",
    "/mapworktypemediatype",
    "/mediatype",
    "/mediaworkitemtype",
    "/productiontype",
    "/ratecalculationon",
    "/ratetype",
    "/ratetypeflag",
    "/timebrand",
    "/vendor",
    "/vendorcategory",
    "/vendorgroup",
    "/vendorsearchcategory",
    "/worktype"
  ];
  // List of all routes under the "Masters" dropdown
  const masterRoutes = [
    "/bankmaster",
    "/basedepartment",
    "/designation",
    "/districtsnew",
    "/division",
    "/employee",
    "/finacialyear",
    "/newspaper",
    "/office",
    "/officelevel",
    "/officeofficer",
    "/officer",
    "/officerlevel",
    "/ratecategory",
    "/texmaster",
    "/unitconvert",
    "/unitmaster",
    "/uploadcategory",
    "/uploadfileextension",
    "/uploadfilesize",
    "/usercreation"


  ];

  // Automatically open the dropdown if the current route is a master route
  useEffect(() => {
    setIsEmDropdownOpen(emMasterRoutes.includes(location.pathname));
    setIsMasterDropdownOpen(masterRoutes.includes(location.pathname));
  }, [location.pathname]);

  // Separate state for Master Entries dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Keep Master Entries dropdown in sync with route
  useEffect(() => {
    setIsDropdownOpen(isMasterDropdownOpen);
  }, [isMasterDropdownOpen]);

  return (
    <div>
      <div>
        {/* Sidebar Navigation */}
        <nav className="nav flex-column p-2">
          {/* EM Master Entry Dropdown Header */}
          <div
            className="nav-link text-white d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setIsEmDropdownOpen((prev) => !prev)}
          >
            <span>
              <BsListCheck className="me-2" />
              {!isCollapsed && "EM Master Entries"}
            </span>
            {!isCollapsed &&
              (isEmDropdownOpen ? <BsChevronUp /> : <BsChevronDown />)}
          </div>

          {/* Animated Dropdown Items */}
          <Collapse in={isEmDropdownOpen}>
            <div
              className="ms-3 sidebar-dropdown"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
            >
              <NavLink to="/jobtype" className="nav-link text-white">{!isCollapsed && "EM Master JobType"}</NavLink>
              <NavLink to="/jobunit" className="nav-link text-white">{!isCollapsed && "EM Master JobUnit"}</NavLink>
              <NavLink to="/mapjobtypeproductiontype" className="nav-link text-white">{!isCollapsed && "Map Jobtype Production Type"}</NavLink>
              <NavLink to="/mapvendorcategory" className="nav-link text-white">{!isCollapsed && "Map Vendor Category"}</NavLink>
              <NavLink to="/mapvendorgroup" className="nav-link text-white">{!isCollapsed && "Map Vendor Group"}</NavLink>
              <NavLink to="/mapworktypejobtype" className="nav-link text-white">{!isCollapsed && "Map WorkTypeJobType"}</NavLink>
              <NavLink to="/mapworktypemediatype" className="nav-link text-white">{!isCollapsed && "Map WorkTypeMediaType"}</NavLink>
              <NavLink to="/mediatype" className="nav-link text-white">{!isCollapsed && "Media Type"}</NavLink>
              <NavLink to="/mediaworkitemtype" className="nav-link text-white">{!isCollapsed && "MediaWorkItemType"}</NavLink>
              <NavLink to="/productiontype" className="nav-link text-white">{!isCollapsed && "Production Type"}</NavLink>
              <NavLink to="/ratecalculationon" className="nav-link text-white">{!isCollapsed && "Rate Calculation On"}</NavLink>
              <NavLink to="/ratetype" className="nav-link text-white">{!isCollapsed && "Rate Type"}</NavLink>
              <NavLink to="/ratetypeflag" className="nav-link text-white">{!isCollapsed && "Rate Type Flag"}</NavLink>
              <NavLink to="/timeband" className="nav-link text-white">{!isCollapsed && "Time Brand"}</NavLink>
              <NavLink to="/vendor" className="nav-link text-white">{!isCollapsed && "Vendor"}</NavLink>
              <NavLink to="/vendorcategory" className="nav-link text-white">{!isCollapsed && "Vendor Category"}</NavLink>
              <NavLink to="/vendorgroup" className="nav-link text-white">{!isCollapsed && "Vendor Group"}</NavLink>
              <NavLink to="/vendorsearchcategory" className="nav-link text-white">{!isCollapsed && "Vendor Search Category"}</NavLink>
              <NavLink to="/worktype" className="nav-link text-white">{!isCollapsed && "Work Type"}</NavLink>
            </div>
          </Collapse>
          {/* EM Master Entry Dropdown Header End */}

          {/* Master Entry Dropdown Header */}
          <div
            className="nav-link text-white d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <span>
              <BsListCheck className="me-2" />
              {!isCollapsed && "Master Entries"}
            </span>
            {!isCollapsed &&
              (isDropdownOpen ? <BsChevronUp /> : <BsChevronDown />)}
          </div>

          {/* Master Entry Animated Dropdown Items */}
          <Collapse in={isDropdownOpen}>
            <div
              className="ms-3 sidebar-dropdown"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
            >
              <NavLink to="/bankmaster" className="nav-link text-white">{!isCollapsed && "Bank Master"}</NavLink>
              <NavLink to="/basedepartment" className="nav-link text-white">{!isCollapsed && "Base Department"}</NavLink>

                <NavLink to="/designation" className="nav-link text-white">{!isCollapsed && "Designation"}</NavLink>
              <NavLink to="/districtsnew" className="nav-link text-white">{!isCollapsed && "Districts New"}</NavLink>
                <NavLink to="/division" className="nav-link text-white">{!isCollapsed && "Division"}</NavLink>
              <NavLink to="/employee" className="nav-link text-white">{!isCollapsed && "Employee"}</NavLink>
                <NavLink to="/financialyear" className="nav-link text-white">{!isCollapsed && "Financial Year"}</NavLink>
              <NavLink to="/newspaper" className="nav-link text-white">{!isCollapsed && "News Paper"}</NavLink>
                <NavLink to="/office" className="nav-link text-white">{!isCollapsed && "Office"}</NavLink>
              <NavLink to="/officelevel" className="nav-link text-white">{!isCollapsed && "Office Level"}</NavLink>
                <NavLink to="/officeofficer" className="nav-link text-white">{!isCollapsed && "Office Officer"}</NavLink>
              <NavLink to="/officerlevel" className="nav-link text-white">{!isCollapsed && "Officer Level"}</NavLink>
  <NavLink to="/ratecategory" className="nav-link text-white">{!isCollapsed && "Rate Category"}</NavLink>
              <NavLink to="/taxmaster" className="nav-link text-white">{!isCollapsed && "Tax Master"}</NavLink>
                <NavLink to="/unitconvert" className="nav-link text-white">{!isCollapsed && "Unit Convert"}</NavLink>
              <NavLink to="/unitmaster" className="nav-link text-white">{!isCollapsed && "Unit Master"}</NavLink>
                <NavLink to="/uploadcategory" className="nav-link text-white">{!isCollapsed && "Upload File Extension"}</NavLink>
              <NavLink to="/uploadfileextension" className="nav-link text-white">{!isCollapsed && "Upload File Size"}</NavLink>
                <NavLink to="/uploadfilesize" className="nav-link text-white">{!isCollapsed && "Upload File Size"}</NavLink>
              <NavLink to="/usercreation" className="nav-link text-white">{!isCollapsed && "User Creation"}</NavLink>

            </div>
          </Collapse>
          {/* Master Entry Dropdown Header End */}
        </nav>

        {/* Collapse Sidebar Button */}
        <div className="mt-auto p-2 border-top">
          <button
            className="btn btn-sm btn-outline-light w-100"
            onClick={toggleCollapse}
          >
            {isCollapsed ? "➡️ Expand" : "⬅️ Collapse"}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-2"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminSideNavbar;
