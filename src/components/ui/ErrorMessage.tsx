interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-red-600 text-sm text-center">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="mt-2 text-sm text-red-500 underline mx-auto block">
                    Reintentar
                </button>
            )}
        </div>
    );
}
