"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressCard from "../../../components/home/ProgressCard";
import ExerciseCard from "../../../components/home/ExerciseCard";
import { feedService } from "./services/feed.service";

export default function Feed() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [streak, setStreak] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email);
    } catch (error) {
      console.error("Error decodificando token:", error);
      setEmail("Usuario");
    }

    const fetchData = async () => {
      try {
        const [exercisesData, streakData, totalData] = await Promise.all([
          feedService.getExercises(),
          feedService.getStreak(),
          feedService.getTotalExercises(),
        ]);
        setExercises(exercisesData);
        setStreak(streakData);
        setTotalExercises(totalData);
      } catch (error) {
        console.error("Error cargando datos del feed:", error);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold">LUDIX</h1>
        <p className="text-gray-600">¡Hola, {email}! 👋</p>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        <ProgressCard streak={streak} totalExercises={totalExercises} />

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">✨ Para ti</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                title={exercise.name}
                duration={exercise.duration}
                type={exercise.exerciseType?.type || "Ejercicio"}
                onClick={() => console.log("Ver ejercicio", exercise.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}