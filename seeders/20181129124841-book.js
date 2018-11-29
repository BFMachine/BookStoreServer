'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Books", [
      {
        title: "Бэтмен. Год первый",
        author: "Фрэнк Миллер",
        description: "В 1986 году Фрэнк Миллер и Дэвид Маццукелли произвели эту сногсшибательную новую интерпретацию оригинального Бэтмена - и того, что сделало его тем, кто он есть. Написанный вскоре после 'Возвращения Темного Рыцаря', миллеровской антиутопии о последних днях Бэтмена, 'Год первый' заложил базу нового видения легендарного персонажа.         Эта книга включает полную версию графического романа, новое предисловие автора, Фрэнка Миллера, и новое иллюстрированное послесловие художника, Дэвида Маццукелли. Это коллекционное издание дополнено коллекцией никогда ранее не представленных публике материалов - 40 страниц скетчей, набросков, сценарных страниц и записей на полях, которые дают представление о том, как создается современная классика.",
        price: 5.99,
        rank: "five",
        category: 2,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        title: "Пламя и кровь: Кровь драконов",
        author: "Джордж Мартин",
        description: "Тирион Ланнистер еще не стал заложником жестокого рока, Бран Старк еще не сделался калекой, а голова его отца Неда Старка еще не скатилась с эшафота. Ни один человек в Королевствах не смеет даже предположить, что Дейенерис Таргариен когда-нибудь назовут Матерью Драконов. Вестерос не привел к покорности соседние государства, и Железный Трон, который, согласно поговорке, ковался в крови и пламени, далеко еще не насытился. Древняя, как сам мир, история сходит со страниц ветхих манускриптов, и только мы, септоны, можем отделить правдивые события от жалких басен, и истину от клеветнических наветов. Присядьте же поближе к огню, добрые слушатели, и вы узнаете: – как Королевская Гавань стала столицей столиц, – как свершались славные подвиги, неподвластные воображению, – и как братья и сестры, отцы и матери теряли разум в кровавой борьбе за власть, – как драконье племя постепенно уступало место драконам в человеческом обличье, – а также и многие другие были и старины – смешные и невыразимо ужасные, бряцающие железом доспехов и играющие на песельных дудках, наполняющее наши сердца гордостью и печалью…",
        price: 8.99,
        rank: "five",
        category: 2,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        title: "Спящие красавицы",
        author: "Стивен Кинг, Оуэн Кинг",
        description: "Что станет с миром, из которого внезапно исчезнут все женщины? Новый захватывающий роман, написанный признанным мастером современной прозы Стивеном Кингом в соавторстве с сыном Оуэном. Тихий уклад жизни маленького городка в Аппалачах нарушается необъяснимым явлением: женщины одна за другой впадают в странный сон, покрываясь тончайшими коконами. Тот, кто пытается их разорвать, пробуждает спящих – и сталкивается с нечеловеческой яростью и жестокостью… И именно в это время в городе появляется таинственная и невероятно красивая женщина, невосприимчивая к вирусу. Кто же она? Ангел, посланный спасти человечество? Или демон, которого следует уничтожить? Решить это и спасти мир от неизбежного хаоса предстоит мужчинам, и теперь они будут играть по собственным правилам…",
        price: 3.49,
        rank: "four",
        category: 3,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Books", null, {});
  }
};
