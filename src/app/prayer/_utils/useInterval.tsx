import { useEffect } from 'react';

const useInterval = (callback: () => void, delay: number | null, condition: boolean): void => {
  useEffect(() => {
    if (!condition || delay === null) return;

    const intervalId = setInterval(callback, delay);

    return () => {
      clearInterval(intervalId);
    };
  }, [callback, delay, condition]);
};

export default useInterval;