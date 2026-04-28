export const PRODUCTS = [
  {
    id: 3,
    title: 'Choco Cranz',
    image: '/assets/choco-cranz.jpg',
    price: 68,
    soldOut: false,
    nutritionKey: 'cranberry',
    eventSlug: 'choco-cranz',
    eyebrow: 'Cranberry cocoa energy',
    summary: 'A bright cranberry twist layered into a rich protein bar for a sharper, fruit-forward bite.',
    description:
      'Built for people who want quick fuel without a heavy feel, Choco Cranz balances sweetness, texture, and a fast snackable format.',
    highlights: [
      '10g protein in every bar',
      'Sweet-tart cranberry finish',
      'Easy grab-and-go post-workout fuel',
    ],
    nutritionSummary: [
      { label: 'Energy', value: '155.2 kcal' },
      { label: 'Protein', value: '10.1 g' },
      { label: 'Sugar', value: '9.6 g' },
      { label: 'Fibre', value: '5 g' },
    ],
  },
  {
    id: 1,
    title: 'Almond Crunch',
    image: '/assets/almond-crunch.jpg',
    price: 68,
    soldOut: false,
    nutritionKey: 'almond',
    eventSlug: 'almond-crunch',
    eyebrow: 'Nutty clean fuel',
    summary: 'A roasted almond profile with a clean crunch that feels familiar, simple, and satisfying.',
    description:
      'Almond Crunch is the steady everyday bar in the lineup, designed for commutes, desk drawers, gym bags, and everything in between.',
    highlights: [
      '10g protein in every bar',
      'Roasted almond crunch texture',
      'Balanced daily snack for work or training',
    ],
    nutritionSummary: [
      { label: 'Energy', value: '160.1 kcal' },
      { label: 'Protein', value: '10.1 g' },
      { label: 'Sugar', value: '8.8 g' },
      { label: 'Fibre', value: '5.1 g' },
    ],
  },
  {
    id: 2,
    title: 'Berry Rush',
    image: '/assets/berry-rush.jpg',
    price: 68,
    soldOut: false,
    nutritionKey: 'blueberry',
    eventSlug: 'berry-rush',
    eyebrow: 'Berry-forward recovery snack',
    summary: 'A smooth berry-led bar with a lighter profile for people who want something fruity after activity.',
    description:
      'Berry Rush keeps the protein base while leaning into a softer, brighter flavor profile that works well before or after training.',
    highlights: [
      '10g protein in every bar',
      'Smooth berry-led finish',
      'Light and portable for quick refueling',
    ],
    nutritionSummary: [
      { label: 'Energy', value: '155.3 kcal' },
      { label: 'Protein', value: '10.1 g' },
      { label: 'Sugar', value: '9.6 g' },
      { label: 'Fibre', value: '5 g' },
    ],
  },
  {
    id: 4,
    title: 'All in One',
    image: '/assets/mobile.png',
    price: 68,
    soldOut: false,
    nutritionKey: 'mix',
    eventSlug: 'mixed-flavours',
    eyebrow: 'Mixed flavour starter',
    summary: 'A simple way to try the Voltt range before locking into a favorite flavor.',
    description:
      'The mixed-flavours page gives shoppers a flexible entry point when they want to sample the lineup and choose their ideal repeat order later.',
    highlights: [
      '10g protein in every bar',
      'Great first order option',
      'Lets shoppers explore multiple flavor notes',
    ],
    nutritionSummary: [
      { label: 'Energy', value: '155.2 kcal' },
      { label: 'Protein', value: '10.1 g' },
      { label: 'Sugar', value: '9.6 g' },
      { label: 'Fibre', value: '5 g' },
    ],
  },
]

export function getProductBySlug(eventSlug) {
  return PRODUCTS.find((product) => product.eventSlug === eventSlug) ?? null
}
