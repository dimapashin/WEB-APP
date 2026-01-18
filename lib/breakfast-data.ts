export interface BreakfastComplex {
  id: string
  name: string
  description: string
  items: string[]
  price: number
  image: string
}

export const breakfastComplexes: BreakfastComplex[] = [
  {
    id: "complex_1",
    name: "Омлет с топпингами",
    description: "Пышный омлет с выбором начинок: бекон, грибы, томаты, сыр",
    price: 1100,
    image: "/images/d0-b7-d0-b0-d0-b2-d1-82-d1-80-d0-b0-d0-ba-201.png",
    items: [
      "Омлет из 3 яиц",
      "Бекон или колбаса",
      "Помидоры",
      "Грибы",
      "Тертый сыр",
      "Свежий хлеб",
      "Сливочное масло",
    ],
  },
  {
    id: "complex_2",
    name: "Блины с соусами",
    description: "Тонкие блины со сметаной, медом и ягодным джемом",
    price: 1100,
    image: "/images/d0-b7-d0-b0-d0-b2-d1-82-d1-80-d0-b0-d0-ba-202.png",
    items: [
      "Блины (4 шт)",
      "Сметана",
      "Ягодный джем",
      "Мед",
      "Свежие ягоды",
      "Сахарная пудра",
      "Маслом сливочное",
    ],
  },
  {
    id: "complex_3",
    name: "Каша с ягодами",
    description: "Овсяная каша с семенами льна, свежими ягодами и бананом",
    price: 1100,
    image: "/images/d0-b7-d0-b0-d0-b2-d1-82-d1-80-d0-b0-d0-ba-203.png",
    items: [
      "Овсяная каша",
      "Семена льна",
      "Свежие ягоды",
      "Банан",
      "Миндаль",
      "Мед",
      "Молоко",
      "Йогурт",
    ],
  },
]

// Alias for backward compatibility
export const breakfastItems = breakfastComplexes
