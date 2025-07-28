//----------------------------UnitConverter Start from Here-----------------------------

const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// GET all UnitConvert
const getUnitConvert = async (req, res) => {
  try {
    const pool = await poolConnect;
    const request = pool.request();
    const result = await request.query("SELECT * FROM UnitConvert");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET one UnitConvert by from_unit_cd and to_unit_cd
const getUnitConvertById = async (req, res) => {
  try {
    const { from, to } = req.params;
    const pool = await poolConnect;
    const request = pool.request();
    const result = await request.query(`
        SELECT * FROM UnitConvert 
        WHERE from_unit_cd = '${from}' AND to_unit_cd = '${to}'
      `);
    res.json(result.recordset[1]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// INSERT a new UnitConvert
const createUnitConvert = async (req, res) => {
  try {
    const { from_unit_cd, to_unit_cd, operation, value } = req.body;
    const pool = await poolConnect;
    const request = pool.request();
    await request.query(`
        INSERT INTO UnitConvert (from_unit_cd, to_unit_cd, operation, value)
        VALUES ('${from_unit_cd}', '${to_unit_cd}', '${operation}', ${value})
      `);
    res.status(201).send("Conversion inserted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE a UnitConvert
const updateUnitConvert = async (req, res) => {
  try {
    const { operation, value } = req.body;
    const { from, to } = req.params;
    const pool = await poolConnect;
    const request = pool.request();
    await request.query(`
        UPDATE UnitConvert 
        SET operation = '${operation}', value = ${value}
        WHERE from_unit_cd = '${from}' AND to_unit_cd = '${to}'
      `);
    res.send("Conversion updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getUnitConvert,
  getUnitConvertById,
  createUnitConvert,
  updateUnitConvert,
};

//----------------------------UnitConverter End from Here--------------------------------
