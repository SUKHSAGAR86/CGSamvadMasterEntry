//-------------------------------------Employee Start Here------------------------------------

const{pool,poolConnect,sql}=require("../../database/dbConfig.js")


//Utility: Date & Time
const getDateTime = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0]; // HH:MM:SS
  return { date, time };
};

//CREATE Employee here
const createEmployee = async (req, res) => {
  await poolConnect;
  const ip = req.ip;
  const { date, time } = getDateTime();
  const {
    employee_cd,
    name_E,
    name_H,
    office_address_E,
    office_address_H,
    emp_address_E,
    emp_address_H,
    designation_cd,
    rti_desig_cd,
    email_id,
    mobile_no,
    landline_no,
    fax_no,
    std_code,
    display_in_directory,
    order_no,
    salary_detail,
    section_cd,
    flag,
    dob,
    section_wark,
    user_active,
    user_type_code,
    joining_date,
    Order_number,
    Retirement_date,
    OpeningLeave_id,
    OpeningEarned_Leave,
    OpeningCommuted_Leave,
    OpeningEmergency_Leave,
    OpeningOptional_Leave,
    ForAttendence,
    jobtype,
    entry_by_user_id,
    entry_by_user_name,
  } = req.body;

  try {
    const request = pool.request();
    request.input("employee_cd", sql.VarChar(5), employee_cd);
    request.input("name_E", sql.NVarChar(100), name_E);
    request.input("name_H", sql.NVarChar(200), name_H);
    request.input("office_address_E", sql.NVarChar(300), office_address_E);
    request.input("office_address_H", sql.NVarChar(500), office_address_H);
    request.input("emp_address_E", sql.NVarChar(300), emp_address_E);
    request.input("emp_address_H", sql.NVarChar(500), emp_address_H);
    request.input("designation_cd", sql.VarChar(3), designation_cd);
    request.input("rti_desig_cd", sql.VarChar(3), rti_desig_cd);
    request.input("email_id", sql.NVarChar(50), email_id);
    request.input("mobile_no", sql.VarChar(10), mobile_no);
    request.input("landline_no", sql.NVarChar(10), landline_no);
    request.input("fax_no", sql.NVarChar(12), fax_no);
    request.input("std_code", sql.VarChar(6), std_code);
    request.input("display_in_directory", sql.Int, display_in_directory);
    request.input("order_no", sql.Int, order_no);
    request.input("salary_detail", sql.NVarChar(300), salary_detail);
    request.input("section_cd", sql.VarChar(3), section_cd);
    request.input("flag", sql.Int, flag);
    request.input("dob", sql.DateTime, dob);
    request.input("section_wark", sql.NVarChar(300), section_wark);
    request.input("user_active", sql.Char(1), user_active);
    request.input("user_type_code", sql.VarChar(2), user_type_code);
    request.input("joining_date", sql.Date, joining_date);
    request.input("Order_number", sql.VarChar(10), Order_number);
    request.input("Retirement_date", sql.Date, Retirement_date);
    request.input("OpeningLeave_id", sql.VarChar(10), OpeningLeave_id);
    request.input("OpeningEarned_Leave", sql.Int, OpeningEarned_Leave);
    request.input("OpeningCommuted_Leave", sql.Int, OpeningCommuted_Leave);
    request.input("OpeningEmergency_Leave", sql.Int, OpeningEmergency_Leave);
    request.input("OpeningOptional_Leave", sql.Int, OpeningOptional_Leave);
    request.input("ForAttendence", sql.Int, ForAttendence);
    request.input("jobtype", sql.VarChar(20), jobtype);
    request.input("entry_date", sql.Date, date);
    request.input("entry_time", sql.VarChar(14), time);
    request.input("ip_address", sql.NVarChar(20), ip);
    request.input("entry_by_user_id", sql.VarChar(10), entry_by_user_id);
    request.input("entry_by_user_name", sql.NVarChar(100), entry_by_user_name);
    await request.query(`
        INSERT INTO Employee (
          employee_cd, name_E, name_H, office_address_E, office_address_H,
          emp_address_E, emp_address_H, designation_cd, email_id, mobile_no,
          landline_no, fax_no, std_code, display_in_directory, order_no,
          salary_detail, section_cd, flag, dob, section_wark, user_active,
          user_type_code, joining_date, Order_number, Retirement_date,
          OpeningLeave_id, OpeningEarned_Leave, OpeningCommuted_Leave,
          OpeningEmergency_Leave, OpeningOptional_Leave, ForAttendence,
          jobtype, entry_date, entry_time, ip_address, entry_by_user_id,
          entry_by_user_name,rti_desig_cd
        )
        VALUES (
          @employee_cd, @name_E, @name_H, @office_address_E, @office_address_H,
          @emp_address_E, @emp_address_H, @designation_cd, @email_id, @mobile_no,
          @landline_no, @fax_no, @std_code, @display_in_directory, @order_no,
          @salary_detail, @section_cd, @flag, @dob, @section_wark, @user_active,
          @user_type_code, @joining_date, @Order_number, @Retirement_date,
          @OpeningLeave_id, @OpeningEarned_Leave, @OpeningCommuted_Leave,
          @OpeningEmergency_Leave, @OpeningOptional_Leave, @ForAttendence,
          @jobtype, @entry_date, @entry_time, @ip_address, @entry_by_user_id,
          @entry_by_user_name,@rti_desig_cd
        )
      `);

    res.status(201).send("Employee created successfully.");
  } catch (err) {
    console.error("Insert error:", err.message);
    res.status(500).send(err.message);
  }
};

//Get All Employees
const getEmployee = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query("SELECT * FROM Employee");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Get One by ID
const getEmployeeById = async (req, res) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("id", sql.VarChar(5), req.params.id)
      .query("SELECT * FROM Employee WHERE employee_cd = @id");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE Employee by ID
const updateEmlpoyee = async (req, res) => {
  await poolConnect;
  const ip = req.ip;
  const { date, time } = getDateTime();
  const {
    name_E,
    name_H,
    office_address_E,
    office_address_H,
    emp_address_E,
    emp_address_H,
    designation_cd,
    rti_desig_cd,
    email_id,
    mobile_no,
    landline_no,
    fax_no,
    std_code,
    display_in_directory,
    order_no,
    salary_detail,
    section_cd,
    flag,
    dob,
    section_wark,
    user_active,
    user_type_code,
    joining_date,
    Order_number,
    Retirement_date,
    OpeningLeave_id,
    OpeningEarned_Leave,
    OpeningCommuted_Leave,
    OpeningEmergency_Leave,
    OpeningOptional_Leave,
    ForAttendence,
    jobtype,
    modify_by_user_id,
    modify_by_user_name,
  } = req.body;

  try {
    const request = pool.request();
    request.input("employee_cd", sql.VarChar(5), req.params.id);
    request.input("name_E", sql.NVarChar(100), name_E);
    request.input("name_H", sql.NVarChar(200), name_H);
    request.input("office_address_E", sql.NVarChar(300), office_address_E);
    request.input("office_address_H", sql.NVarChar(500), office_address_H);
    request.input("emp_address_E", sql.NVarChar(300), emp_address_E);
    request.input("emp_address_H", sql.NVarChar(500), emp_address_H);
    request.input("designation_cd", sql.VarChar(3), designation_cd);
    request.input("rti_desig_cd", sql.VarChar(3), rti_desig_cd);
    request.input("email_id", sql.NVarChar(50), email_id);
    request.input("mobile_no", sql.VarChar(10), mobile_no);
    request.input("landline_no", sql.NVarChar(10), landline_no);
    request.input("fax_no", sql.NVarChar(12), fax_no);
    request.input("std_code", sql.VarChar(6), std_code);
    request.input("display_in_directory", sql.Int, display_in_directory);
    request.input("order_no", sql.Int, order_no);
    request.input("salary_detail", sql.NVarChar(300), salary_detail);
    request.input("section_cd", sql.VarChar(3), section_cd);
    request.input("flag", sql.Int, flag);
    request.input("dob", sql.DateTime, dob);
    request.input("section_wark", sql.NVarChar(300), section_wark);
    request.input("user_active", sql.Char(1), user_active);
    request.input("user_type_code", sql.VarChar(2), user_type_code);
    request.input("joining_date", sql.Date, joining_date);
    request.input("Order_number", sql.VarChar(10), Order_number);
    request.input("Retirement_date", sql.Date, Retirement_date);
    request.input("OpeningLeave_id", sql.VarChar(10), OpeningLeave_id);
    request.input("OpeningEarned_Leave", sql.Int, OpeningEarned_Leave);
    request.input("OpeningCommuted_Leave", sql.Int, OpeningCommuted_Leave);
    request.input("OpeningEmergency_Leave", sql.Int, OpeningEmergency_Leave);
    request.input("OpeningOptional_Leave", sql.Int, OpeningOptional_Leave);
    request.input("ForAttendence", sql.Int, ForAttendence);
    request.input("jobtype", sql.VarChar(20), jobtype);
    request.input("modify_date", sql.Date, date);
    request.input("modify_time", sql.VarChar(14), time);
    request.input("modify_ip_address", sql.NVarChar(20), ip);
    request.input("modify_by_user_id", sql.VarChar(10), modify_by_user_id);
    request.input(
      "modify_by_user_name",
      sql.NVarChar(100),
      modify_by_user_name
    );

    await request.query(`
        UPDATE Employee SET
          name_E=@name_E, name_H=@name_H, office_address_E=@office_address_E,
          office_address_H=@office_address_H, emp_address_E=@emp_address_E,
          emp_address_H=@emp_address_H, designation_cd=@designation_cd,rti_desig_cd=@rti_desig_cd,
          email_id=@email_id, mobile_no=@mobile_no, landline_no=@landline_no,
          fax_no=@fax_no, std_code=@std_code, display_in_directory=@display_in_directory,
          order_no=@order_no, salary_detail=@salary_detail, section_cd=@section_cd,
          flag=@flag, dob=@dob, section_wark=@section_wark, user_active=@user_active,
          user_type_code=@user_type_code, joining_date=@joining_date,
          Order_number=@Order_number, Retirement_date=@Retirement_date,
          OpeningLeave_id=@OpeningLeave_id, OpeningEarned_Leave=@OpeningEarned_Leave,
          OpeningCommuted_Leave=@OpeningCommuted_Leave, OpeningEmergency_Leave=@OpeningEmergency_Leave,
          OpeningOptional_Leave=@OpeningOptional_Leave, ForAttendence=@ForAttendence,
          jobtype=@jobtype, modify_date=@modify_date, modify_time=@modify_time,
          modify_ip_address=@modify_ip_address, modify_by_user_id=@modify_by_user_id,
          modify_by_user_name=@modify_by_user_name
        WHERE employee_cd=@employee_cd
      `);

    res.send("Employee updated successfully.");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createEmployee,
  getEmployee,
  getEmployeeById,
  updateEmlpoyee,
};
//----------------------------Emlpoyee End Here--------------------------------------------
