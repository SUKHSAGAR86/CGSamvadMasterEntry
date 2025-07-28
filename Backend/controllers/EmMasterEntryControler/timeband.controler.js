const { pool, poolConnect, sql } = require("../../database/dbConfig");

// GET all records
const getTimeBands = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT * FROM EM_Master_TimeBand ORDER BY media_type_id, time_band_id
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// GET all time bands by media_type_id
const getTimeBandById = async (req, res) => {
  const { time_band_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("time_band_id", sql.VarChar(2), time_band_id).query(`
        SELECT * FROM EM_Master_TimeBand
        WHERE time_band_id = @time_band_id
        ORDER BY time_band_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send("No records found for this time_band_id");
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// CREATE new record
const createTimeBand = async (req, res) => {
  const { media_type_id, media_type, time_band_from, time_band_to, status } =
    req.body;

  if (
    !media_type_id ||
    !media_type ||
    !time_band_from ||
    !time_band_to ||
    status === undefined
  ) {
    return res.status(400).send("All fields are required!");
  }

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed: "0" or "1"');
  }

  try {
    await poolConnect;


    //  Get next time_band_id for given media_type_id
    const idResult = await pool
      .request()
      .input("media_type_id", sql.VarChar(2), media_type_id).query(`
        SELECT MAX(CAST(time_band_id AS INT)) AS maxId
        FROM EM_Master_TimeBand
        WHERE media_type_id = @media_type_id
      `);

    const maxId = idResult.recordset[0].maxId || 0;
    const nextTimeBandId = String(maxId + 1).padStart(2, "0");


    // Insert new record
    await pool
      .request()
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("time_band_id", sql.VarChar(2), nextTimeBandId)
      .input("time_band_from", sql.NVarChar(10), time_band_from)
      .input("time_band_to", sql.NVarChar(10), time_band_to)
      .input("status", sql.VarChar(1), status).query(`
        INSERT INTO EM_Master_TimeBand (
          media_type_id, media_type, time_band_id, time_band_from, time_band_to, status
        )
        VALUES (
          @media_type_id, @media_type, @time_band_id, @time_band_from, @time_band_to, @status
        )
      `);

    res
      .status(201)
      .send(`TimeBand created: ${media_type_id}-${nextTimeBandId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};



//  UPDATE existing record using only time_band_id
const updateTimeBand = async (req, res) => {
  const { time_band_id } = req.params;
  const { media_type_id, media_type, time_band_from, time_band_to, status } = req.body;

  if (!media_type_id || !media_type || !time_band_from || !time_band_to || status === undefined) {
    return res.status(400).send("All fields are required!");
  }

  if (status !== "0" && status !== "1") {
    return res.status(400).send('Invalid status. Allowed: "0" or "1"');
  }

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input("time_band_id", sql.VarChar(2), time_band_id)
      .input("media_type_id", sql.VarChar(2), media_type_id)
      .input("media_type", sql.NVarChar(100), media_type)
      .input("time_band_from", sql.NVarChar(10), time_band_from)
      .input("time_band_to", sql.NVarChar(10), time_band_to)
      .input("status", sql.VarChar(1), status).query(`
        UPDATE EM_Master_TimeBand
        SET media_type_id = @media_type_id,
            media_type = @media_type,
            time_band_from = @time_band_from,
            time_band_to = @time_band_to,
            status = @status
        WHERE time_band_id = @time_band_id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("Record not found");
    }

    res.send("TimeBand updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = {
  getTimeBands,
  getTimeBandById,
  createTimeBand,
  updateTimeBand,
};
