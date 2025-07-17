import PropTypes from "prop-types";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import "./SidebarMenu.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function SidebarMenu({ items, activeIndex = 0, onSelect }) {
  const [show, setShow] = useState(false);
  const isMobile = window.innerWidth < 768;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const renderItems = () => (
    <Nav className="flex-column align-items-center">
      {items.map((item, idx) => (
        <Nav.Link
          key={idx}
          href={item.href || "#"}
          onClick={() => onSelect && onSelect(idx)}
          className={`sidebar-icon-link ${
            idx === activeIndex ? "active" : "inactive"
          }${isMobile ? " sidebar-mobile-link" : ""}`}
          data-testid="sidebar-icon-link"
        >
          <i
            className={`bi bi-${item.icon} ${
              idx === activeIndex ? "sidebar-icon-glow" : ""
            }`}
          ></i>
          {isMobile && <span className="sidebar-link-text">{item.text}</span>}
        </Nav.Link>
      ))}
    </Nav>
  );

  return (
    <>
      {isMobile ? (
        <>
          {!show && (
            <Button
              variant="primary"
              onClick={handleShow}
              className="sidebar-mobile-btn"
              aria-label="Abrir menú"
            >
              <i className="bi bi-list"></i>
            </Button>
          )}
          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="start"
            fullscreen
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body data-testid="sidebar-navbar">
              {renderItems()}
            </Offcanvas.Body>
          </Offcanvas>
        </>
      ) : (
        <Navbar
          bg="light"
          className="sidebar-navbar"
          data-testid="sidebar-navbar"
        >
          <div className="sidebar-navbar-content">{renderItems()}</div>
        </Navbar>
      )}
    </>
  );
}

SidebarMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      text: PropTypes.string,
      href: PropTypes.string,
    })
  ).isRequired,
  activeIndex: PropTypes.number,
  onSelect: PropTypes.func,
};

export default SidebarMenu;
