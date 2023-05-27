import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HttpTransportType,
  HubConnectionState,
} from "@microsoft/signalr";

import "./App.css";

function App() {
  const [msgList, setMsgList] = useState("No message to show");
  const [hubConnection, setHubConnect] = useState(null);

  useEffect(() => {
    let start = false;
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5007/chathub", {
        async accessTokenFactory() {
          try {
            let res = await fetch(
              "http://localhost:5007/api/Demo/GetToken?userName=james"
            );
            let token = await res.text();
            return token;
          } catch (ex) {
            console.log(ex, "fetch token error");
          }
        },
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging("warn")
      .build();

    // let state = connection.state;
    // let dt = Date.now();
    // console.log(connection, state, Date.now());

    connection
      .start()
      .then(function () {
        console.log("connection started");

        connection.on("ReceiveMessage", function (user, message) {
          console.log("ReceiveMessage", user, message);
        });

        connection.onreconnecting((error) => {
          console.log("reconnecting");
        });

        connection.onreconnected((connectionId) => {
          console.log("reconnected");
        });

        connection.onclose((error) => {
          console.log("closed");
        });
      })
      .catch(function (err) {
        console.error(err, "error occurred in hub connection start");
      });

    setHubConnect(connection);

    return () => {
      if (connection && connection.state === HubConnectionState.Connected) {
        console.log("stop connectin");
        connection.stop();
      }
    };
  }, []);

  function sendMessage(user, message) {
    if (hubConnection) {
      hubConnection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
      });
    }
  }

  function stopConnection() {
    if (hubConnection && hubConnection.state === HubConnectionState.Connected) {
      hubConnection.stop();
    }
  }

  function reConnect() {
    if (
      hubConnection &&
      hubConnection.state === HubConnectionState.Disconnected
    ) {
      hubConnection.start();
    }
  }

  return (
    <div className="container">
      <div className="msg_list">{msgList}</div>
      <div>
        <input />
      </div>

      <div>
        <button onClick={() => sendMessage("James", "test")}>
          Send message
        </button>
        <button onClick={() => stopConnection()}>Stop Connection</button>
        <button onClick={() => reConnect()}>Reconnect</button>
      </div>
    </div>
  );
}

export default App;
