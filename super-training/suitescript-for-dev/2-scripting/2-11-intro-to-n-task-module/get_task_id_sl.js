/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *
 * Get the "Task ID" from "Suitelet".
 */
define(['N/task'], (task) => {
  const SCRIPT_FILENAME = 'get_task_id_sl';
  const TARGET_MR_SCRIPT_ID = 'customscript_load_save_search_mr'; // !! good practice.. to store the ID in constants rather than specifying it directly in the function call

  /**
   * @param {OnRequestContext} context
   * @return {void}
   */
  const onRequest = (context) => {
    try {
      const { request, response } = context;

      const taskId = task
        .create({
          taskType: task.TaskType.MAP_REDUCE,
          scriptId: TARGET_MR_SCRIPT_ID,
        })
        .submit();

      response.write(taskId); // output of the received ID
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: onRequest`,
        details: e,
      });
    }
  };

  return { onRequest };
});
