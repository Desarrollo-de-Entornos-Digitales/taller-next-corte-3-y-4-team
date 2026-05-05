"use client";

export default function Feed() {
  // Simulación de usuario autenticado para desarrollo
  const email = "Usuario de prueba";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header con saludo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">¡Hola, {email}! 👋</h1>
          <p className="text-gray-600">¿Qué necesitas hoy?</p>
        </div>

        {/* Aquí empezarás a construir el MoodSelector */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">¿Cómo te sientes hoy?</h2>
          <div className="flex gap-4 justify-around">
            {["😫", "😴", "⚡", "😖", "😊"].map((emoji) => (
              <button
                key={emoji}
                className="text-3xl p-3 bg-gray-100 rounded-full hover:bg-green-100 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Pausa mágica */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
          <p className="text-sm opacity-90">✨ PAUSA MÁGICA</p>
          <button className="mt-2 bg-white text-purple-600 px-6 py-2 rounded-full font-semibold">
            ¡Sorpréndeme!
          </button>
        </div>

        {/* Sección "Para ti" (luego la expandirá Persona 4) */}
        <div>
          <h2 className="text-xl font-bold mb-4">Para ti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4">
                <div className="h-32 bg-gray-100 rounded-lg mb-2 animate-pulse" />
                <p className="font-semibold">Ejercicio {i}</p>
                <p className="text-sm text-gray-500">Cargando...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}