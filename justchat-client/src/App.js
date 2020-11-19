import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { TextField, Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { ChannelList } from "./components/ChannelList";
import { AuthDialog } from "./components/AuthDialog";
import {
  disconnectSocket,
  subscribeToChat,
  initiateSocket,
  subscribeToChannel,
  sendMessage,
  joinChannel,
} from "./utils/socket.io";

const App = () => {
  const [channelList] = useState(["#default", "#gaming"]);
  const [channel, setChannel] = useState();
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState("");

  const [text, setText] = useState("");

  useEffect(() => {
    if (token) initiateSocket(token);

    subscribeToChat((err, data) => {
      if (err) return;
      setMessages((oldChats) => [...oldChats, data]);
    });

    subscribeToChannel((err, data) => {
      setChannel(data);
      setMessages([]);
    });
    return () => {
      disconnectSocket();
    };
  }, [token]);

  function signOut() {
    setToken("");
  }

  function clearAndSendMessage(message) {
    setText("");
    sendMessage(channel, message);
  }

  function renderSignOutButton() {
    return <Button onClick={() => signOut()}>Sign out</Button>;
  }

  function renderChat(m) {
    return (
      <div style={styles.chatInner}>
        <div style={{ flex: 1 }}>
          <Container>
            {m
              .filter((c) => c && !!c.message)
              .map((c) => (
                <p>
                  <b>{c.from}</b>: {c.message}
                </p>
              ))}
          </Container>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            id="outlined-basic"
            style={{ flex: 1 }}
            label="Type your message"
            variant="outlined"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <Button onClick={() => clearAndSendMessage(text)}>Send</Button>
        </div>
      </div>
    );
  }

  function renderChatHeader() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            {channel || "None"}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
  function renderSettingsHeader() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <div style={styles.container}>
      <AuthDialog token={token} onAuthenticated={(token) => setToken(token)} />
      <ChannelList
        list={channelList}
        onSelectChannel={(channel) => joinChannel(channel)}
        currentChannel={channel}
      />
      <div style={styles.chat}>
        {renderChatHeader()}
        {renderChat(messages)}
      </div>
      <div style={styles.settings}>
        {renderSettingsHeader()}
        {renderSignOutButton()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "100vh",
  },
  channelList: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
  },
  chatInner: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  settings: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
};

export default App;
