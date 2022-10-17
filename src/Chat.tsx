import { FC, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const Chat: FC = () => {
  const [message, setMessage] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [connection, setConnection] = useState<any>();
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const receiveMessage = (sender: string, text: string) => {
    setMessages((perv) => [...perv, { user: sender, text: text }]);
  };
  const connectUser = async () => {
    function join(groupName: string) {
      console.log(groupName);
      setMessages((perv) => [
        ...perv,
        { user: "admin", text: `you are join to ${groupName}` },
      ]);
    }
    var connect = await new signalR.HubConnectionBuilder()
      .withUrl("https://cls.mehraman.com/Messenger", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
    connect.on("JoinGroup", join);
    connect.on("ReceiveMessage", receiveMessage);
    await connect.start();

    console.log(connect);
    setConnection(connect);
  };
  useEffect(() => {
    connectUser();
  }, []);
  const joinGroup = async () => {
    await connection.invoke("JoinGroup", groupName);
  };
  async function sendMessage() {
    await axios.post("https://cls.mehraman.com/api/Messenger/SendMessage", {
      roomName: groupName,
      sender: userName,
      text: message,
    });
    setMessage("");
  }

  return (
    <div style={{ display: "flex", padding: 30 }}>
      <div style={{ width: "50%" }}>
        <label htmlFor="groupName" style={{ marginBottom: "10px" }}>
          Group Name :{" "}
        </label>
        <div>
          <input
            type="text"
            id="groupName"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />
          <button
            onClick={() => {
              joinGroup();
              setShowChat(true);
            }}
            style={{ marginLeft: "10px" }}
          >
            join
          </button>
        </div>

        <label htmlFor="UserName" style={{ marginBottom: "10px" }}>
          User Name :{" "}
        </label>
        <div>
          <input
            type="text"
            id="UserName"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />

        </div>


        <label htmlFor="messageText">Message: </label>

        <div>
          <textarea
            id="messageText"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            rows={15}
          />
        </div>

        <button
          onClick={() => {
            sendMessage();
          }}
        >
          {" "}
          send{" "}
        </button>
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
