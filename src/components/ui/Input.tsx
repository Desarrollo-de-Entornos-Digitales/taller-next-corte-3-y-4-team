'use client';

import { useState } from 'react';

interface InputProps {
    label?: string;
    name: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export default function Input({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-xs font-bold text-[#6b21a8] mb-1.5 uppercase tracking-[0.5px]"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#ede9fe] bg-[#faf8ff] text-[#1a0a3d] text-sm font-[Nunito,sans-serif] outline-none placeholder:text-[#c4b5fd] focus:border-[#9d6fe0] focus:shadow-[0_0_0_4px_rgba(157,111,224,0.12)] focus:bg-white transition-all duration-200"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-[#a78bfa] hover:text-[#7c3aed] transition-colors"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
