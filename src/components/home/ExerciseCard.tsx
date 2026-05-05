interface ExerciseCardProps {
  title: string;
  duration: string;
  bgColor?: string;
}

export default function ExerciseCard({ title, duration, bgColor = "bg-pink-200" }: ExerciseCardProps) {
  return (
    <div className={`${bgColor} p-4 rounded-2xl shadow-md min-w-[160px]`}>
      <p className="text-sm font-medium">Gimnasia creativa</p>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-xs text-gray-600 mt-2">⏱️ {duration} min</p>
      <div className="mt-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
        ▶️
      </div>
    </div>
  );
}