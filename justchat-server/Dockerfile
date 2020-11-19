FROM node:12-alpine as builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json /app/

RUN npm install

# Bundle app source
COPY . /app

RUN npm run build

EXPOSE 8000
CMD [ "npm", "start" ]

COPY wait-for.sh wait-for.sh 
RUN chmod +x wait-for.sh