 FROM --platform=linux/amd64 node:18-slim

 # Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies


# prisma global
RUN yarn install
RUN yarn add global prisma
RUN yarn add @prisma/client
RUN apt-get update && apt install -y openssl

EXPOSE 3344
EXPOSE 5555

CMD [ "yarn", "dev" ]

# # Create app directory
# WORKDIR /usr/src/app

# # Bundle app source
# COPY . .

# # COPY .env
# # COPY .env.docker.example .env

# # Install app dependencies
# RUN yarn install
# COPY prisma ./prisma/
# RUN npm install -g
# RUN npm install prisma @prisma/client
# RUN apt-get update && apt install -y openssl

# EXPOSE 3344
# EXPOSE 5555

# CMD [ "yarn", "dev" ]
