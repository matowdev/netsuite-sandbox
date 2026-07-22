/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *
 * Get the "Task ID" from "Suitelet".
 */
define(['N/task'], (task) => {
  const SCRIPT_FILENAME = 'get_task_id_sl';

  /**
   * @param {OnRequestContext} context
   * @return {void}
   */
  const onRequest = (context) => {
    try {
      const { request, response } = context;
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: onRequest`,
        details: e,
      });
    }
  };

  return { onRequest };
});
