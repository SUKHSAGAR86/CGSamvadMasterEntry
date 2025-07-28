// const { pool, sql, poolConnect } = require("../../database/dbConfig.js");

// // GET all production types
// const getProductionType = async (req, res) => {
//   try {
//     await poolConnect;
//     const result = await pool
//       .request()
//       .query("SELECT * FROM EM_Master_ProductionType");
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// // GET a single production type by ID
// const getProductionTypeById = async (req, res) => {
//   const { production_type_id } = req.params;
//   try {
//     await poolConnect;
//     const result = await pool
//       .request()
//       .input("production_type_id", sql.VarChar(2), production_type_id)
//       .query(
//         "SELECT * FROM EM_Master_ProductionType WHERE production_type_id = @production_type_id"
//       );

//     if (result.recordset.length === 0) {
//       return res.status(404).send("Production type not found");
//     }

//     res.json(result.recordset[0]);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// // CREATE a new production type
// const createProductionType = async (req, res) => {
//   const { production_type_id, production_type, status, display_order } =
//     req.body;

//   if (!production_type_id) {
//     return res.status(400).send("Production type ID is required");
//   }

//   try {
//     await poolConnect;
//     await pool
//       .request()
//       .input("production_type_id", sql.VarChar(2), production_type_id)
//       .input("production_type", sql.NVarChar(100), production_type)
//       .input("status", sql.VarChar(1), status)
//       .input("display_order", sql.Int, display_order).query(`
//         INSERT INTO EM_Master_ProductionType 
//         (production_type_id, production_type, status, display_order)
//         VALUES (@production_type_id, @production_type, @status, @display_order)
//       `);

//     res.status(201).json({
//       message: "Production type created successfully",
//     });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// // UPDATE an existing production type
// const updateProductionType = async (req, res) => {
//   const { production_type_id } = req.params;
//   const { production_type, status, display_order } = req.body;

//   if (!production_type_id) {
//     return res.status(400).send("Production type ID is required");
//   }

//   try {
//     await poolConnect;

//     // Check if record exists
//     const checkResult = await pool
//       .request()
//       .input("production_type_id", sql.VarChar(2), production_type_id)
//       .query(
//         "SELECT * FROM EM_Master_ProductionType WHERE production_type_id = @production_type_id"
//       );

//     if (checkResult.recordset.length === 0) {
//       return res.status(404).send("Production type not found");
//     }

//     // Update the record
//     await pool
//       .request()
//       .input("production_type_id", sql.VarChar(2), production_type_id)
//       .input("production_type", sql.NVarChar(100), production_type)
//       .input("status", sql.VarChar(1), status)
//       .input("display_order", sql.Int, display_order).query(`
//         UPDATE EM_Master_ProductionType SET 
//           production_type = @production_type,
//           status = @status,
//           display_order = @display_order
//         WHERE production_type_id = @production_type_id
//       `);

//     res.send("Production type updated successfully");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

// module.exports = {
//   getProductionType,
//   getProductionTypeById,
//   createProductionType,
//   updateProductionType,
// };


const { pool, sql, poolConnect } = require("../../database/dbConfig.js");

// GET all production types
const getProductionType = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT * FROM EM_Master_ProductionType");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET a single production type by ID
const getProductionTypeById = async (req, res) => {
  const { production_type_id } = req.params;
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("production_type_id", sql.VarChar(2), production_type_id)
      .query(
        "SELECT * FROM EM_Master_ProductionType WHERE production_type_id = @production_type_id"
      );

    if (result.recordset.length === 0) {
      return res.status(404).send("Production type not found");
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE a new production type with auto-generated ID
const createProductionType = async (req, res) => {
  const { production_type, status, display_order } = req.body;

  if (!production_type || !status || display_order === undefined) {
    return res.status(400).send("All fields are required");
  }

  try {
    await poolConnect;

    // Get the max existing ID and calculate the next ID
    const idResult = await pool
      .request()
      .query("SELECT MAX(CAST(production_type_id AS INT)) AS maxId FROM EM_Master_ProductionType");

    const maxId = idResult.recordset[0].maxId || 0;
    const nextId = (maxId + 1).toString().padStart(2, '0'); // Pad with 0: '01', '02'

    await pool
      .request()
      .input("production_type_id", sql.VarChar(2), nextId)
      .input("production_type", sql.NVarChar(100), production_type)
      .input("status", sql.VarChar(1), status)
      .input("display_order", sql.Int, display_order)
      .query(`
        INSERT INTO EM_Master_ProductionType 
        (production_type_id, production_type, status, display_order)
        VALUES (@production_type_id, @production_type, @status, @display_order)
      `);

    res.status(201).json({
      message: "Production type created successfully",
      production_type_id: nextId,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE an existing production type
const updateProductionType = async (req, res) => {
  const { production_type_id } = req.params;
  const { production_type, status, display_order } = req.body;

  if (!production_type_id) {
    return res.status(400).send("Production type ID is required");
  }

  try {
    await poolConnect;

    // Check if record exists
    const checkResult = await pool
      .request()
      .input("production_type_id", sql.VarChar(2), production_type_id)
      .query(
        "SELECT * FROM EM_Master_ProductionType WHERE production_type_id = @production_type_id"
      );

    if (checkResult.recordset.length === 0) {
      return res.status(404).send("Production type not found");
    }

    // Update the record
    await pool
      .request()
      .input("production_type_id", sql.VarChar(2), production_type_id)
      .input("production_type", sql.NVarChar(100), production_type)
      .input("status", sql.VarChar(1), status)
      .input("display_order", sql.Int, display_order)
      .query(`
        UPDATE EM_Master_ProductionType SET 
          production_type = @production_type,
          status = @status,
          display_order = @display_order
        WHERE production_type_id = @production_type_id
      `);

    res.send("Production type updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getProductionType,
  getProductionTypeById,
  createProductionType,
  updateProductionType,
};
