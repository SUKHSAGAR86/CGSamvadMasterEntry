

//---------------------------------Divisions------------------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all divisions
const getDivision = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM Division ORDER BY Display_order");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get a division by ID
const getDivisionById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("id", sql.VarChar(3), id)
      .query("SELECT * FROM Division WHERE Division_id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).send("Division not found");
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Create new division with auto-generated zero-padded ID but manual Display_order
const createDivision = async (req, res) => {
  const { Division_name_Hindi, Division_name_English, flag, Display_order } = req.body;

  try {
    await poolConnect;

    // Get current max Division_id
    const maxIdResult = await pool.request().query(`
        SELECT MAX(CAST(Division_id AS INT)) AS maxId FROM Division
      `);
    const nextIdInt = (maxIdResult.recordset[0].maxId || 0) + 1;
    const nextId = nextIdInt.toString().padStart(3, "0"); // e.g., "001", "002"

    // Insert with manual Display_order
    await pool
      .request()
      .input("id", sql.VarChar(3), nextId)
      .input("hindi", sql.NVarChar(50), Division_name_Hindi)
      .input("english", sql.VarChar(50), Division_name_English)
      .input("flag", sql.Int, flag)
      .input("order", sql.Int, Display_order)
      .query(`
          INSERT INTO Division (Division_id, Division_name_Hindi, Division_name_English, flag, Display_order)
          VALUES (@id, @hindi, @english, @flag, @order)
        `);

    res.status(201).json({
      message: "Division created successfully",
      Division_id: nextId,
      Display_order: Display_order,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update division by ID
const updateDivision = async (req, res) => {
  const { id } = req.params;
  const { Division_name_Hindi, Division_name_English, flag, Display_order } =
    req.body;

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("id", sql.VarChar(3), id)
      .input("hindi", sql.NVarChar(50), Division_name_Hindi)
      .input("english", sql.VarChar(50), Division_name_English)
      .input("flag", sql.Int, flag)
      .input("order", sql.Int, Display_order)
      .query(`
          UPDATE Division
          SET Division_name_Hindi = @hindi,
              Division_name_English = @english,
              flag = @flag,
              Display_order = @order
          WHERE Division_id = @id
        `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Division not found");
    }

    res.send("Division updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getDivision,
  getDivisionById,
  createDivision,
  updateDivision,
};
