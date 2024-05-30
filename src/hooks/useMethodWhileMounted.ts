import { useEffect, useRef } from 'react';

/**
 * @desc 包装 function，当组件卸载后不再执行, 避免调用时组件已被卸载而产生报错，常用于异步场景
 * @return (...args: any[]) => void
 */
export const useMethodWhileMounted = (method: (...args: any[]) => any) => {
    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    });
    return (...args: any[]): any => {
        if (isMountedRef.current) {
            return method(...args);
        }
    };
};
