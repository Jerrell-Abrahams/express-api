import * as pg from "pg";
const { Sequelize, DataTypes } = require("sequelize");
const sales = new Sequelize("postgres", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
});

export { syncDB, registerSale, getSales };

const Sales = sales.define("Sales", {
  sale_id: {
    type: DataTypes.NUMBER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
  },
  sale_date: {
    type: DataTypes.STRING,
  },
  items: {
    type: DataTypes.ARRAY(DataTypes.JSON),
  },
});

async function syncDB() {
  try {
    await sales.authenticate();
    Sales.sync({ alter: true });
    return "Connection to Sales was been established successfully.";
  } catch (error) {
    return "Couldn't connect to Sales Database, error: " + error;
  }
}

async function registerSale(customer_id, sale_date, items) {
  await Sales.create({
    customer_id: customer_id,
    sale_date: sale_date,
    items: items,
  });
}

async function getSales() {
  return await Sales.findAll();
}
