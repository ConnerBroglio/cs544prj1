import { Errors } from 'cs544-js-utils';
/************************ Main Implementation **************************/
export function makeLendingLibrary() {
    return new LendingLibrary();
}
export class LendingLibrary {
    //TODO: declare private TS properties for instance
    #addBooksList;
    #findBooksList;
    #checkoutList;
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
    addBook(req) {
        //TODO
        return Errors.errResult('TODO'); //placeholder
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
    findBooks(req) {
        //TODO
        return Errors.errResult('TODO'); //placeholder
    }
    /** Set up patron req.patronId to check out book req.isbn.
     *
     *  Errors:
     *    MISSING: patronId or isbn field is missing
     *    BAD_TYPE: patronId or isbn field is not a string.
     *    BAD_REQ error on business rule violation.
     */
    checkoutBook(req) {
        //TODO
        return Errors.errResult('TODO'); //placeholder
    }
    /** Set up patron req.patronId to returns book req.isbn.
     *
     *  Errors:
     *    MISSING: patronId or isbn field is missing
     *    BAD_TYPE: patronId or isbn field is not a string.
     *    BAD_REQ error on business rule violation.
     */
    returnBook(req) {
        //TODO 
        return Errors.errResult('TODO'); //placeholder
    }
}
/********************** Domain Utility Functions ***********************/
//TODO: add domain-specific utility functions or classes.
/********************* General Utility Functions ***********************/
//TODO: add general utility functions or classes.
//# sourceMappingURL=lending-library.js.map