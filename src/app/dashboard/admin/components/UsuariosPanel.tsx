"use client";
import { useState } from "react";
import useAdminUsuarios, { AdminUsuario } from "@/hooks/useAdminUsuarios";
import { apiFetch } from "@lib/api";

export default function UsuariosPanel() {
  const { usuarios, loading, mutate } = useAdminUsuarios();
  const [selected, setSelected] = useState<AdminUsuario | null>(null);
  const [form, setForm] = useState({ correo: "", tipoCuenta: "", estado: "", contrasena: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const open = (u: AdminUsuario) => {
    setForm({ correo: u.correo, tipoCuenta: u.tipoCuenta, estado: u.estado, contrasena: "" });
    setSelected(u);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/api/admin/usuarios/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSelected(null);
      mutate();
    } catch {
      setError("Error guardando");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Usuarios</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">ID</th>
              <th className="text-left">Nombre</th>
              <th className="text-left">Correo</th>
              <th className="text-left">Tipo</th>
              <th className="text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="cursor-pointer border-t border-white/10" onClick={() => open(u)}>
                <td className="px-1 py-2">{u.id}</td>
                <td className="px-1 py-2">{u.nombre}</td>
                <td className="px-1 py-2">{u.correo}</td>
                <td className="px-1 py-2">{u.tipoCuenta}</td>
                <td className="px-1 py-2">{u.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-zinc-800 p-4 rounded space-y-2 w-64" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold">Editar usuario {selected.id}</h3>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <label className="block text-sm">
              Correo
              <input className="w-full bg-transparent border p-1 rounded" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
            </label>
            <label className="block text-sm">
              Tipo
              <input className="w-full bg-transparent border p-1 rounded" value={form.tipoCuenta} onChange={(e) => setForm({ ...form, tipoCuenta: e.target.value })} />
            </label>
            <label className="block text-sm">
              Estado
              <input className="w-full bg-transparent border p-1 rounded" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} />
            </label>
            <label className="block text-sm">
              Nueva contraseña
              <input type="password" className="w-full bg-transparent border p-1 rounded" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSelected(null)} className="px-3 py-1 bg-white/20 rounded">Cancelar</button>
              <button onClick={save} disabled={saving} className="px-3 py-1 bg-amber-500 rounded">{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
