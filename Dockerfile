FROM node:16.14.0-alpine3.15

LABEL maintainer="Developer Advocate"
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --production

# Bundle app source
COPY . .

# Expose Express.js web-server port
EXPOSE 8080
# Set user to be node user, not root.
USER node
# run npm start command (node server.js)
CMD [ "npm", "start" ]