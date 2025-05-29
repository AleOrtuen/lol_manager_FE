import { useEffect, useState, useRef, useCallback } from 'react';
import { useWebSocketDraft } from '../web_socket/useWebSocketGame';
import { useParams } from 'react-router-dom';

function Timer({ currentPhase }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [lastPhase, setLastPhase] = useState(null);
  const timerRef = useRef(null);
  const { idRoom, role } = useParams();

  const onWebSocketMessage = useCallback((msg) => {
    if (msg.type === "TIMER_START" && msg.startTime) {
      const endTime = msg.startTime + 30_000;

      clearInterval(timerRef.current);

      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(diff);

        if (diff <= 0) {
          clearInterval(timerRef.current);
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    }
  }, []);

  const { sendMessage, connected } = useWebSocketDraft(idRoom, onWebSocketMessage);

  useEffect(() => {
    if (!connected || currentPhase === lastPhase) return;

    sendMessage({
      idRoom,
      type: "TIMER_REQUEST",
      sender: role,
    });

    setLastPhase(currentPhase);

  }, [currentPhase, connected]);

  return (
    <div>
      <h1>{timeLeft !== null ? `${timeLeft}` : "—"}</h1>
    </div>
  );
}

export default Timer;

