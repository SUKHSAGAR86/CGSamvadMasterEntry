const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all media type records
const getMediaType = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_MediaType");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET media type by ID
const getMediaTypeById = async (req, res) => {
  const { media_type_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .query(
        "SELECT * FROM EM_Master_MediaType WHERE media_type_id = @media_type_id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("Media type record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE new media type
const createMediaType = async (req, res) => {
  const { media_type, media_type_H, status } = req.body;

  if (!media_type || !media_type_H) {
    return res
      .status(400)
      .send("Both English and Hindi media type are required");
  }

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }

  try {
    await poolConnect;

    // Check for duplicates
    const checkResult = await pool
      .request()
      .input("media_type", sql.NVarChar(100), media_type)
      .query(
        "SELECT * FROM EM_Master_MediaType WHERE media_type = @media_type"
      );

    if (checkResult.recordset.length > 0) {
      return res.status(409).send("Media type already exists!");
    }

    // Generate new ID
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(media_type_id AS INT)) AS maxId FROM EM_Master_MediaType"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0");

    // Insert new record
    await pool
      .request()
      .input("media_type_id", sql.VarChar(2), nextId)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("media_type_H", sql.NVarChar(100), media_type_H)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_MediaType (media_type_id, media_type, media_type_H, status)
        VALUES (@media_type_id, @media_type, @media_type_H, @status)
      `);

    res.status(201).send(`Media type created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE media type
const updateMediaType = async (req, res) => {
  const { media_type_id } = req.params;
  const { media_type, media_type_H, status } = req.body;

  if (!media_type || !media_type_H || status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("media_type_H", sql.NVarChar(100), media_type_H)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_MediaType
        SET media_type = @media_type,
            media_type_H = @media_type_H,
            status = @status
        WHERE media_type_id = @media_type_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Media type record not found");
    }

    res.send("Media type updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getMediaType,
  getMediaTypeById,
  createMediaType,
  updateMediaType,
};
