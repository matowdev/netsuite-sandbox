// Задание 4:
// Бизнес-ситуация: После того как Заказ (Sales Order) собран на складе, бухгалтер должен выставить клиенту счет на оплату (Invoice). Нам нужно автоматизировать этот процесс фоновым скриптом: взять существующий заказ и превратить его в инвойс, заполнив системные связи.
// Условия:
// - Тип скрипта: Scheduled Script (работает автономно).
// - Режим работы: Dynamic Mode (isDynamic: true).
// - Нам известен внутренний ID исходного заказа: 9999.

/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType ScheduledScript
 */
// запрос модуля 'N/record'
define(['N/record'], (record) => {
  // обязательная функция/логика, которую Scheduled Script будет отрабатывать.. т.е. такая, точка входа (Entry Point)
  const execute = (context) => {
    // !! создание "новой/последующей" записи Invoice из/на основе существующей "Sales Order" записи, т.е. без предварительной/отдельной load() загрузки.. всё в одном месте/методе, согласно fromType / toType
    const invoiceRecord = record.transform({
      fromType: record.Type.SALES_ORDER, // вид/тип "исходной" записи
      fromId: 9999, // ID "исходной" записи
      toType: record.Type.INVOICE, // вид/тип "новой" записи
      isDynamic: true, // режим "динамического ввода".. (может на перспективу, т.к. пока без отработок selectLine(), getCurrentSublistValue() и т.д.)
    });

    // обновление/добавление значения для "memo" поля/заголовок (в Invoice записи)
    invoiceRecord.setValue({
      fieldId: 'memo',
      value: 'Создано автоматически на основе SO - 9999',
    });

    // !! добавление/сохранение Invoice записи в БД (без изменения/затирания "исходного" Sales Order, НО с установкой "связи" между документами/записями)
    invoiceRecord.save();
  };

  // обязательный возврат функции/метода.. для корректной отработки Scheduled Script по расписанию (там/потом на серверах NetSuite)
  return { execute };
});
