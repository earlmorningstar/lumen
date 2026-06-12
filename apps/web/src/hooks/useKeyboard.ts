import { useEffect, useRef } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

interface KeyCombo {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    meta?: boolean;
    handler: KeyHandler;
}

type KeyMap = Record<string, KeyHandler>;

export function useKeyboard(keys: KeyMap | KeyCombo[], deps: unknown[] = []) {
    const keysRef = useRef(keys);

    // Update the ref whenever keys change, without triggering a re‑render
    useEffect(() => {
        keysRef.current = keys;
    });

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            const currentKeys = keysRef.current;
            if (Array.isArray(currentKeys)) {
                for (const combo of currentKeys) {
                    if (
                        event.key.toLowerCase() === combo.key.toLowerCase() &&
                        !!combo.ctrl === event.ctrlKey &&
                        !!combo.shift === event.shiftKey &&
                        !!combo.meta === event.metaKey
                    ) {
                        event.preventDefault();
                        combo.handler(event);
                        return;
                    }
                }
            } else {
                const normalizedKey =
                    event.key === 'Escape' ? 'Escape' : event.key.toLowerCase();
                if (currentKeys[normalizedKey]) {
                    event.preventDefault();
                    currentKeys[normalizedKey](event);
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}