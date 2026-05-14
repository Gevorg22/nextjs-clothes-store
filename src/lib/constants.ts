export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const COLORS = [
  'Чёрный',
  'Белый',
  'Серый',
  'Бежевый',
  'Синий',
  'Красный',
  'Зелёный',
  'Хаки',
  'Голубой',
  'Розовый',
];

export const CATEGORIES = [
  { id: 1, name: 'Футболки' },
  { id: 2, name: 'Худи' },
  { id: 3, name: 'Брюки' },
  { id: 4, name: 'Куртки' },
  { id: 5, name: 'Платья' },
  { id: 6, name: 'Обувь' },
  { id: 7, name: 'Аксессуары' },
];

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Сначала популярное' },
  { value: 'new', label: 'Сначала новые' },
  { value: 'price_asc', label: 'Сначала недорогие' },
  { value: 'price_desc', label: 'Сначала дорогие' },
] as const;

export const MAX_PRICE = 15000;
export const MIN_PRICE = 0;
