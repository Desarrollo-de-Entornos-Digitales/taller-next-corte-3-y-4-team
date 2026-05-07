'use client';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

export default function Button({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    disabled = false,
    className = '',
}: ButtonProps) {
    const base =
        'w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-200 disabled:opacity-50 cursor-pointer tracking-wide';

    const variants: Record<string, string> = {
        primary:
            'bg-gradient-to-r from-[#9d4edd] to-[#c77dff] text-white shadow-[0_6px_20px_rgba(157,78,221,0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(157,78,221,0.45)] active:translate-y-0',
        secondary: 'bg-[#1a0a3d] text-white hover:bg-[#2d1b69]',
        outline: 'border-2 border-[#9d4edd] text-[#9d4edd] bg-white hover:bg-[#faf8ff]',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
