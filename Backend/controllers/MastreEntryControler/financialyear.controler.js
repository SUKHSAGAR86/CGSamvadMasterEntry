//-------------------------Finacial Year----------------------------------
const { pool, poolConnect, sql } = require("../../database/dbConfig.js");

// Insert Financial Year (auto-generate Sno)
const createFinancialYear = async (req, res) => {
  const { financial_year, status } = req.body;
  const statusValue = status === "Active" ? 1 : 0;

  try {
    const result = await pool
      .request()
      .query("SELECT MAX(Sno) AS maxSno FROM FinancialYear");
    let maxSno = result.recordset[0].maxSno;

    let nextSno = "001";
    if (maxSno) {
      const nextNumber = parseInt(maxSno, 10) + 1;
      nextSno = nextNumber.toString().padStart(3, "0");
    }

    await pool
      .request()
      .input("Sno", sql.VarChar(3), nextSno)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("status", sql.Int, statusValue)
      .query(
        "INSERT INTO FinancialYear (Sno, financial_year, status) VALUES (@Sno, @financial_year, @status)"
      );

    res.status(201).json({ message: "Record created", Sno: nextSno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Financial Years
const getFinancialYear = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM FinancialYear");
    const records = result.recordset.map((record) => ({
      ...record,
      status: record.status === 1 ? "Active" : "Inactive",
    }));
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one Financial Year
const getFinancialYearById = async (req, res) => {
  try {
    const result = await pool
      .request()
      .input("Sno", sql.VarChar(3), req.params.sno)
      .query("SELECT * FROM FinancialYear WHERE Sno = @Sno");

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Record not found" });

    const record = result.recordset[0];
    record.status = record.status === 1 ? "Active" : "Inactive";
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Financial Year
const updateFinancialYear = async (req, res) => {
  const { financial_year, status } = req.body;
  const statusValue = status === "Active" ? 1 : 0;

  try {
    await pool
      .request()
      .input("Sno", sql.VarChar(3), req.params.sno)
      .input("financial_year", sql.VarChar(9), financial_year)
      .input("status", sql.Int, statusValue)
      .query(
        "UPDATE FinancialYear SET financial_year = @financial_year, status = @status WHERE Sno = @Sno"
      );
    res.json({ message: "Record updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getFinancialYear,
  getFinancialYearById,
  createFinancialYear,
  updateFinancialYear,
};

//--------------------------finacial Year End----------------------------
