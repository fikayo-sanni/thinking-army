FROM node:20

RUN apt-get update && apt-get install -y yarn python3 make g++

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

RUN npm install --legacy-peer-deps

# add app
COPY . ./

RUN npm run build

EXPOSE 5005

# start app
CMD ["npm", "run", "start"]
