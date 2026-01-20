export function AmbientBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-black">
            {/* Technical Grid Pattern - crisp and subtle */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #444 1px, transparent 1px),
                        linear-gradient(to bottom, #444 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}
            />

            {/* Cinematic Lighting - Top Down Spotlight */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] opacity-20"
                style={{
                    background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.4), transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />
        </div>
    );
}
