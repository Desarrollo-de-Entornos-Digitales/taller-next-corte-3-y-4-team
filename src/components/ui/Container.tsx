interface ContainerProps {
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
};

export default function Container({ children, maxWidth = 'md', className = '' }: ContainerProps) {
    return <div className={`mx-auto px-4 ${maxWidthClasses[maxWidth]} ${className}`}>{children}</div>;
}
