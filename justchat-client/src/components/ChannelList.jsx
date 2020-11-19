import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

export const ChannelList = ({ currentChannel, list, onSelectChannel }) => {
  function renderChannels() {
    return (
      <List>
        {list.map((c) => (
          <ListItem
            selected={currentChannel === c}
            button
            onClick={() => onSelectChannel(c)}
            key={c.toString()}
          >
            <ListItemAvatar>
              <Avatar>{c.replace("#", "")[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={c} />
          </ListItem>
        ))}
      </List>
    );
  }

  function renderChannelsHeader() {
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Channels
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <div style={styles.channelList}>
      {renderChannelsHeader()}
      {renderChannels()}
    </div>
  );
};

const styles = {
  channelList: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
};
