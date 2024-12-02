FROM node:18

EXPOSE 80 443 2019

WORKDIR /code

CMD ["npm", "start"]