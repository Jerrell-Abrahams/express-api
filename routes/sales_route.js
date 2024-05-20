import express from "express";
import * as database from "../database/sales_database";
const router = express.Router();

// router.post("/sales/get-sales", async (req, res) => {
//   await database.registerSale();
//   res.send("Working");
// });

router.get("/sales/sync", async (req, res) => {
  await database.syncDB();
  res.send("Synced the Database");
});

router.get("/sales/get-sales", async (req, res) => {
  res.json(await database.getSales());
});

export default router;
