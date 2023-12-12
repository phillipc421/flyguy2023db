require("dotenv").config();

const { Pool } = require("pg");
const { testUsers } = require("./testUsers");
const {
  createTestOrderValues,
  createTestOrderItemValues,
} = require("./testOrder");

const seedPool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

(async function () {
  const client = await seedPool.connect();
  let query = "INSERT INTO users (external_provider_id, name, email) VALUES";

  let testUserValues = [];
  for (let i = 0; i < testUsers.length; i++) {
    const { external_provider_id, name, email } = testUsers[i];
    testUserValues.push(external_provider_id, name, email);
  }

  for (let i = 0; i < testUserValues.length; i += 3) {
    if (i === testUserValues.length - 3) {
      query += ` ($${i + 1}, $${i + 2}, $${i + 3}) `;
    } else {
      query += ` ($${i + 1}, $${i + 2}, $${i + 3}),`;
    }
  }
  query += "RETURNING id, name;";

  const { rows: userRows } = await client.query(query, testUserValues);

  // returns an array {id: string, name: string}[];
  const userIds = userRows.map((row) => [row.id, row.name]);

  // get products
  query = "SELECT id, current_price FROM products;";
  const { rows: productRows } = await client.query(query);

  const prices = productRows.map((product) => product.current_price);

  const [testOrdersValues, priceSplits] = createTestOrderValues(
    5,
    userIds,
    prices
  );

  // query for adding test orders
  query = "INSERT INTO orders (customer_name, user_id, order_total) VALUES";

  for (let i = 0; i < testOrdersValues.length; i += 3) {
    if (i === testOrdersValues.length - 3) {
      query += ` ($${i + 1}, $${i + 2}, $${i + 3}) `;
    } else {
      query += ` ($${i + 1}, $${i + 2}, $${i + 3}),`;
    }
  }
  query += "RETURNING id;";

  const { rows: orderRows } = await client.query(query, testOrdersValues);

  // use the price splits from each order to determine the quantity and order_item_total;

  const testOrderItemValues = createTestOrderItemValues(
    orderRows.length,
    priceSplits,
    productRows
  );

  query =
    "INSERT INTO order_items (order_id, product_id, quantity, order_item_total) VALUES";

  for (let i = 0; i < testOrderItemValues.length; i += 4) {
    if (i === testOrderItemValues.length - 4) {
      query += ` ($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4});`;
    } else {
      query += ` ($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}),`;
    }
  }

  const { rows: orderItemsRows } = await client.query(
    query,
    testOrderItemValues
  );
  client.release();
})();
