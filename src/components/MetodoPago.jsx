import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import qrYape from "../assets/qr-yape.jpg";

export default function MetodoPago({
  metodoPago,
  setMetodoPago,
  montoPagado,
  setMontoPagado,
  vuelto,
  setVuelto,
  total,
  ultimos4,
  setUltimos4,
  codigoIzipay,
  setCodigoIzipay,
}) {
  useEffect(() => {
    if (metodoPago === "EFECTIVO") {
      const calc = parseFloat(montoPagado) - parseFloat(total);
      setVuelto(calc > 0 ? calc : 0);
    } else {
      setVuelto(0);
    }
  }, [montoPagado, metodoPago, total, setVuelto]);

  return (
    <div className="card shadow-sm mt-3 p-3 border-danger" style={{ borderWidth: 2 }}>
      <h5 className="text-danger fw-bold">Método de Pago</h5>

      <div className="btn-group w-100 mb-3">
        <button
          className={`btn ${metodoPago === "EFECTIVO" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setMetodoPago("EFECTIVO")}
        >
          Efectivo
        </button>
        <button
          className={`btn ${metodoPago === "YAPE" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setMetodoPago("YAPE")}
        >
          Yape
        </button>
        <button
          className={`btn ${metodoPago === "IZIPAY" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setMetodoPago("IZIPAY")}
        >
          Izipay
        </button>
      </div>

      {metodoPago === "EFECTIVO" && (
        <div>
          <label className="form-label fw-bold">Monto Pagado</label>
          <input
            type="number"
            className="form-control"
            value={montoPagado}
            onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
          />
          <div className="mt-2">
            <strong>Vuelto: </strong> S/ {vuelto.toFixed(2)}
          </div>
        </div>
      )}

      {metodoPago === "YAPE" && (
        <div className="text-center">
          <p className="fw-bold m-1">Escanea el QR</p>
          <img
            src={qrYape}
            alt="QR Yape"
            style={{ width: "70%", borderRadius: 10 }}
          />
        </div>
      )}

      {metodoPago === "IZIPAY" && (
        <div>
          <label className="form-label fw-bold">Últimos 4 dígitos</label>
          <input
            type="text"
            className="form-control mb-2"
            maxLength={4}
            value={ultimos4}
            onChange={(e) => setUltimos4(e.target.value.replace(/[^0-9]/g, ""))}
          />

          <label className="form-label fw-bold">Código IZIPAY (6 dígitos)</label>
          <input
            type="text"
            className="form-control"
            maxLength={6}
            value={codigoIzipay}
            onChange={(e) => setCodigoIzipay(e.target.value.replace(/[^0-9]/g, ""))}
          />
        </div>
      )}
    </div>
  );
}
