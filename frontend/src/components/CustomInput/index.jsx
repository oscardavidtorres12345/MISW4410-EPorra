import PropTypes from "prop-types";
import "./CustomInput.css";

function CustomInput({
  type,
  label,
  helperText,
  value,
  onChange,
  placeholder,
  error,
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
      {helperText && (
        <p
          className={
            error ? "custom-input-helper-error" : "custom-input-helper"
          }
        >
          {helperText}
        </p>
      )}
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
  error: PropTypes.bool,
};

CustomInput.defaultProps = {
  type: "text",
};

export default CustomInput;
