// src/components/DashboardCard.jsx
import React from "react";

const DashboardCard = ({ title, value }) => {
  return (
    <div className="col-md-3 mb-3">
      <div className="card text-center shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text fs-4 fw-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
