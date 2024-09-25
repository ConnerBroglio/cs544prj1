import { LendingLibrary, makeLendingLibrary } from '../lib/lending-library.js';

import { BOOKS, LANG_BOOKS, BOOK_nCopies2, BOOK_nCopies1 }
  from './data/data.js';

import { assert, expect } from 'chai';

//use assert(result.isOk === true) and assert(result.isOk === false)
//to ensure that typescript narrows result correctly


describe('lending library', () => {

  let library: LendingLibrary;

  beforeEach(() => {
    library = makeLendingLibrary();
  });

  describe('addBook()', () => {

    const NUMERIC_FIELDS = [ 'pages', 'year', 'nCopies' ];

    it('must add valid book', () => {
      for (const book of BOOKS) {
	const bookResult = library.addBook(book);
	assert(bookResult.isOk === true);
	expect(bookResult.val.nCopies).to.equal((book.nCopies ?? 1));
      }
    });

    it('must catch missing required fields', () => {
      const book = BOOKS[0];
      for (const key of Object.keys(book)) {
	if (key === 'nCopies') continue;
	const book1 = { ...book };
	delete book1[key];
	const bookResult = library.addBook(book1);
	assert(bookResult.isOk === false);
	expect(bookResult.errors).to.have.length(1);
	expect(bookResult.errors[0].options.code).to.equal('MISSING');
	expect(bookResult.errors[0].options.widget).to.equal(key);
      }
    });

    it('must catch badly typed numeric fields', () => {
      const book = BOOKS[0];
      for (const key of NUMERIC_FIELDS) {
	const book1 = { ...book };
	book1[key] = 'hello';
	const bookResult = library.addBook(book1);
	assert(bookResult.isOk === false);
	expect(bookResult.errors).to.have.length(1);
	expect(bookResult.errors[0].options.code).to.equal('BAD_TYPE');
	expect(bookResult.errors[0].options.widget).to.equal(key);
      }
    });

    it('must catch nCopies field <= 0', () => {
      for (const [i, book] of BOOKS.entries()) {
	const book1 = { ...book, nCopies: -i };
	const bookResult = library.addBook(book1);
	assert(bookResult.isOk === false);
	expect(bookResult.errors).to.have.length(1);
	expect(bookResult.errors[0].options.code).to.equal('BAD_REQ');
	expect(bookResult.errors[0].options.widget).to.equal('nCopies');
      }
    });

    it('must catch non-integer nCopies field', () => {
      for (const book of BOOKS) {
	const book1 = { ...book, nCopies: 2.001 };
	const bookResult = library.addBook(book1);
	assert(bookResult.isOk === false);
	expect(bookResult.errors).to.have.length(1);
	expect(bookResult.errors[0].options.code).to.equal('BAD_REQ');
	expect(bookResult.errors[0].options.widget).to.equal('nCopies');
      }
    });

    it('must catch badly typed string fields', () => {
      const book = BOOKS[0];
      for (const key of Object.keys(book)) {
	if (NUMERIC_FIELDS.includes(key) || key === 'authors') continue;
	const book1 = { ...book };
	book1[key] = 11;
	const bookResult = library.addBook(book1);
	assert(bookResult.isOk === false);
	expect(bookResult.errors).to.have.length(1);
	expect(bookResult.errors[0].options.code).to.equal('BAD_TYPE');
	expect(bookResult.errors[0].options.widget).to.equal(key);
      }
    });

    it('must catch badly typed authors field', () => {
      const book = BOOKS[0];
      const book1 = { ...book };
      book1.authors = 'hello';
      const bookResult = library.addBook(book1);
      assert(bookResult.isOk === false);
      expect(bookResult.errors).to.have.length(1);
      expect(bookResult.errors[0].options.code).to.equal('BAD_TYPE');
      expect(bookResult.errors[0].options.widget).to.equal('authors');
    });

    it('must catch badly typed author', () => {
      const book = BOOKS[0];
      const book1 = { ...book };
      book1.authors = ['hello', 22];
      const bookResult = library.addBook(book1);
      assert(bookResult.isOk === false);
      expect(bookResult.errors).to.have.length(1);
      expect(bookResult.errors[0].options.code).to.equal('BAD_TYPE');
      expect(bookResult.errors[0].options.widget).to.equal('authors');
    });

    it('must catch empty authors', () => {
      const book = BOOKS[0];
      const book1 = { ...book };
      book1.authors = [];
      const bookResult = library.addBook(book1);
      assert(bookResult.isOk === false);
      expect(bookResult.errors).to.have.length(1);
      expect(bookResult.errors[0].options.code).to.equal('BAD_TYPE');
      expect(bookResult.errors[0].options.widget).to.equal('authors');
    });

  });  //describe('addBooks()', ...)


  describe('findBooks()', () => {

    beforeEach(() => {
      for (const book of BOOKS) {
	const bookResult = library.addBook(book);
	assert(bookResult.isOk === true);
      }
    });

    it('must error on an empty search string error', () => {
      const searchResult = library.findBooks({search: '  '});
      assert(searchResult.isOk === false);
      expect(searchResult.errors).to.have.length(1);
      expect(searchResult.errors[0].options.code).to.equal('BAD_REQ');
    });
	       
    it('must error on a search string without any words error', () => {
      const searchResult = library.findBooks({search: 'a #b  '});
      assert(searchResult.isOk === false);
      expect(searchResult.errors).to.have.length(1);
      expect(searchResult.errors[0].options.code).to.equal('BAD_REQ');
    });

    it('must find single results', () => {
      for (const lang of [ 'javascript', 'ruby', 'scala' ]) {
	const searchResult = library.findBooks({search: `a ${lang} `});
	assert(searchResult.isOk === true);
	expect(searchResult.val).to.have.length(1);
	const expected =
	  [{ nCopies: 1, ...LANG_BOOKS[lang as keyof typeof LANG_BOOKS] }];
	expect(searchResult.val).to.deep.equal(expected);
      }
    });
	       
    it('must find multiple results', () => {
      const searchResult = library.findBooks({search: 'a #definitive '});
      assert(searchResult.isOk === true);
      expect(searchResult.val).to.have.length(2);
      const expected = BOOKS
	.filter(b => b.title.match(/definitive/i))
        .map(b => ({ nCopies: 1, ...b }));
      expect(searchResult.val).to.deep.equal(expected);
    });

    it('must find intersection of results', () => {
      const searchResult =
	library.findBooks({search: 'a #definitive @JAVASCRIPT'});
      assert(searchResult.isOk === true);
      expect(searchResult.val).to.have.length(1);
      const expected = [{ nCopies: 1, ...LANG_BOOKS.javascript }];
      expect(searchResult.val).to.deep.equal(expected);
    });

    it('must find no results', () => {
      const searchResult = library.findBooks({ search: 'a #definitive1 '});
      assert(searchResult.isOk === true);
      expect(searchResult.val).to.have.length(0);
    });

    
  });

  describe('checkoutBook()', () => {

    beforeEach(() => {
      for (const book of BOOKS) {
	const bookResult = library.addBook(book);
	assert(bookResult.isOk === true);
      }
    });

    it('must allow checkout of multiple books by same patron', () => {
      for (const book of BOOKS) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const checkoutResult = library.checkoutBook({patronId, isbn});
	assert(checkoutResult.isOk === true);
      }
    });

    it('must error on bad book', () => {
      const [ patronId, isbn ] = [ PATRONS[0], 'xxx' ];
      const checkoutResult = library.checkoutBook({ patronId, isbn });
      assert(checkoutResult.isOk === false);
      expect(checkoutResult.errors).to.have.length(1);
      expect(checkoutResult.errors[0].options.code).to.equal('BAD_REQ');
    });

    it('must error on repeated checkout of same book by same patron', () => {
      const [ patronId, isbn ] = [ PATRONS[0], BOOK_nCopies2.isbn ];
      const checkoutResult1 = library.checkoutBook({patronId, isbn});
      assert(checkoutResult1.isOk === true);
      const checkoutResult2 = library.checkoutBook({ patronId, isbn });
      assert(checkoutResult2.isOk === false);
      expect(checkoutResult2.errors).to.have.length(1);
      expect(checkoutResult2.errors[0].options.code).to.equal('BAD_REQ');
    });

    it('must error on exhausting all copies of a book', () => {
      const isbn = BOOK_nCopies2.isbn;
      for (const [i, patronId] of PATRONS.entries()) {
	const checkoutResult1 = library.checkoutBook({patronId, isbn});
	assert(checkoutResult1.isOk === i < 2, `copy ${i} checkout ${i < 2}`);
      }
    });

  });

  describe('checkout and return books', () => {

    beforeEach(() => {
      for (const book of BOOKS) {
	const bookResult = library.addBook(book);
	assert(bookResult.isOk === true);
      }
    });

    it('must allow checkout/return of a single book by same patron', () => {
      for (const book of BOOKS) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const checkoutResult = library.checkoutBook({patronId, isbn});
	assert(checkoutResult.isOk === true);
	const returnResult = library.returnBook({patronId, isbn});
	assert(returnResult.isOk === true);
      }
    });

    it('must allow checkout/return of multiple books by same patron', () => {
      for (const book of BOOKS) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const checkoutResult = library.checkoutBook({patronId, isbn});
	assert(checkoutResult.isOk === true);
      }
      for (const book of BOOKS) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const returnResult = library.returnBook({patronId, isbn});
	assert(returnResult.isOk === true);
      }
    });

    it('must allow any order checkout/return of books by same patron', () => {
      for (const book of BOOKS) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const checkoutResult = library.checkoutBook({patronId, isbn});
	assert(checkoutResult.isOk === true);
      }
      for (const book of BOOKS.toReversed()) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const returnResult = library.returnBook({patronId, isbn});
	assert(returnResult.isOk === true);
      }
    });
    
    it('must allow checkout/return of books by multiple patrons', () => {
      for (const [i, book] of BOOKS.entries()) {
	const [ patronId, isbn ] = [ PATRONS[i], book.isbn ];
	const checkoutResult = library.checkoutBook({patronId, isbn});
	assert(checkoutResult.isOk === true);
      }
      for (const [i, book]  of BOOKS.entries()) {
	const [ patronId, isbn ] = [ PATRONS[i], book.isbn ];
	const returnResult = library.returnBook({patronId, isbn});
	assert(returnResult.isOk === true);
      }
    });
    
    it('must not allow return of books by different patrons', () => {
      for (const [i, book] of BOOKS.entries()) {
	const [ patronId, isbn ] = [ PATRONS[i], book.isbn ];
	const checkoutResult = library.checkoutBook({patronId, isbn});
	assert(checkoutResult.isOk === true);
      }
      for (const [i, book]  of BOOKS.entries()) {
	const j = (i + 1)%(PATRONS.length);
	const [ patronId, isbn ] = [ PATRONS[j], book.isbn ];
	const returnResult = library.returnBook({patronId, isbn});
	assert(returnResult.isOk === false);
	expect(returnResult.errors).to.have.length(1);
	expect(returnResult.errors[0].options.code).to.equal('BAD_REQ');
      }
    });

    it('must not allow repeated return of books by a patron', () => {
      for (const book of BOOKS) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const checkoutResult = library.checkoutBook({patronId, isbn});
	assert(checkoutResult.isOk === true);
      }
      for (const book  of BOOKS.toReversed()) {
	const [ patronId, isbn ] = [ PATRONS[0], book.isbn ];
	const returnResult1 = library.returnBook({patronId, isbn});
	assert(returnResult1.isOk === true);
	const returnResult2 = library.returnBook({patronId, isbn});
	assert(returnResult2.isOk === false);
	expect(returnResult2.errors).to.have.length(1);
	expect(returnResult2.errors[0].options.code).to.equal('BAD_REQ');
      }
    });
    
    
  });    

});

const PATRONS = [ 'joe', 'sue', 'ann' ];

