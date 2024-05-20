import express from "express";
import * as controller from "../controllers/stocks_controller";

const router = express.Router();

router.get("/inventory/sync", async (req, res) => {
  await controller.syncDB();
  res.send("Synced");
});

// Route to get names of users in database
router.get("/inventory", async (req, res) => {
  try {
    res.send(await controller.getInventory(req.body.id));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/inventory/quantity", async (req, res) => {
  try {
    res.send(`${await controller.getPartQuantityById(req.body.id)} in stock`);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/inventory/part", async (req, res) => {
  const { id } = req.body;
  try {
    res.send(
      `Product with stock code ${id} is: ${await controller.getPartById(id)}`
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/inventory/set-quantity", async (req, res) => {
  const { id, amount } = req.body;
  try {
    const part_name = await controller.getPartById(id);
    const stock_count = await controller.setPartQuantityById(id, amount);
    res.send(
      `Stocks for ${part_name} has been replenished. Available now: ${stock_count}`
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/inventory/set-price", async (req, res) => {
  const { id, amount } = req.body;
  try {
    const part_name = await controller.getPartById(id);
    await controller.setPriceById(id, amount);
    res.send(`Price for ${part_name} has changed to R${amount}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/inventory/get-price", async (req, res) => {
  try {
    const part_name = await controller.getPartById(req.body.id);
    const price = await controller.getPriceById(req.body.id);
    res.send(`Current price for ${part_name} is: R${price}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/inventory/add-part", async (req, res) => {
  const { part_name, price, quantity } = req.body;
  try {
    // await controller.addPartToDatabase(part_name, price, quantity);
    // res.send(`${part_name} has been added with quantity of ${quantity}`);
    res.send(await controller.addPartToDatabase(part_name, price, quantity));
  } catch (error) {
    res.status(500).send("Error: ", error);
  }
});

router.post("/inventory/replenish", async (req, res) => {
  try {
    res.send(await controller.replenishStocks(req.body.amount));
  } catch (error) {
    res.status(500).send("Error on /replenish", error);
  }
});

router.delete("/inventory/part", async (req, res) => {
  try {
    res.send(await controller.discontinuePartById(req.body.id));
  } catch (error) {
    res.status(500).send("Error on /delete-part");
  }
});

export default router;
