const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Get all map job type production types
const getMapJobTypeProductionType = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_Map_JobType_ProductionType");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
//// Get a single map job type production type by production_type_id
const getMapJobTypeProductionTypeById = async (req, res) => {
  try {
    await poolConnect;
    const { production_type_id } = req.params;
    const result = await pool
      .request()
      .input("production_type_id", sql.Int, production_type_id)
      .query(
        "SELECT * FROM EM_Master_Map_JobType_ProductionType WHERE production_type_id = @production_type_id"
      );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
//insert new map job type production type
const createMapJobTypeProductionType = async (req, res) => {
  const { job_type_id, job_type, production_type_id, production_type, status } =
    req.body;

  if (!production_type_id) {
    return res.status(400).send('Production Type is required !');
  }
  if(status !== "0" && status !== "1"){
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }
  try {
    await poolConnect;
    // Insert the new record
    const result = await pool
      .request()
      .input("job_type_id", sql.Int, job_type_id)
      .input("job_type", sql.VarChar(100), job_type)
      .input("production_type_id", sql.Int, production_type_id)
      .input("production_type", sql.VarChar(100), production_type)
      .input("status", sql.VarChar(1), status)
      .query(`INSERT INTO EM_Master_Map_JobType_ProductionType(
        job_type_id,job_type, production_type_id,production_type,status) 
        VALUES (@job_type_id,@job_type,@production_type_id,@production_type,@status)`);

    res.status(201).send(`Record created successfully ${production_type_id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//update an existing map job type production type
const updateMapJobTypeProductionType = async (req, res) => {
  const { production_type_id } = req.params;
  const { job_type_id, job_type, production_type, status } = req.body; 
  if (!production_type_id) {
    return res.status(400).send('Production Type ID is required !');
  }
  if(status !== "0" && status !== "1"){
    return res.status(400).send('Invalid status. Allowed values: "0", or "1"');
  }
  try {
    await poolConnect;
    // Update the record
    const result = await pool
      .request()
      .input("production_type_id", sql.Int, production_type_id)
      .input("job_type_id", sql.Int, job_type_id)
      .input("job_type", sql.VarChar(100), job_type)
      .input("production_type", sql.VarChar(100), production_type)
      .input("status", sql.VarChar(1), status)
      .query(`UPDATE EM_Master_Map_JobType_ProductionType 
              SET job_type_id = @job_type_id, 
                  job_type = @job_type, 
                  production_type = @production_type, 
                  status = @status 
              WHERE production_type_id = @production_type_id`);

    res.status(200).send(`Record updated successfully ${production_type_id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
}



module.exports = {
  getMapJobTypeProductionType,
  getMapJobTypeProductionTypeById,
  createMapJobTypeProductionType,
  updateMapJobTypeProductionType
};
