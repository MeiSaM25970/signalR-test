import { FC, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { createSignalRContext } from "react-signalr";

const Chat: FC = () => {
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [connection, setConnection] = useState<any>();
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const { useSignalREffect, Provider } = createSignalRContext();
  useSignalREffect(
    "event name",
    (message) => {
      console.log(message);
    },
    [messages]
  );
  let room = "Room1";
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
    if (connect) {
      setMessages((perv) => [
        ...perv,
        { user: "admin", text: `you are join to ${room}` },
      ]);
    }
    setConnection(connect);
  };
  async function sendMessage() {
    await connection?.invoke("SendMessenger", room, username, message);
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
