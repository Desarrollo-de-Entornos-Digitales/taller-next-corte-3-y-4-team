"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";

interface CreativeArea {
  id: number;
  area: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creativeAreas, setCreativeAreas] = useState<CreativeArea[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    creativeAreaId: "",
    bio: "",
    location: "",
  });

  // Cargar datos del usuario y áreas creativas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Obtener áreas creativas
        const areasRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creative-areas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const areas = await areasRes.json();
        setCreativeAreas(areas);

        // Obtener datos del usuario
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();

        // Obtener perfil
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userData.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let profileData = {};
        if (profileRes.ok) {
          profileData = await profileRes.json();
        }

        setFormData({
          name: userData.name || "",
          creativeAreaId: (profileData as any).creativeAreaId?.toString() || "",
          bio: (profileData as any).bio || "",
          location: (profileData as any).location || "",
        });
      } catch (error) {
        console.error(error);
        showNotification("Error al cargar los datos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, showNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token!.split(".")[1])).sub;

      // Actualizar nombre del usuario
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: formData.name }),
      });

      // Obtener el profileId
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const profile = await profileRes.json();

      // Actualizar perfil
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          creativeAreaId: formData.creativeAreaId ? parseInt(formData.creativeAreaId) : null,
          bio: formData.bio,
          location: formData.location,
        }),
      });

      showNotification("Perfil actualizado correctamente", "success");
      router.push("/profile");
    } catch (error) {
      console.error(error);
      showNotification("Error al actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDE8DC] py-10 px-5">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-purple-600 transition"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Editar perfil</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-lg border-2 border-black space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área creativa</label>
            <select
              value={formData.creativeAreaId}
              onChange={(e) => setFormData({ ...formData, creativeAreaId: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
            >
              <option value="">Selecciona un área</option>
              {creativeAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
              placeholder="Ciudad, País"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}