# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY . .

# Build the Vue app for production
RUN npm run build

# Expose port 80 for the app
EXPOSE 80

# Set the command to run the app when the container starts
CMD [ "npm", "run", "serve" ]
