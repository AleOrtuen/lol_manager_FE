import { useEffect, useState, useRef } from 'react';
import { useWebSocketDraft } from './web_socket/useWebSocketGame';

function Timer({ idRoom, role }) {
  const [messages, setMessages] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const { sendMessage } = useWebSocketDraft(idRoom, (msg) => {
    setMessages((prev) => [...prev, msg]);

    if (msg.type === "TIMER_START" && msg.startTime) {
      const endTime = msg.startTime + 30000;
      clearInterval(timerRef.current);

      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) clearInterval(timerRef.current);
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    }
  });

  useEffect(() => {
    sendMessage({
      idRoom,
      type: "TIMER_STATUS_REQUEST",
      sender: role
    });
  }, [idRoom, sendMessage]);

  const handleStartTimer = () => {
    sendMessage({
      idRoom,
      type: "TIMER_REQUEST",
      sender: role
    });
  };

  return (
    <div>
      <h1>{timeLeft !== null ? `${timeLeft}` : "—"}</h1>
      <button className="btn btn-outline-secondary btn-md" onClick={handleStartTimer}>Avvia Timer</button>
    </div>
  );
}

export default Timer;

