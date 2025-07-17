import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import "./CustomButton.css";

function CustomButton({ children, onClick, variant, className, disabled }) {
  const buttonClass = `custom-btn custom-btn-${variant} ${className || ""}`;

  return (
    <Button onClick={onClick} className={buttonClass} disabled={disabled}>
      {children}
    </Button>
  );
}

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

CustomButton.defaultProps = {
  variant: "primary",
  disabled: false,
};

export default CustomButton;
