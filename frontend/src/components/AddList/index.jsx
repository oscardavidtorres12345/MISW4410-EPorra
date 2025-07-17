import { useState } from "react";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomTable from "../CustomTable";
import "./AddList.css";
import PropTypes from "prop-types";

function AddList({
  label,
  firstField,
  secondField,
  firstFieldType,
  secondFieldType,
  onDataChange,
}) {
  const [showInputs, setShowInputs] = useState(false);
  const [firstFieldValue, setFirstFieldValue] = useState("");
  const [secondFieldValue, setSecondFieldValue] = useState("");
  const [rows, setRows] = useState([]);

  const handleAddClick = () => {
    setShowInputs(true);
    setFirstFieldValue("");
    setSecondFieldValue("");
  };

  const handleCancel = () => {
    setShowInputs(false);
    setFirstFieldValue("");
    setSecondFieldValue("");
  };

  const handleSave = () => {
    if (firstFieldValue.trim() !== "" && secondFieldValue.trim() !== "") {
      const newRows = [...rows, { firstFieldValue, secondFieldValue }];
      setRows(newRows);
      setShowInputs(false);
      setFirstFieldValue("");
      setSecondFieldValue("");

      if (onDataChange) {
        onDataChange(newRows);
      }
    }
  };

  const handleDelete = (rowIdx) => {
    const newRows = rows.filter((_, idx) => idx !== rowIdx);
    setRows(newRows);
    if (onDataChange) {
      onDataChange(newRows);
    }
  };

  return (
    <div className="add-list-container">
      <div className="add-list__label-container">
        <label className="add-list-label">{label}</label>
        {!showInputs && (
          <CustomButton
            onClick={handleAddClick}
            variant="secondary"
            className="add-list-plus-btn"
          >
            <i className="bi bi-plus-lg"></i>
          </CustomButton>
        )}
      </div>
      {showInputs && (
        <div className="add-list-inputs-row">
          <div className="add-list-inputs-container">
            <CustomInput
              type={firstFieldType}
              label={firstField}
              value={firstFieldValue}
              onChange={(e) => setFirstFieldValue(e.target.value)}
              placeholder={`Ingrese ${firstField.toLowerCase()}`}
            />
            <CustomInput
              type={secondFieldType}
              label={secondField}
              value={secondFieldValue}
              onChange={(e) => setSecondFieldValue(e.target.value)}
              placeholder={`Ingrese ${secondField.toLowerCase()}`}
            />
          </div>
          <div className="add-list-buttons-container">
            <CustomButton
              onClick={handleSave}
              variant="primary"
              className="add-list-action-btn"
            >
              <i className="bi bi-check-lg"></i>
            </CustomButton>
            <CustomButton
              onClick={handleCancel}
              variant="secondary"
              className="add-list-action-btn"
            >
              <i className="bi bi-x-lg"></i>
            </CustomButton>
          </div>
        </div>
      )}
      {rows.length > 0 && (
        <div className="add-list-table-container">
          <CustomTable
            headers={[firstField, secondField]}
            data={rows.map((row) => ({
              [firstField]: row.firstFieldValue,
              [secondField]: row.secondFieldValue,
            }))}
            actions={[
              {
                icon: "trash",
                onClick: (row, rowIdx) => handleDelete(rowIdx),
                tooltip: "Eliminar",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

AddList.propTypes = {
  label: PropTypes.string.isRequired,
  firstField: PropTypes.string.isRequired,
  secondField: PropTypes.string.isRequired,
  firstFieldType: PropTypes.string,
  secondFieldType: PropTypes.string,
  onDataChange: PropTypes.func,
};

AddList.defaultProps = {
  firstField: "Campo 1",
  secondField: "Campo 2",
  firstFieldType: "text",
  secondFieldType: "text",
};

export default AddList;
