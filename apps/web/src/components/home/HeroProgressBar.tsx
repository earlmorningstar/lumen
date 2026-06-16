interface HeroProgressBarProps {
    isPaused: boolean;
    key: number; // re-mount on index change
}

export function HeroProgressBar({ isPaused }: HeroProgressBarProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <div
                className="h-full bg-accent shadow-[0_0_8px_rgba(229,160,13,0.6)]"
                style={{
                    animation: `progressBar 6s linear forwards`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            />
        </div>
    );
}