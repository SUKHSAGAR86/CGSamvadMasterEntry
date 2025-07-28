import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { BsBell, BsEnvelope } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({ toggleSidebar }) => {
  // Replace with context/Redux if needed
  const user = {
    name: 'SJ',
          avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd1Y_LHU5cIbQ1GOxw3x6yJVNv9IiGdsJQqZkFC0BnQBsRzJg2Z1Zg2pddadXpycxaDzo&usqp=CAU",
   
  }

  const navigate = useNavigate()

  const handleLogout = () => {
    // TODO: Clear auth tokens or session here
    navigate('/login')
  }

  return (
    <header className="bg-dark  border-bottom sticky-top d-flex align-items-center justify-content-between p-3 px-3 shadow-sm z-3">
      {/* Sidebar Toggle (Mobile) */}
      <button className="btn btn-outline-secondary d-lg-none" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Branding / Page Title */}
      <h5 className="mb-0  text-white fw-bold">Admin Dashboard</h5>

      {/* Right Side Icons + User */}
      <div className="d-flex align-items-center gap-3">
        {/* Notifications */}
        <button className="btn btn-link  text-white fw-bold position-relative p-0">
          <BsBell size={20} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            1
          </span>
        </button>

        {/* Messages */}
        <button className="btn btn-link  text-white fw-bold position-relative p-0">
          <BsEnvelope size={20} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
            1
          </span>
        </button>

        {/* Profile Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle variant="dark" className="d-flex align-items-center text-white gap-2 border-0 shadow-none">
            <img
              src={user.avatar}
              alt="User"
              width="30"
              height="30"
              className="rounded-circle"
            />
            <span className="d-none d-md-inline">{user.name}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/settings')}>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  )
}

export default AdminHeader
