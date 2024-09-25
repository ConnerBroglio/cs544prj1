import fs from 'fs';
import Path from 'path';
import util from 'util';
const { promisify } = util;
import { Errors } from 'cs544-js-utils';
const { errResult, okResult } = Errors;
export async function readJson(path) {
    let text;
    try {
        text = await promisify(fs.readFile)(path, 'utf8');
    }
    catch (e) {
        return errResult(`unable to read ${path}: ${e.message}`);
    }
    try {
        if (path.endsWith('.jsonl')) {
            text = '[' + text.trim().replace(/\n/g, ',') + ']';
        }
        return okResult(JSON.parse(text));
    }
    catch (e) {
        return errResult(`unable to parse JSON from ${path}: ${e.message}`);
    }
}
export function cwdPath(path) {
    return (path.startsWith(Path.sep)) ? path : Path.join(process.cwd(), path);
}
export function scriptName() {
    return Path.basename(process.argv[1]);
}
export function abort(msg, ...args) {
    const text = msg + args.map(a => JSON.stringify(a)).join(' ');
    console.error(text);
    process.exit(1);
}
//# sourceMappingURL=utils.js.map