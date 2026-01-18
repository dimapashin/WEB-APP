export interface Tour {
  id: number
  title: string
  image: string
  description: string
  duration: string
  price: string
  highlights: string[]
  includes: string[]
  unavailable: boolean
}

export interface Decoration {
  id: number
  title: string
  image: string
  description: string
  price: string
  includes: string[]
  unavailable: boolean
}

export const tours: Tour[] = [
  {
    id: 1,
    title: "Обзорная экскурсия по Санкт-Петербургу",
    image: "/images/tours/city-tour.jpg",
    description: "3-часовая автобусная экскурсия по главным достопримечательностям Северной столицы",
    duration: "3 часа",
    price: "от 2 500 ₽ с человека",
    highlights: ["Невский проспект", "Дворцовая площадь", "Стрелка Васильевского острова", "Спас на Крови"],
    includes: ["Транспорт", "Гид", "Бутылка воды"],
    unavailable: true,
  },
  {
    id: 2,
    title: "Ночная экскурсия по рекам и каналам",
    image: "/images/tours/night-canal.jpg",
    description: "Романтическая прогулка на катере под разводными мостами",
    duration: "2 часа",
    price: "3 200 ₽ с человека",
    highlights: ["Разводные мосты", "Петропавловская крепость", "Летний сад"],
    includes: ["Катер", "Гид", "Пледы", "Горячий чай"],
    unavailable: true,
  },
  {
    id: 3,
    title: "Экскурсия в Петергоф",
    image: "/images/tours/peterhof.jpg",
    description: "Посещение знаменитых фонтанов и дворцов летней резиденции императоров",
    duration: "5 часов",
    price: "4 500 ₽ с человека",
    highlights: ["Большой каскад", "Фонтан Самсон", "Нижний парк", "Дворец Монплезир"],
    includes: ["Трансфер", "Входные билеты", "Гид"],
    unavailable: true,
  },
  {
    id: 4,
    title: "Царское Село и Янтарная комната",
    image: "/images/tours/tsarskoe-selo.jpg",
    description: "Посещение Екатерининского дворца и знаменитой Янтарной комнаты",
    duration: "6 часов",
    price: "5 800 ₽ с человека",
    highlights: ["Янтарная комната", "Екатерининский парк", "Камеронова галерея"],
    includes: ["Трансфер", "Входные билеты", "Гид", "Обед"],
    unavailable: true,
  },
]

export const decorations: Decoration[] = [
  {
    id: 1,
    title: "Романтическое украшение",
    image: "/images/decorations/romantic.jpg",
    description: "Создаем атмосферу для особого вечера",
    price: "5 000 ₽",
    includes: ["Лебеди из полотенец", "Лепестки роз", "Бутылка шампанского", "Ароматические свечи", "Шоколадные конфеты"],
    unavailable: true,
  },
  {
    id: 2,
    title: "С Днем Рождения!",
    image: "/images/decorations/birthday.jpg",
    description: "Яркое украшение для празднования дня рождения",
    price: "4 500 ₽",
    includes: ["Воздушные шары", "Поздравительный плакат", "Праздничный торт", "Бокалы для шампанского"],
    unavailable: true,
  },
  {
    id: 3,
    title: "Лебединое озеро",
    image: "/images/decorations/swans.jpg",
    description: "Классическое украшение из полотенец в виде лебедей",
    price: "2 500 ₽",
    includes: ["Два лебедя из полотенец", "Лепестки роз", "Шоколадные монетки"],
    unavailable: true,
  },
  {
    id: 4,
    title: "Сердечное признание",
    image: "/images/decorations/hearts.jpg",
    description: "Украшение в виде сердец для признания в любви",
    price: "3 800 ₽",
    includes: ["Сердца из лепестков", "Ароматические свечи", "Бутылка игристого вина", "Открытка с пожеланиями"],
    unavailable: true,
  },
  {
    id: 5,
    title: "Свадебный сюрприз",
    image: "/images/decorations/wedding.jpg",
    description: "Особое украшение для молодоженов",
    price: "7 500 ₽",
    includes: ["Лебеди с кольцами", "Лепестки роз в форме сердца", "Шампанское премиум", "Шоколадные фигурки молодоженов"],
    unavailable: true,
  },
  {
    id: 6,
    title: "Новогоднее настроение",
    image: "/images/decorations/newyear.jpg",
    description: "Праздничное украшение к Новому году",
    price: "4 000 ₽",
    includes: ["Новогодняя елка", "Гирлянды", "Подарочные коробки", "Шампанское"],
    unavailable: true,
  },
]
