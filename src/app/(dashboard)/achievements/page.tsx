"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";

interface Achievement {
  id: number;
  name: string;
  description: string;
  requirement: string;
}

interface UserAchievement {
  achievementId: number;
  dateOfAchievement: string;
}

export default function AchievementsPage() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const userId = JSON.parse(atob(token.split(".")[1])).sub;

        // Obtener todos los logros
        const achievementsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/achievements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allAchievements = await achievementsRes.json();
        setAchievements(allAchievements);

        // Obtener logros del usuario
        const userAchievementsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user-achievements/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userAchievementsData = await userAchievementsRes.json();
        setUserAchievements(userAchievementsData);
      } catch (error) {
        console.error(error);
        showNotification("Error al cargar los logros", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [router, showNotification]);

  const isAchieved = (achievementId: number) => {
    return userAchievements.some((ua) => ua.achievementId === achievementId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando logros...</p>
        </div>
      </div>
    );
  }

  const achievedCount = achievements.filter((a) => isAchieved(a.id)).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#EDE8DC] py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Logros</h1>
        <p className="text-gray-500 mb-6">
          {achievedCount} de {totalCount} desbloqueados
        </p>

        {/* Barra de progreso */}
        <div className="bg-white rounded-full h-4 mb-8 overflow-hidden border border-gray-200">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Grid de logros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const achieved = isAchieved(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl p-5 shadow-md border-2 transition ${
                  achieved
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{achieved ? "🏆" : "🔒"}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                    <p className="text-xs text-gray-500">{achievement.requirement}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achieved && (
                  <p className="text-xs text-green-600 mt-3">
                    ✓ Obtenido
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}