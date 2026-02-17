module.exports = {
  product_name: {
    fail: "Product name not clearly detected",
    fix: "Ensure product name is clearly printed on the label"
  },
  fssai_number: {
    fail: "FSSAI license number not detected",
    fix: "Add valid FSSAI license number on package"
  },
  net_quantity: {
    fail: "Net quantity not mentioned",
    fix: "Mention net quantity (e.g., 40g, 500ml)"
  },
  mrp: {
    fail: "MRP label detected but value missing",
    fix: "Ensure MRP value is clearly printed"
  },
  manufacturing_date: {
    fail: "Manufacturing date not detected",
    fix: "Add manufacturing date on package"
  },
  expiry_date: {
    fail: "Expiry / best before date not detected",
    fix: "Mention expiry or best before date"
  },
  ingredients: {
    fail: "Ingredients list not detected",
    fix: "Add ingredients list as per FSSAI norms"
  },
  manufacturer_details: {
    fail: "Manufacturer details missing",
    fix: "Add manufacturer / marketer address"
  }
};
