"use client";
import { useEffect, useRef, useState } from "react";

interface Perfil {
  nombre: string;
  apellidos: string;
  correo: string;
  tipoCuenta: string;
  fotoPerfilNombre?: string;
  preferencias?: string;
}

export default function Configuracion() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    preferencias: "",
    contrasenaActual: "",
    nuevaContrasena: "",
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "ok" | "error";
    texto: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function cargarPerfil() {
      try {
        setCargando(true);
        const res = await fetch("/api/perfil", { method: "GET" });
        const data = await res.json();
        if (data.success && data.usuario) {
          setPerfil(data.usuario);
          setForm({
            nombre: data.usuario.nombre || "",
            apellidos: data.usuario.apellidos || "",
            correo: data.usuario.correo || "",
            preferencias: data.usuario.preferencias || "",
            contrasenaActual: "",
            nuevaContrasena: "",
          });
          if (data.usuario.fotoPerfilNombre) {
            setFotoPreview(
              `/api/perfil/foto?nombre=${encodeURIComponent(data.usuario.fotoPerfilNombre)}`,
            );
          }
        }
      } catch (err) {
        setMensaje({ tipo: "error", texto: "No se pudo cargar el perfil." });
      } finally {
        setCargando(false);
      }
    }
    cargarPerfil();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);
    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("apellidos", form.apellidos);
      formData.append("correo", form.correo);
      formData.append("preferencias", form.preferencias);
      if (foto) formData.append("foto", foto);
      if (form.contrasenaActual && form.nuevaContrasena) {
        formData.append("contrasenaActual", form.contrasenaActual);
        formData.append("nuevaContrasena", form.nuevaContrasena);
      }
      const res = await fetch("/api/perfil", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: "ok", texto: "Perfil actualizado correctamente." });
        const newPerfilRes = await fetch("/api/perfil", { method: "GET" });
        const newPerfil = await newPerfilRes.json();
        if (newPerfil.success && newPerfil.usuario) {
          setPerfil(newPerfil.usuario);
          setForm((prev) => ({
            ...prev,
            contrasenaActual: "",
            nuevaContrasena: "",
          }));
          if (newPerfil.usuario.fotoPerfilNombre) {
            setFotoPreview(
              `/api/perfil/foto?nombre=${encodeURIComponent(newPerfil.usuario.fotoPerfilNombre)}`,
            );
          }
        }
      } else {
        setMensaje({
          tipo: "error",
          texto: data.error || "Error al guardar cambios.",
        });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al guardar cambios." });
    } finally {
      setGuardando(false);
    }
  }

  async function handleExportarPerfil() {
    try {
      const secciones = ["perfil", "almacenes", "bitacora"];
      const res = await fetch(
        `/api/perfil/export?secciones=${secciones.join(",")}`,
        {
          method: "GET",
        },
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "honeylabs_perfil_export.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setMensaje({
          tipo: "ok",
          texto: "Exportación de perfil realizada con éxito.",
        });
      } else {
        setMensaje({ tipo: "error", texto: "No se pudo exportar tu perfil." });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error al exportar perfil." });
    }
  }

  if (cargando) {
    return (
      <main
        className="min-h-[80vh] flex items-center justify-center"
        data-oid="._c-562"
      >
        <div
          className="text-amber-700 text-lg font-bold animate-blink"
          data-oid="70m_25v"
        >
          Cargando perfil...
        </div>
      </main>
    );
  }

  if (!perfil) {
    return (
      <main
        className="min-h-[80vh] flex items-center justify-center"
        data-oid="kc9t1l."
      >
        <div className="text-red-600 text-lg font-bold" data-oid="0wk4xiq">
          No se pudo cargar tu perfil.
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-[80vh] w-full flex flex-col items-center py-8 bg-transparent"
      data-oid="33vru81"
    >
      <section
        className="w-full max-w-2xl rounded-2xl shadow-2xl bg-white/90 dark:bg-zinc-900/90 p-6 border border-yellow-200 dark:border-zinc-800 backdrop-blur-2xl transition-all"
        data-oid="q7svn2n"
      >
        <h1
          className="text-3xl font-bold text-amber-700 font-caveat mb-2 animate-fade-in"
          data-oid="ll6:1:."
        >
          Configuración de tu Perfil
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300" data-oid="ft8w5mm">
          Personaliza tus datos, seguridad y exporta tu información cuando
          quieras.
        </p>
        {mensaje && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg font-bold text-center animate-fade-in transition-all duration-300 ${
              mensaje.tipo === "ok"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
            data-oid="bulqymf"
          >
            {mensaje.texto}
          </div>
        )}
        <div
          className="flex flex-col md:flex-row gap-8 items-start"
          data-oid="v1-7y0u"
        >
          {/* FOTO DE PERFIL */}
          <div className="flex flex-col items-center gap-2" data-oid="k5pwliy">
            <div className="relative group" data-oid="9:_m-cj">
              <img
                src={fotoPreview || "/avatar-default.png"}
                alt="Foto de perfil"
                className="w-28 h-28 rounded-full border-4 border-yellow-300 object-cover bg-yellow-100 shadow-lg transition group-hover:ring-4 group-hover:ring-amber-200"
                data-oid="xzj.1tg"
              />

              <button
                className="absolute bottom-0 right-0 bg-amber-400 hover:bg-amber-500 text-white rounded-full p-2 shadow-md transition"
                title="Cambiar foto"
                onClick={() => fileInputRef.current?.click()}
                type="button"
                data-oid="5_.0h46"
              >
                <span className="sr-only" data-oid="y64a57.">
                  Cambiar foto
                </span>
                <svg
                  width={22}
                  height={22}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  data-oid="nkrp7j_"
                >
                  <path
                    d="M16.5 7.5l-1-1a2 2 0 00-2.8 0l-6 6a2 2 0 000 2.8l1 1a2 2 0 002.8 0l6-6a2 2 0 000-2.8z"
                    data-oid="x:w3t3n"
                  ></path>
                  <circle cx="12" cy="12" r="3" data-oid="yc5w6f-"></circle>
                </svg>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFotoChange}
                data-oid="yro-ad7"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1" data-oid="p9:8eoq">
              PNG/JPG. Máx 2MB
            </div>
          </div>
          {/* FORMULARIO DE PERFIL */}
          <form
            className="flex-1 flex flex-col gap-4"
            onSubmit={handleSubmit}
            autoComplete="off"
            data-oid="pibevh:"
          >
            <div className="flex gap-3" data-oid="o77xt8u">
              <div className="flex-1" data-oid="8u.ymdx">
                <label
                  className="block text-sm font-semibold text-amber-800"
                  data-oid="wmh8_ko"
                >
                  Nombre
                </label>
                <input
                  className="w-full rounded-lg border border-yellow-200 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white/80 dark:bg-zinc-900/80"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                  data-oid="ykdmh-c"
                />
              </div>
              <div className="flex-1" data-oid="z1nm9-a">
                <label
                  className="block text-sm font-semibold text-amber-800"
                  data-oid="tzx8wuv"
                >
                  Apellidos
                </label>
                <input
                  className="w-full rounded-lg border border-yellow-200 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white/80 dark:bg-zinc-900/80"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                  data-oid="qr7z::2"
                />
              </div>
            </div>
            <div data-oid="xd6r2z4">
              <label
                className="block text-sm font-semibold text-amber-800"
                data-oid="cigptju"
              >
                Correo
              </label>
              <input
                className="w-full rounded-lg border border-yellow-200 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white/80 dark:bg-zinc-900/80"
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                autoComplete="email"
                required
                data-oid="xbcfwtj"
              />
            </div>
            <div data-oid=".0vy6uj">
              <label
                className="block text-sm font-semibold text-amber-800"
                data-oid="pcv9me-"
              >
                Tipo de cuenta
              </label>
              <input
                className="w-full rounded-lg border border-yellow-200 p-2 mt-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                value={perfil.tipoCuenta}
                disabled
                data-oid="2vs-rgi"
              />
            </div>
            <div data-oid="h24-in4">
              <label
                className="block text-sm font-semibold text-amber-800"
                data-oid="wuxlhyy"
              >
                Preferencias (texto libre)
              </label>
              <textarea
                className="w-full rounded-lg border border-yellow-200 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white/80 dark:bg-zinc-900/80"
                name="preferencias"
                value={form.preferencias}
                onChange={handleChange}
                rows={2}
                data-oid="95n3p6x"
              />
            </div>
            {/* Cambiar contraseña */}
            <div className="flex gap-3" data-oid="bh8ouvn">
              <div className="flex-1" data-oid="tk_b83-">
                <label
                  className="block text-sm font-semibold text-amber-800"
                  data-oid="xavpx0-"
                >
                  Contraseña actual
                </label>
                <input
                  type="password"
                  name="contrasenaActual"
                  value={form.contrasenaActual}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-yellow-200 p-2 mt-1 focus:outline-none bg-white/80 dark:bg-zinc-900/80"
                  autoComplete="current-password"
                  placeholder="Dejar vacío si no cambias"
                  data-oid="qw82uu_"
                />
              </div>
              <div className="flex-1" data-oid="qpdnyih">
                <label
                  className="block text-sm font-semibold text-amber-800"
                  data-oid="89oo2-s"
                >
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  name="nuevaContrasena"
                  value={form.nuevaContrasena}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-yellow-200 p-2 mt-1 focus:outline-none bg-white/80 dark:bg-zinc-900/80"
                  autoComplete="new-password"
                  placeholder="Dejar vacío si no cambias"
                  data-oid="rbrqwwt"
                />
              </div>
            </div>
            {/* Acciones */}
            <div className="flex gap-3 mt-2" data-oid="0og.9yt">
              <button
                type="submit"
                disabled={guardando}
                className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-white font-bold transition shadow-lg disabled:opacity-70"
                data-oid="949rd.w"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={handleExportarPerfil}
                className="flex-1 py-2 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold hover:bg-amber-50 transition"
                data-oid="4662toh"
              >
                Exportar perfil
              </button>
            </div>
          </form>
        </div>
        {/* Extras: sesiones y seguridad */}
        <div
          className="border-t border-yellow-200 dark:border-zinc-700 mt-8 pt-6 flex flex-col md:flex-row gap-8 w-full max-w-2xl"
          data-oid="fhdiyxf"
        >
          <section className="flex-1" data-oid="2:2fjs4">
            <h2
              className="text-lg font-semibold text-amber-700 mb-2 font-caveat"
              data-oid="ap7qdqv"
            >
              Sesiones activas
            </h2>
            <div
              className="text-sm text-gray-600 dark:text-gray-300"
              data-oid="r8nc3jc"
            >
              Pronto podrás gestionar tus dispositivos activos y cerrar sesiones
              desde aquí.
            </div>
          </section>
          <section className="flex-1" data-oid="d18y.z8">
            <h2
              className="text-lg font-semibold text-amber-700 mb-2 font-caveat"
              data-oid="py6fd:n"
            >
              Seguridad extra (2FA)
            </h2>
            <div
              className="text-sm text-gray-600 dark:text-gray-300"
              data-oid="uayx531"
            >
              Muy pronto: activa verificación en dos pasos y otras opciones
              avanzadas de seguridad.
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
