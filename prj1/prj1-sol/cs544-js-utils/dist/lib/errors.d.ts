/** throw exception with msg and args; use when impossible conditions occur */
export declare function panic(msg: string, ...args: any): never;
/** An error consists of a message and possible options */
type Code = string;
/** Error options must have an error 'code'.  They may also have other
 *  optional properties like 'widget' specifying the ID of the widget
 *  causing the error.
 */
export type ErrOptions = {
    code: Code;
    [opt: string]: string;
};
export declare class Err {
    readonly message: string;
    readonly options: ErrOptions;
    constructor(message: string, options: ErrOptions);
}
/** A Result is either a success result identified by isOk=true,
 *  or an error result identified by isOk=false.  A success
 *  result has the success value in its 'val' property; an
 *  error result will have one or more 'Err' objects in its
 *  'errors' property.
 */
export declare class OkResult<T> {
    readonly isOk = true;
    readonly val: T;
    constructor(v: T);
    /** return result of applying fn on val */
    chain<T1>(fn: (v: T) => Result<T1>): Result<T1>;
}
export declare class ErrResult {
    readonly isOk = false;
    readonly errors: Err[];
    constructor(errors?: Err[]);
    /** Possible arguments
     *   addError(ErrResult errResult)
     *   addError(msg: string, code?: string, widget?: string)
     *   addError(msg: string, options: ErrOptions)
     *   addError(err: Err)
     *   addError(err: Error, options?: ErrOptions)
     *   addError(errObj: object, options?: ErrOptions)
     */
    addError(arg0: any, ...args: any): ErrResult;
    /** ignore fn, simply returning this error result */
    chain<T1>(_fn: (v: any) => Result<T1>): Result<T1>;
}
export type Result<T> = OkResult<T> | ErrResult;
/** factory function for a success result */
export declare function okResult<T>(v: T): OkResult<T>;
export declare const VOID_RESULT: Result<void>;
/** factory function for an error result initialized to contain
 *  a single error as per arg0, args.
 *    errResult(msg: string, code?: string, widget?: string)
 *    errResult(msg: string, options: ErrOptions)
 *    errResult(err: Err)
 *    errResult(err: ErrResult, options: ErrOptions)
 *    errResult(errObj: object, options: ErrOptions)
 */
export declare function errResult(arg0: any, ...args: any): ErrResult;
/** Convenience error building function.  Possible arguments:
 *     error(msg: string, code?: string, widget?: string)
 *     error(msg: string, options: ErrOptions)
 *     error(err: Err)
 *     error(err: Error, options?: ErrOptions)
 *     error(errObj: object, options?: ErrOptions)
 */
export declare function error(arg0: any, ...args: any): Err;
export {};
//# sourceMappingURL=errors.d.ts.map