// NetSuite использует RequireJS для управления модулями. В консоли мы можем динамически загрузить модуль 'N' (содержащий ссылки на все стандартные модули SuiteScript) и привязать их к объекту `window`, чтобы иметь к ним прямой доступ.

// ШАГ 1: Подключение модулей NetSuite и их экспорт в глобальную область видимости window (браузера)
require(['N'], (N) =>
  console.log(
    'Loaded Modules:',
    // Добавляем все модули NetSuite (N) и интерфейсные модули (N.ui) в объект window
    // т.е. это делает модули record, search, file, ui и др. доступными напрямую в консоли
    Object.assign(window, N, N.ui) &&
      Object.fromEntries(
        [!1, 'ui']
          .map((ui) =>
            Object.keys(ui ? N[ui] : N).map((name) => [
              name,
              `N${ui ? `/${ui}` : ''}/${name}`,
            ]),
          )
          .flat(),
      ),
  ));

// ШАГ 2: Загрузка существующей записи (Record) из базы данных NetSuite
// После выполнения Шага 1 в консоли становится доступен модуль `record`
// Используем метод record.load() для загрузки записи в переменную
const BPMapping = record.load({
  type: 'customrecord_bp_mapping', // Внутренний идентификатор типа записи (Record Type ID)
  id: 216, // Внутренний ID конкретной записи (Internal ID)
});

// ШАГ 3: Использование доступных методов API для чтения значений полей записи
// Теперь мы можем тестировать различные методы API для работы с полями этой записи
BPMapping.getValue({ fieldId: 'id' }); // '216'
BPMapping.getValue({ fieldId: 'lastmodified' }); // Mon Jun 22 2026 19:15:00 GMT+0300 (GMT+03:00)
BPMapping.getText({ fieldId: 'custrecord_bp_ns_bp_push' }); // 'From BillingPlatform to NetSuite'
