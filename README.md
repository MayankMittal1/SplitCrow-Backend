# SplitCrow-Backend
Make sure you have MySql server intalled with database named ```"splitcrow"```
Rename .env.sample to .env and add any random string as the secret key, update the database connection string to point to the database

Run ```npm i```

Then run ```npx prisma migrate reset```, ```npx prisma db push```

To run dev server, use command

```npm run dev```
