import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define color theme
const colors = {
  primary: "#0490d9",
  secondary: "#111111",
  light: "#f8f9fa",
  dark: "#343a40",
};

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    padding: 20,
    backgroundColor: colors.light,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  main_title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.primary,
    borderBottom: `1pt solid ${colors.dark}`,
  },
  bill_to: {
    marginBottom: 20,
  },
  bill_to_title: {
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.primary,
  },
  items_table: {
    border: `1pt solid ${colors.dark}`,
    marginBottom: 20,
    borderRadius: 3,
  },
  table_row: {
    flexDirection: "row",
    borderBottom: `1pt solid ${colors.dark}`,
    fontSize: 14,
  },
  table_header: {
    backgroundColor: colors.secondary,
    padding: 2,
    flex: 1,
    textAlign: "center",
    color: colors.light,
  },
  table_cell: {
    padding: 5,
    flex: 1,
    textAlign: "center",
    color: colors.dark,
  },
  image: {
    width: "100px",
    height: "70px",
    textAlign: "center",
    margin: 10,
  },
  header: {
    position: "relative",
    top: 0,
    left: 0,
    margin: "20px",
    fontSize: 20,
    fontFamily: "Times-Roman",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: "center",
    color: "grey",
    padding: 10,
    fontSize: 12,
  },
  total: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    border: "1xp solid black",
    textAlign: "center",
    margin: "0 auto",
  },
});

let sub_total = 0;

// Create Document Component
const InvoiceTemplate = ({
  invoice_number,
  items,
  name,
  last_name,
  date,
  email,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
        <Image src={"assets/invoice_logo.jpeg"} style={styles.image} />
        <Text>Jerrell's Autobahn</Text>
        <Text>12 Clarence September Street, Boksburg</Text>
        <Text>065 312 9139</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.main_title}>Invoice: #{invoice_number}</Text>
        <View style={styles.bill_to}>
          <Text style={styles.bill_to_title}>Bill To:</Text>
          <Text>
            {name} {last_name}
          </Text>
          <Text>{email}</Text>
          <Text>{date}</Text>
        </View>
        <View style={styles.items_table}>
          <View style={styles.table_row}>
            <Text style={styles.table_header}>Item</Text>
            <Text style={styles.table_header}>Description</Text>
            <Text style={styles.table_header}>Quantity</Text>
            <Text style={styles.table_header}>Price</Text>
            <Text style={styles.table_header}>Total</Text>
          </View>
          {items.map((item, i) => {
            sub_total += item.price;
            return (
              <View key={item.name + i} style={styles.table_row}>
                <Text style={styles.table_cell}>{i + 1}</Text>
                <Text style={styles.table_cell}>{item.part_name}</Text>
                <Text style={styles.table_cell}>{item.quantity}</Text>
                <Text style={styles.table_cell}>
                  {item.quantity === 0
                    ? "R0"
                    : "R" + item.price / item.quantity}
                </Text>
                <Text style={styles.table_cell}>R{item.price}.00</Text>
              </View>
            );
          })}
        </View>
        {sub_total !== 0 ? (
          <View style={styles.total}>
            <Text>Sub Total:</Text>
            <Text style={{ fontSize: 24 }}>R {sub_total}</Text>
          </View>
        ) : (
          ""
        )}
      </View>
      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default InvoiceTemplate;
