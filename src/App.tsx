import logo from "./logo.svg";
import "./App.css";
import {
  createSignalRContext, // SignalR
} from "react-signalr";
import Chat from "./Chat";
export const SignalRContext = createSignalRContext();

function App() {
  return (
    // <SignalRContext.Provider
    //   connectEnabled={true}
    //   // accessTokenFactory={() => token}
    //   // dependencies={[token]} //remove previous connection and create a new connection if changed
    //   url={"https://cls.mehraman.com/Messenger"}
    // >
    <Chat />
    // </SignalRContext.Provider>
  );
}

export default App;
