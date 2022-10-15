import { FC, useContext, useEffect, useState } from "react";
import { createSignalRContext } from "react-signalr";
import { SignalRContext } from "./App";
const Chat: FC = () => {
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [connection, setConnection] = useState<any>();
  const signalR = require("@microsoft/signalr");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );

  const joinUser = () => {
    function receive(user: string, text: string) {
      console.log(user + ": ", text);
      setMessages((perv) => [...perv, { user, text }]);
    }
    var connect = new signalR.HubConnectionBuilder()
      .withUrl("https://cls.mehraman.com/Messenger", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)

      .build();

    connect.on("ReceiveMessage", receive);
    connect.start();
    console.log(connect);
    setConnection(connect);
  };
  async function sendMessage() {
    await connection?.invoke("SendMessenger", "Room1", username, message);
  }

  return (
    <div style={{ display: "flex", padding: 30 }}>
      <div style={{ width: "50%" }}>
        {!showChat && (
          <>
            <input
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <button
              onClick={() => {
                joinUser();
                setShowChat(true);
              }}
            >
              {" "}
              add user
            </button>
          </>
        )}
        {showChat && (
          <>
            <input
              type="text"
              id="messageText"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button onClick={() => sendMessage()}> send </button>
          </>
        )}
      </div>
      <div style={{ width: "50%" }}>
        {messages.map((item, index) => (
          <div key={index}>
            {item.user} : {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Chat;
