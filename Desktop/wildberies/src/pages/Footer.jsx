import React from 'react';

const Footer = () => {
  // Данные для разделов
  const sections = [
    {
      title: 'Покупателям',
      links: [
        { text: 'Частые вопросы', checked: false },
        { text: 'Юридическая информация', checked: true },
      ],
    },
    {
      title: 'Продавцам и партнёрам',
      links: [
        { text: 'Продавать товары', checked: false },
        { text: 'Открыть пункт выдачи', checked: false },
        { text: 'Предложить помещение', checked: false },
        { text: 'Развозить грузы', checked: true },
        { text: 'Доставлять заказы', checked: true },
      ],
    },
    {
      title: 'Наши проекты',
      links: [
        { text: 'WB Guru', checked: false },
      ],
    },
    {
      title: 'Компания',
      links: [
        { text: 'О нас', checked: false },
        { text: 'Пресс-служба', checked: false },
        { text: 'Контакты', checked: false },
        { text: 'Вакансии', checked: false },
        { text: 'Сообщить о мошенничестве', checked: false },
        { text: 'Социальные сети', checked: false },
      ],
    },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Сетка разделов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors inline-flex items-center"
                    >
                      {link.text}
                      {link.checked && (
                        <span className="text-green-500 font-bold ml-1">✓</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Копирайт */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            © Wildberries 2004–2025. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;