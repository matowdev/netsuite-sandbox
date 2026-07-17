/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *
 * Get "runtime" information about the current user and the current script, through log.debug().
 */
define(['N/runtime'], (runtime) => {
  const SCRIPT_FILENAME = 'get_runtime_debug_info_sl';

  /**
   * @param {OnRequestContext} context
   * @return {void}
   */
  const onRequest = (context) => {
    try {
      const { request, response } = context;

      const currentUser = runtime.getCurrentUser();

      // this will be displayed in the "Script Deployment" → "Execution Log" sub-tab
      log.debug('Current User:', {
        role: currentUser.role,
        id: currentUser.id,
        email: currentUser.email,
      });

      const currentScript = runtime.getCurrentScript();
      const currentScriptLabel = currentScript.getParameter({
        name: 'custscript_runtime_debug_info',
      }); // getParameter().. most useful method in runtime.currentScript() capabilities

      // also will be displayed in the "Script Deployment" → "Execution Log" sub-tab
      log.debug('Current Script:', {
        id: currentScript.id,
        deploymentId: currentScript.deploymentId,
        label: currentScriptLabel, // custom parameter from 'Script Deployment' record
      });
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: onRequest`,
        details: e,
      });
    }
  };

  return { onRequest };
});
