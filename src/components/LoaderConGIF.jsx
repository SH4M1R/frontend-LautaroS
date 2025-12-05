import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

export default function LoaderConGIF({ loading, children }) {
  const [showGif, setShowGif] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (loading) {
      setShowGif(false);
      setFinished(false);

      const t1 = setTimeout(() => setShowGif(true), 500); // aparece el GIF
      const t2 = setTimeout(() => setFinished(true), 6500); // 6s → mostrar contenido

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [loading]);

  if (loading && !finished) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5"
        style={{ minHeight: "200px", position: "relative" }}>
        {!showGif ? (
          <Spinner animation="border" variant="danger" />
        ) : (
          <img
            src="/cargando-chef.gif"
            alt="cargando"
            style={{
              width: "180px",
              opacity: 0.9,
              transition: "opacity 0.5s ease"
            }}
          />
        )}
      </div>
    );
  }

  return children;
}
