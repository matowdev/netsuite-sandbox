/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType ClientScript
 *
 * Validates the "memo" field. Detects the invalid word "bad" and automatically replaces it with asterisks (***).
 */
define([], () => {
  const SCRIPT_FILENAME = 'memo_field_validate_checker_cs';

  /**
   * @param {ValidateFieldContext} context
   * @return {boolean} - Return true if the field is valid or false to prevent the field value from changing
   */
  const validateField = (context) => {
    try {
      const { currentRecord, fieldId } = context;

      // checking changes/entries only in the "memo" field
      if (fieldId === 'memo') {
        const badValue = 'bad';
        const memoValue = currentRecord.getValue({ fieldId: 'memo' }) ?? ''; // getting the current/entered value (null/undefined exception)
        const containsBadValue = memoValue.toLowerCase().includes(badValue); // checking for a "bad" value (true/false)

        if (containsBadValue === true) {
          // setting the intended value and ignoring repeated triggers
          currentRecord.setValue({
            fieldId: 'memo',
            value: memoValue.replace(new RegExp(badValue, 'gi'), '***'), // replacing a “bad” value with the provided one "***" (i.e. through a regular expression from badValue, with flags "g" (global/all occurrences), "i" (case insensitive).. alternative to the replaceAll() method which may not be supported, skips cases)
            ignoreFieldChange: true, // exclusion of re-validation (immediately) after replacing “bad” with “***” (i.e., in essence, exclusion of possible recursion)
          });

          return false; // canceling the user's original input containing "bad" (i.e. "bad" will not be written, but "***" will be written)
        }
      }
    } catch (e) {
      console.error(`${SCRIPT_FILENAME}: validateField error:`, e);
    }

    return true; // after all.. return true, because we either/have already corrected the value, or there was no "bad" in the field (i.e. there is no barrier to other interactions)
  };

  return {
    validateField,
  };
});
