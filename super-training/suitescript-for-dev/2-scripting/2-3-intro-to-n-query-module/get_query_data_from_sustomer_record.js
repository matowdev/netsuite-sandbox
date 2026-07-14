/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 *
 * Get "query" data from customer record (from/in browser).
 */
define(['N/query'], (query) => {
  // ** ex. testing SuiteQL based on query to a "dual" virtual table
  query
    .runSuiteQL({
      query: `
      SELECT
        'value' column_1
      FROM dual
    `,
    })
    .asMappedResults(); // returns an array of mapped results (e.g. [{ column_1: 'value' }])

  // ** ex. how to get "companyName" from customer record based on "Records Catalog -> Customer (Fields)"
  query
    .runSuiteQL({
      query: `
      SELECT
        companyname
      From customer
      WHERE id = 76888
    `,
    })
    .asMappedResults();

  // ** ex. how to get "ISO-currency code" from customer record based on "Records Catalog -> Customer (Joins)"
  query
    .runSuiteQL({
      query: `
      SELECT
        customer.companyname,
        currency.symbol
      From customer
      JOIN currency ON customer.currency = currency.id
      WHERE customer.id = 76888
    `,
    })
    .asMappedResults();

  return {};
});
