import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import ModalEmpleado from "../components/ModalEmpleado";

const API = import.meta.env.VITE_API_URL;

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empleadoToEdit, setEmpleadoToEdit] = useState(null);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/empleados`);
      const data = await res.json();
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener la lista de empleados:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (empleado = null) => {
    setEmpleadoToEdit(empleado);
    setShowModal(true);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    setEmpleadoToEdit(null);
    fetchEmpleados();
  };

  const handleDelete = async (idEmpleado) => {
    if (!window.confirm(`¿Seguro de eliminar al empleado con ID ${idEmpleado}?`)) return;

    try {
      const res = await fetch(`${API}/api/empleados/${idEmpleado}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setEmpleados(empleados.filter(emp => emp.idEmpleado !== idEmpleado));
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
      alert("Fallo al eliminar el empleado.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Gestión de Empleados</h3>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <i className="bi bi-person-plus-fill me-2"></i>Agregar Empleado
        </Button>
      </div>

      {loading ? (<p>Cargando empleados...</p>) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Username</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.idEmpleado}>
                <td>{emp.idEmpleado}</td>
                <td>{emp.user}</td>
                <td>{emp.username}</td>
                <td>{emp.rol?.rol}</td>
                <td>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2" 
                    onClick={() => handleOpenModal(emp)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(emp.idEmpleado)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ModalEmpleado
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveSuccess}
        empleadoData={empleadoToEdit}
      />
    </div>
  );
}
