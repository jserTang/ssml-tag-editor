import { useEffect, useRef } from 'react';

export const useClickContainTarget = (target: HTMLElement | null, callback: (contain: boolean) => void) => {
    const cbRef = useRef(callback);
    cbRef.current = callback;
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            cbRef.current(!!target && target.contains(event.target as Node));
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);
};
