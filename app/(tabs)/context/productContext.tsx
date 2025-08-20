// context/productContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
};

type ProductContextType = {
  products: Product[];
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Витамины для собак",
      description: "Поддержка иммунитета",
      longDescription:
        "Комплекс витаминов для собак всех пород и возрастов. Поддерживает иммунную систему, улучшает состояние шерсти и общее здоровье.",
      price: 450,
      image: ""
    },
    {
      id: "2",
      name: "Антигельминтный препарат",
      description: "Против паразитов",
      longDescription:
        "Эффективное средство против внутренних паразитов у собак и кошек. Безопасно при правильном применении, облегчает профилактику заражения глистами.",
      price: 700,
      image: ""
    },
    {
      id: "3",
      name: "Шампунь для кошек",
      description: "Уход за шерстью",
      longDescription:
        "Нежный шампунь для кошек всех пород. Удаляет грязь и запах, придаёт шерсти блеск и мягкость, не раздражает кожу.",
      price: 350,
      image: ""
    },
    {
      id: "4",
      name: "Капли для ушей",
      description: "Уход за ушами",
      longDescription:
        "Капли для ухода за ушами собак и кошек. Помогают очищать ушную раковину, предотвращают воспаления и неприятный запах.",
      price: 500,
      image: ""
    },
    {
      id: "5",
      name: "Сухой корм для котят",
      description: "Здоровый рост",
      longDescription:
        "Сбалансированный корм с высоким содержанием белка и витаминов. Подходит для котят до 12 месяцев, способствует правильному развитию.",
      price: 1200,
      image: ""
    },
    {
      id: "6",
      name: "Игрушка для собак 'Косточка'",
      description: "Развлечение",
      longDescription:
        "Прочная игрушка в форме косточки для собак средних пород. Помогает развивать челюсти и предотвращает скуку.",
      price: 250,
      image: ""
    },
    {
      id: "7",
      name: "Лакомства для кошек",
      description: "Вкусное поощрение",
      longDescription:
        "Хрустящие подушечки с куриным вкусом. Отлично подходят для дрессировки и поощрения кошек.",
      price: 300,
      image: ""
    },
    {
      id: "8",
      name: "Поводок нейлоновый",
      description: "Прогулки",
      longDescription:
        "Прочный нейлоновый поводок длиной 2 метра. Подходит для собак всех размеров, мягкая ручка для комфорта.",
      price: 600,
      image: ""
    },
    {
      id: "9",
      name: "Миска двойная",
      description: "Для еды и воды",
      longDescription:
        "Удобная двойная миска для собак и кошек. Сделана из нержавеющей стали, легко моется и не скользит.",
      price: 550,
      image: ""
    },
    {
      id: "10",
      name: "Когтеточка для кошек",
      description: "Защита мебели",
      longDescription:
        "Компактная когтеточка с джутовой обмоткой. Помогает кошкам стачивать когти и беречь мебель.",
      price: 900,
      image: ""
    },
    {
      id: "11",
      name: "Щётка для шерсти",
      description: "Груминг",
      longDescription:
        "Щётка для ухода за шерстью собак и кошек. Убирает лишний подшёрсток и делает шерсть блестящей.",
      price: 400,
      image: ""
    },
    {
      id: "12",
      name: "Наполнитель для кошачьего туалета",
      description: "Гигиена",
      longDescription:
        "Комкующийся наполнитель с ароматом лаванды. Отлично удерживает запахи и легко убирается.",
      price: 350,
      image: ""
    },
    {
      id: "13",
      name: "Капли от блох и клещей",
      description: "Защита",
      longDescription:
        "Надёжная защита от блох и клещей для собак весом до 10 кг. Наносится на холку, действует до 30 дней.",
      price: 800,
      image: ""
    },
    {
      id: "14",
      name: "Клетка для грызунов",
      description: "Дом для питомца",
      longDescription:
        "Просторная клетка для хомяков и морских свинок. В комплекте поилка и колесо для бега.",
      price: 2200,
      image: ""
    },
    {
      id: "15",
      name: "Минеральный камень для птиц",
      description: "Источник кальция",
      longDescription:
        "Минеральный камень для попугаев и канареек. Поддерживает здоровье костей и клюва.",
      price: 150,
      image: ""
    },
    {
      id: "16",
      name: "Переноска для кошек",
      description: "Удобные поездки",
      longDescription:
        "Лёгкая и прочная переноска из пластика. Подходит для поездок к ветеринару и путешествий.",
      price: 1800,
      image: ""
    },
    {
      id: "17",
      name: "Ошейник со светоотражателем",
      description: "Безопасность",
      longDescription:
        "Регулируемый ошейник со светоотражающей полоской. Повышает безопасность во время вечерних прогулок.",
      price: 350,
      image: ""
    },
    {
      id: "18",
      name: "Консервы для собак",
      description: "Полноценное питание",
      longDescription:
        "Влажный корм с говядиной и овощами. Богат витаминами и белком, подходит для ежедневного кормления.",
      price: 950,
      image: ""
    },
    {
      id: "19",
      name: "Наполнитель для птиц",
      description: "Чистая клетка",
      longDescription:
        "Натуральный наполнитель для клеток попугаев и канареек. Экологичный и безопасный, хорошо впитывает влагу.",
      price: 280,
      image: ""
    },
    {
      id: "20",
      name: "Витамины для кошек",
      description: "Здоровье шерсти",
      longDescription:
        "Витаминный комплекс для кошек. Поддерживает блеск шерсти, здоровье кожи и общее самочувствие.",
      price: 420,
      image: ""
    },
  ]);


  return (
    <ProductContext.Provider value={{ products }}>
        
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used inside ProductProvider");
  return context;
};
