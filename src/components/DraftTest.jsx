import { useState } from 'react';
import { useWebSocketDraft } from './web_socket/useWebSocketGame';


function DraftTest() {
  const [idRoom, setIdRoom] = useState("a79ddf7a-7d86-4871-a5c8-6fed3f55c7b4"); // cambia con ID reale
  const [messages, setMessages] = useState([]);

  const { sendPick } = useWebSocketDraft(idRoom, (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  const handleSend = () => {
    const pick = {
      idRoom: idRoom,
      side: "blue",
      idChamp: 103, // Ahri, per esempio
    };
    sendPick(pick);
  };

  return (
    <div>
      <h2>Draft Room: {idRoom}</h2>
      <button onClick={handleSend}>Invia Pick</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
}

export default DraftTest
