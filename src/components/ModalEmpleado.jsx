import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function ModalEmpleado({ isOpen, onClose, onSave }) {
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rolId, setRolId] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/roles");
      if (!res.ok) throw new Error("Error al cargar roles");
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !username || !contrasena || !rolId) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const nuevoEmpleado = {
      user,
      username,
      contrasena,
      rol: { idRol: parseInt(rolId) },
    };

    await onSave(nuevoEmpleado);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setUser("");
    setUsername("");
    setContrasena("");
    setRolId("");
  };

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Empleado</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre completo"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese un nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese una contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={rolId}
              onChange={(e) => setRolId(e.target.value)}
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.rol}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}