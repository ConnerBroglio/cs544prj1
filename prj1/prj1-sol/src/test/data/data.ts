const BOOK0_nCopies2: Record<string, any> = {
  title: "JavaScript: The Definitive Guide, 7th Edition",
  authors: [
    "David Flanagan"
  ],
  isbn: "149-195-202-4",
  pages: 704,
  year: 2020,
  publisher: "O'Reilly",
  nCopies: 2,
};

const BOOK1_nCopies1: Record<string, any> = {
  title: "Intermediate Scala Programming",
  authors: [
    "Gandaria, Alani",
    "Weigt, Aileen",
    "Uecker, Koby"
  ],
  isbn: "556-480-975-2",
  pages: 308,
  year: 2013,
  publisher: "Prentice-Hall",
};

const BOOK2_nCopies2: Record<string, any> =  {
  title: "Ruby: The Definitive Guide",
  authors: [
    "Aguirre, Tia",
    "Owens, Kameron",
    "Velasco, Jameson"
  ],
  isbn: "661-972-367-4",
  pages: 170,
  year: 2009,
  publisher: "Prentice-Hall",
  nCopies: 2
};

//sorted by title
const BOOKS = [ BOOK1_nCopies1, BOOK0_nCopies2, BOOK2_nCopies2 ];

const LANG_BOOKS = {
  javascript: BOOK0_nCopies2,
  ruby: BOOK2_nCopies2,
  scala: BOOK1_nCopies1,
};

//klunky
export {
  BOOKS,
  BOOK0_nCopies2 as BOOK_nCopies2,
  BOOK1_nCopies1 as BOOK_nCopies1,
  LANG_BOOKS,
};

