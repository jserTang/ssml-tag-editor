import { useRef } from "react";

/**
 * 1.缓存 function 2.始终在 callback 内拿到最新状态 3.对一组方法的收敛
 * @param {[key: string]: (...args: any[]) => any}
 */
export const useMethods = (methods: {
  [key: string]: (...args: any[]) => any;
}): { [key: string]: (...args: any[]) => any } => {
  const { current } = useRef({
    methods,
    proxyFunc: undefined,
  });
  current.methods = methods;

  if (!current.proxyFunc) {
    const proxyFunc = Object.create(null);
    Object.keys(methods).forEach((key) => {
      proxyFunc[key] = (...args: unknown[]) =>
        current.methods[key].call(current.methods, ...args);
    });
    current.proxyFunc = proxyFunc;
  }

  return current.proxyFunc as any;
};
