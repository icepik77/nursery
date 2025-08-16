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
      longDescription: "Комплекс витаминов для собак всех пород и возрастов. Поддерживает иммунную систему, улучшает состояние шерсти и общее здоровье.",
      price: 450,
      image: ""
    },
    {
      id: "2",
      name: "Антигельминтный препарат",
      description: "Против паразитов",
      longDescription: "Эффективное средство против внутренних паразитов у собак и кошек. Безопасно при правильном применении, облегчает профилактику заражения глистами.",
      price: 700,
      image: ""
    },
    {
      id: "3",
      name: "Шампунь для кошек",
      description: "Уход за шерстью",
      longDescription: "Нежный шампунь для кошек всех пород. Удаляет грязь и запах, придаёт шерсти блеск и мягкость, не раздражает кожу.",
      price: 350,
      image: ""
    },
    {
      id: "4",
      name: "Капли для ушей",
      description: "Уход за ушами",
      longDescription: "Капли для ухода за ушами собак и кошек. Помогают очищать ушную раковину, предотвращают воспаления и неприятный запах.",
      price: 500,
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
