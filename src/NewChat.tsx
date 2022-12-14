import { FC, useCallback, useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import moment from "moment";

export const NewChat: FC = () => {
  const [message, setMessage] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);
  const [connection, setConnection] = useState<any>();
  const [messages, setMessages] = useState<
    { user: string; text: string; date: Date }[]
  >([]);
  const messagesListRef = useRef<HTMLDivElement>(null);

  const receiveMessage = useCallback((sender: string, text: string) => {
    setMessages((perv) => [
      ...perv,
      { user: sender, text: text, date: new Date() },
    ]);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, []);
  const connectUser = useCallback(async () => {
    function join(groupName: string) {
      console.log(groupName);
      setMessages((perv) => [
        ...perv,
        {
          user: "admin",
          text: `you are join to ${groupName}`,
          date: new Date(),
        },
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
    connect.on("ReceiveMessage", (sender, text) => {
      receiveMessage(sender, text);
    });
    await connect.start();

    console.log(connect);
    setConnection(connect);
  }, [receiveMessage]);
  useEffect(() => {
    connectUser();
  }, [connectUser]);
  const joinGroup = async () => {
    await connection.invoke("JoinGroup", groupName);
    setShowChat(true);
  };
  async function sendMessage() {
    await connection.invoke("SendMessenger", {
      roomName: groupName,
      sender: userName,
      text: message,
    });
    setMessage("");
  }
  const scrollToBottom = () => {
    // const height: number | undefined =
    //   document.getElementById("chatBox")?.scrollHeight;
    // if (height) {
    //   const top = height + 170;
    //   document.getElementById("chatBox")?.scrollTo({
    //     top,
    //     behavior: "smooth",
    //   });
    // }

    const scroll =
      messagesListRef?.current?.scrollHeight! -
      messagesListRef?.current?.clientHeight! +
      184;
    messagesListRef.current?.scrollTo(80, scroll);

    console.log(document.getElementById("chatBox")?.offsetHeight);
  };
  return (
    <div className="container">
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card chat-app row">
            <div id="plist" className="people-list col-sm-12 col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="username"
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                />
              </div>
              <div className="input-group mt-2">
                <a
                  href="/"
                  className="input-group-prepend"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    joinGroup();
                  }}
                >
                  <span
                    className="input-group-text "
                    style={{ fontWeight: 900 }}
                  >
                    Join
                  </span>
                </a>
                <input
                  type="text"
                  className="form-control"
                  placeholder="group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                  value={groupName}
                />
              </div>
              <ul className="list-unstyled chat-list mt-2 mb-0 ">
                <li
                  className="clearfix user-items"
                  onClick={() => setGroupName("MehramanRoom")}
                >
                  <img src="/mehraman-logo.png" alt="avatar" />
                  <div className="about">
                    <div className="name">Mehraman Room</div>
                    <div className="status">
                      <i className="fa fa-circle offline"></i>click join to
                      group{" "}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            {showChat && (
              <div className="chat ">
                <div className="chat-header clearfix">
                  <div className="row">
                    <div className="col-lg-6">
                      <span
                        // href="#"
                        data-toggle="modal"
                        data-target="#view_info"
                      >
                        <img src="/avatar2.png" alt="avatar" />
                      </span>
                      <div className="chat-about">
                        <h6 className="m-b-0">{userName}</h6>
                        <small>Online</small>
                      </div>
                    </div>
                    {/* <div className="col-lg-6 hidden-sm text-right">
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-secondary"
                    >
                      <i className="fa fa-camera"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-primary"
                    >
                      <i className="fa fa-image"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-info"
                    >
                      <i className="fa fa-cogs"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      className="btn btn-outline-warning"
                    >
                      <i className="fa fa-question"></i>
                    </a>
                  </div> */}
                  </div>
                </div>
                <div className="chat-history" ref={messagesListRef}>
                  <ul className="m-b-0" id="chatBox">
                    {messages.map((msg, index) => {
                      if (msg.user === userName) {
                        return (
                          <li className="clearfix" key={index}>
                            <div className="message-data">
                              <span className="message-data-time">
                                {moment(msg.date).format("HH:mm")}
                              </span>
                            </div>
                            <div className="message my-message">{msg.text}</div>
                          </li>
                        );
                      } else {
                        return (
                          <li className="clearfix" key={index}>
                            <div className="message-data text-right">
                              <span className="message-data-time">
                                {msg.user}
                              </span>
                              <img src="/avatar7.png" alt="avatar" />
                            </div>
                            <div className="message other-message float-right">
                              {msg.text}
                            </div>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
                <div className="chat-message clearfix">
                  <div className="input-group mb-0">
                    <div
                      className="input-group-prepend"
                      onClick={() => sendMessage()}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="input-group-text">
                        <i className="fa fa-send"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter text here..."
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      value={message}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
