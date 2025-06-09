import logo from "../../public/v2logo2.jpg";
import { IoIosInformationCircle } from "react-icons/io";
const Header = ({ handleInfoModalOpen }) => {
  return (
    <header className="navbar navbar-expand-md d-print-none">
      <div className="container-xl">
        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
          aria-controls="navbar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          <a href=".">
            <img
              src={logo}
              alt="V2"
              className="navbar-brand-image"
              style={{height: "40px", width: "40px"}}
            />
          </a>
        </h1>
        <div>
          <p style={{ fontWeight: 700, fontSize: "clamp(0.75rem, 4vw, 2rem)", }} className="mb-0">New Site Requisition Form</p>
        </div>
        <div className="navbar-nav flex-row order-md-last align-items-center">
          <button
            className="btn btn-twitter"
            style={{
              backgroundColor: "#0d6efd",
            }}
            onClick={handleInfoModalOpen}
          >
            <IoIosInformationCircle size={18} className="me-1"/>
            info
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
