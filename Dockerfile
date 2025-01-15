FROM node:14.21.3-alpine as build
# Create app directory!
RUN mkdir -p /app
#make the 'app' folder the current working directory
WORKDIR /app
# Copy package.json
COPY package.json .
# Install dependencies
RUN npm install
# Copy app source code
COPY . .

RUN npm run build
# Expose port and start application
EXPOSE 7878

# Start the application
CMD ["npm", "start"] 
