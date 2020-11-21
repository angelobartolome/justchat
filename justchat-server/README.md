## Just Chat Server

This is the server side of the Just Chat project, written in TypeScript, uses Socket.io, RabbitMQ and Mongoose/Typegoose.

- allow users to register and log in
- allow users to chat between themselves
- let users know what was going on when they join the room (chat history)
- Message Broker structure for bots (separate queue for bot commands and their reply)
- Some unit testing

## Requirements

- Node LTS (v14.x.x)
- MongoDB
- RabbitMQ

You can set up everything on Docker too.

## Setup

Clone this repository and install dependencies

```bash
git clone https://github.com/angelobartolome/justchat
cd justchat/justchat-server
```

```bash
npm install
```

Edit your .env file to match your environment.

```bash
DATABASE_URI=mongodb://your_mongo_host:27017/db
BROKER_URI=amqp://your_rabbitmq_instance_host:5672
PORT=3000
SECRET=your_desired_jwt_key
```

If you wan't to use with docker, run the following commands:

```bash
$ docker run -d  -it --name mongo --rm -p 27017:27017 mongo
$ docker run -d --hostname myrabbit --name rabbit131 -p 8080:15672 -p  5672:5672 -p 25676:25676 rabbitmq:3-management
```

Then and setup your .env as following.

```bash
DATABASE_URI=mongodb://localhost:27017/db
BROKER_URI=amqp://localhost:5672
PORT=3000
SECRET=your_desired_jwt_key
```

And open up [http://localhost:3000](http://localhost:3000)

## Adding new bots

This project keeps bots detached from server, so how does it work?

- Step 1: User sends a bot command, for example **/hello**
  Those messages are intercepted in [bot.controller.ts](src/socket-controllers/bot.controller.ts) file.

- Step 2: Those messages are queued in **bot_request_channel** on your RabbitMQ instance.

- Step 3: Your bot listen to the message, in the following format:
  ```json
  {
    "message": "lorem ipsum",
    "room": "#default",
    "date": "2020-11-21T21:26:22.196Z",
    "from": "user name"
  }
  ```
- Step 4: Your bot parses, and send the response queued in **bot_response_channel** on your RabbitMQ instance.

- Step 5: The server listens to response channel, and sends to all users on the socket.
