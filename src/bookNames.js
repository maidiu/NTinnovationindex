// Canonical full names for NT book IDs
export const BOOK_NAMES = {
  Matt:   'Matthew',
  Mark:   'Mark',
  Luke:   'Luke',
  John:   'John',
  Acts:   'Acts',
  Rom:    'Romans',
  '1Cor': '1 Corinthians',
  '2Cor': '2 Corinthians',
  Gal:    'Galatians',
  Eph:    'Ephesians',
  Phil:   'Philippians',
  Col:    'Colossians',
  '1Thess': '1 Thessalonians',
  '2Thess': '2 Thessalonians',
  '1Tim': '1 Timothy',
  '2Tim': '2 Timothy',
  Titus:  'Titus',
  Phlm:   'Philemon',
  Heb:    'Hebrews',
  Jas:    'James',
  '1Pet': '1 Peter',
  '2Pet': '2 Peter',
  '1John':'1 John',
  '2John':'2 John',
  '3John':'3 John',
  Jude:   'Jude',
  Rev:    'Revelation',
}

export function bookName(id) {
  return BOOK_NAMES[id] ?? id
}
