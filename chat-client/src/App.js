import React, { useState, useEffect } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;

function App() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const socket = new SockJS('http://43.203.222.208:8080/ws');
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  }, []);

  const onConnected = () => {
    stompClient.subscribe('/topic/messages', onMessageReceived);
  };

  const onError = (err) => {
    console.error(err);
  };

  const onMessageReceived = (msg) => {
    const message = JSON.parse(msg.body);
    setChatMessages(prevMessages => [...prevMessages, message]);
  };

  const sendMessage = () => {
    if (stompClient) {
      const chatMessage = {
        content: message
      };
      stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h2>Chat Application</h2>
          <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <div>
            {chatMessages.map((msg, index) => (
                <div key={index}>{msg.content}</div>
            ))}
          </div>
        </header>
      </div>
  );
}

export default App;
