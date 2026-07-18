/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *
 * Create a "custom" UI form, with fields and a sublist.
 */
define(['N/ui/serverWidget', 'N/format'], (serverWidget, format) => {
  const SCRIPT_FILENAME = 'create_custom_ui_form_sl';

  /**
   * @param {OnRequestContext} context
   * @return {void}
   */
  const onRequest = (context) => {
    try {
      const { request, response } = context;

      const customForm = serverWidget.createForm({
        title: 'Custom Form (Hello, from Suitelet)',
      });

      // add text field
      customForm.addField({
        id: 'custpage_text',
        type: serverWidget.FieldType.TEXT,
        label: 'Enter text',
      });

      // add date field
      const dateField = customForm.addField({
        id: 'custpage_date',
        type: serverWidget.FieldType.DATE,
        label: 'Date',
      });

      // add default value to date field (and immediately format date)
      dateField.defaultValue = format.format({
        value: new Date(),
        type: format.Type.DATE,
      });
      // make date field not editable (view only)
      dateField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.INLINE,
      });

      // create sublist
      const customSublist = customForm.addSublist({
        id: 'custpage_items',
        type: serverWidget.SublistType.INLINEEDITOR,
        label: 'Items',
      });

      customSublist.addField({
        id: 'custpage_item',
        type: serverWidget.FieldType.SELECT,
        label: 'Select Item',
        source: 'item', // specify the type of list values (that will display on the dropdown), i.e. "item", or "customer", or "employee".. etc.
      });

      customSublist.addField({
        id: 'custpage_qty',
        type: serverWidget.FieldType.FLOAT,
        label: 'Quantity',
      });

      const rateField = customSublist.addField({
        id: 'custpage_rate',
        type: serverWidget.FieldType.CURRENCY,
        label: 'Rate',
      });

      // add default value to rate field
      rateField.defaultValue = '99.99';
      // make rate field not editable (disabled)
      rateField.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.DISABLED,
      });

      return response.writePage(customForm); // !! mandatory return.. to display the UI form in the NetSuite/browser tab
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: onRequest`,
        details: e,
      });
    }
  };

  return { onRequest };
});
