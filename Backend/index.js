const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sha256 = require("sha256");

const authRoute = require("./routes/auth.route.js");

// const Adminuser=require("./routes/auth.route.js");


//----------------------------MasterEntry route----------------------------------------------
const bankMaster = require("./routes/MasterEntryRoute/bankmaster.route.js");
const baseDepartment = require("./routes/MasterEntryRoute/basedepartment.route.js");
const designation = require("./routes/MasterEntryRoute/designation.route.js");
const districtNew = require("./routes/MasterEntryRoute/districtnew.route.js");
const division = require("./routes/MasterEntryRoute/division.route.js");
const employee = require("./routes/MasterEntryRoute/employee.route.js");
const financialYear = require("./routes/MasterEntryRoute/financialyear.route.js");
const newsPaper = require("./routes/MasterEntryRoute/newspaper.route.js");
const office = require("./routes/MasterEntryRoute/office.route.js");
const officeLevel = require("./routes/MasterEntryRoute/officelevel.route.js");
const officeOfficer = require("./routes/MasterEntryRoute/officeofficer.route.js");
const officer = require("./routes/MasterEntryRoute/officer.route.js");
const officerLevel = require("./routes/MasterEntryRoute/officerlevel.route.js");
const rateCategory = require("./routes/MasterEntryRoute/ratecategory.route.js");
const taxMaster = require("./routes/MasterEntryRoute/taxmaster.route.js");
const unitConvert = require("./routes/MasterEntryRoute/unitconvert.route.js");
const unitMaster = require("./routes/MasterEntryRoute/unitmaster.route.js");
const uploadCategory = require("./routes/MasterEntryRoute/uploadcategory.route.js");
const uploadFileExtension = require("./routes/MasterEntryRoute/uploadfileextension.route.js");
const uploadFileSize = require("./routes/MasterEntryRoute/uploadfilesize.route.js");
//----------------------------MasterEntry route End----------------------------------------------

//----------------------------EM MasterEntry route End----------------------------------------------
 const jobType = require("./routes/EmMasterEntryRoute/jobtype.route.js");
 const jobUnit = require("./routes/EmMasterEntryRoute/jobunit.route.js");
 const mapJobTypeProductionType = require("./routes/EmMasterEntryRoute/mapjobtypeproductiontype.route.js");
 const productionType = require("./routes/EmMasterEntryRoute/productiontype.route.js"); 
const mediaType = require("./routes/EmMasterEntryRoute/mediatype.route.js");
const rateCalculationOn = require("./routes/EmMasterEntryRoute/ratecalculationon.route.js");
const rateType = require("./routes/EmMasterEntryRoute/ratetype.route.js");
const vendorCategory = require("./routes/EmMasterEntryRoute/vendorcategory.route.js");
const workType = require("./routes/EmMasterEntryRoute/worktype.route.js");  
const vendorSearchCategory = require("./routes/EmMasterEntryRoute/vendorsearchcategory.route.js");
const rateTypeFlag = require("./routes/EmMasterEntryRoute/ratetypeflag.route.js");
const mapWorkTypeJobType = require("./routes/EmMasterEntryRoute/mapworktypejobtype.route.js");
const mapVendorCategory = require("./routes/EmMasterEntryRoute/mapvendorcategory.route.js");
const mapWorkTypeMediaType = require("./routes/EmMasterEntryRoute/mapworktypemediatype.route.js");
const mapVendorGroup = require("./routes/EmMasterEntryRoute/mapvendorgroup.route.js");
const mediaWorkItemType=require("./routes/EmMasterEntryRoute/mediaworkitemtype.route.js")
const TimeBand=require("./routes/EmMasterEntryRoute/timeband.route.js")
const Vendor=require("./routes/EmMasterEntryRoute/vendor.route.js")
const VendorGroup=require("./routes/EmMasterEntryRoute/vendorgroup.route.js")

//-------------------------------EM MasterEntry route----------------------------------------------




const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.set("trust proxy", true);

// FIXED PATHS
app.use("/api/auth", authRoute);
// app.use("api/adminuser",Adminuser);

//----------------------------MasterEntry----------------------------------------------
app.use("/api/bankmaster", bankMaster);
app.use("/api/basedepartment", baseDepartment);
app.use("/api/designation", designation);
app.use("/api/districtnew", districtNew);
app.use("/api/division", division);
app.use("/api/employee", employee);
app.use("/api/financialyear", financialYear);
app.use("/api/newspaper", newsPaper);
app.use("/api/office", office);
app.use("/api/officelevel", officeLevel);
app.use("/api/officeofficer", officeOfficer);
app.use("/api/officer", officer);
app.use("/api/officerlevel", officerLevel);
app.use("/api/ratecategory", rateCategory);
app.use("/api/taxmaster", taxMaster);
app.use("/api/unitconvert", unitConvert);
app.use("/api/unitmaster", unitMaster);
app.use("/api/uploadcategory", uploadCategory);
app.use("/api/uploadfileextension", uploadFileExtension);
app.use("/api/uploadfilesize", uploadFileSize);
//----------------------------MasterEntry End ----------------------------------------------

//----------------------------EM MasterEntry End ----------------------------------------------
app.use("/api/jobtype", jobType);
app.use("/api/jobunit", jobUnit);
app.use("/api/jobtypeproductiontype", mapJobTypeProductionType);
app.use("/api/productiontype", productionType);
app.use("/api/mediatype", mediaType);
app.use("/api/ratecalculationon", rateCalculationOn);
app.use("/api/ratetype", rateType);
app.use("/api/vendorcategory", vendorCategory);
app.use("/api/worktype", workType);
app.use("/api/vendorsearchcategory", vendorSearchCategory);
app.use("/api/ratetypeflag", rateTypeFlag);
app.use("/api/mapworktypejobtype", mapWorkTypeJobType);
app.use("/api/mapvendorcategory", mapVendorCategory);
app.use("/api/mapworktypemediatype", mapWorkTypeMediaType);
app.use("/api/mapvendorgroup",mapVendorGroup);
app.use("/api/mediaworkitemtype",mediaWorkItemType);
app.use("/api/timeband",TimeBand)
app.use("/api/vendor",Vendor)
app.use("/api/vendorgroup",VendorGroup);

//----------------------------EM MasterEntry End ----------------------------------------------



app.listen(3080, () => {
  console.log("Server is running at http://localhost:3080");
});
