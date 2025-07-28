import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import NICLOGO from '../../../assets/images/256px-NIC_logo.svg.png'

const AdminFooter = () => {
  const currentYear = new Date().getFullYear()
  const appVersion = 'v1.0.0' // You can pull from env or package.json if needed

  return (
    <footer className="bg-dark text-white shadow-sm mt-auto py-lg-3">
      <div className="container-fluid">
        <div className="row align-items-center text-center text-lg-start flex-wrap g-3">
          {/* Left - Copyright */}
          <div className="col-12 col-lg d-flex justify-content-center justify-content-lg-start">
            <div>
              &copy; {currentYear} creativeLabs. <span className="ms-2">Version {appVersion}</span>
            </div>
          </div>

          {/* Center - Logo */}
          <div className="col-12 col-lg d-flex justify-content-center">
          <img
  src={NICLOGO}
  alt="NIC Logo"
  className="footer-logo"
  style={{
    height: '3rem',
    width: 'auto',
  }}
/>
          </div>

          {/* Right - Powered by */}
          <div className="col-12 col-lg d-flex justify-content-center justify-content-lg-end">
            <div>
              <span className="me-1">Powered by</span>
              <a
                href="https://coreui.io/react"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                CoreUI React Admin Template
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AdminFooter
