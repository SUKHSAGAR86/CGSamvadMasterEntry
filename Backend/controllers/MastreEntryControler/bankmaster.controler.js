// ----------------------------------- BankMaster Table Start -----------------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all bank records (ORDERED by Sno ASC)
// GET - api/bankmaster/
const getBankMasters = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM BankMaster ORDER BY Sno ASC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get single bank record by Sno
// app.get("/api/bankmaster/:sno"
const getBankMastersById = async (req, res) => {
  const { sno } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("Sno", sql.VarChar(5), sno)
      .query("SELECT * FROM BankMaster WHERE Sno = @Sno");

    if (result.recordset.length === 0) {
      return res.status(404).send("Bank record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Insert a new bank record with automatic Sno generation
const createBankMaster = async (req, res) => {
  const {
    BANKNM,
    IFSCCODE,
    MICRCODE,
    BRANCHNM,
    BRANCHADDRESS,
    CONTACTDETAILS,
    CENTRE,
    DISTRICT,
    STATE,
    status,
    entry_by_user_id,
    entry_by_user_name,
    ip_address,
  } = req.body;

  // Validate required fields for empty or undefined values
  if (
    !BANKNM ||
    !IFSCCODE ||
    !MICRCODE ||
    !BRANCHNM ||
    !BRANCHADDRESS ||
    !CONTACTDETAILS ||
    !DISTRICT ||
    !STATE ||
    status === undefined ||
    !entry_by_user_id ||
    !entry_by_user_name ||
    !ip_address
  ) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  const now = new Date();
  const entry_date = now;
  const entry_time = now.toISOString().slice(11, 19);

  try {
    await poolConnect;

    const maxSnoResult = await pool
      .request()
      .query("SELECT MAX(Sno) AS maxSno FROM BankMaster");
    let maxSno = maxSnoResult.recordset[0].maxSno;
    let nextSnoNumber = 1;
    if (maxSno) {
      nextSnoNumber = parseInt(maxSno, 10) + 1;
    }
    const newSno = String(nextSnoNumber).padStart(3, "0");

    await pool
      .request()
      .input("Sno", sql.VarChar(5), newSno)
      .input("BANKNM", sql.NVarChar(250), BANKNM)
      .input("IFSCCODE", sql.NVarChar(50), IFSCCODE)
      .input("MICRCODE", sql.NVarChar(50), MICRCODE)
      .input("BRANCHNM", sql.NVarChar(300), BRANCHNM)
      .input("BRANCHADDRESS", sql.NVarChar(800), BRANCHADDRESS)
      .input("CONTACTDETAILS", sql.NVarChar(350), CONTACTDETAILS)
      .input("CENTRE", sql.NVarChar(200), CENTRE)
      .input("DISTRICT", sql.NVarChar(200), DISTRICT)
      .input("STATE", sql.NVarChar(200), STATE)
      .input("status", sql.Int, status)
      .input("entry_date", sql.Date, entry_date)
      .input("entry_time", sql.VarChar(14), entry_time)
      .input("entry_by_user_id", sql.VarChar(10), entry_by_user_id)
      .input("entry_by_user_name", sql.NVarChar(100), entry_by_user_name)
      .input("ip_address", sql.NVarChar(20), ip_address).query(`
          INSERT INTO BankMaster (
            Sno, BANKNM, IFSCCODE, MICRCODE, BRANCHNM, BRANCHADDRESS, CONTACTDETAILS,
            CENTRE, DISTRICT, STATE, status, entry_date, entry_time,
            entry_by_user_id, entry_by_user_name, ip_address
          ) VALUES (
            @Sno, @BANKNM, @IFSCCODE, @MICRCODE, @BRANCHNM, @BRANCHADDRESS, @CONTACTDETAILS,
            @CENTRE, @DISTRICT, @STATE, @status, @entry_date, @entry_time,
            @entry_by_user_id, @entry_by_user_name, @ip_address
          )
        `);

    res
      .status(201)
      .json({ message: "Bank record inserted successfully", Sno: newSno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a bank record
const updateBankMaster = async (req, res) => {
  const { sno } = req.params;
  const {
    BANKNM,
    IFSCCODE,
    MICRCODE,
    BRANCHNM,
    BRANCHADDRESS,
    CONTACTDETAILS,
    CENTRE,
    DISTRICT,
    STATE,
    status,
    modify_by_user_id,
    modify_by_user_name,
    modify_ip_address,
  } = req.body;

  const modify_date = new Date();
  const modify_time = modify_date.toISOString().slice(11, 19);

  try {
    await poolConnect;
    await pool
      .request()
      .input("Sno", sql.VarChar(5), sno)
      .input("BANKNM", sql.NVarChar(250), BANKNM)
      .input("IFSCCODE", sql.NVarChar(50), IFSCCODE)
      .input("MICRCODE", sql.NVarChar(50), MICRCODE)
      .input("BRANCHNM", sql.NVarChar(300), BRANCHNM)
      .input("BRANCHADDRESS", sql.NVarChar(800), BRANCHADDRESS)
      .input("CONTACTDETAILS", sql.NVarChar(350), CONTACTDETAILS)
      .input("CENTRE", sql.NVarChar(200), CENTRE)
      .input("DISTRICT", sql.NVarChar(200), DISTRICT)
      .input("STATE", sql.NVarChar(200), STATE)
      .input("status", sql.Int, status)
      .input("modify_date", sql.Date, modify_date)
      .input("modify_time", sql.VarChar(14), modify_time)
      .input("modify_by_user_id", sql.VarChar(10), modify_by_user_id)
      .input("modify_by_user_name", sql.NVarChar(100), modify_by_user_name)
      .input("modify_ip_address", sql.NVarChar(20), modify_ip_address).query(`
          UPDATE BankMaster SET
            BANKNM = @BANKNM, IFSCCODE = @IFSCCODE, MICRCODE = @MICRCODE,
            BRANCHNM = @BRANCHNM, BRANCHADDRESS = @BRANCHADDRESS,
            CONTACTDETAILS = @CONTACTDETAILS, CENTRE = @CENTRE, DISTRICT = @DISTRICT,
            STATE = @STATE, status = @status, modify_date = @modify_date,
            modify_time = @modify_time, modify_by_user_id = @modify_by_user_id,
            modify_by_user_name = @modify_by_user_name, modify_ip_address = @modify_ip_address
          WHERE Sno = @Sno
        `);
    res.send("Bank record updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createBankMaster,
  getBankMasters,
  updateBankMaster,
  getBankMastersById,
};
