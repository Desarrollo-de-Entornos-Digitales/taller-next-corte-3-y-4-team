'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
    withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    const withLoading = async <T,>(promise: Promise<T>): Promise<T> => {
        showLoading();
        try {
            const result = await promise;
            return result;
        } finally {
            hideLoading();
        }
    };

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, withLoading }}>
            {children}
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) throw new Error('useLoading must be used within LoadingProvider');
    return context;
}
