# Using an existing docker image as a base
FROM node:14-slim
WORKDIR /usr/src/app

# Downloading and installing dependencies needed
COPY ./package*.json ./
RUN npm install
COPY ./ ./

# Tell te image what to do when it starts as a container
EXPOSE 3000
CMD ["npm", "start"]