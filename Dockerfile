ARG NODE_IMAGE=node:20.12.0-bullseye-slim

FROM $NODE_IMAGE AS base

# Install dumb-init
RUN apt-get update && apt-get install -y dumb-init

# Create app directory and set permissions to node user
RUN mkdir -p /home/node/app && chown node:node /home/node/app

# Set the working directory
WORKDIR /home/node/app

# Set the User as NODE
USER node

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
FROM base AS production

# Here, we include all the required environment variables
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0

# Copy package.* to the working directory with active user
COPY --chown=node:node ./package*.json ./

# Copy files to the working directory from the build folder the user
COPY --chown=node:node --from=build /home/node/app/build .

# We run NPM CI to install the exact versions of dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE $PORT

# Run the command to start the server using "dumb-init"
CMD [ "dumb-init", "node", "bin/server.js" ]