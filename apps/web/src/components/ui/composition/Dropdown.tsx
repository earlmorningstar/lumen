import { useState, useRef, type ReactNode } from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useListNavigation,
    useInteractions,
    FloatingFocusManager,
    type Placement,
} from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { glassReveal } from '@/lib/motion';

interface DropdownItem {
    id: string;
    label: string;
    icon?: ReactNode;
    shortcut?: string;
    destructive?: boolean;
    divider?: boolean;
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    placement?: Placement;
    onSelect?: (item: DropdownItem) => void;
}

export function Dropdown({ trigger, items, placement = 'bottom-start', onSelect }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const listRef = useRef<Array<HTMLElement | null>>([]);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [offset(4), flip(), shift({ padding: 8 })],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'menu' });
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        click,
        dismiss,
        role,
        listNav,
    ]);

    const setItemRef = (index: number) => (node: HTMLElement | null) => {
        listRef.current[index] = node;
    };

    return (
        <>
            <div ref={(node) => { refs.setReference(node); }} {...getReferenceProps()} className="inline-block">
                {trigger}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <FloatingFocusManager context={context} modal={false}>
                        <motion.div
                            ref={(node) => { refs.setFloating(node); }}
                            style={floatingStyles}
                            variants={glassReveal}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="z-150 glass-strong rounded-xl min-w-45 p-2"
                            {...getFloatingProps()}
                        >
                            {items.map((item, index) => {
                                if (item.divider) {
                                    return <div key={item.id} className="h-px bg-border-default my-1" />;
                                }

                                return (
                                    <button
                                        key={item.id}
                                        ref={setItemRef(index)}
                                        role="menuitem"
                                        className={`
                      w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg
                      transition-colors duration-100
                      ${activeIndex === index ? 'bg-glass-medium' : ''}
                      ${item.destructive ? 'text-status-error' : 'text-text-primary'}
                      hover:bg-glass-light
                    `}
                                        {...getItemProps({
                                            onClick: () => {
                                                onSelect?.(item);
                                                setIsOpen(false);
                                            },
                                        })}
                                        tabIndex={activeIndex === index ? 0 : -1}
                                    >
                                        {item.icon && <span className="w-5 h-5 shrink-0">{item.icon}</span>}
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.shortcut && (
                                            <span className="text-xs text-text-muted">{item.shortcut}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </FloatingFocusManager>
                )}
            </AnimatePresence>
        </>
    );
}