import { Errors } from 'cs544-js-utils';

/** Note that errors are documented using the `code` option which must be
 *  returned (the `message` can be any suitable string which describes
 *  the error as specifically as possible).  Whenever possible, the
 *  error should also contain a `widget` option specifying the widget
 *  responsible for the error).
 *
 *  Note also that none of the function implementations should normally
 *  require a sequential scan over all books or patrons.
 */

/******************** Types for Validated Requests *********************/

/** used as an ID for a book */
type ISBN = string; 

/** used as an ID for a library patron */
type PatronId = string;

export type Book = {
  isbn: ISBN;
  title: string;
  authors: string[];
  pages: number;      //must be int > 0
  year: number;       //must be int > 0
  publisher: string;
  nCopies?: number;   //# of copies owned by library; not affected by borrows;
                      //must be int > 0; defaults to 1
};

export type XBook = Required<Book>;

type AddBookReq = Book;
type FindBooksReq = { search: string; };
type ReturnBookReq = { patronId: PatronId; isbn: ISBN; };
type CheckoutBookReq = { patronId: PatronId; isbn: ISBN; };

/************************ Main Implementation **************************/

export function makeLendingLibrary() {
  return new LendingLibrary();
}

export class LendingLibrary {

  //TODO: declare private TS properties for instance
  #addBooksList: Record<ISBN, XBook>;
  #findBooksList: Record<string, ISBN[]>;
  #checkoutList: Record<ISBN, PatronId[]>;
  #returnList: Record<PatronId, ISBN[]>;
  
  constructor() {
    //TODO: initialize private TS properties for instance
    this.#addBooksList = {};
    this.#findBooksList = {};
    this.#checkoutList = {};
    this.#returnList = {};
  }

  /** Add one-or-more copies of book represented by req to this library.
   *
   *  Errors:
   *    MISSING: one-or-more of the required fields is missing.
   *    BAD_TYPE: one-or-more fields have the incorrect type.
   *    BAD_REQ: other issues like nCopies not a positive integer 
   *             or book is already in library but data in obj is 
   *             inconsistent with the data already present.
   */
  addBook(req: Record<string, any>): Errors.Result<XBook> {
    //TODO
    //verify types of book to add
    const verify = verifyType(req);
    //console.log(verify);
    if (verify){
      return verify;
    }
	  
    //check list to see if book already exist
    //if it exists, verify information matches, add copies
    const match = verifyMatch(this.#addBooksList[req.isbn], req); 
    if(this.#addBooksList.hasOwnProperty(req.isbn)){
	    if(!match){
	      this.#addBooksList[req.isbn].nCopies += req.nCopies;
	    }
	   else{
	      return match;
	    }
    }
    //else, add new isbn and XBook to addBooksList, and extract distinct words to add to findBooksList
    else{
	    this.#addBooksList[req.isbn] = <XBook>req;
	    //console.log("new book added");
	  }
    
    return Errors.okResult(this.#addBooksList[req.isbn]);  
  }

  /** Return all books matching (case-insensitive) all "words" in
   *  req.search, where a "word" is a max sequence of /\w/ of length > 1.
   *  Returned books should be sorted in ascending order by title.
   *
   *  Errors:
   *    MISSING: search field is missing
   *    BAD_TYPE: search field is not a string.
   *    BAD_REQ: no words in search
   */
  findBooks(req: Record<string, any>) : Errors.Result<XBook[]> {
    //TODO, needs to be finished
    
    //search missing
    const { search } = req;
    if(search === 'undefined'){ return Errors.errResult('Search field is missing', 'MISSING', 'search')}
    //search not a string
    if(typeof search !== 'string'){ return Errors.errResult('Search field is not a string', 'BAD_TYPE', 'search')}
    //no words in search
    const words = search.match(/ \w{2,} /g);
    if(!words) { return Errors.errResult('No words in search', 'BAD_REQ', 'search')}
    
    return Errors.errResult('TODO');  //placeholder
    //return Errors.OkResult<Book>(undefined);
  }


  /** Set up patron req.patronId to check out book req.isbn. 
   * 
   *  Errors:
   *    MISSING: patronId or isbn field is missing
   *    BAD_TYPE: patronId or isbn field is not a string.
   *    BAD_REQ error on business rule violation.
   */
  checkoutBook(req: Record<string, any>) : Errors.Result<void> {
  //not thoroughly tested, logic
    if(typeof req.patronId === 'undefined' || req.patronId === null){return Errors.errResult('Missing patronId', 'MISSING', 'patronId');}
    if(typeof req.isbn === 'undefined' || req.isbn === null) {return Errors.errResult('Missing isbn', 'MISSING', 'isbn');}
    if(typeof req.patronId !== 'string'){return Errors.errResult('patronId is not a string', 'BAD_TYPE', 'patronId');}
    if(typeof req.isbn !== 'string'){return Errors.errResult('isbn is not a string', 'BAD_TYPE', 'isbn');}

   //business rule violations - check if book exists in library
   const book = this.#addBooksList[req.isbn];
   if(!book){
    //console.log("book DNE");
    return Errors.errResult('Book not found', 'BAD_REQ', 'isbn'); 
  }

   //check if there are copies available
   if(book.nCopies <= 0){return Errors.errResult('No copies are available for checkout', 'BAD_REQ', 'isbn');} //console.log("no copies");

   //should check if someone already checked out
   const checkedOutBooks= this.#checkoutList[req.patronId] || [];
   if(checkedOutBooks.includes(req.isbn)) { return Errors.errResult('This book has been checked out', 'BAD_REQ', 'isbn'); }

   //actually check out the book
   book.nCopies =-1;
   this.#checkoutList[req.patronId] = [...checkedOutBooks, req.isbn];       //supposed to merge to patron’s checkoutList
   this.#returnList[req.isbn] = this.#returnList[req.isbn] || [];
   this.#returnList[req.isbn].push(req.patronId);                           //track who owns book
  
   return Errors.okResult<void>(undefined);
  }

  /** Set up patron req.patronId to returns book req.isbn.
   *  
   *  Errors:
   *    MISSING: patronId or isbn field is missing
   *    BAD_TYPE: patronId or isbn field is not a string.
   *    BAD_REQ error on business rule violation.
   */
  returnBook(req: Record<string, any>) : Errors.Result<void> {
    if(typeof req.patronId === 'undefined' || req.patronId === null){return Errors.errResult('Missing patronId', 'MISSING', 'patronId');}
    if(typeof req.isbn === 'undefined' || req.isbn === null) {return Errors.errResult('Missing isbn', 'MISSING', 'isbn');}
    if(typeof req.patronId !== 'string'){return Errors.errResult('patronId is not a string', 'BAD_TYPE', 'patronId');}
    if(typeof req.isbn !== 'string'){return Errors.errResult('isbn is not a string', 'BAD_TYPE', 'isbn');}
    
    //check if book is in the addBooksList?
    const book = this.#addBooksList[req.isbn]; //gives error for nCopies with returnList
    if (!book) {return Errors.errResult('Book not found', 'BAD_REQ', 'isbn');}

    //business rule violation - book was not checked out by patron
     const checkedOutBooks = this.#checkoutList[req.patronId] || [];
     if(!checkedOutBooks.includes(req.isbn)){return Errors.errResult('This book was not checked out by the patron', 'BAD_REQ', 'isbn');}
 
    //if book checked out, remove it from patrons checked-out list, since they're returning
    this.#checkoutList[req.patronId] = checkedOutBooks.filter(isbn => isbn !== req.isbn);
    
    //update # available copies
    book.nCopies =+ 1;
    //if patron has no more books, empty returnList
    if(this.#returnList[req.patronId]){
      this.#returnList[req.patronId] = this.#returnList[req.patronId].filter(isbn => isbn != req.isbn); //filter out specific book to return by isbn
      if(this.#returnList[req.patronId].length === 0){delete this.#returnList[req.patronId];}
    }
     return Errors.okResult<void>(undefined);
  }

}


/********************** Domain Utility Functions ***********************/


//TODO: add domain-specific utility functions or classes.

//type check book instances, return multiple errors?
function verifyType(req: Record<string, any>): Errors.Result<XBook> | null{
    
    //missing properties
    if(!req.title){
    	return Errors.errResult("title is missing", 'MISSING', 'title');
    }
    if(!req.authors){
    	return Errors.errResult("author is missing", 'MISSING', 'authors');
    } 
    if(!req.isbn){
    	return Errors.errResult("isbn is missing", 'MISSING', 'isbn');
    }
    if(!req.publisher){
    	return Errors.errResult("publisher is missing", 'MISSING', 'publisher');
    } 
    if(!req.pages){
      return Errors.errResult('pages is missing', 'MISSING', 'pages');
    }
    if(!req.year){
      return Errors.errResult('year is missing', 'MISSING', 'year'); 
    }

    //if authors array is empty
    if(req.authors.length <= 0) {
    	return Errors.errResult('authors must be array of strings', 'BAD_TYPE', 'authors');
    }
    
    //loop through array to look at each string
    for(let author in req.authors){
    	 if(typeof req.authors[author] !== "string"){
	      return Errors.errResult('author has incorrect type', 'BAD_TYPE', 'authors');
	     }
       if(!req.authors[author]){
	      return Errors.errResult('author is empty', 'MISSING', 'authors');
	     }
    }

    //type check
    if(typeof req.isbn !== "string" ){
        return Errors.errResult('isbn has incorrect type', 'BAD_TYPE', 'isbn');
    }
    if(typeof req.pages !== "number"){
        return Errors.errResult('pages has incorrect type', 'BAD_TYPE', 'pages');
    }
    if(typeof req.year !== "number"){
        return Errors.errResult('year has incorrect type', 'BAD_TYPE', 'year');
    }
    if(typeof req.publisher !== "string"){
       return Errors.errResult('publisher has incorrect type', 'BAD_TYPE', 'publisher');
    }
    if(req.nCopies !== undefined && typeof req.nCopies !== "number" ) {
        return Errors.errResult('nCopies has incorrect type', 'BAD_TYPE', 'nCopies');
    }
    if(typeof req.title !== "string"){
    	return Errors.errResult("title has incorrect type", 'BAD_TYPE', 'title');
    }
    if(typeof req.authors !== "object"){
    	return Errors.errResult('authors must be in an array', 'BAD_TYPE', 'authors');
    }
    
    //bad req
    if(req.pages <= 0) {
      return Errors.errResult('pages cannot be negative', 'BAD_REQ', 'pages');
    }
    if(req.year <= 0) {
      return Errors.errResult('year cannot be negative', 'BAD_REQ', 'year');
    }  
    if(req.nCopies <= 0) {
      return Errors.errResult('nCopies cannot be negative', 'BAD_REQ', 'nCopies');
    }
    if(req.nCopies != undefined){
      if(!Number.isInteger(req.nCopies)) {
        return Errors.errResult('nCopies must be an integer', 'BAD_REQ', 'nCopies');
      } 
    }
    return null;
}




//check if two books have all the same info
function verifyMatch(book1: Record<string, any>, book2: Record<string, any>): Errors.Result<XBook> | null{

   if(book1.title !== book2.title){return Errors.errResult("title doesn't match", 'BAD_REQ', 'title');}
   for(let author in book1.authors){
       if(book1.authors[author] !== book2.authors[author]){return Errors.errResult("authors don't match", 'BAD_REQ', 'authors');}
   }
   if(book1.isbn !== book2.isbn){return Errors.errResult("isbn doesn't match", 'BAD_REQ', 'isbn');}
   if(book1.pages !== book2.pages){return Errors.errResult("page number doesn't match", 'BAD_REQ', 'pages');}
   if(book1.year !== book2.year){return Errors.errResult("year doesn't match", 'BAD_REQ', 'year');}
   if(book1.publisher !== book2.publisher){return Errors.errResult("publisher doesn't match", 'BAD_REQ', 'publisher');}
   return null;
}

/********************* General Utility Functions ***********************/

//TODO: add general utility functions or classes.

