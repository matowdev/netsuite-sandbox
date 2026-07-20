/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 *
 * Add two "custom" buttons to the "Sales Order" to display a "message" and change the color of all page elements (through a "dialog").
 */
define([], () => {
  const SCRIPT_FILENAME = 'add_buttons_to_so_header_ue';

  /**
   * @param {BeforeLoadContext} context
   * @return {void}
   */
  const beforeLoad = (context) => {
    try {
      const { type, newRecord, form, request } = context;

      if (type !== context.UserEventType.VIEW) return; // add button(s) only in the "View" record mode (if "Edit".. isn't displayed)

      form.addButton({
        id: 'custpage_message',
        label: 'Show Message',
        functionName: 'showMessage',
      });

      form.addButton({
        id: 'custpage_dialog',
        label: 'Show Dialog',
        functionName: 'showDialog',
      });

      form.clientScriptModulePath = './so_button_handlers_cs.js'; // path to the file.. with the "handlers" function for button(s) (which will also be loaded to the "File Cabinet")
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: beforeLoad`,
        details: e,
      });
    }
  };

  return {
    beforeLoad,
  };
});
