export const STATES = ["Pagado", "Pendiente", "Cancelado"];

export const normalize = (venta) => {
  const v = { ...venta };
  v.cantidad = Number(v.cantidad || 1);
  v.precioUnit = Number(v.precioUnit || 0);
  v.total = v.cantidad * v.precioUnit;
  return v;
};
