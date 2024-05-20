import React from "react";
import * as database from "../database/customers_database";
import { renderToStream } from "@react-pdf/renderer";
import InvoiceTemplate from "../template/invoice_template";
import { registerSale } from "../database/sales_database";
import { UUID } from "sequelize";
export { buildPDF };

// Stores invoice on database
async function buildPDF(
  invoice_items,
  invoice_number,
  name,
  last_name,
  email,
  date
) {
  const complete_buffer = [];
  const pdf_stream = await renderToStream(
    <InvoiceTemplate
      invoice_number={invoice_number}
      items={invoice_items}
      name={name}
      last_name={last_name}
      date={date}
      email={email}
    />
  );

  pdf_stream.on("data", (chucks) => {
    complete_buffer.push(chucks);
  });
  pdf_stream.on("end", async () => {
    const buffed = Buffer.concat(complete_buffer).toString("base64");
    try {
      await database.addCustomer(
        name,
        last_name,
        invoice_number,
        buffed,
        email
      );
      await registerSale()
      return `${name} has been added to Database`;
    } catch (error) {
      return error;
    }
  });
}
