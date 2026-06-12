import { cloneElement, useState, type ReactNode } from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    arrow,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingArrow,
    type Placement,
} from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/lib/motion';

interface TooltipProps {
    content: ReactNode;
    placement?: Placement;
    delay?: number;
    children: React.ReactElement;
}

export function Tooltip({ content, placement = 'top', delay = 300, children }: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [arrowEl, setArrowEl] = useState<SVGSVGElement | null>(null);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(8),
            flip(),
            shift({ padding: 8 }),
            arrow({ element: arrowEl }),
        ],
    });

    const hover = useHover(context, { delay, restMs: 0 });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    const referenceProps = getReferenceProps({
        ref: (node: HTMLElement | null) => refs.setReference(node),
    });

    return (
        <>
            {cloneElement(children, referenceProps)}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={(node) => { refs.setFloating(node); }}
                        style={floatingStyles}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.15 }}
                        className="z-200 glass px-3 py-1.5 text-sm text-text-primary rounded-lg max-w-xs"
                        {...getFloatingProps()}
                    >
                        {content}
                        <FloatingArrow ref={setArrowEl} context={context} className="fill-glass-light" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}