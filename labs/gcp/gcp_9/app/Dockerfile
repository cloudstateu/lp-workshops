FROM node:slim

# create and set app directory
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

# this is done before the following COPY command to take advantage of layer caching
COPY package.json .
RUN npm install

# copy app source to destination container
COPY . .

ENV SOME_VALUE=2

CMD ["npm", "start"]
