export const today = () => new Date().toISOString().slice(0, 10);
export const ymd = (d) => new Date(d).toISOString().slice(0, 10);