'use client';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    variant = 'warning',
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const confirmButtonClass =
        variant === 'danger'
            ? 'bg-red-400 hover:bg-red-500 text-white'
            : variant === 'warning'
              ? 'bg-amber-400 hover:bg-amber-500 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white';

    const cancelButtonClass = 'flex-1 py-4 text-center font-bold text-purple-600 hover:bg-purple-50 transition';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
            <div
                className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0px #1A1A1A' }}
            >
                <div className="p-5 pb-3">
                    <h3 className="text-xl font-black text-gray-900">{title}</h3>
                </div>
                <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
                <div className="flex border-t border-gray-100">
                    <button onClick={onCancel} className={cancelButtonClass}>
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-4 text-center font-bold transition border-l border-gray-100 ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
