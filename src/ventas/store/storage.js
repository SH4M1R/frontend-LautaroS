import { normalize } from "./schema";
const KEY = "ventas@restaurant";

export const readAll = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
};
export const saveAll = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
export const upsert = (venta) => {
  const v = normalize(venta);
  const list = readAll();
  const i = list.findIndex(x => x.id === v.id);
  if (i >= 0) list[i] = v; else list.unshift(v);
  saveAll(list);
  return v;
};
export const removeById = (id) => saveAll(readAll().filter(v => v.id !== id));
export const reset = (arr = []) => saveAll(arr);
