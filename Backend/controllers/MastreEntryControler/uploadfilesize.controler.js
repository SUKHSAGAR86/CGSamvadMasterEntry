//----------------------------Upload File Size Start-------------------------------------------

const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Utility: Generate next sno like 001, 002, ...
async function generateSno() {
  const pool = await poolConnect;
  const request = pool.request();
  const result = await request.query(`
      SELECT MAX(CAST(sno AS INT)) AS maxSno 
      FROM upload_file_size 
      WHERE ISNUMERIC(sno) = 1
    `);
  let newSno = 1;
  if (result.recordset[0].maxSno !== null) {
    newSno = result.recordset[0].maxSno + 1;
  }
  return newSno.toString().padStart(3, "0");
}

//POST create new record
const createUploadFileSize = async (req, res) => {
  try {
    const pool = await poolConnect;
    const { file_size_in_bytes } = req.body;

    if (file_size_in_bytes == null) {
      return res.status(400).json({ error: "file_size_in_bytes is required" });
    }

    const sno = await generateSno();
    const request = pool.request();
    request.input("sno", sql.VarChar(3), sno);
    request.input("file_size_in_bytes", sql.Numeric(18, 0), file_size_in_bytes);

    await request.query(`
        INSERT INTO upload_file_size (sno, file_size_in_bytes)
        VALUES (@sno, @file_size_in_bytes)
      `);

    res.status(201).json({ message: "Record inserted", sno });
  } catch (error) {
    console.error("POST Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

//  GET a record by sno
const getUploadFileSizeById = async (req, res) => {
  try {
    const pool = await poolConnect;
    const { sno } = req.params;

    const request = pool.request();
    request.input("sno", sql.VarChar(3), sno);

    const result = await request.query(`
        SELECT * FROM upload_file_size WHERE sno = @sno
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("GET by ID Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// GET all records
const getUploadFileSize = async (req, res) => {
  try {
    const pool = await poolConnect;
    const request = pool.request();
    const result = await request.query(`
        SELECT * FROM upload_file_size ORDER BY sno
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error("GET Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// update a record by sno
const updateUploadFileSize = async (req, res) => {
  try {
    const pool = await poolConnect;
    const { sno } = req.params;
    const { file_size_in_bytes } = req.body;

    if (file_size_in_bytes == null) {
      return res.status(400).json({ error: "file_size_in_bytes is required" });
    }

    const request = pool.request();
    request.input("sno", sql.VarChar(3), sno);
    request.input("file_size_in_bytes", sql.Numeric(18, 0), file_size_in_bytes);

    const result = await request.query(`
        UPDATE upload_file_size
        SET file_size_in_bytes = @file_size_in_bytes
        WHERE sno = @sno
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record updated" });
  } catch (error) {
    console.error("PUT Error:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  getUploadFileSize,
  getUploadFileSizeById,
  createUploadFileSize,
  updateUploadFileSize,
};

//-----------------------------------Upload File Size End-----------------------------------------
