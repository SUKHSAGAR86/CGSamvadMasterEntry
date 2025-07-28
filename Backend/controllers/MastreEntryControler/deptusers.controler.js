//  Utility: Get Date and Time
const getDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // HH:MM:SS
  return { date, time };
};

// Utility: Get IP Address
function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"] || req.connection?.remoteAddress || req.ip
  );
}

//  POST - Register Dept User with Auto user_id
app.post("/api/deptuser-register", async (req, res) => {
  await poolConnect;
  try {
    const {
      username,
      address,
      mobile,
      dob,
      pwd,
      user_type_code,
      first_login,
      section_cd,
      login_flag,
      pwd_changed_date,
      user_status,
      who_created,
    } = req.body;

    if (!username || !pwd) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Generate auto-incrementing user_id like 001, 002...
    const lastUserQuery = await pool
      .request()
      .query("SELECT TOP 1 user_id FROM DeptUser_Login ORDER BY user_id DESC");

    let newId = "001"; // default if no record
    if (lastUserQuery.recordset.length > 0) {
      const lastId = lastUserQuery.recordset[0].user_id;
      const numericId = parseInt(lastId, 10) + 1;
      newId = numericId.toString().padStart(3, "0");
    }

    const hashedPassword = sha256(pwd);
    const { date: nowDate, time: nowTime } = getDateTime();
    const ip = getClientIp(req);

    await pool
      .request()
      .input("user_id", sql.VarChar(3), newId)
      .input("username", sql.VarChar(25), username)
      .input("address", sql.VarChar(60), address)
      .input("mobile", sql.VarChar(10), mobile)
      .input("dob", sql.Date, dob)
      .input("pwd", sql.VarChar(64), hashedPassword)
      .input("user_type_code", sql.VarChar(3), user_type_code)
      .input("first_login", sql.NVarChar(1), first_login)
      .input("section_cd", sql.VarChar(3), section_cd)
      .input("login_date", sql.Date, nowDate)
      .input("logout_date", sql.Date, null)
      .input("login_flag", sql.NVarChar(1), login_flag)
      .input("pwd_changed_date", sql.Date, pwd_changed_date || nowDate)
      .input("creation_date", sql.Date, nowDate)
      .input("user_status", sql.VarChar(1), user_status)
      .input("who_created", sql.VarChar(50), who_created)
      .input("login_time", sql.VarChar(14), nowTime)
      .input("login_ip_address", sql.VarChar(50), ip)
      .input("logout_flag", sql.VarChar(1), null)
      .input("logout_time", sql.VarChar(14), null)
      .input("logout_ip_address", sql.VarChar(50), null)
      .input("entry_date", sql.Date, nowDate)
      .input("entry_time", sql.VarChar(14), nowTime)
      .input("ip_address", sql.VarChar(50), ip).query(`
          INSERT INTO DeptUser_Login (
            user_id, username, address, mobile, dob, pwd, user_type_code, first_login, section_cd,
            login_date, logout_date, login_flag, pwd_changed_date, creation_date, user_status, who_created,
            login_time, login_ip_address, logout_flag, logout_time, logout_ip_address, entry_date, entry_time, ip_address
          )
          VALUES (
            @user_id, @username, @address, @mobile, @dob, @pwd, @user_type_code, @first_login, @section_cd,
            @login_date, @logout_date, @login_flag, @pwd_changed_date, @creation_date, @user_status, @who_created,
            @login_time, @login_ip_address, @logout_flag, @logout_time, @logout_ip_address, @entry_date, @entry_time, @ip_address
          )
        `);

    res
      .status(201)
      .json({ message: "User registered successfully!", user_id: newId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update Dept User
app.put("/api/deptuser-update/:user_id", async (req, res) => {
  await poolConnect;
  try {
    const { user_id } = req.params;
    const {
      pwd,
      user_type_code,
      first_login,
      section_cd,
      address,
      mobile,
      dob,
      login_flag,
      pwd_changed_date,
      user_status,
      modify_by_user_name,
      password_reset_by_user_id,
      password_reset_by_user_name,
    } = req.body;

    const hashedPassword = sha256(pwd);
    const { date: nowDate, time: nowTime } = getDateTime();
    const ip = getClientIp(req);

    const result = await pool
      .request()
      .input("user_id", sql.VarChar(3), user_id)
      .input("address", sql.VarChar(60), address)
      .input("mobile", sql.VarChar(10), mobile)
      .input("dob", sql.Date, dob)
      .input("pwd", sql.VarChar(64), hashedPassword)
      .input("user_type_code", sql.VarChar(3), user_type_code)
      .input("first_login", sql.NVarChar(1), first_login)
      .input("section_cd", sql.VarChar(3), section_cd)
      .input("login_flag", sql.NVarChar(1), login_flag)
      .input("pwd_changed_date", sql.Date, pwd_changed_date || nowDate)
      .input("user_status", sql.VarChar(1), user_status)
      .input("modify_by_user_name", sql.NVarChar(50), modify_by_user_name)
      .input("modify_date", sql.Date, nowDate)
      .input("modify_time", sql.NVarChar(14), nowTime)
      .input("modify_ip_address", sql.VarChar(50), ip)
      .input("password_reset_date", sql.Date, nowDate)
      .input("password_reset_time", sql.VarChar(14), nowTime)
      .input("password_reset_ip_address", sql.NVarChar(50), ip)
      .input(
        "password_reset_by_user_id",
        sql.NVarChar(50),
        password_reset_by_user_id
      )
      .input(
        "password_reset_by_user_name",
        sql.NVarChar(50),
        password_reset_by_user_name
      ).query(`
          UPDATE DeptUser_Login SET
            dob = @dob,
            address = @address,
            mobile = @mobile,
            pwd = @pwd,
            user_type_code = @user_type_code,
            first_login = @first_login,
            section_cd = @section_cd,
            login_flag = @login_flag,
            pwd_changed_date = @pwd_changed_date,
            user_status = @user_status,
            modify_by_user_name = @modify_by_user_name,
            modify_date = @modify_date,
            modify_time = @modify_time,
            modify_ip_address = @modify_ip_address,
            password_reset_date = @password_reset_date,
            password_reset_time = @password_reset_time,
            password_reset_ip_address = @password_reset_ip_address,
            password_reset_by_user_id = @password_reset_by_user_id,
            password_reset_by_user_name = @password_reset_by_user_name
          WHERE user_id = @user_id
        `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//get all users record----------------
app.get("/api/deptusers", async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query("SELECT * FROM DeptUser_Login");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//get one record----------
app.get("/api/deptuser/:id", async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("id", sql.VarChar(3), req.params.id)
      .query("SELECT * FROM DeptUser_Login WHERE user_id = @id");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
