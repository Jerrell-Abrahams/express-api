import express from "express";
import * as controller from "../controllers/customers_controller";
const router = express.Router();



// Route to get names of users in database
router.get("/customers/get-customers", async (req, res) => {
  const process_start = process.hrtime.bigint();
  try {
    res.send(await controller.retrieveAllCustomers());
  } catch (error) {
    res.status(500).send("Error on /get-customers");
  }
  const diff = process.hrtime.bigint() - process_start;
  const seconds = Number(diff) / 1e9;
  console.log("\x1b[33m" + `Get customers from Database: ${seconds} m/s`);
});

// Route that gets invoice number
router.get("/customers/get-invoice-number", async (req, res) => {
  const process_start = process.hrtime.bigint();
  try {
    res.send(await controller.getInvoiceNumberByID(req.body.id));
  } catch (error) {
    res.status(500).send("Error on /get-invoice-number");
  }
  const diff = process.hrtime.bigint() - process_start;
  const seconds = Number(diff) / 1e9;
  console.log("\x1b[33m" + `Get customers from Database: ${seconds} m/s`);
});

// Route to generate invoice and store to database
router.post("/customers/generate-invoice", async (req, res) => {
  const process_start = process.hrtime.bigint();
  await controller.generateInvoice(req.body);
  try {
    res.send("Added new user to database");
  } catch (error) {
    res.status(500).send("Error on /generate-invoice");
  }
  const diff = process.hrtime.bigint() - process_start;
  const seconds = Number(diff) / 1e9;
  console.log(
    "\x1b[33m" + `Generated Invoice/Stored to Database: ${seconds} m/s`
  );
});

// Route to send email of invoice
router.post("/customers/send-invoice", async (req, res) => {
  const process_start = process.hrtime.bigint();
  try {
    res.send(await controller.sendInvoice(req.body));
  } catch (error) {
    res.status(500).send("Error on /send-invoice");
  }

  const diff = process.hrtime.bigint() - process_start;
  const seconds = Number(diff) / 1e9;
  console.log("\x1b[33m" + `Sent invoice: ${seconds} m/s`);
});

// Route to send email of invoice
router.post("/customers/send-invoice-with-number", async (req, res) => {
  const process_start = process.hrtime.bigint();
  try {
    res.send(await controller.sendInvoiceByInvoiceNumber(req.body));
  } catch (error) {
    res.status(500).send("Error on /send-invoice-with-number");
  }

  const diff = process.hrtime.bigint() - process_start;
  const seconds = Number(diff) / 1e9;
  console.log("\x1b[33m" + `Sent invoice: ${seconds} m/s`);
});

router.delete("/customers/delete-customer", async (req, res) => {
  try {
    res.send(await controller.deleteCustomerById(req.body.id));
  } catch (error) {
    res.status(500).send("Error on /delete-customer");
  }
});

router.get("/customers/sync", async (req, res) => {
  res.send(await controller.syncDB())
})

export default router;
