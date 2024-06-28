ARG NODE_IMAGE=node:20.12.0-bullseye-slim

FROM $NODE_IMAGE AS base

# Puppeteer dependencies
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install dumb-init
RUN apt-get update && apt-get install -y dumb-init

# Create app directory and set permissions to node user
RUN mkdir -p /home/node/app && chown node:node /home/node/app

# Set the working directory
WORKDIR /home/node/app

RUN mkdir tmp

################### Second Stage - Installing dependencies ###################

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

################## Third Stage - Building Stage #####################

FROM dependencies AS build
RUN node ace build

################## Final Stage - Production #########################

# In this final stage, we will start running the application
FROM build AS production

# Here, we include all the required environment variables
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0

# Switch to the app build directory
WORKDIR /home/node/app/build

# We run NPM CI to install the exact versions of dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE $PORT

# Run the command to start the server using "dumb-init"
CMD [ "dumb-init", "node", "bin/server.js" ]