const books1 = require('./books1');

const books = [];
for (const b1 of books1) {
  const nCopies = 1 + Math.round(Math.random()*3);
  const b = { ...b1, nCopies };
  books.push(b);
}
console.log(JSON.stringify(books, null, 2));
