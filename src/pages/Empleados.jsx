import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import ModalEmpleado from "../components/ModalEmpleado";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/empleados");
      if (!res.ok) throw new Error("Error al cargar empleados");
      const data = await res.json();
      setEmpleados(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const guardarEmpleado = async (empleado) => {
    try {
      const res = await fetch("http://localhost:9000/api/empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleado),
      });
      if (!res.ok) throw new Error("Error al guardar el empleado");

      const nuevoEmpleado = await res.json();
      setEmpleados([...empleados, nuevoEmpleado]);
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar el empleado:", error);
      alert("Error al guardar el empleado");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Empleados</h3>
        <Button onClick={() => setModalOpen(true)}>+ Agregar Empleado</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Username</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.idEmpleado}>
              <td>{emp.idEmpleado}</td>
              <td>{emp.user}</td>
              <td>{emp.username}</td>
              <td>{emp.rol?.rol}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalEmpleado
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={guardarEmpleado}
      />
    </div>
  );
}