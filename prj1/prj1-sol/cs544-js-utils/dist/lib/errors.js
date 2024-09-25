// Immutable API
/** throw exception with msg and args; use when impossible conditions occur */
export function panic(msg, ...args) {
    throw new Error(msg + args.map((a) => JSON.stringify(a)).join(', '));
}
const DEFAULT_ERR_CODE = 'UNKNOWN';
export class Err {
    message;
    options;
    constructor(message, options) {
        this.message = message;
        this.options = options;
    }
}
;
/** A Result is either a success result identified by isOk=true,
 *  or an error result identified by isOk=false.  A success
 *  result has the success value in its 'val' property; an
 *  error result will have one or more 'Err' objects in its
 *  'errors' property.
 */
export class OkResult {
    isOk = true;
    val;
    constructor(v) { this.val = v; }
    /** return result of applying fn on val */
    chain(fn) {
        return fn(this.val);
    }
}
export class ErrResult {
    isOk = false;
    errors;
    constructor(errors = []) { this.errors = errors; }
    /** Possible arguments
     *   addError(ErrResult errResult)
     *   addError(msg: string, code?: string, widget?: string)
     *   addError(msg: string, options: ErrOptions)
     *   addError(err: Err)
     *   addError(err: Error, options?: ErrOptions)
     *   addError(errObj: object, options?: ErrOptions)
     */
    addError(arg0, ...args) {
        const errors = (arg0 instanceof ErrResult) ? arg0.errors : [error(arg0, ...args)];
        return new ErrResult(this.errors.concat(errors));
    }
    /** ignore fn, simply returning this error result */
    chain(_fn) {
        return this;
    }
}
/** factory function for a success result */
export function okResult(v) { return new OkResult(v); }
export const VOID_RESULT = okResult(undefined);
/** factory function for an error result initialized to contain
 *  a single error as per arg0, args.
 *    errResult(msg: string, code?: string, widget?: string)
 *    errResult(msg: string, options: ErrOptions)
 *    errResult(err: Err)
 *    errResult(err: ErrResult, options: ErrOptions)
 *    errResult(errObj: object, options: ErrOptions)
 */
export function errResult(arg0, ...args) {
    return new ErrResult().addError(arg0, ...args);
}
/** Convenience error building function.  Possible arguments:
 *     error(msg: string, code?: string, widget?: string)
 *     error(msg: string, options: ErrOptions)
 *     error(err: Err)
 *     error(err: Error, options?: ErrOptions)
 *     error(errObj: object, options?: ErrOptions)
 */
export function error(arg0, ...args) {
    let options = { code: DEFAULT_ERR_CODE };
    if (typeof arg0 === 'string') {
        const msg = arg0;
        if (args.length === 0) {
            return new Err(msg, { code: DEFAULT_ERR_CODE });
        }
        else if (args.length === 1 && typeof args[0] === 'object') {
            return new Err(msg, { code: DEFAULT_ERR_CODE, ...args[0] });
        }
        else if (args.length === 1 && typeof args[0] === 'string') {
            return new Err(msg, { code: args[0] });
        }
        else if (args.length === 2 &&
            typeof args[0] === 'string' && typeof args[1] === 'string') {
            return new Err(msg, { code: args[0], widget: args[1] });
        }
        else {
            panic(`bad error args`, [arg0, ...args]);
        }
    }
    else if (arg0 instanceof Err) {
        return arg0;
    }
    else if (arg0 instanceof Error) {
        return new Err(arg0.message, args.length > 0 ? args[0]
            : { code: DEFAULT_ERR_CODE });
    }
    else if (typeof arg0 === 'object') {
        return new Err(arg0.toString(), args.length > 0 ? args[0]
            : { code: DEFAULT_ERR_CODE });
    }
    else {
        panic(`bad error args`, [arg0, ...args]);
    }
}
/*
//demo program

function safeDiv(num: number, denom: number) : Result<number> {
  if (denom === 0) return errResult('zero denominator');
  return okResult(num/denom);
}

function demo(result: Result<number>) : Result<string> {
  if (!result.isOk) return result as Result<string>;
  const v = result.val + 1;
  return result.chain((val: number) => okResult('x'.repeat(v*val)))
               .chain((str: string) => okResult(str + 'aaa'));
}

console.log(safeDiv(1, 0));
console.log(safeDiv(1, 2));
console.log(demo(errResult('some error', 'ERR_CODE')));
console.log(demo(okResult(2)));
*/
//# sourceMappingURL=errors.js.map