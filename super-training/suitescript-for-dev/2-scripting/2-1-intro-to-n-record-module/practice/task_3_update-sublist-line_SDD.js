// Задание 3:
// Бизнес-ситуация: Ночной скрипт по расписанию (Scheduled Script) должен найти конкретный существующий Заказ (Sales Order) и скорректировать количество товара в первой строке подсписка, а также сделать отметку в заголовке документа. В конце документ нужно сохранить.
// Условия:
// - Тип скрипта: Scheduled Script.
// - Режим работы с записью: Standard Mode (isDynamic: false). Это критично, так как методы Dynamic Mode (selectLine, setCurrentSublistValue) здесь вызовут ошибку.
// - Поскольку скрипт автономный, запись не приходит в контексте автоматически. Ее нужно загрузить из базы вручную через метод record.load().

/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType ScheduledScript
 */
// запрос одного модуля 'N/record'
define(['N/record'], (record) => {
  // обязательная точка входа (Entry Point), т.е. специальное зарезервированное имя функции/переменной (как execute), которое ожидается NetSuit(ом) для корректной отработки логики ScheduledScript (т.е. скрипта по расписанию)
  const execute = (context) => {
    // загрузка записи ИЗ БАЗЫ NetSuite, себе RAM (т.е. себе в ОЗУ, т.е. в Оперативное Запоминающее Устройство своего компьютера)
    // !! загрузка "конкретной/одной" записи, вручную (не всех).. т.е. Scheduled Script не получает автоматически в свой "context" искомой записи/записей (в отличие/например от User Event Script или Client Script.. там это "внутренней" логикой NetSuite, настроено по другому)
    const salesOrderRecord = record.load({
      type: record.Type.SALES_ORDER,
      id: 8888,
      isDynamic: false, // !! хоть, по default идёт и так "isDynamic: false" в record.load() логике, НО лучше это прописывать ЯВНО (и для себя.. на будущее и для коллег)
    });

    // изменение значения в определенном поле/линии (в подсписке искомой записи)
    salesOrderRecord.setSublistValue({
      sublistId: 'item',
      fieldId: 'quantity',
      line: 0,
      value: 10,
    });

    // обновление "memo" заголовка (в "body field" части)
    salesOrderRecord.setValue({
      fieldId: 'memo',
      value: 'Обновлено ночью',
    });

    // сохранение/пересохранение запись в NetSuite базу ("освобождение" своей RAM)
    salesOrderRecord.save();
  };

  // возврат объекта с предусмотренной функцией/методом (которая будет отрабатываться NetSuit(ом) по установленному расписанию, согласно настройке выполнения Scheduled Script при деплое)
  return { execute };
});
