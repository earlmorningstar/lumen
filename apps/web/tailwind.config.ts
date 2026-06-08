import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            // Some overrides that are easier here than in CSS, but most tokens are in globals.css
            screens: {
                xs: '375px',
            },
            spacing: {
                playerBar: '72px',
                cardSm: '140px',
                cardMd: '200px',
                cardLg: '260px',
            },
            borderRadius: {
                glass: '16px',
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            transitionDuration: {
                fast: '100ms',
                normal: '200ms',
                slow: '400ms',
                glacial: '700ms',
            },
        },
    },
    plugins: [
        plugin(({ addUtilities, addVariant }) => {
            // Glass utilities - these are also defined in CSS for broader support
            addUtilities({
                '.glass': {
                    backdropFilter: 'blur(20px) saturate(180%)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                },
                '.glass-dark': {
                    backdropFilter: 'blur(20px) saturate(180%)',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                },
                '.glass-strong': {
                    backdropFilter: 'blur(40px) saturate(200%)',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                },
                '.glass-navbar': {
                    backdropFilter: 'blur(24px) saturate(180%) brightness(0.9)',
                    background: 'rgba(10,10,10,0.7)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                },
                '.glass-player': {
                    backdropFilter: 'blur(32px) saturate(160%)',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                },
                '.text-gradient': {
                    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                },
            });
            // Hover variants for glass utilities
            addVariant('glass-hover', '&:hover');
        }),
    ],
} satisfies Config;