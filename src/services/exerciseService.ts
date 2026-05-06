export interface Exercise {
  id: number;
  name: string;
  description: string;
  duration: number;
  exerciseTypeId: number;
  exerciseType?: {
    id: number;
    type: string;
  };
}

class ExerciseService {
  async getExercises(): Promise<Exercise[]> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export const exerciseService = new ExerciseService();