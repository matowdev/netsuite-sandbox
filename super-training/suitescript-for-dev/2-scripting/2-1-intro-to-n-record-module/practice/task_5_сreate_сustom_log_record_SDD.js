// Задание 5:
// Бизнес-ситуация: Нам необходимо реализовать систему логирования ошибок в ночных скриптах. Если в системе происходит сбой, скрипт должен автоматически создать запись в нашей кастомной таблице "Лог интеграции" (customrecord_integration_log), заполнить описание ошибки и сохранить её для админа.
// Условия:
// - Тип скрипта: Scheduled Script.
// - Режим работы: Dynamic Mode (isDynamic: true).
// - Мы создаем запись абсолютно с нуля, поэтому метод record.transform тут не применим. Используем метод record.create.

/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType ScheduledScript
 */
// запрос модуля 'N/record'
define(['N/record'], (record) => {
  // обязательная функция/логика, которую Scheduled Script будет отрабатывать.. т.е. такая, точка входа (Entry Point)
  const execute = (context) => {
    // !! создание "новой/пустой" кастомной записи.. для логов (ошибок)
    const logRecord = record.create({
      type: 'customrecord_integration_log', // ID кастомной записи
      isDynamic: true, // режим "динамического ввода".. (может на перспективу, т.к. пока без отработок selectLine(), getCurrentSublistValue() и т.д.)
    });

    // добавление заголовка для названия ошибки/лога
    logRecord.setValue({
      fieldId: 'custrecord_log_title',
      value: 'Ошибка в интеграции от ' + new Date().toLocaleString(),
    });

    // добавление описания/сообщения для ошибки/лога
    logRecord.setValue({
      fieldId: 'custrecord_log_message',
      value:
        'Произошла непредвиденная ошибка в интеграции. Требуется проверка логов!',
    });

    // добавление критичности/важности ошибки/лога (т.е. вероятно, в системе.. будут предусмотрены такие значения: 1 - Low, 2 - Medium, 3 - High)
    logRecord.setValue({ fieldId: 'custrecord_log_severity', value: 3 });

    // ?? добавление даты/времени для ошибки/лога (по сути дублирование, т.к. в заголовке добавляется то же время)
    // logRecord.setValue({
    //   fieldId: 'custrecord_log_error_date_time',
    //   value: new Date(),
    // });

    // добавление/сохранение записи в БД NetSuite
    logRecord.save();
  };

  // обязательный возврат функции/метода..
  return { execute };
});
