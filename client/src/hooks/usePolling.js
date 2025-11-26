import { useState, useEffect, useRef } from 'react';

export const usePolling = (callback, interval = 5000, enabled = true) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      savedCallback.current();
    };

    // Call immediately
    tick();

    // Then set interval
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
};
