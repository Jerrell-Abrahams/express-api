import * as database from "../database/stocks_database";

// Exports
export {
  getInventory,
  getPartQuantityById,
  getPartById,
  setPartQuantityById,
  setPriceById,
  getPricesByName,
  getPriceById,
  addPartToDatabase,
  replenishStocks,
  discontinuePartById,
  syncDB,
};

// ############### GETTERS ####################

// Gets all stocks with ID
async function getInventory(id) {
  return await database.getInventory(id);
}
// Gets stock quantity from ID
async function getPartQuantityById(id) {
  return await database.getPartQuantityById(id).then((result) => {
    return Number(result[0][0].quantity);
  });
}
// Get part by ID
async function getPartById(id) {
  return await database.getPart(id).then((result) => result);
}
// Gets price of part with ID
async function getPriceById(id) {
  return await database.getPrice(id).then((result) => result);
}
// Gets prices of parts with name
async function getPricesByName(name) {
  return await database.getPrices(name).then((result) => result);
}

// ############### SETTERS ####################

// Sets stock of part with ID
async function setPartQuantityById(id, amount) {
  await database.setPartQuantity(id, amount);
  return await database
    .getPartQuantityById(id)
    .then((result) => result[0][0].quantity);
}

// Sets Price of part with ID
async function setPriceById(id, amount) {
  return await database.setPrice(id, amount);
}

// Adds part to Database
async function addPartToDatabase(part_name, price, quantity) {
  return await database.addPart(part_name, price, quantity);
}

// Replenish all stocks with amount provided
async function replenishStocks(amount) {
  return await database.replenish(amount);
}

// Deletes part from Database with ID
async function discontinuePartById(id) {
  return await database.discontinuePart(id);
}

async function syncDB() {
  return await database.syncDB();
}
