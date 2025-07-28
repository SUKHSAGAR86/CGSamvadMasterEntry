const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all Item Types
const getMediaWorkItemTypes = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_Media_Work_ItemType");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET Item Type by ID
const getMediaWorkItemTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("item_type_id", sql.VarChar(2), id)
      .query(
        "SELECT * FROM EM_Master_Media_Work_ItemType WHERE item_type_id = @item_type_id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("Record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE new Item Type
const createMediaWorkItemType = async (req, res) => {
  const { item_type, work_type_id, media_type_id, status } = req.body;

  if (!item_type || !work_type_id || !media_type_id || status === undefined) {
    return res.status(400).send("All fields are required");
  }

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0" or "1"');
  }

  try {
    await poolConnect;

    // Generate new item_type_id
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(item_type_id AS INT)) AS maxId FROM EM_Master_Media_Work_ItemType"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0"); // 01, 02, ..., 99

    await pool
      .request()
      .input("item_type_id", sql.VarChar(2), nextId)
      .input("item_type", sql.NVarChar(50), item_type)
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_Media_Work_ItemType
        (item_type_id, item_type, work_type_id, media_type_id, status)
        VALUES (@item_type_id, @item_type, @work_type_id, @media_type_id, @status)
      `);

    res.status(201).send(`Item Type created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE Item Type by ID
const updateMediaWorkItemType = async (req, res) => {
  const { id } = req.params;
  const { item_type, work_type_id, media_type_id, status } = req.body;

  if (!item_type || !work_type_id || !media_type_id || status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("item_type_id", sql.VarChar(2), id)
      .input("item_type", sql.NVarChar(50), item_type)
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_Media_Work_ItemType
        SET item_type = @item_type,
            work_type_id = @work_type_id,
            media_type_id = @media_type_id,
            status = @status
        WHERE item_type_id = @item_type_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Record not found");
    }

    res.send("Item Type updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getMediaWorkItemTypes,
  getMediaWorkItemTypeById,
  createMediaWorkItemType,
  updateMediaWorkItemType,
};
