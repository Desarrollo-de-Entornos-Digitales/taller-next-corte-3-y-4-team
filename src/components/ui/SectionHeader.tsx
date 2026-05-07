interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    step?: string;
}

export default function SectionHeader({ title, subtitle, step }: SectionHeaderProps) {
    return (
        <div className="text-center mb-6">
            {step && <p className="text-sm text-gray-400 mb-1">{step}</p>}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && <p className="text-gray-500 text-sm max-w-xs mx-auto">{subtitle}</p>}
        </div>
    );
}
