# us the official nod.sjs image
From node:20-alpine

#set the working directory inside the container
WORKDIR /app

COPY package*.json ./

# install dependencies
RUN npm install

COPY . .


EXPOSE 5173

CMD ["npm", "run", "dev"]

