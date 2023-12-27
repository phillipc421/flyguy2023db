# Test Database Data for flyguy2023app

This repo contains the basic schema and test data generation files for seeding the database used with the flyguy2023 app repo.

## Setup

You will need a local copy of postgres on your machine and psql. I assume some basic knowledge of postgres, such as how to create a db with psql.

To start with a clean database (no users, orders, reviews):

1. Use psql to create a db.

2. Create a `.env` file and fill it with the following key/value pairs using the values you used when making the db in step 1.

   ```
   DB_USER="username"
   DB_PASS="password"
   DB_HOST="localhost"
   DB_PORT=5432
   DB_NAME="databasename"
   ```

3. Use psql to seed the new db with the `schema.sql` file.

   `psql -U <username> < schema.sql`

   - see npm seed script in my package.json for how I'm doing it locally. Replace the username with whatever username you used to make the db.
   - Products **are** created during this step. We only ever sold three products.

4. Run `node seed.js` to fill the DB with test users and orders. Reviews will remain blank as of now.
5. Configure the env variables of flyguy2023app to use the same db credentials.
6. You should be able to succesfully connect to the db via the ui and through api endpoints. Feel free the extend for your purposes. The `seed.js` file calls `testOrder.js` and `testUsers.js`, but you can do it all in `seed.js` if you prefer.

## Resetting

If you want to start fresh again, simply seed the db with `schema.sql` and optionally run `node seed.js`. Note that the **product id's will change** as they are not sequential.

`psql -U <username> < schema.sql`
