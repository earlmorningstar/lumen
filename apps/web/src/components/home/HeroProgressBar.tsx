interface HeroProgressBarProps {
    isPaused: boolean;
}

export function HeroProgressBar({ isPaused }: HeroProgressBarProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/10">
            <div
                className="h-full bg-accent"
                style={{
                    animation: `progressBar 6s linear forwards`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                    boxShadow: '0 0 10px rgba(229, 160, 13, 0.8)',
                }}
            />
        </div>
    );
}