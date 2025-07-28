const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all RateCalculationOn records
const getRateCalculationOn = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_RateCalculationOn");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET RateCalculationOn  by ID
const getRateCalculationOnById = async (req, res) => {
  const { id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("id", sql.VarChar(2), id)
      .query(
        "SELECT * FROM EM_Master_RateCalculationOn WHERE id = @id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("record not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE new RateCalculationOn 
const createRateCalculationOn = async (req, res) => {
  const { rate_calculation_on_E, rate_calculation_on_H, status } = req.body;

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }

  try {
    await poolConnect;

    // Check for duplicates
    // const checkResult = await pool
    //   .request()
    //   .input("rate_calculation_on_E", sql.NVarChar(100), rate_calculation_on_E)
    //   .query(
    //     "SELECT * FROM EM_Master_RateCalculationOn WHERE rate_calculation_on_E = @rate_calculation_on_E"
    //   );

    // if (checkResult.recordset.length > 0) {
    //   return res.status(409).send("Media type already exists!");
    // }

    // Generate new RateCalculationOn ID
    const idResult = await pool
      .request()
      .query(
        "SELECT MAX(CAST(id AS INT)) AS maxId FROM EM_Master_RateCalculationOn"
      );

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = String(maxId + 1).padStart(2, "0");

    // Insert new RateCalculationOn  record 
    await pool
      .request()
      .input("id", sql.VarChar(2), nextId)
      .input("rate_calculation_on_E", sql.VarChar(15), rate_calculation_on_E)
      .input("rate_calculation_on_H", sql.NVarChar(20), rate_calculation_on_H)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_RateCalculationOn (id,rate_calculation_on_E, rate_calculation_on_H, status)
        VALUES (@id, @rate_calculation_on_E, @rate_calculation_on_H, @status)
      `);

    res.status(201).send(`created successfully with ID ${nextId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE RateCalculationOn by ID
const updateRateCalculationOn = async (req, res) => {
  const { id } = req.params;
  const {rate_calculation_on_E,rate_calculation_on_H, status } = req.body;

  if (!rate_calculation_on_E || !rate_calculation_on_H|| status === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("id", sql.VarChar(2), id)
      .input("rate_calculation_on_E", sql.NVarChar(100), rate_calculation_on_E)
      .input("rate_calculation_on_H", sql.NVarChar(100), rate_calculation_on_H)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_RateCalculationOn
        SET rate_calculation_on_E = @rate_calculation_on_E,
            rate_calculation_on_H = @rate_calculation_on_H,
            status = @status
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("record not found !");
    }

    res.send("Rate Calculation On updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getRateCalculationOn,
  getRateCalculationOnById,
  createRateCalculationOn,
  updateRateCalculationOn,
};
