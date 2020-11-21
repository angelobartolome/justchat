## Just Chat

This is the Just Chat project, written in TypeScript, React, uses Socket.io, RabbitMQ, Mongoose/Typegoose.

- allow users to register and log in
- allow users to chat between themselves
- let users know what was going on when they join the room (chat history)
- features a **stocks** information bot
- multiple channels to chat from

## Requirements

- Node LTS (v14.x.x)
- WebSockets supporting browser (e.g.: Google Chrome 43+)
- MongoDB
- RabbitMQ

## Running

You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/contentful/the-example-app.nodejs.git
```

Step 2: Build the Docker instance

```bash
docker-compose build
```

Step 3: Run the Docker instance locally:

```bash
docker-compose up
```

Now open two browser instances on [http://localhost](http://localhost), register with different names and e-mails, and try-it out!

Available bot commands: - **/stock=aapl.us**: Show stocks value on _aapl.us_, try **googl.us** for e.g.
