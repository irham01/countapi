FROM nikolaik/python-nodejs:latest

WORKDIR /home/frmdev/frmdev
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]