import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function App() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  let stompClient = null;

  useEffect(() => {
    const socket = new SockJS('http://43.203.222.208:8080/ws');
    stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/messages', (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          console.log("Received message:", receivedMessage); // 콘솔에 메시지 출력
          setChatMessages(prevMessages => {
            const newMessages = [...prevMessages, receivedMessage];
            console.log("Updated chatMessages:", newMessages); // 콘솔에 배열 출력
            return newMessages;
          });
        });
      },
      onStompError: (err) => {
        console.error('Error connecting to WebSocket', err);
      }
    });
    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      const chatMessage = {
        content: message
      };
      console.log("Sending message:", chatMessage); // 콘솔에 메시지 출력
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify(chatMessage)
      });
      setChatMessages(prevMessages => {
        const newMessages = [...prevMessages, chatMessage];
        console.log("Updated chatMessages after send:", newMessages); // 콘솔에 배열 출력
        return newMessages;
      });
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
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'left', width: '60%', margin: '0 auto' }}>
            {chatMessages.map((msg, index) => (
                <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                  {msg.content}
                </div>
            ))}
          </div>
        </header>
      </div>
  );
}

export default App;
