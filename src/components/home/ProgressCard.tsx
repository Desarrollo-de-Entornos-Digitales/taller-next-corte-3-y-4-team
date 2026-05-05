export default function ProgressCard() {
  return (
    <div className="bg-white border border-black shadow-md rounded-2xl p-4 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <p className="text-black">
            Llevas <span className="font-bold">7</span> días seguidos
          </p>
        </div>
        <p className="text-sm text-black">¡Sigue así!</p>
      </div>

      <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center text-lg font-bold text-black">
        7
      </div>
    </div>
  );
}