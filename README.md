## Just Chat

This is the Just Chat project, written in TypeScript, React, uses Socket.io, RabbitMQ, Mongoose/Typegoose.

- [x] allow users to register and log in
- [x] allow users to chat between themselves in real-time communication
- [x] let users know what was going on when they join the room (chat history)
- [x] features a **stocks** information bot
- [x] multiple channels to chat from
- [x] easy to add new bots

## Requirements

- Node LTS (v14.x.x)
- WebSockets supporting browser (e.g.: Google Chrome 43+)
- MongoDB
- RabbitMQ

## Running

You can run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/angelobartolome/justchat
```

Step 2: Build the Docker instance

```bash
cd justchat
docker-compose build
```

Step 3: Run the Docker instance locally:

```bash
docker-compose up
```

Wait few seconds to have everything up (Rabbit.MQ and MongoDB takes up to 30sec)

Now open two browser instances on [http://localhost](http://localhost), register with different names and e-mails, and try-it out!

Available bot commands:

- **/stock=aapl.us**: Show stocks value on _aapl.us_, try **googl.us** for e.g.
