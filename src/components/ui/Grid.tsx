interface GridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
};

const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
};

export default function Grid({ children, cols = 2, gap = 'md' }: GridProps) {
    return <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]}`}>{children}</div>;
}
