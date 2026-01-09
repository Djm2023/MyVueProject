// utils/randomChipColor.js

export function getRandomChipColor() {
  const colors = [
    '#E6F4FF',
    '#FFE6E6',
    '#E6FFE9',
    '#FFF8E6',
    '#EDE6FF',
    '#FFE6F7',
    '#D9F7BE',
    '#FFD6E7'
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}
