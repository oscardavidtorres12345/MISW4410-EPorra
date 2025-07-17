import PropTypes from "prop-types";
import "./CustomInput.css";

function CustomInput({
  type,
  label,
  helperText,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="custom-input-container">
      {label && <label className="custom-input-label">{label}</label>}
      <input
        type={type}
        className="custom-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {helperText && <p className="custom-input-helper">{helperText}</p>}
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

CustomInput.defaultProps = {
  type: "text",
};

export default CustomInput;
