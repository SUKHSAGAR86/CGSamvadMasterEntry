//---------------------------------------News Paper Start Here-------------------------------------

const { pool, poolConnect, sql } = require("../../database/dbConfig.js");


//Utility: Date & Time
const getDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // HH:MM:SS
  return { date, time };
};

//CREATE NewsPaper here
const createNewsPaper= async (req, res) => {
  await poolConnect;
  const ip = req.ip;
  const { date, time } = getDateTime();
  const {
    np_cd,
    np_name,
    edition,
    type,
    language_id,
    language,
    status,
    rni_reg_no,
    bank_acount_no,
    bank_name,
    ifsc_code,
    display_order,
    who_created,
    is_eligible_for_gst,
    is_gst_verified_by_admin,
    CONTACT,
    DESN,
    NPADDR1,
    NPADDR2,
    NPADDR3,
    NPSTATE,
    NPSTATE_text,
    NPCITY,
    NPCITY_text,
    NPPOSTAL_cd,
    NPPHONE,
    YROPBAL,
    COMMPERC,
    NPNAME,
    GST_legalName,
    GST_number,
    GST_StateID,
    GST_StateText,
    GST_DateOfRegistration,
    GST_TaxpayerType,
    GST_Trade_Name,
    GST_DateOfIssue,
    State_Code,
    District_Code,
    State_Text,
    District_Text,
    np_info,
    entry_by_user_id,
    entry_by_user_name,
  } = req.body;

  try {
    const request = pool.request();
    request.input("np_cd", sql.VarChar(6), np_cd);
    request.input("np_name", sql.NVarChar(200), np_name);
    request.input("edition", sql.NVarChar(50), edition);
    request.input("type", sql.NVarChar(3), type);
    request.input("language_id", sql.Float, language_id);
    request.input("language", sql.NVarChar(15), language);
    request.input("status", sql.Int, status);
    request.input("rni_reg_no", sql.VarChar(30), rni_reg_no);
    request.input("bank_acount_no", sql.VarChar(20), bank_acount_no);
    request.input("bank_name", sql.NVarChar(100), bank_name);
    request.input("ifsc_code", sql.VarChar(20), ifsc_code);
    request.input("display_order", sql.Int, display_order);
    request.input("who_created", sql.NVarChar(5), who_created);
    request.input("is_eligible_for_gst", sql.VarChar(1), is_eligible_for_gst);
    request.input(
      "is_gst_verified_by_admin",
      sql.VarChar(1),
      is_gst_verified_by_admin
    );
    request.input("CONTACT", sql.NVarChar(255), CONTACT);
    request.input("DESN", sql.NVarChar(255), DESN);
    request.input("NPADDR1", sql.VarChar(255), NPADDR1);
    request.input("NPADDR2", sql.VarChar(255), NPADDR2);
    request.input("NPADDR3", sql.VarChar(255), NPADDR3);
    request.input("NPSTATE", sql.VarChar(10), NPSTATE);
    request.input("NPSTATE_text", sql.NVarChar(100), NPSTATE_text);
    request.input("NPCITY", sql.NVarChar(255), NPCITY);
    request.input("NPCITY_text", sql.NVarChar(100), NPCITY_text);
    request.input("NPPOSTAL_cd", sql.VarChar(6), NPPOSTAL_cd);
    request.input("NPPHONE", sql.NVarChar(255), NPPHONE);
    request.input("YROPBAL", sql.Float, YROPBAL);
    request.input("COMMPERC", sql.Float, COMMPERC);
    request.input("NPNAME", sql.NVarChar(255), NPNAME);
    request.input("GST_legalName", sql.NVarChar(100), GST_legalName);
    request.input("GST_number", sql.VarChar(15), GST_number);
    request.input("GST_StateID", sql.NVarChar(10), GST_StateID);
    request.input("GST_StateText", sql.VarChar(50), GST_StateText);
    request.input("GST_DateOfRegistration", sql.Date, GST_DateOfRegistration);
    request.input("GST_TaxpayerType", sql.NVarChar(20), GST_TaxpayerType);
    request.input("GST_Trade_Name", sql.NVarChar(100), GST_Trade_Name);
    request.input("GST_DateOfIssue", sql.Date, GST_DateOfIssue);
    request.input("State_Code", sql.VarChar(50), State_Code);
    request.input("District_Code", sql.VarChar(50), District_Code);
    request.input("State_Text", sql.VarChar(50), State_Text);
    request.input("District_Text", sql.VarChar(50), District_Text);
    request.input("np_info", sql.Char(1), np_info);
    request.input("entry_date", sql.Date, date);
    request.input("entry_time", sql.VarChar(14), time);
    request.input("ip_address", sql.NVarChar(20), ip);
    request.input("entry_by_user_id", sql.VarChar(10), entry_by_user_id);
    request.input("entry_by_user_name", sql.NVarChar(100), entry_by_user_name);
    await request.query(`
            INSERT INTO NewsPaper (
            np_cd,np_name,edition,type,language_id,language,status,rni_reg_no,bank_acount_no,
          bank_name,ifsc_code,display_order,who_created,is_eligible_for_gst,is_gst_verified_by_admin,
          CONTACT,DESN,NPADDR1,NPADDR2,NPADDR3,NPSTATE,NPSTATE_text,NPCITY,NPCITY_text,NPPOSTAL_cd,
          NPPHONE,YROPBAL,COMMPERC,NPNAME,GST_legalName,GST_number,GST_StateID,GST_StateText,GST_DateOfRegistration,
          GST_TaxpayerType,GST_Trade_Name,GST_DateOfIssue,State_Code,District_Code,State_Text,District_Text,np_info,entry_date, 
          entry_time,ip_address,entry_by_user_id,entry_by_user_name)
            VALUES (
               @np_cd,@np_name,@edition,@type,@language_id,@language,@status,@rni_reg_no,@bank_acount_no,
          @bank_name,@ifsc_code,@display_order,@who_created,@is_eligible_for_gst,@is_gst_verified_by_admin,
          @CONTACT,@DESN,@NPADDR1,@NPADDR2,@NPADDR3,@NPSTATE,@NPSTATE_text,@NPCITY,@NPCITY_text,@NPPOSTAL_cd,
         @NPPHONE,@YROPBAL,@COMMPERC,@NPNAME,@GST_legalName,@GST_number,@GST_StateID,@GST_StateText,@GST_DateOfRegistration,
          @GST_TaxpayerType,@GST_Trade_Name,@GST_DateOfIssue,@State_Code,@District_Code,@State_Text,@District_Text,@np_info,@entry_date, 
          @entry_time,@ip_address,@entry_by_user_id,@entry_by_user_name
            )
          `);

    res.status(201).send("News Paper created successfully.");
  } catch (err) {
    console.error("Insert error:", err.message);
    res.status(500).send(err.message);
  }
};

//Get All NewsPaper
const getNewsPaper= async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query("SELECT * FROM NewsPaper");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Get One by ID
const getNewsPaperById= async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("id", sql.VarChar(5), req.params.id)
      .query("SELECT * FROM NewsPaper WHERE np_cd = @id");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE Employee by ID
const updateNewsPaper= async (req, res) => {
  await poolConnect;
  const ip = req.ip;
  const { date, time } = getDateTime();
  const np_cd = req.params.id;
  const {
    np_name,
    edition,
    type,
    language_id,
    language,
    status,
    rni_reg_no,
    bank_acount_no,
    bank_name,
    ifsc_code,
    display_order,
    who_created,
    is_eligible_for_gst,
    is_gst_verified_by_admin,
    CONTACT,
    DESN,
    NPADDR1,
    NPADDR2,
    NPADDR3,
    NPSTATE,
    NPSTATE_text,
    NPCITY,
    NPCITY_text,
    NPPOSTAL_cd,
    NPPHONE,
    YROPBAL,
    COMMPERC,
    NPNAME,
    GST_legalName,
    GST_number,
    GST_StateID,
    GST_StateText,
    GST_DateOfRegistration,
    GST_TaxpayerType,
    GST_Trade_Name,
    GST_DateOfIssue,
    State_Code,
    District_Code,
    State_Text,
    District_Text,
    np_info,
    modify_by_user_id,
    modify_by_user_name,
  } = req.body;

  try {
    const request = pool.request();
    request.input("np_cd", sql.VarChar(6), np_cd);
    request.input("np_name", sql.NVarChar(200), np_name);
    request.input("edition", sql.NVarChar(50), edition);
    request.input("type", sql.NVarChar(3), type);
    request.input("language_id", sql.Float, language_id);
    request.input("language", sql.NVarChar(15), language);
    request.input("status", sql.Int, status);
    request.input("rni_reg_no", sql.VarChar(30), rni_reg_no);
    request.input("bank_acount_no", sql.VarChar(20), bank_acount_no);
    request.input("bank_name", sql.NVarChar(100), bank_name);
    request.input("ifsc_code", sql.VarChar(20), ifsc_code);
    request.input("display_order", sql.Int, display_order);
    request.input("who_created", sql.NVarChar(5), who_created);
    request.input("is_eligible_for_gst", sql.VarChar(1), is_eligible_for_gst);
    request.input(
      "is_gst_verified_by_admin",
      sql.VarChar(1),
      is_gst_verified_by_admin
    );
    request.input("CONTACT", sql.NVarChar(255), CONTACT);
    request.input("DESN", sql.NVarChar(255), DESN);
    request.input("NPADDR1", sql.VarChar(255), NPADDR1);
    request.input("NPADDR2", sql.VarChar(255), NPADDR2);
    request.input("NPADDR3", sql.VarChar(255), NPADDR3);
    request.input("NPSTATE", sql.VarChar(10), NPSTATE);
    request.input("NPSTATE_text", sql.NVarChar(100), NPSTATE_text);
    request.input("NPCITY", sql.NVarChar(255), NPCITY);
    request.input("NPCITY_text", sql.NVarChar(100), NPCITY_text);
    request.input("NPPOSTAL_cd", sql.VarChar(6), NPPOSTAL_cd);
    request.input("NPPHONE", sql.NVarChar(255), NPPHONE);
    request.input("YROPBAL", sql.Float, YROPBAL);
    request.input("COMMPERC", sql.Float, COMMPERC);
    request.input("NPNAME", sql.NVarChar(255), NPNAME);
    request.input("GST_legalName", sql.NVarChar(100), GST_legalName);
    request.input("GST_number", sql.VarChar(15), GST_number);
    request.input("GST_StateID", sql.NVarChar(10), GST_StateID);
    request.input("GST_StateText", sql.VarChar(50), GST_StateText);
    request.input("GST_DateOfRegistration", sql.Date, GST_DateOfRegistration);
    request.input("GST_TaxpayerType", sql.NVarChar(20), GST_TaxpayerType);
    request.input("GST_Trade_Name", sql.NVarChar(100), GST_Trade_Name);
    request.input("GST_DateOfIssue", sql.Date, GST_DateOfIssue);
    request.input("State_Code", sql.VarChar(50), State_Code);
    request.input("District_Code", sql.VarChar(50), District_Code);
    request.input("State_Text", sql.VarChar(50), State_Text);
    request.input("District_Text", sql.VarChar(50), District_Text);
    request.input("np_info", sql.Char(1), np_info);
    request.input("modify_date", sql.Date, date);
    request.input("modify_time", sql.VarChar(14), time);
    request.input("modify_ip_address", sql.NVarChar(20), ip);
    request.input("modify_by_user_id", sql.VarChar(10), modify_by_user_id);
    request.input(
      "modify_by_user_name",
      sql.NVarChar(100),
      modify_by_user_name
    );

    await request.query(`
            UPDATE NewsPaper SET
              np_name=@np_name,edition=@edition,type=@type,language_id=@language_id,
              language=@language,status=@status,rni_reg_no=@rni_reg_no,bank_acount_no=@bank_acount_no,
              bank_name=@bank_name,ifsc_code=@ifsc_code,display_order=@display_order,who_created=@who_created,
              is_eligible_for_gst=@is_eligible_for_gst,is_gst_verified_by_admin=@is_gst_verified_by_admin,
              CONTACT=@CONTACT,DESN=@DESN,NPADDR1=@NPADDR1,NPADDR2=@NPADDR2,NPADDR3=@NPADDR3,NPSTATE=@NPSTATE,
              NPSTATE_text=@NPSTATE_text,NPCITY=@NPCITY,NPCITY_text=@NPCITY_text,NPPOSTAL_cd=@NPPOSTAL_cd,
              NPPHONE=@NPPHONE,YROPBAL=@YROPBAL,COMMPERC=@COMMPERC,NPNAME=@NPNAME,GST_legalName=@GST_legalName,
              GST_number=@GST_number,GST_StateID=@GST_StateID,GST_StateText=@GST_StateText,
          GST_DateOfRegistration=@GST_DateOfRegistration,GST_TaxpayerType=@GST_TaxpayerType,
          GST_Trade_Name=@GST_Trade_Name,GST_DateOfIssue=@GST_DateOfIssue,State_Code=@State_Code,
          District_Code=@District_Code,State_Text=@State_Text,District_Text=@District_Text,np_info=@np_info,
          modify_date=@modify_date, modify_time=@modify_time,modify_ip_address=@modify_ip_address,
          modify_by_user_id=@modify_by_user_id,modify_by_user_name=@modify_by_user_name
            WHERE np_cd=@np_cd
          `);

    res.send("News Paper updated successfully.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};



module.exports={
  getNewsPaper,getNewsPaperById,createNewsPaper,updateNewsPaper,
};
//---------------------------------News Paper End Here-----------------------------------------
