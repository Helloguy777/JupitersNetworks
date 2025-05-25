// cube.js (или schema/Orders.js)

cube(`Orders`, { // Название куба, обычно соответствует таблице в БД
  sql: `SELECT * FROM public.orders`, // SQL-запрос для получения данных для этого куба
                                     // Замените public.orders на вашу таблицу

  joins: {
    // Здесь можно определить связи с другими кубами (другими таблицами)
    // Customers: {
    //   sql: `${Orders}.customer_id = ${Customers}.id`,
    //   relationship: `belongsTo`
    // }
  },

  measures: { // Метрики - агрегированные значения
    count: {
      type: `count`,
      description: `Total number of orders`
    },
    totalAmount: {
      sql: `amount`, // Название колонки с суммой в вашей таблице orders
      type: `sum`,
      format: `currency`,
      description: `Total amount of all orders`
    }
  },

  dimensions: { // Измерения - атрибуты, по которым можно группировать и фильтровать
    id: {
      sql: `id`, // Название колонки ID в вашей таблице orders
      type: `number`,
      primaryKey: true,
      shown: true // Показывать ли это измерение по умолчанию
    },
    status: {
      sql: `status`, // Название колонки статуса в вашей таблице orders
      type: `string`
    },
    createdAt: {
      sql: `created_at`, // Название колонки с датой создания в вашей таблице orders
      type: `time`
    }
  },

  // Опционально: настройки для пред-агрегаций для ускорения запросов
  preAggregations: {
    // main: {
    //   type: `rollup`,
    //   measureReferences: [count, totalAmount],
    //   dimensionReferences: [status, createdAt],
    //   timeDimensionReference: createdAt,
    //   granularity: `day`
    // }
  }
});
