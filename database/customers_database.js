import * as pg from "pg";
const { Sequelize, DataTypes } = require("sequelize");
const customers = new Sequelize("postgres", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
});

// Exports
export {
  getAllCustomers,
  getCustomerById,
  getInvoiceNumber,
  addCustomer,
  getCustomerByInvoice,
  deleteCustomer,
  syncDB,
};

const customer_model = customers.define("Customers", {
  customer_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  invoice_number: {
    type: DataTypes.INTEGER,
  },
  invoice: {
    type: DataTypes.BLOB,
  },
  email: {
    type: DataTypes.STRING,
  },
});

async function syncDB() {
  try {
    await customers.authenticate();
    customer_model.sync({ alter: true });
    return "Has been synced";
  } catch (error) {
    return error;
  }
}

export const getDatabaseStatus = async () => {
  try {
    await customers.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Gets customers from Database
async function getAllCustomers() {
  try {
    return await customer_model.findAll({
      attributes: ["first_name"],
    });
  } catch (error) {
    throw new Error(
      "Query to retrieve all customers were unsuccessful. Error: ",
      error
    );
  }
}
// Get Customer by name
export const getCustomerByName = async (name) => {
  try {
    return (
      await customers.query(`SELECT * FROM customers WHERE firstname='${name}'`)
    ).at(0);
  } catch (error) {
    throw new Error(
      "This person does not exist or you have the wrong spelling. Error: ",
      error
    );
  }
};

// Get customer by ID
async function getCustomerById(id) {
  try {
    return (
      await customers.query(`SELECT * FROM customers WHERE id='${id}'`)
    ).at(0)[0];
  } catch (error) {
    throw new Error(
      "This person does not exist or you have the wrong spelling. Error: ",
      error
    );
  }
}

// Get customer by invoice number
async function getCustomerByInvoice(id) {
  try {
    return (
      await customers.query(
        `SELECT * FROM customers WHERE invoice_number='${id}'`
      )
    ).at(0)[0];
  } catch (error) {
    throw new Error(
      "This person does not exist or you have the wrong spelling. Error: ",
      error
    );
  }
}

// get invoice number from id
async function getInvoiceNumber(id) {
  try {
    return (
      await customers.query(
        `SELECT invoice_number FROM customers WHERE id='${id}'`
      )
    ).at(0);
  } catch (error) {
    throw new Error(
      "Failed to get invoice number from Database. Error: ",
      error
    );
  }
}

// Adds customer to Database
async function addCustomer(firstname, lastname, invoice_number, buffer, email) {
  try {
    return await customers.query(
      `INSERT INTO customers (firstname, lastname, invoice_number, invoice, email) VALUES ('${firstname}', '${lastname}', ${invoice_number}, '${buffer}', '${email}')`
    );
  } catch (error) {
    throw new Error(`Could not add ${firstname} to database. Error: `, error);
  }
}

// Deletes customer from Database with ID
async function deleteCustomer(id) {
  try {
    return await customers.query(`DELETE FROM customers WHERE id = ${id}`);
  } catch (error) {
    return `Couldn't remove user from database`;
  }
}
