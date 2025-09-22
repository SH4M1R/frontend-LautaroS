import { reset } from "./store/storage";

export const seedVentas = () => {
  if (!localStorage.getItem("ventas@restaurant")) {
    reset([
      { id:"V-001", fechaISO:"2025-09-15T12:10:00Z", cliente:"Juan Pérez",  plato:"Lomo Saltado",     cantidad:2, precioUnit:18.5, estado:"Pagado"    },
      { id:"V-002", fechaISO:"2025-09-15T12:30:00Z", cliente:"María López", plato:"Ceviche",          cantidad:1, precioUnit:22,   estado:"Pendiente" },
      { id:"V-003", fechaISO:"2025-09-15T13:05:00Z", cliente:"Carlos Díaz", plato:"Ají de Gallina",   cantidad:2, precioUnit:15,   estado:"Cancelado" },
      { id:"V-004", fechaISO:"2025-09-15T13:20:00Z", cliente:"Ana Torres",  plato:"Pollo a la Brasa", cantidad:4, precioUnit:12.9, estado:"Pagado"    },
    ]);
  }
};
