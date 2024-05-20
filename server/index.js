import express from "express";
import customers from "../routes/customers_route";
import stocks from "../routes/stocks_route";
import sales from "../routes/sales_route"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Uses all imported routes -- check /routes
app.use(customers);
app.use(stocks);
app.use(sales)


// Listens on port 3000
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
