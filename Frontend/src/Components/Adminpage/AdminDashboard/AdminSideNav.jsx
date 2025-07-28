import React from "react";
import AdminSideNavbar from "./AdminSideNavbar";

const AdminSideNav = () => {
  return (
    <div>
      <div className="border-bottom sticky-top d-flex align-items-center justify-content-center p-3 px-3 shadow-sm z-3">
        <div className="me-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd1Y_LHU5cIbQ1GOxw3x6yJVNv9IiGdsJQqZkFC0BnQBsRzJg2Z1Zg2pddadXpycxaDzo&usqp=CAU"
            height="40"
            className="d-inline-block align-top rounded-5"
          />
        </div>
        <div className="fw-bold text-danger fs-4">CG Samvad</div>
      </div>

      <div>
        <AdminSideNavbar/>
      </div>
    </div>
  );
};
export default AdminSideNav;


