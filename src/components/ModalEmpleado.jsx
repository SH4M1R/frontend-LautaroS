import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const API = import.meta.env.VITE_API_URL;

const ModalEmpleado = ({ show, onClose, onSave, empleadoData }) => {
    const isEditing = !!empleadoData;
    const initialData = { user: '', username: '', contrasena: '', rol: { idRol: '' } };

    const [data, setData] = useState(initialData);
    const [roles, setRoles] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            fetchRoles();
            if (isEditing) {
                setData({
                    user: empleadoData.user,
                    username: empleadoData.username,
                    contrasena: empleadoData.contrasena,
                    rol: { idRol: empleadoData.rol?.idRol || '' }
                });
            } else {
                setData(initialData);
            }
            setError(null);
        }
    }, [show, isEditing, empleadoData]);

    const fetchRoles = async () => {
        try {
            const response = await fetch(`${API}/api/roles`);
            const rolesList = await response.json();
            setRoles(rolesList);
            if (!isEditing && rolesList.length > 0) {
                 setData(prev => ({...prev, rol: { idRol: rolesList[0].idRol }}));
            }
        } catch (err) {
            setError("No se pudieron cargar los roles.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rolId') {
            setData({ ...data, rol: { idRol: parseInt(value) } });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!data.rol.idRol) { setError("Seleccione un Rol."); setLoading(false); return; }
        
        const url = isEditing ? `${API}/api/empleados/${empleadoData.idEmpleado}` : `${API}/api/empleados`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error al ${isEditing ? 'actualizar' : 'crear'} empleado`);
            }

            onSave(); 
        } catch (err) {
            console.error('Error en operación:', err);
            setError(err.message || "Fallo en la conexión o en el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Empleado' : 'Crear Nuevo Empleado'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control type="text" name="user" value={data.user} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Usuario (Username)</Form.Label>
                        <Form.Control type="text" name="username" value={data.username} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" name="contrasena" value={data.contrasena} onChange={handleChange} required={!isEditing} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select name="rolId" value={data.rol.idRol || ''} onChange={handleChange} required disabled={roles.length === 0}>
                            <option value="" disabled>Seleccione un Rol</option>
                            {roles.map((rol) => (
                                <option key={rol.idRol} value={rol.idRol}>
                                    {rol.rol}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading || !data.rol.idRol}
                    >
                        {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Guardar Empleado'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalEmpleado;
