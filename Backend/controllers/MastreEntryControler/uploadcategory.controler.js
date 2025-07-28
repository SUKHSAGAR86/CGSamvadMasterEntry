//---------------------------------Upload Category start here------------------------------

const {pool,poolConnect,sql}=require("../../database/dbConfig.js");

//Auto-generate next cat_cd like '001', '002', '003', ...
async function getNextCatCd() {
  const pool = await poolConnect;
  const request = pool.request();
  const result = await request.query(
    "SELECT MAX(CAST(cat_cd AS INT)) AS max_cd FROM UploadCategory"
  );

  const max = result.recordset[0].max_cd || 0;
  const next = (parseInt(max) + 1).toString().padStart(2, "0");
  return next;
}

//  insert record here
const createUploadCategory= async (req, res) => {
  try {
    const { cat_name, status, display_order } = req.body;
    const cat_cd = await getNextCatCd();
    const statusValue = status === "Active" || status === "1" ? 1 : 0;

    const pool = await poolConnect;
    const request = pool.request();

    await request
      .input("cat_cd", sql.VarChar(3), cat_cd)
      .input("cat_name", sql.NVarChar(50), cat_name)
      .input("status", sql.Bit, statusValue)
      .input("display_order", sql.Int, display_order).query(`
           INSERT INTO UploadCategory(cat_cd, cat_name, status, display_order)
           VALUES (@cat_cd, @cat_name, @status, @display_order)
         `);

    res.status(201).json({ message: "Category inserted", cat_cd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get READ ALL record
const getUploadCategory= async (req, res) => {
  try {
    const pool = await poolConnect;
    const request = pool.request();

    const result = await request.query(
      "SELECT * FROM UploadCategory ORDER BY cat_cd"
    );
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET record by cat_cd
const getUploadCategoryById= async (req, res) => {
  try {
    const { cat_cd } = req.params;

    const pool = await poolConnect;
    const request = pool.request();

    const result = await request
      .input("cat_cd", sql.VarChar(2), cat_cd)
      .query("SELECT * FROM UploadCategory WHERE cat_cd = @cat_cd");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE record here
const updateUploadCategory= async (req, res) => {
  try {
    const { cat_cd } = req.params;
    const { cat_name, status, display_order } = req.body;
    const statusValue = status === "Active" || status === "1" ? 1 : 0;

    const pool = await poolConnect;
    const request = pool.request();

    await request
      .input("cat_cd", sql.VarChar(3), cat_cd)
      .input("cat_name", sql.NVarChar(50), cat_name)
      .input("status", sql.Bit, statusValue)
      .input("display_order", sql.Int, display_order).query(`
           UPDATE UploadCategory 
           SET cat_name = @cat_name, status = @status, display_order = @display_order
           WHERE cat_cd = @cat_cd
         `);

    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getUploadCategory,
  getUploadCategoryById,
  createUploadCategory,
  updateUploadCategory,
};


//------------------------------------Upload Category End Here---------------------------------------
