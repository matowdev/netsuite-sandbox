/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType ClientScript
 *
 * Validates the "memo" field. Detects the invalid word "bad" and automatically replaces it with asterisks (***).
 */
define([], () => {
  const SCRIPT_FILENAME = 'memo_field_checker_CS';

  /**
   * @param {ValidateFieldContext} context
   * @return {boolean} - Return true if the field is valid or false to prevent the field value from changing
   */
  const validateField = (context) => {
    try {
      const { currentRecord, fieldId } = context;

      // проверка изменения/ввода только в поле "memo"
      if (fieldId === 'memo') {
        const badValue = 'bad';
        const memoValue = currentRecord.getValue({ fieldId: 'memo' }) ?? ''; // получение текущего/введённого значения (исключение null/undefined)
        const containsBadValue = memoValue.toLowerCase().includes(badValue); // проверка на наличие "плохого" значения (true/false)

        if (containsBadValue === true) {
          // установка предусмотренного значения с игнорированием повторных триггеров
          currentRecord.setValue({
            fieldId: 'memo',
            value: memoValue.replace(new RegExp(badValue, 'gi'), '***'), // замена "плохого" значения на предусмотренное (т.е. через регулярное выражение из badValue, с флагами g (глобально/все вхождения), i (без учета регистра).. альтернатива методу replaceAll() который может не поддерживаться, пропускать регистры)
            ignoreFieldChange: true, // исключение повторной валидации (сразу) после замены "bad" на "***" (т.е. по сути исключение возможной рекурсии)
          });

          // отмена исходного ввода пользователя, содержащего "bad" (т.е. "bad" не будет записан, а будет записан "***")
          return false;
        }
      }
    } catch (e) {
      console.error(`${SCRIPT_FILENAME}: validateField error:`, e);
    }

    // после всего.. возврат true, т.к. мы либо/уже исправили значение, либо в поле не было "bad" (т.е. нет препятствия для других взаимодействий)
    return true;
  };

  return {
    validateField,
  };
});
