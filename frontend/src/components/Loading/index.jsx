import React from "react";
import Spinner from "react-bootstrap/Spinner";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <Spinner animation="border" size="lg" />
    </div>
  );
};

export default Loading;
