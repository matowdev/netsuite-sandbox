// Задание 1:
// Бизнес-ситуация: Бухгалтер попросил автоматизировать заполнение поля «Комментарий» (memo) в карточке Клиента (Customer). Если у клиента в поле «Категория» (category) выбрано значение "VIP" (внутренний ID этого значения в системе — 5), то в поле memo нужно записать текст: "Особое обслуживание".
// Напиши фрагмент кода (SuiteScript 2.x), который загружает существующего клиента с ID 12345, проверяет его категорию и при необходимости обновляет поле memo. Постарайся написать код максимально эффективно с точки зрения лимитов (Governance Units), учитывая, что нам может и не понадобиться ничего перезаписывать, если категория не VIP.

// !! первичное решение, НЕ корректное.. стоит исключить record.load().. т.к. подгружать можно/нужно только через record.submitFields (в данной ситуации), а то.. как бы дважды подгрузка записи получается, при этом submitFields() метод нужно реализовывать/наполнять правильно..
const customerRecord = record.load({
  type: record.Type.CUSTOMER,
  id: 12345,
});

const customerCategory = customerRecord.getValue({ fieldId: 'category' });

if (Number(customerCategory) === 5) {
  customerRecord.submitFields({
    values: {
      memo: 'Особое обслуживание',
    },
  });
}

// корректное решение, ВАРИАНТ 1 (дороже по лимитам.. 30 лимитов всего, т.е. 10 + 20)
/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType ???
 */
define(['N/record'], (record) => {
  const getCustomerRecord = record.load({
    type: record.Type.CUSTOMER,
    id: 12345,
  });

  const getCustomerCategory = getCustomerRecord.getValue({
    fieldId: 'category',
  });

  if (Number(getCustomerCategory) === 5) {
    // метод setValue().. в standard режиме, стоит 0 лимитов
    getCustomerRecord.setValue({
      fieldId: 'memo',
      value: 'Особое обслуживание',
      ignoreFieldChange: true,
    });

    getCustomerRecord.save(); // 20 лимитов
  }

  return {
    // какой-то триггер
  };
});

// ** корректное решение, ВАРИАНТ 2 (предпочтительный.. 2 или 12 лимитов всего, т.е. 2 + 10)
/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @NScriptType ScheduledScript
 */
// запрашиваются два модуля 'N/record', 'N/search', и отрабатываться будут ДВА..
define(['N/record', 'N/search'], (record, search) => {
  // !! обязательная точка входа (Entry Point), т.е. специальное зарезервированное имя функции/переменной (как execute), которое ожидается NetSuit(ом) для корректной отработки логики ScheduledScript
  const execute = (context) => {
    // !! "быстрый/лёгкий" SEARCH определенного поля в записи, БЕЗ загрузки всей/искомой записи, т.е. всего 2 лимита, стоимость данного метода (в отличии от record.load(), который стоит 10)
    const lookupResult = search.lookupFields({
      type: search.Type.CUSTOMER,
      id: 12345,
      columns: ['category'],
    });

    // занесение в переменную "найденного" поля, следующего вида [{value: "5", text: "VIP"}], т.е. массива объектов с двумя полями value и text
    const categoryArray = lookupResult.category;

    // организация проверки "наверняка", т.е. сразу проверка "categoryArray && categoryArray.length > 0" это, что бы понять.. пришла ли структура [], а не '', null, undefined.. и есть ли длинна, ну а потом уже на проверка === на соответствие
    if (
      categoryArray &&
      categoryArray.length > 0 &&
      Number(categoryArray[0].value) === 5
    ) {
      // !! "быстрый/незатратный" UPDATE некоторых полей/значений записи (после подтверждения совпадения), т.е. всего 10 лимитов.. вместо 30 лимитов при связке load() + save()
      record.submitFields({
        type: record.Type.CUSTOMER,
        id: 12345,
        values: {
          memo: 'Особое обслуживание',
        },
      });
    }
  };

  // !! возврат объекта с предусмотренной функцией/методом (которая будет отрабатываться NetSuit(ом) когда нужно)
  return {
    // execute: execute,
    execute,
  };
});
