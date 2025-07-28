const { pool,poolConnect, sql } = require("../../database/dbConfig.js");

// Get all WorkType-MediaType mappings
const getMapWorkTypeMediaType = async (req, res) => {
  try {
    const pool = await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_Map_WorkType_MediaType");
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
  
// Get a single WorkType-MediaType mapping by work_type_id
const getMapWorkTypeMediaTypeById = async (req, res) => {
  try {
    await poolConnect;
    const { work_type_id } = req.params;
    const result = await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .query(
        "SELECT * FROM EM_Master_Map_WorkType_MediaType WHERE work_type_id = @work_type_id"
      );
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new WorkType-MediaType mapping
const createMapWorkTypeMediaType = async (req, res) => {
  try {
    const {
      work_type_id,
      work_type,
      media_type_id,
      media_type,
      rate_calculation_on_id,
      rate_calculation_on_E,
      rate_calculation_on_H,
      calculate_commission,
      ro_amt_convert_in_100_percent,
      display_as,
      discount_percent_on_wo_amt,
      it_tds_on_wo_amt,
      status,
    } = req.body;

    await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .input("work_type", sql.NVarChar(100), work_type)
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("rate_calculation_on_id", sql.Int, rate_calculation_on_id)
      .input("rate_calculation_on_E", sql.VarChar(15), rate_calculation_on_E)
      .input("rate_calculation_on_H", sql.NVarChar(20), rate_calculation_on_H)
      .input("calculate_commission", sql.VarChar(1), calculate_commission)
      .input("ro_amt_convert_in_100_percent",sql.VarChar(1),ro_amt_convert_in_100_percent)
      .input("display_as", sql.NVarChar(100), display_as)
      .input("discount_percent_on_wo_amt",sql.Float,discount_percent_on_wo_amt)
      .input("it_tds_on_wo_amt", sql.Float, it_tds_on_wo_amt)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_Map_WorkType_MediaType 
        (work_type_id, work_type, media_type_id, media_type, rate_calculation_on_id, rate_calculation_on_E, rate_calculation_on_H, calculate_commission, ro_amt_convert_in_100_percent, display_as, discount_percent_on_wo_amt, it_tds_on_wo_amt, status)
        VALUES 
        (@work_type_id, @work_type, @media_type_id, @media_type, @rate_calculation_on_id, @rate_calculation_on_E, @rate_calculation_on_H, @calculate_commission, @ro_amt_convert_in_100_percent, @display_as, @discount_percent_on_wo_amt, @it_tds_on_wo_amt, @status)
      `);

    res.status(201).send(`Created successfully with ID ${work_type_id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update existing WorkType-MediaType mapping

const updateMapWorkTypeMediaType = async (req, res) => {
  try {
    const {
      work_type,
      media_type_id,
      media_type,
      rate_calculation_on_id,
      rate_calculation_on_E,
      rate_calculation_on_H,
      calculate_commission,
      ro_amt_convert_in_100_percent,
      display_as,
      discount_percent_on_wo_amt,
      it_tds_on_wo_amt,
      status,
    } = req.body;

    const { work_type_id, old_media_type_id } = req.params;

    await pool
      .request()
      .input("work_type_id", sql.VarChar(2), work_type_id)
      .input("old_media_type_id", sql.VarChar(2), old_media_type_id)
      .input("work_type", sql.NVarChar(100), work_type)
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("rate_calculation_on_id", sql.Int, rate_calculation_on_id)
      .input("rate_calculation_on_E", sql.VarChar(15), rate_calculation_on_E)
      .input("rate_calculation_on_H", sql.NVarChar(20), rate_calculation_on_H)
      .input("calculate_commission", sql.VarChar(1), calculate_commission)
      .input("ro_amt_convert_in_100_percent", sql.VarChar(1), ro_amt_convert_in_100_percent)
      .input("display_as", sql.NVarChar(100), display_as)
      .input("discount_percent_on_wo_amt", sql.Float, discount_percent_on_wo_amt)
      .input("it_tds_on_wo_amt", sql.Float, it_tds_on_wo_amt)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_Map_WorkType_MediaType SET
          work_type = @work_type,
          media_type_id = @media_type_id,
          media_type = @media_type,
          rate_calculation_on_id = @rate_calculation_on_id,
          rate_calculation_on_E = @rate_calculation_on_E,
          rate_calculation_on_H = @rate_calculation_on_H,
          calculate_commission = @calculate_commission,
          ro_amt_convert_in_100_percent = @ro_amt_convert_in_100_percent,
          display_as = @display_as,
          discount_percent_on_wo_amt = @discount_percent_on_wo_amt,
          it_tds_on_wo_amt = @it_tds_on_wo_amt,
          status = @status
        WHERE work_type_id = @work_type_id AND media_type_id = @old_media_type_id
      `);

    res.status(200).send(`Updated successfully with ID ${work_type_id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports = {
  getMapWorkTypeMediaType,
  getMapWorkTypeMediaTypeById,
  createMapWorkTypeMediaType,
  updateMapWorkTypeMediaType,
};
