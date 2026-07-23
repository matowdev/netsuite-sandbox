/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 *
 * Get the "Saved Search" ID according to the "MapReduceScript" logic.
 */
define(['N/record', 'N/runtime', 'N/search'], (record, runtime, search) => {
  const SCRIPT_FILENAME = 'load_save_search_mr';

  /**
   * @param {GetInputContext} context
   * @return {GetInputReturn} - The data source to be processed (search.Search, file.File, Array, Object, etc.)
   */
  const getInputData = (context) => {
    try {
      log.audit({
        title: `${SCRIPT_FILENAME}: getInputData`,
        details: 'Start execution',
      });

      const savedSearchId =
        runtime
          .getCurrentScript()
          .getParameter({ name: 'custscript_mr_search_to_process' }) + '' || '';

      if (!savedSearchId) return []; // if not found.. return "empty" [] to avoid an error

      const loadSearch = search.load({ id: savedSearchId });

      return loadSearch;
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: getInputData`,
        details: e,
      });
    }
  };

  /**
   * @param {MapContext} context - Data collection containing raw key/value pairs
   * @return {void}
   */
  const map = (context) => {
    try {
      const { key, value } = context;

      const { id: recordId, recordType } = JSON.parse(value);

      const savedId = record
        .load({ id: recordId, type: recordType })
        .save({ ignoreMandatoryFields: true });

      log.debug({
        title: `${SCRIPT_FILENAME}: map`,
        details: `Record ${savedId} has been saved`,
      });
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: map`,
        details: e,
      });
    }
  };

  /**
   * @param {ReduceContext} context - Data collection containing grouped key/value pairs
   * @return {void}
   */
  const reduce = (context) => {
    try {
      const { key, values } = context;
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: reduce`,
        details: e,
      });
    }
  };

  /**
   * @param {SummarizeContext} context - Holds statistics regarding the execution of a map/reduce script
   * @return {void}
   */
  const summarize = (context) => {
    try {
      const { dateCreated, seconds, usage, concurrency, yields } = context;
    } catch (e) {
      log.error({
        title: `${SCRIPT_FILENAME}: summarize`,
        details: e,
      });
    } finally {
      log.audit({
        title: `${SCRIPT_FILENAME}: summarize`,
        details: 'Execution finished',
      });
    }
  };

  return {
    getInputData,
    map,
    reduce,
    summarize,
  };
});
