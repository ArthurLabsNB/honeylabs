"use client";
import { useState } from "react";
import useSession from "@/hooks/useSession";
import useAdminUsuarios from "@/hooks/useAdminUsuarios";
import { apiFetch } from "@lib/api";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";

export default function AdminUsuariosPage() {
  const { usuario, loading } = useSession();
  const { usuarios, loading: loadingUsers, mutate } = useAdminUsuarios();
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!usuario) return <div className="p-4 text-red-500">Debes iniciar sesión</div>;
  const rol = getMainRole(usuario)?.toLowerCase();
  const tipo = normalizeTipoCuenta(usuario.tipoCuenta);
  if (rol !== "admin" && rol !== "administrador" && tipo !== "admin") {
    return <div className="p-4 text-red-500">No autorizado</div>;
  }

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
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      {error && <div className="text-red-500">{error}</div>}
      {savingId && <span className="text-sm text-gray-500">Guardando...</span>}
      {loadingUsers ? (
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
            {usuarios.map(u => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="px-1 py-2">{u.id}</td>
                <td className="px-1 py-2">{u.nombre}</td>
                <td className="px-1 py-2">
                  <input
                    defaultValue={u.correo}
                    className="bg-transparent p-1 border rounded"
                    onBlur={e =>
                      e.target.value !== u.correo &&
                      updateUser(u.id, { correo: e.target.value })
                    }
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    defaultValue={u.tipoCuenta}
                    className="bg-transparent p-1 border rounded"
                    onBlur={e =>
                      e.target.value !== u.tipoCuenta &&
                      updateUser(u.id, { tipoCuenta: e.target.value })
                    }
                  />
                </td>
                <td className="px-1 py-2">
                  <input
                    defaultValue={u.estado}
                    className="bg-transparent p-1 border rounded"
                    onBlur={e =>
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
                    onBlur={e =>
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
