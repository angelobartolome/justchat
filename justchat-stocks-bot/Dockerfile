FROM node:12-alpine as builder

# Create bot directory
WORKDIR /bot

# Install bot dependencies
COPY package*.json /bot/

RUN npm install

# Bundle bot source
COPY . /bot

RUN npm run build

CMD [ "npm", "start" ]

COPY wait-for.sh wait-for.sh 
RUN chmod +x wait-for.sh