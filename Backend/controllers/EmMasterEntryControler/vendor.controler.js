const { pool, poolConnect, sql } = require("../../database/dbConfig.js");


//  Correct date format for SQL Server
const getCurrentDate = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
};

const getCurrentTime = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mi}:${ss}`; // HH:MM:SS
};

const getClientIP = (req) => {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
};

// 🔹 GET all vendors
const getVendors = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`SELECT * FROM EM_Master_Vendor`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//  GET vendor by ID
const getVendorById = async (req, res) => {
  const { vendor_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("vendor_id", sql.VarChar(6), vendor_id)
      .query(`SELECT * FROM EM_Master_Vendor WHERE vendor_id = @vendor_id`);

    if (result.recordset.length === 0) {
      return res.status(404).send("Vendor not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//  CREATE vendor
const createVendor = async (req, res) => {
  const body = req.body;
  const entry_date = getCurrentDate();
  const entry_time = getCurrentTime();
  const ip_address = getClientIP(req);

  const modify_date = getCurrentDate();
  const modify_time = getCurrentTime();

  // Remove vendor_id from required fields check
  if (!body.vendor_name || !body.media_type_id || !body.media_type) {
    return res.status(400).send("Required fields are missing");
  }

  try {
    await poolConnect;

    // 1. Auto-generate vendor_id
    const result = await pool
      .request()
      .query(`SELECT MAX(CAST(vendor_id AS INT)) AS maxId FROM EM_Master_Vendor`);

    let newVendorId = "000001";
    if (result.recordset[0].maxId !== null) {
      const nextId = parseInt(result.recordset[0].maxId) + 1;
      newVendorId = nextId.toString().padStart(6, "0");
    }

    // 2. Insert with generated vendor_id
    await pool
      .request()
      .input("vendor_id", sql.VarChar(6), newVendorId)
      .input("vendor_name", sql.NVarChar(200), body.vendor_name)
      .input("media_type_id", sql.VarChar(2), body.media_type_id)
      .input("media_type", sql.NVarChar(100), body.media_type)
      .input("owner_name", sql.NVarChar(200), body.owner_name)
      .input("contact_no", sql.VarChar(10), body.contact_no)
      .input("email_id", sql.VarChar(50), body.email_id)
      .input("status", sql.Int, body.status)
      .input("is_eligible_for_gst", sql.VarChar, body.is_eligible_for_gst)
      .input("is_gst_verified_by_admin", sql.VarChar, body.is_gst_verified_by_admin)
      .input("gst_approved", sql.VarChar, body.gst_approved)
      .input("gst_rejected", sql.VarChar, body.gst_rejected)
      .input("gst_reject_remark", sql.NVarChar, body.gst_reject_remark)
      .input("GST_legalName", sql.NVarChar, body.GST_legalName)
      .input("GST_Trade_Name", sql.NVarChar, body.GST_Trade_Name)
      .input("GST_number", sql.VarChar, body.GST_number)
      .input("GST_StateID", sql.VarChar, body.GST_StateID)
      .input("GST_StateText", sql.NVarChar, body.GST_StateText)
      .input("GST_DateOfRegistration", sql.Date, body.GST_DateOfRegistration)
      .input("GST_DateOfIssue", sql.Date, body.GST_DateOfIssue)
      .input("GST_TaxpayerType", sql.NVarChar, body.GST_TaxpayerType)
      .input("State_Code", sql.VarChar, body.State_Code)
      .input("District_Code", sql.VarChar, body.District_Code)
      .input("State_Text", sql.NVarChar, body.State_Text)
      .input("District_Text", sql.VarChar, body.District_Text)
      .input("Area_Code", sql.VarChar, body.Area_Code)
      .input("Area_Text", sql.NVarChar, body.Area_Text)
      .input("search_cate_id", sql.Int, body.search_cate_id)
      .input("search_category", sql.NVarChar, body.search_category)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(8), entry_time)
      .input("ip_address", sql.NVarChar(20), ip_address)
      .input("entry_by_user_id", sql.VarChar, body.entry_by_user_id)
      .input("entry_by_user_name", sql.NVarChar, body.entry_by_user_name)
      .query(`
        INSERT INTO EM_Master_Vendor (
          vendor_id, vendor_name, media_type_id, media_type, owner_name, contact_no, email_id, status,
          is_eligible_for_gst, is_gst_verified_by_admin, gst_approved, gst_rejected, gst_reject_remark,
          GST_legalName, GST_Trade_Name, GST_number, GST_StateID, GST_StateText,
          GST_DateOfRegistration, GST_DateOfIssue, GST_TaxpayerType,
          State_Code, District_Code, State_Text, District_Text, Area_Code, Area_Text,
          search_cate_id, search_category,
          entry_date, entry_time, ip_address, entry_by_user_id, entry_by_user_name
        ) VALUES (
          @vendor_id, @vendor_name, @media_type_id, @media_type, @owner_name, @contact_no, @email_id, @status,
          @is_eligible_for_gst, @is_gst_verified_by_admin, @gst_approved, @gst_rejected, @gst_reject_remark,
          @GST_legalName, @GST_Trade_Name, @GST_number, @GST_StateID, @GST_StateText,
          @GST_DateOfRegistration, @GST_DateOfIssue, @GST_TaxpayerType,
          @State_Code, @District_Code, @State_Text, @District_Text, @Area_Code, @Area_Text,
          @search_cate_id, @search_category,
          @entry_date, @entry_time, @ip_address, @entry_by_user_id, @entry_by_user_name
        )
      `);

    res.status(201).json({ message: "Vendor created successfully", vendor_id: newVendorId });
  } catch (err) {
    res.status(500).send(err.message);
  }
};



//  UPDATE vendor
const updateVendor = async (req, res) => {
    const { vendor_id } = req.params;
    const body = req.body;
  
    const modify_date = getCurrentDate(); //  Date of update
    const modify_time = getCurrentTime(); //  Time of update
    const modify_ip_address = getClientIP(req); //  IP of user updating
  
    try {
      await poolConnect;
  
      const result = await pool
        .request()
        .input("vendor_id", sql.VarChar(6), vendor_id)
        .input("vendor_name", sql.NVarChar(200), body.vendor_name)
        .input("media_type_id", sql.VarChar(2), body.media_type_id)
        .input("media_type", sql.NVarChar(100), body.media_type)
        .input("owner_name", sql.NVarChar(200), body.owner_name)
        .input("contact_no", sql.VarChar(10), body.contact_no)
        .input("email_id", sql.VarChar(50), body.email_id)
        .input("status", sql.Int, body.status)
  
        .input("is_eligible_for_gst", sql.VarChar, body.is_eligible_for_gst)
        .input("is_gst_verified_by_admin", sql.VarChar, body.is_gst_verified_by_admin)
        .input("gst_approved", sql.VarChar, body.gst_approved)
        .input("gst_rejected", sql.VarChar, body.gst_rejected)
        .input("gst_reject_remark", sql.NVarChar, body.gst_reject_remark)
        .input("GST_legalName", sql.NVarChar, body.GST_legalName)
        .input("GST_Trade_Name", sql.NVarChar, body.GST_Trade_Name)
        .input("GST_number", sql.VarChar, body.GST_number)
        .input("GST_StateID", sql.VarChar, body.GST_StateID)
        .input("GST_StateText", sql.NVarChar, body.GST_StateText)
        .input("GST_DateOfRegistration", sql.Date, body.GST_DateOfRegistration)
        .input("GST_DateOfIssue", sql.Date, body.GST_DateOfIssue)
        .input("GST_TaxpayerType", sql.NVarChar, body.GST_TaxpayerType)
  
        .input("State_Code", sql.VarChar, body.State_Code)
        .input("District_Code", sql.VarChar, body.District_Code)
        .input("State_Text", sql.NVarChar, body.State_Text)
        .input("District_Text", sql.VarChar, body.District_Text)
        .input("Area_Code", sql.VarChar, body.Area_Code)
        .input("Area_Text", sql.NVarChar, body.Area_Text)
  
        .input("search_cate_id", sql.Int, body.search_cate_id)
        .input("search_category", sql.NVarChar, body.search_category)
  
        //  Modified info
        .input("modify_date", sql.Date, modify_date)
        .input("modify_time", sql.VarChar(8), modify_time)
        .input("modify_ip_address", sql.NVarChar(20), modify_ip_address)
        .input("modify_by_user_id", sql.VarChar, body.modify_by_user_id)
        .input("modify_by_user_name", sql.NVarChar, body.modify_by_user_name)
  
        .query(`
          UPDATE EM_Master_Vendor SET
            vendor_name = @vendor_name,
            media_type_id = @media_type_id,
            media_type = @media_type,
            owner_name = @owner_name,
            contact_no = @contact_no,
            email_id = @email_id,
            status = @status,
            is_eligible_for_gst = @is_eligible_for_gst,
            is_gst_verified_by_admin = @is_gst_verified_by_admin,
            gst_approved = @gst_approved,
            gst_rejected = @gst_rejected,
            gst_reject_remark = @gst_reject_remark,
            GST_legalName = @GST_legalName,
            GST_Trade_Name = @GST_Trade_Name,
            GST_number = @GST_number,
            GST_StateID = @GST_StateID,
            GST_StateText = @GST_StateText,
            GST_DateOfRegistration = @GST_DateOfRegistration,
            GST_DateOfIssue = @GST_DateOfIssue,
            GST_TaxpayerType = @GST_TaxpayerType,
            State_Code = @State_Code,
            District_Code = @District_Code,
            State_Text = @State_Text,
            District_Text = @District_Text,
            Area_Code = @Area_Code,
            Area_Text = @Area_Text,
            search_cate_id = @search_cate_id,
            search_category = @search_category,
            modify_date = @modify_date,
            modify_time = @modify_time,
            modify_ip_address = @modify_ip_address,
            modify_by_user_id = @modify_by_user_id,
            modify_by_user_name = @modify_by_user_name
          WHERE vendor_id = @vendor_id
        `);
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).send("Vendor not found");
      }
  
      res.send("Vendor updated successfully");
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
};
