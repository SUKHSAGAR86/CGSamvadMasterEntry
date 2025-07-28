//--------------------------Upload File Extension Start-------------------

const {pool,poolConnect,sql}=require("../../database/dbConfig.js");

//Generate next sno (e.g., 001, 002, ...)
const generateNextSno = async () => {
  const pool = await poolConnect;
  const request = pool.request();
  const result = await request.query(
    "SELECT MAX(CAST(sno AS INT)) AS maxSno FROM upload_file_extension"
  );
  const max = result.recordset[0].maxSno || 0;
  const next = (parseInt(max) + 1).toString().padStart(3, "0");
  return next;
};



//CREATE - POST
const createUploadFileExtension= async (req, res) => {
  const { file_extension, status, Hoarding_upload_flag, tender_upload_flag } =
    req.body;

  try {
    const pool = await poolConnect;
    const request = pool.request();
    const sno = await generateNextSno();

    request.input("sno", sql.VarChar(3), sno);
    request.input("file_extension", sql.VarChar(10), file_extension);
    request.input("status", sql.NVarChar(50), status);
    request.input("Hoarding_upload_flag", sql.Int, Hoarding_upload_flag);
    request.input("tender_upload_flag", sql.Int, tender_upload_flag);

    await request.query(`
        INSERT INTO upload_file_extension 
        (sno, file_extension, status, Hoarding_upload_flag, tender_upload_flag)
        VALUES (@sno, @file_extension, @status, @Hoarding_upload_flag, @tender_upload_flag)
      `);

    res.status(201).json({ message: "Record inserted", sno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - GET ALL
const getUploadFileExtension = async (req, res) => {
  try {
    const pool = await poolConnect;
    const request = pool.request();
    const result = await request.query("SELECT * FROM upload_file_extension");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - GET ONE BY sno
const getUploadFileExtensionById= async (req, res) => {
  try {
    const pool = await poolConnect;
    const request = pool.request();
    request.input("sno", sql.VarChar(3), req.params.sno);
    const result = await request.query(
      "SELECT * FROM upload_file_extension WHERE sno = @sno"
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - PUT
const updateUploadFileExtension= async (req, res) => {
  const { file_extension, status, Hoarding_upload_flag, tender_upload_flag } =
    req.body;

  try {
    const pool = await poolConnect;
    const request = pool.request();

    request.input("sno", sql.VarChar(3), req.params.sno);
    request.input("file_extension", sql.VarChar(10), file_extension);
    request.input("status", sql.NVarChar(50), status);
    request.input("Hoarding_upload_flag", sql.Int, Hoarding_upload_flag);
    request.input("tender_upload_flag", sql.Int, tender_upload_flag);

    const result = await request.query(`
        UPDATE upload_file_extension 
        SET 
          file_extension = @file_extension,
          status = @status,
          Hoarding_upload_flag = @Hoarding_upload_flag,
          tender_upload_flag = @tender_upload_flag
        WHERE sno = @sno
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={
  getUploadFileExtension,
  getUploadFileExtensionById,
  createUploadFileExtension,
  updateUploadFileExtension,
}

//--------------------------Upload File Extension End-------------------------------------
