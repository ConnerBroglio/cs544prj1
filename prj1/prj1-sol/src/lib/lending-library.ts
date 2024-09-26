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
  //#returnList: Record<PatronId, ISBN[]>;
  
  constructor() {
    //TODO: initialize private TS properties for instance
    this.#addBooksList = {};
    this.#findBooksList = {};
    this.#checkoutList = {};
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
    console.log(verifyType(req));
    if(!verifyType(req)){
	    return Errors.errResult('BAD_TYPE');
	  }
    return Errors.errResult('TODO');  //placeholder
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
    //TODO,
    if(typeof req.patronId === 'undefined' || req.patronId === null){
      return Errors.errResult('Missing patronId', 'MISSING', 'patronId');
    }
    if(typeof req.isbn === 'undefined' || req.isbn === null) {
      return Errors.errResult('Missing isbn', 'MISSING', 'isbn');
    }
    if(typeof req.patronId !== 'string'){
      return Errors.errResult('patronId is not a string', 'BAD_TYPE', 'patronId');
    }
    if(typeof req.isbn !== 'string'){
      return Errors.errResult('isbn is not a string', 'BAD_TYPE', 'isbn');
    }
    //business rule violations - check if book exists in library
    //const book = this.library[req.isbn];
    //if(!book){
    //  return Errors.errResult('Book not found', 'BAD_REQ', 'isbn'); }

    //check if there are copies available
    //if(book.nCopies <= 0){
    //  return Errors.errResult('No copies are available for checkout', 'BAD_REQ', 'isbn'); }

    //check if someone already checked out
    //const checkedOutBooks= this.patronList
    
    return Errors.errResult('TODO');  //placeholder
  }

  /** Set up patron req.patronId to returns book req.isbn.
   *  
   *  Errors:
   *    MISSING: patronId or isbn field is missing
   *    BAD_TYPE: patronId or isbn field is not a string.
   *    BAD_REQ error on business rule violation.
   */
  returnBook(req: Record<string, any>) : Errors.Result<void> {
    //TODO 
    return Errors.errResult('TODO');  //placeholder
  }
  
}


/********************** Domain Utility Functions ***********************/


//TODO: add domain-specific utility functions or classes.

//type check book instances
function verifyType(req: Record<string, any>): boolean{
    if(typeof req.title !== "string" || !req.title){ return false;}
    if(typeof req.authors !== "object" || !req.authors){return false;}

    //if authors array is empty
    if(req.authors.length <= 0) {return false;}
    for(let author in req.authors){
    	 if(typeof req.authors[author] !== "string" || !req.authors[author]){return false;}
    }
    if(typeof req.isbn !== "string" || !req.isbn){return false;}
    if(typeof req.pages !== "number" || req.pages <= 0){return false;}
    if(typeof req.year !== "number" || req.year <= 0){return false;}
    if(typeof req.publisher !== "string" || !req.publisher){return false;}
    if(req.nCopies !== undefined && typeof req.nCopies !== "number" || req.nCopies <= 0) {return false;}
    //check that nCopies is and integer
    return true;
}

//check if two books have all the same info
//function verifyMatch(book1: Record<string, any>, book2: Record<string, any>): boolean{}

/********************* General Utility Functions ***********************/

//TODO: add general utility functions or classes.

