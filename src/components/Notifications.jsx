import React from "react";

const Notifications = () => {
  const alerts = [
    "⚠️ Stock bajo en pollo",
    "✅ Meta de ventas alcanzada",
    "🛒 Nuevo pedido recibido",
  ];

  return (
    <div className="card shadow-sm">
      <div className="card-header">🔔 Notificaciones</div>
      <div className="card-body">
        <ul className="list-group">
          {alerts.map((alert, i) => (
            <li key={i} className="list-group-item">
              {alert}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
