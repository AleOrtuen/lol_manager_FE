import { useEffect, useState, useRef, useCallback } from 'react';
import { useWebSocketDraft } from '../web_socket/useWebSocketGame';
import { useParams } from 'react-router-dom';

function Timer({ currentPhase }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [lastPhase, setLastPhase] = useState(null);
  const timerRef = useRef(null);
  const phaseStartRef = useRef(null);
  const { idRoom, role } = useParams();

  const onWebSocketMessage = useCallback((msg) => {
    // LOG TEMPORANEO PER DEBUG - rimuovi dopo il test
    console.log('📩 WebSocket message:', msg);

    if (msg.type === "TIMER_START") {
      console.log('⏱️ startTime:', msg.startTime, '| timeRemaining:', msg.timeRemaining);

      // Usa timeRemaining se disponibile, altrimenti calcola da startTime
      let remainingMs;
      
      if (msg.timeRemaining !== undefined && msg.timeRemaining !== null) {
        // Usa il tempo rimanente dal server (SOLUZIONE AGGIORNATA)
        remainingMs = msg.timeRemaining;
        console.log('✅ Usando timeRemaining dal server:', remainingMs);
      } else if (msg.startTime) {
        // Fallback: calcola dal timestamp (vecchio metodo)
        const now = Date.now();
        remainingMs = Math.max(0, 30_000 - (now - msg.startTime));
        console.log('⚠️ Fallback: calcolato da startTime:', remainingMs);
      } else {
        console.error('❌ Nessun dato timer disponibile');
        return;
      }

      if (remainingMs <= 0 || currentPhase === "end") {
        setTimeLeft(0);
        clearInterval(timerRef.current);
        return;
      }

      // Imposta il tempo di inizio locale per il countdown
      phaseStartRef.current = Date.now();
      const initialSeconds = Math.ceil(remainingMs / 1000);
      setTimeLeft(initialSeconds);

      clearInterval(timerRef.current);

      const updateTimer = () => {
        const elapsed = Date.now() - phaseStartRef.current;
        const remaining = Math.max(0, remainingMs - elapsed);
        const seconds = Math.ceil(remaining / 1000);
        
        setTimeLeft(seconds);
        
        if (seconds <= 0) {
          clearInterval(timerRef.current);
          setTimeLeft(0);
        }
      };

      // Usa 100ms per maggiore precisione invece di 1000ms
      timerRef.current = setInterval(updateTimer, 100);
    }
  }, [currentPhase]);

  const { sendMessage, connected } = useWebSocketDraft(idRoom, onWebSocketMessage);

  useEffect(() => {
    if (!connected || currentPhase === lastPhase || currentPhase === "end" || !currentPhase) return;
    
    console.log('🔄 Richiedendo timer per fase:', currentPhase);
    
    sendMessage({
      idRoom,
      type: "TIMER_REQUEST",
      sender: role,
    });
    
    setLastPhase(currentPhase);
  }, [currentPhase, connected, idRoom, role, sendMessage, lastPhase]);

  useEffect(() => {
    if (currentPhase === "end") {
      clearInterval(timerRef.current);
      setTimeLeft(0);
    }
  }, [currentPhase]);

  // Cleanup all'unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h1>{timeLeft !== null ? `${timeLeft}` : "—"}</h1>
    </div>
  );
}

export default Timer;
