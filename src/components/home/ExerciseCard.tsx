interface ExerciseCardProps {
  title: string;
  duration: number;
  type: string;
  onClick: () => void;
}

export default function ExerciseCard({ title, duration, type, onClick }: ExerciseCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "lightblue",
        border: "2px solid black",
        borderRadius: "16px",
        padding: "16px",
        minWidth: "180px",
        cursor: "pointer",
      }}
    >
      <div>
        <span style={{ backgroundColor: "gray", padding: "4px 8px", borderRadius: "20px", color: "white" }}>
          {type}
        </span>
        <span style={{ marginLeft: "8px" }}>⏱️ {duration} min</span>
      </div>
      <h3 style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>{title}</h3>
      <p style={{ color: "black" }}>Ejercicio para tu creatividad</p>
    </div>
  );
}