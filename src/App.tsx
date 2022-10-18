import "./App.css";
import {
  createSignalRContext, // SignalR
} from "react-signalr";
import { NewChat } from "./NewChat";
export const SignalRContext = createSignalRContext();

function App() {
  return (
    // <SignalRContext.Provider
    //   connectEnabled={true}
    //   // accessTokenFactory={() => token}
    //   // dependencies={[token]} //remove previous connection and create a new connection if changed
    //   url={"https://cls.mehraman.com/Messenger"}
    // >
    <NewChat />
    // </SignalRContext.Provider>
  );
}

export default App;
