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
      const now = Date.now();
      const endTime = msg.startTime + 30_000;

      if (endTime <= now || currentPhase === "end") {
        setTimeLeft(0);
        clearInterval(timerRef.current);
        return;
      }

      clearInterval(timerRef.current);

      const updateTimer = () => {
        const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(diff);

        if (diff <= 0) {
          clearInterval(timerRef.current);
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    }

  }, [currentPhase]);

  const { sendMessage, connected } = useWebSocketDraft(idRoom, onWebSocketMessage);

  useEffect(() => {
    if (!connected || currentPhase === lastPhase || currentPhase === "end" || !currentPhase) return;

    sendMessage({
      idRoom,
      type: "TIMER_REQUEST",
      sender: role,
    });

    setLastPhase(currentPhase);
  }, [currentPhase, connected]);

  useEffect(() => {
    if (currentPhase === "end") {
      clearInterval(timerRef.current);
      setTimeLeft(0);
    }
  }, [currentPhase]);

  return (
    <div>
      <h1>{timeLeft !== null ? `${timeLeft}` : "—"}</h1>
    </div>
  );
}

export default Timer;

