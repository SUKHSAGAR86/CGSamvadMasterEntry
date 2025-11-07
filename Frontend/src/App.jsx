import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"

//----------------------Mster Entry start----------------------------------
import DesignationMaster from "./Components/MasterEntry/Designation/DesignationMaster";
import BankMaster from "./Components/MasterEntry/BankMaster/BankMaster";
import BaseDepartment from "./Components/MasterEntry/BaseDepartment/BaseDepartment";
import Division from "./Components/MasterEntry/Division/Division";
import DistrictsNew from "./Components/MasterEntry/DistrictsNew/DistrictsNew";
import FinancialYear from "./Components/MasterEntry/FinancialYear/FinancialYear";
import OfficerLevel from "./Components/MasterEntry/OfficerLevel/OffecerLevel";
import RateCategory from "./Components/MasterEntry/RateCategory/RateCategory";
import Employee from "./Components/MasterEntry/Employee/Employee";
import NewsPaper from "./Components/MasterEntry/NewsPaper/NewsPaper";
import Office from "./Components/MasterEntry/Office/Office";
import OfficeOfficer from "./Components/MasterEntry/OfficeOfficer/OfficeOfficer";
import Officer from "./Components/MasterEntry/Officer/Officer";
import TaxMasterForm from "./Components/MasterEntry/TaxMaster/TaxMaster";
import UnitConvert from "./Components/MasterEntry/UnitConvert/UnitConvert";
import UnitMaster from "./Components/MasterEntry/UnitMaster/UnitMaster";
import UploadCategory from "./Components/MasterEntry/UploadCategory/UploadCategory";
import UploadFileExtension from "./Components/MasterEntry/UploadFileExtension/UploadFileExtension";
import UploadFileSize from "./Components/MasterEntry/UploadFileSize/UploadFileSize";
import Register from "./Components/Adminpage/LoginPage/RegistrationPage";
import LoginPage from "./Components/Adminpage/LoginPage/LoginPage";
import OfficeLevel from "./Components/MasterEntry/OfficeLevel/OfficeLevel";
import UserCreation from "./Components/MasterEntry/UserCreation/UserCreation";

import ProtectedRoute from "./Components/route/ProtectedRoute";
// -----------------Master Entry End Here------------------------------
//Main Page-----------------------
// import LandingPage from "./Components/MasterEntry/LandingPage/LnadingPage";
import AdminDashboardLayout from "./Components/Adminpage/AdminDashboard/AdminDashboardLayout";


//----------------------------EM master Entry Start here--------------------------

import JobType from "./Components/EmMasterEntry/JobType/JobType";
import JobUnit from "./Components/EmMasterEntry/JobUnit/JobUnit";
import MapJobTypeProductionType from "./Components/EmMasterEntry/mapJobtypeProductionType/mapJobTypeProductionType";
import MapVendorCategory from "./Components/EmMasterEntry/mapVendorCategory/mapVendorCategory";
import MapVendorGroup from "./Components/EmMasterEntry/mapVendorGroup/mapVendorGroup";
import MediaType from "./Components/EmMasterEntry/MediaType/MediaType";
import ProductionType from "./Components/EmMasterEntry/ProductionType/ProductionType";
import RateCalculationOn from "./Components/EmMasterEntry/RateCalculationOn/RateCalculatorOn";
import RateType from "./Components/EmMasterEntry/RateType/RateType";
import RateTypeFlag from "./Components/EmMasterEntry/RateTypeFlag/RateTypeFlag";
import TimeBand from "./Components/EmMasterEntry/TimeBand/TimeBand";
import Vendor from "./Components/EmMasterEntry/Vendor/Vendor";
import VendorCategory from "./Components/EmMasterEntry/VendorCategory/VendorCategory";
import VendorGroup from "./Components/EmMasterEntry/VendorGroup/VendorGroup";
import VendorSearchCategory from "./Components/EmMasterEntry/VendorSearchCategory/VendorSearchCategory";
import WorkType from "./Components/EmMasterEntry/WorkType/WorkType";
import MediaWorkItemType from "./Components/EmMasterEntry/MediaWorkItemType/MediaWorkItemType";
import MapWorkTypeMediaType from "./Components/EmMasterEntry/mapWorktypeMediatype/mapWorktypeMediatype";
import MapWorkTypeJobType from "./Components/EmMasterEntry/mapWorkTypeJobType/mapWorkTypeJobType";
//-------------------------------EM master Entry End here---------------------------------------



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* // Public Routes */}
        {/* ==========================================test======================== */}
 <Route path="/loginPage" element={<LoginPage />} />
        {/* <Route path="/" element={<LandingPage />} /> */}

        {/* //Grouped Protected Routes */}

      <Route element={<ProtectedRoute />}>
  <Route path="/" element={<AdminDashboardLayout />}>
    {/* All dashboard pages go here — they’ll render inside <Outlet /> */}
    
    {/* Master Entry */}
    <Route path="createadmin" element={<Register />} />
    <Route path="usercreation" element={<UserCreation />} />
    <Route path="officelevel" element={<OfficeLevel />} />
    <Route path="bankmaster" element={<BankMaster />} />
    <Route path="basedepartment" element={<BaseDepartment />} />
    <Route path="designation" element={<DesignationMaster />} />
    <Route path="districtsnew" element={<DistrictsNew />} />
    <Route path="division" element={<Division />} />
    <Route path="employee" element={<Employee />} />
    <Route path="financialyear" element={<FinancialYear />} />
    <Route path="newspaper" element={<NewsPaper />} />
    <Route path="office" element={<Office />} />
    <Route path="officeofficer" element={<OfficeOfficer />} />
    <Route path="officer" element={<Officer />} />
    <Route path="officerlevel" element={<OfficerLevel />} />
    <Route path="ratecategory" element={<RateCategory />} />
    <Route path="taxmaster" element={<TaxMasterForm />} />
    <Route path="unitconvert" element={<UnitConvert />} />
    <Route path="unitmaster" element={<UnitMaster />} />
    <Route path="uploadcategory" element={<UploadCategory />} />
    <Route path="uploadfileextension" element={<UploadFileExtension />} />
    <Route path="uploadfilesize" element={<UploadFileSize />} />

    {/* EM Master Entry */}
    <Route path="jobtype" element={<JobType />} />
    <Route path="jobunit" element={<JobUnit />} />
    <Route path="mapjobtypeproductiontype" element={<MapJobTypeProductionType />} />
    <Route path="mapvendorcategory" element={<MapVendorCategory />} />
    <Route path="mapvendorgroup" element={<MapVendorGroup />} />
    <Route path="mediatype" element={<MediaType />} />
    <Route path="productiontype" element={<ProductionType />} />
    <Route path="ratecalculationon" element={<RateCalculationOn />} />
    <Route path="ratetype" element={<RateType />} />
    <Route path="ratetypeflag" element={<RateTypeFlag />} />
    <Route path="timeband" element={<TimeBand />} />
    <Route path="vendor" element={<Vendor />} />
    <Route path="vendorcategory" element={<VendorCategory />} />
    <Route path="vendorgroup" element={<VendorGroup />} />
    <Route path="vendorsearchcategory" element={<VendorSearchCategory />} />
    <Route path="worktype" element={<WorkType />} />
    <Route path="mediaworkitemtype" element={<MediaWorkItemType />} />
    <Route path="mapworktypemediatype" element={<MapWorkTypeMediaType />} />
    <Route path="mapworktypejobtype" element={<MapWorkTypeJobType />} />
  </Route>
</Route>

       {/* =====================================test======================= */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;








