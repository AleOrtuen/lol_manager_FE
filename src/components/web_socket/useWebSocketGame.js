import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export function useWebSocketDraft(idRoom, onMessage) {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!idRoom) return;

    const stompClient = new Client({
      // ⚠️ Usa SockJS: non impostare `brokerURL`
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}ws`),
      reconnectDelay: 5000, // ✅ auto-reconnect ogni 5s
      debug: (str) => console.log("💬 STOMP:", str),
    });

    stompClient.onConnect = () => {
      console.log(`✅ Connected to WebSocket room ${idRoom}`);

      stompClient.subscribe(`/topic/game/${idRoom}`, (message) => {
        const body = JSON.parse(message.body);
        console.log("📩 Received:", body);
        if (onMessage) onMessage(body);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers['message']);
      console.error(frame.body);
    };

    stompClient.activate(); // 🔌 connessione

    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate(); // 🔌 chiude la connessione in modo pulito
        console.log("❌ Disconnected from WebSocket");
      }
    };
  }, [idRoom]);

  const sendPick = (pickMessage) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: `/app/game/${idRoom}/pick`,
        body: JSON.stringify(pickMessage),
      });
    }
  };

  return { sendPick };
}

