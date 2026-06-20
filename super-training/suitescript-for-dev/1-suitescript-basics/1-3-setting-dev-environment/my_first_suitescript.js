/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType Suitelet
 */
define([], () => {
  /**
   * @param {OnRequestContext} context
   * @return {void}
   */
  const onRequest = (context) => {
    try {
      const { request, response } = context;
    } catch (e) {
      log.error('onRequest', e.toJSON ? e : e.stack ? e.stack : e.toString());
    }
  };

  return { onRequest };
});
