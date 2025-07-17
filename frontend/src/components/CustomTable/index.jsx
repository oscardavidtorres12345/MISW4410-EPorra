import Table from "react-bootstrap/Table";
import PropTypes from "prop-types";
import "./CustomTable.css";

function CustomTable({ headers, data, actions }) {
  return (
    <Table
      striped
      bordered
      hover
      className={`table${actions && actions.length ? " has-actions" : ""}`}
    >
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
          {actions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {Array.isArray(row)
              ? row.map((cell, cellIdx) => <td key={cellIdx}>{cell}</td>)
              : headers.map((header, cellIdx) => (
                  <td key={cellIdx}>{row[header]}</td>
                ))}
            {actions && (
              <td>
                <div className="actions-container">
                  {actions.map((action, actionIdx) => (
                    <button
                      key={actionIdx}
                      className="action-button"
                      onClick={() =>
                        action.onClick && action.onClick(row, rowIdx)
                      }
                      title={action.tooltip || action.label}
                    >
                      <i className={`bi bi-${action.icon}`}></i>
                    </button>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

CustomTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      label: PropTypes.string,
      tooltip: PropTypes.string,
    })
  ),
};

export default CustomTable;
