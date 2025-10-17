# Using official Node.js image from https://hub.docker.com/_/node
# FROM node:16.14.0-alpine3.15
FROM node:22.20.0-alpine3.21

LABEL maintainer="LSEG Developer Relations"
# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app
ENV NODE_ENV=production
RUN npm install -g npm@8.5.1 \
    && npm install --production

# Bundle app source
COPY . .

# Expose Express.js web-server port
EXPOSE 8080
# Set user to be node user, not root.
USER node
# run npm start command (node server.js)
CMD [ "npm", "start" ]