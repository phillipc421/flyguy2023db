function randomIndex(arrayLength) {
  return Math.floor(arrayLength * Math.random());
}

function randomNumber(max) {
  return Math.floor((max - 1) * Math.random()) + 1;
}

// convert the postre money type to js number
function moneyToNumber(money) {
  return Number(money.slice(1));
}
function makeOrderTotal(qty, prices) {
  let total = 0;
  const indexesPicked = [];
  for (let i = 0; i < qty; i++) {
    let index = randomIndex(prices.length);
    indexesPicked.push(index);
    const price = prices[index];
    total += moneyToNumber(price);
  }

  return [total, indexesPicked];
}

// returns the occurences of each price
function createPriceSplit(priceIndexes, prices) {
  return priceIndexes.reduce((prev, curr) => {
    let price = moneyToNumber(prices[curr]);
    if (prev[price]) {
      prev[price]++;
    } else {
      prev[price] = 1;
    }
    return prev;
  }, {});
}

// our test orders will never have more than 5 items

// numOrders: number
// testUsers: [string, string][]
// prices: number[]
function createTestOrderValues(numOrders, testUsers, prices) {
  const testOrderValues = [];
  const priceSplitsList = [];
  for (let i = 0; i < numOrders; i++) {
    const randomUser = testUsers[randomIndex(testUsers.length)];
    const [id, name] = randomUser;
    const orderQty = randomNumber(5);
    // const orderQty = 5;
    const [orderTotal, priceIndexes] = makeOrderTotal(orderQty, prices);
    const priceSplits = createPriceSplit(priceIndexes, prices);
    priceSplitsList.push(priceSplits);
    testOrderValues.push(name, id, orderTotal);
  }
  return [testOrderValues, priceSplitsList];
}

// priceSplits: {[price]: number}[]
// products: {[product]: number}
function createTestOrderItemValues(numOrders, priceSplits, products) {
  const testOrderItemValues = [];
  for (let i = 0; i < numOrders; i++) {
    const priceSplit = priceSplits[i];
    // length of pricesplit array indicates how many orderItems are related to the order
    Object.entries(priceSplit).forEach(([price, qty]) => {
      const product = products.find(
        (product) => moneyToNumber(product.current_price) === Number(price)
      );
      testOrderItemValues.push(
        i + 1,
        product.id,
        qty,
        Number(price) * Number(qty)
      );
    });
  }
  return testOrderItemValues;
}

module.exports = { createTestOrderValues, createTestOrderItemValues };
