import * as pg from "pg";
const { Sequelize, DataTypes } = require("sequelize");

// Connect to database from sequelize
const inventory = new Sequelize("postgres", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
});

// Exports
export {
  getInventory,
  getPartQuantityById,
  getPart,
  setPartQuantity,
  setPrice,
  getPrice,
  getPrices,
  addPart,
  getPartName,
  replenish,
  discontinuePart,
  syncDB,
};

const inventory_model = inventory.define("Inventory", {
  part_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  part_name: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  limit: {
    type: DataTypes.INTEGER,
  },
});

async function syncDB() {
  try {
    await inventory.authenticate();
    inventory_model.sync({ force: true });
    return "Has been synced";
  } catch (error) {
    return error;
  }
}

// Gets All stocks
async function getInventory() {
  try {
    return await inventory.findAll();
  } catch (error) {
    throw new Error(
      "Query to retrieve all inventory were unsuccessful. Error: ",
      error
    );
  }
}

// get quantity of stock from ID
async function getPartQuantityById(id) {
  try {
    // return await inventory.query(
    //   `SELECT quantity, part_name FROM stocks WHERE id = ${id}`
    // );
    return await inventory.findOne({
      attributes: ["quantity, part_name"],
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw new Error(
      "No quantity or part name in stock in Database. Error: " + error
    );
  }
}

// Get part name from ID
async function getPart(id) {
  try {
    return await inventory
      .query(`SELECT part_name FROM stocks WHERE id = ${id}`)
      .then((result) => result[0][0].part_name);
  } catch (error) {
    throw new Error("No part name stock in Database. Error: " + error);
  }
}

// Gets Entire part with Name
async function getPartName(name) {
  try {
    return await inventory.findOne({
      where: {
        part_name: name,
      },
    });
  } catch (error) {
    throw new Error("No stock in Database. Error: " + error);
  }
}

// Gets Price from ID
async function getPrice(id) {
  try {
    return await inventory
      .query(`SELECT price FROM stocks WHERE id = ${id}`)
      .then((result) => result[0][0].price);
  } catch (error) {
    throw new Error("No price for this stock in Database. Error: " + error);
  }
}

// Get Prices from list using the name
async function getPrices(items) {
  try {
    return await inventory
      .query(
        `SELECT * FROM stocks where part_name IN (${items.map(
          (item) => "'" + String(item.name) + "'"
        )})`
      )
      .then((result) => result);
  } catch (error) {
    throw new Error("No prices in stock in Database. Error: " + error);
  }
}

// Sets stock quantity from id
async function setPartQuantity(id, amount) {
  try {
    return await inventory.query(
      `UPDATE stocks SET quantity = ${amount} WHERE id = ${id}`
    );
  } catch (error) {
    throw new Error(
      "Query to set quantity was not successful. Error: " + error
    );
  }
}

// Set price of part
async function setPrice(id, amount) {
  try {
    return await inventory.query(
      `UPDATE stocks SET price = ${amount} WHERE id = ${id}`
    );
  } catch (error) {
    throw new Error("Query to set price was not successful. Error: " + error);
  }
}

// Add part to database
async function addPart(part_name, price, quantity) {
  const already_exists = await getPartName(part_name);
  try {
    if (!already_exists) {
      await inventory.create({
        part_name: part_name,
        price: price,
        quantity: quantity,
      });
      return `${part_name} has been added to database`;
    } else {
      return "Part already exists";
    }
  } catch (error) {
    throw new Error("Query to set price was not successful. Error: " + error);
  }
}

// Replenish all stocks with amount
async function replenish(amount = 20) {
  try {
    await inventory.query(`UPDATE stocks SET quantity = ${amount}`);
    return `stocks has been updated to ${amount} `;
  } catch (error) {
    return error;
  }
}

// Removes part from id
async function discontinuePart(id) {
  try {
    const part_name = await getPart(id);
    await inventory.query(`DELETE FROM stocks WHERE id = ${id}`);
    return `Part ${part_name} has been discontinued and removed from Database`;
  } catch (error) {
    return `Could not delete stock/part with name: ${part_name} `;
  }
}
