FROM keymetrics/pm2:latest-alpine

RUN pm2 install pm2-server-monit

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node

WORKDIR /home/node/api

COPY package.json yarn.* ./

USER node

RUN yarn

COPY --chown=node:node . .

RUN yarn build

RUN cp -r src/app/views dist/app/

EXPOSE 3333

CMD [ "pm2-runtime", "start", "gobarber.ecosystem.config.js" ]
