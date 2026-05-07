'use client';

interface OptionCardProps {
    emoji: string;
    label: string;
    selected: boolean;
    onClick: () => void;
}

export default function OptionCard({ emoji, label, selected, onClick }: OptionCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        flex flex-col items-center justify-center gap-2 p-4 rounded-2xl 
        transition-all duration-200 min-h-[100px]
        ${selected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border-2 border-gray-800 hover:bg-gray-50'}
      `}
        >
            <span className="text-3xl">{emoji}</span>
            <span className="text-sm font-medium text-gray-800 text-center">{label}</span>
        </button>
    );
}
