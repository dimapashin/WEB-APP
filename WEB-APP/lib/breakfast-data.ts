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
    image: "/images/breakfast-1.jpg",
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
    image: "/images/breakfast-2.jpg",
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
    image: "/images/breakfast-3.jpg",
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
