# Backend/Server of Invoice Application

Learn more about the following technologies:

- [Postgres SQL](https://www.postgresql.org/docs/current/)
- [Node.js](https://nodejs.org/docs/latest/api/)
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs/orm)

## Get Started:

Use `git clone` to clone this repo:

```console
$ git clone https://github.com/JCJ02/invoice-api.git
```

or

Click `Clone or download` and `Download ZIP` to get this repo.

## Install packages

1. Open a terminal
2. Go to `invoice-api` folder then

```console
$ npm install
```

## Instructions for Configuring the .env File:

1. Copy the following template into your .env file.
2. Replace each placeholder (e.g., <YOUR_PORT>, <YOUR_DATABASE_USERNAME>) with the corresponding value for your environment.
3. Save the file to apply the changes.

```console
PORT=<YOUR_PORT>
DATABASE_USERNAME=<YOUR_DATABASE_USERNAME>
DATABASE_PASSWORD=<YOUR_DATABASE_PASSWORD>
DATABASE_NAME=<YOUR_DATABASE_NAME>
DATABASE_HOST=<YOUR_DATABASE_HOST>
DATABASE_PORT=<YOUR_DATABASE_PORT>
DATABASE_URL=postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}

JWT_SECRET_KEY=$2a$10$Em6INkV.bbsi1sS2LgcB8.o/GtFlIJa6lMJQ7g7ewAPsBMNP8CqmS

ENV=development

SMTP_HOST=<YOUR_SMTP_HOST>
SMTP_PORT=465
SMTP_USER=<YOUR_SMTP_USER>
SMTP_PASS=<YOUR_SMTP_PASSWORD>
SENDER_EMAIL=<YOUR_SENDER_EMAIL>
```

## To Run the Backend/Server

Make sure you setup your `DATABASE` already before starting and using `REST API`

```console
$ npm run server
```
