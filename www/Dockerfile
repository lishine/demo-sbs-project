FROM node:12

RUN npm install pm2 -g

WORKDIR /usr/app

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}
RUN echo DOCKER NODE_ENV=${NODE_ENV}
# ARG NODE_ENV
# ARG TEMP__NODE_ENV=${NODE_ENV}
# RUN echo TEMP__NODE_ENV=${TEMP__NODE_ENV}
# RUN echo TEMP__NODE_ENV=${TEMP__NODE_ENV}
# RUN echo TEMP__NODE_ENV=${TEMP__NODE_ENV}
# # ARG NODE_ENV=production
# # RUN echo $NODE_ENV
# ENV NODE_ENV production
# RUN echo 111 BUILD+++++++++++
# RUN echo DOCKER NODE_ENV=${NODE_ENV}
# RUN echo 111 BUILD-----------

COPY package*.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile
# RUN npm ci
COPY . .

# ARG NODE_ENV=${TEMP__NODE_ENV}
# ENV NODE_ENV ${NODE_ENV}
# RUN echo 222 RUN+++++++++++
# RUN echo DOCKER NODE_ENV=${NODE_ENV}
# RUN echo 222 RUN-----------

# RUN yarn build

CMD ["pm2-runtime", "./server.js"]