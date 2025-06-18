"use client";
import { useState } from "react";
import useAdminUsuarios from "@/hooks/useAdminUsuarios";
import { apiFetch } from "@lib/api";

export default function UsuariosTable() {
  const { usuarios, loading, mutate } = useAdminUsuarios();
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const updateUser = async (id: number, data: any) => {
    setSavingId(id);
    setError("");
    try {
      await apiFetch(`/api/admin/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      mutate();
    } catch {
      setError("Error guardando");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Usuarios</h2>
      {error && <div className="text-red-500">{error}</div>}
      {savingId && <span className="text-sm text-gray-500">Guardando...</span>}
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
              <th className="text-left">Contraseña</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="px-1 py-2">{u.id}</td>
                <td className="px-1 py-2">{u.nombre}</td>
                <td className="px-1 py-2">
                  <input
                    defaultValue={u.correo}
                    className="bg-transparent p-1 border rounded"
                    onBlur={(e) =>
                      e.target.value !== u.correo &&
                      updateUser(u.id, { correo: e.target.value })
                    }
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    defaultValue={u.tipoCuenta}
                    className="bg-transparent p-1 border rounded"
                    onBlur={(e) =>
                      e.target.value !== u.tipoCuenta &&
                      updateUser(u.id, { tipoCuenta: e.target.value })
                    }
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    defaultValue={u.estado}
                    className="bg-transparent p-1 border rounded"
                    onBlur={(e) =>
                      e.target.value !== u.estado &&
                      updateUser(u.id, { estado: e.target.value })
                    }
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    type="password"
                    placeholder="Nueva"
                    className="bg-transparent p-1 border rounded"
                    onBlur={(e) =>
                      e.target.value && updateUser(u.id, { contrasena: e.target.value })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
