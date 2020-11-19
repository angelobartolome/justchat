FROM node:14-alpine as builder

WORKDIR /client

COPY package*.json /client/

RUN npm install --only=prod

COPY . /client

RUN npm run build

FROM nginx:1.15.9-alpine
COPY --from=builder /client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]