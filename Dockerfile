# FROM gitlab.car-plus.cool:5000/fe/cms/fe-cms/cache AS build
# ARG NPM_TOKEN
# ARG MEMBER_INTERNAL_NPM_TOKEN

# WORKDIR /app

# COPY . .

# RUN echo -e "@fe:registry=https://gitlab.car-plus.cool/api/v4/packages/npm/" >> .npmrc
# RUN echo -e "//gitlab.car-plus.cool/api/v4/packages/npm/:_authToken=${NPM_TOKEN}" >> .npmrc
# RUN echo -e "//gitlab.car-plus.cool/api/v4/projects/:_authToken=${NPM_TOKEN}" >> .npmrc

# RUN yarn install && yarn build

# FROM node:14.16.0-alpine3.13

# WORKDIR /app

# COPY --from=build /app/next.config.js ./
# COPY --from=build /app/tailwind.config.js ./
# COPY --from=build /app/public ./public
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/node_modules ./node_modules
# COPY package.json .


# CMD ["/usr/local/bin/yarn", "start"]

# FROM node:17-alpine as dependencies
# WORKDIR /app
# COPY . .
# RUN npm i
# # Build production image
# CMD ["gcloud", "run", "start", "--port", "8080", "--bind", "0.0.0.0"]
# RUN docker build -t gcr.io/[test-project-389812]/my-node-app .
# FROM dependencies as builder
# RUN npm run build
# EXPOSE 3000
# CMD npm run start

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080
CMD npm run dev

# docker build -t gcr.io/[test-project-389812]/my-node-app .
# docker push gcr.io/[test-project-389812]/my-node-app
# gcloud run deploy --image gcr.io/[test-project-389812]/my-node-app --platform managed

