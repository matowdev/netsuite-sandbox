/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 *
 * Realize the "search" logic in the browser, based on the “Customer” record.
 */
define(['N/search'], (search) => {
  const customerSearch = search.create({
    // set the record type "Customer" (i.e. in which records we will make a "search")
    type: search.Type.CUSTOMER,
    // what columns we want to see (what data we want to get)
    columns: [
      search.createColumn({
        name: 'companyname',
      }),
      // search.createColumn({
      //   name: 'addr1', // this is field's ID for "Address 1"
      // }),
      search.createColumn({
        name: 'address1',
        join: 'Address',
      }),
    ],
    // what criteria we will use to filter the record(s)
    filters: [
      search.createFilter({
        // name: 'id',
        name: 'internalid',
        operator: search.Operator.ANYOF,
        values: 76888, // the field should be called "values" (i.e. with an "S" at the end)
      }),
    ],
  });

  const result = [];

  customerSearch.run().each((searchResult) => {
    result.push(searchResult.getAllValues()); // push all values (from/after "customSearch")
    return true; // true.. because we need to keep iterating through result(s)
  });

  return {};
});
