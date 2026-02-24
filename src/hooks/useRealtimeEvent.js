import { useEffect, useRef } from 'react';
import websocketClient from '@services/websocket/client';

const useRealtimeEvent = (eventName, handler, { enabled = true } = {}) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof handlerRef.current !== 'function') return undefined;

    const unsubscribe = websocketClient.subscribe(eventName, (payload, rawMessage) => {
      if (typeof handlerRef.current === 'function') {
        handlerRef.current(payload, rawMessage);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [enabled, eventName]);
};

export default useRealtimeEvent;
