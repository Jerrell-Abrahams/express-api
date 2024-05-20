import * as database from "../database/customers_database";
import {
  getPricesByName,
  setStockQuantityById,
  getStockQuantityById,

} from "./stocks_controller";
import { sendEmail } from "./email_controller";
import { buildPDF } from "./pdf_controller";
import * as orders from "../database/sales_database";

// Exports
export {
  retrieveAllCustomers,
  generateInvoice,
  sendInvoice,
  getInvoiceNumberByID,
  sendInvoiceByInvoiceNumber,
  deleteCustomerById,
  syncDB
};

// Status Check of Database
database.getDatabaseStatus();

// Query Database and make stocks changes accordingly
async function compilePrices(items) {
  // Check if there is enough parts
  const quantity = items.map((item) => item.quantity);
  const invoice_items = await getPricesByName(items);

  for (const [i, item] of invoice_items[0].entries()) {
    const stock_in_hand = await getStockQuantityById(item.id);
    invoice_items[0][i].price *= quantity[i];

    if (quantity[i] === stock_in_hand) {
      invoice_items[0][i].price *= quantity[i];
      await setStockQuantityById(
        item.id,
        invoice_items[0][i].quantity - quantity[i]
      );
      sendEmail(
        "jerrellabrahams50@gmail.com",
        "",
        `${item.part_name} Someone ordered all stock. Please replenish before someone orders again.`,
        `Someone ordered all ${item.part_name}. Please replenish before someone orders again.`
      ); // Sends mail when all stock was ordered
    } else if (quantity[i] > stock_in_hand) {
      (invoice_items[0][i].part_name += "(Insufficient Stock)"),
        (invoice_items[0][i].price = 0);
      invoice_items[0][i].quantity = 0;
      sendEmail(
        "jerrellabrahams50@gmail.com",
        "",
        `${item.part_name} stock running low`,
        `Stocks of ${item.part_name} are finished or running low, please get more stock.`
      ); // Sends mail when stocks are running low
    } else {
      await setStockQuantityById(
        item.id,
        invoice_items[0][i].quantity - quantity[i]
      );
      invoice_items[0][i].quantity = quantity[i];
    }
  }
  return invoice_items[0];
}

// Gets users from database
async function retrieveAllCustomers() {
  const customers = (await database.getAllCustomers());
  console.log(customers)
  // return customers.map((user) => user.firstname);
}

// Gets invoice number from ID
async function getInvoiceNumberByID(id) {
  const customers = await database.getInvoiceNumber(id);
  return customers.map((user) => user.invoice_number);
}

// Gets and sends invoice to customer from id
async function sendInvoice(data) {
  return await database.getCustomerById(data.id).then((database_data) => {
    const rebuilt_pdf = Buffer.from(database_data.invoice, "base64");
    return sendEmail(
      database_data.email,
      `${database_data.firstname}_Invoice`,
      `Invoice: ${database_data.firstname}`,
      `Hi ${database_data.firstname}😊\nHere is the invoice you requested from us.👌`,
      rebuilt_pdf
    );
  });
}

// Gets and sends invoice to customer from invoice_number
async function sendInvoiceByInvoiceNumber(data) {
  return await database
    .getCustomerByInvoice(data.invoice_number)
    .then((database_data) => {
      const rebuilt_pdf = Buffer.from(database_data.invoice, "base64");
      return sendEmail(
        database_data.email,
        `${database_data.firstname}_Invoice`,
        `Invoice: ${database_data.firstname}`,
        `Hi ${database_data.firstname}😊\nHere is the invoice you requested from us.👌`,
        rebuilt_pdf
      );
    });
}

// Generates invoice PDF and stores to database
async function generateInvoice(data) {
  const date = new Date();
  const invoice_number_generator =
    Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const short_date = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  const invoice_items = await compilePrices(data.items);
  return await buildPDF(
    invoice_items,
    invoice_number_generator,
    data.name,
    data.last_name,
    data.email,
    short_date
  );
}

async function deleteCustomerById(id) {
  return await database.deleteCustomer(id);
}

async function syncDB() {
  return await database.syncDB();
}
