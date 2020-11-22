## Just Chat Stocks Bot

This is the stocks bot for Just Chat server.

## Requirements

- Node LTS (v14.x.x)
- Just Chat server running.

## How to create my own bot?

You can use this project as reference for your own bot. All handling is done in [src/controllers/bot.controller.ts](src/controllers/bot.controller.ts).
Just extend **CommandParser** to match your desired commands, and implement features in **bot.controller.ts** file.

## Running

You can run this app as following:

Step 1: Clone the repo

```bash
git clone https://github.com/angelobartolome/justchat
```

Step 2: Build the Docker instance

```bash
cd justchat/justchat-stocks-bot
npm install
```

Step 3: Run the client in development mode

```bash
npm run dev
```
