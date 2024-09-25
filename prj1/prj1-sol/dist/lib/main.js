import assert from 'assert';
import Path from 'path';
import readline from 'readline';
import { readJson } from 'cs544-node-utils';
import { Errors } from 'cs544-js-utils';
import { makeLendingLibrary } from './lending-library.js';
/*************************** Top-Level Code ****************************/
export default async function main(args) {
    if (args.length < 1) {
        console.error('usage: %s JSON_PATH...', Path.basename(process.argv[1]));
        process.exit(1);
    }
    await go(process.argv.slice(2));
}
//change to true after completing addBook() method.
const CHECK_INIT_LOAD = false;
async function go(paths) {
    assert(paths.length > 0);
    const library = makeLendingLibrary();
    for (const path of paths) {
        const readResult = await readJson(path);
        if (!readResult.isOk)
            panic(readResult);
        const books = readResult.val;
        for (const book of books) {
            const addResult = library.addBook(book);
            if (CHECK_INIT_LOAD && !addResult.isOk)
                panic(addResult);
        }
    }
    //help(sensorsInfo);
    await interact(library);
}
/*************************** User Interaction **************************/
const PROMPT = '>> ';
function interact(library) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
        prompt: PROMPT,
    });
    help();
    rl.prompt();
    rl.on('line', async (line) => {
        await doLine(library, line);
        rl.prompt();
    });
}
const ARGS_RE = /(\w+)\s*\=\s*(?:\"([^\"]+)\"|\'([^\']+)\'|(\S+))/g;
function doLine(library, line) {
    line = line.trim();
    const cmdIndex = COMMANDS.findIndex(c => line.startsWith(c));
    if (cmdIndex < 0) {
        errors(Errors.errResult(`bad command ${line.split(/\s/)[0]}`));
        return;
    }
    const cmd = COMMANDS[cmdIndex];
    const argPairs = [...line.matchAll(ARGS_RE)].map(m => [m[1], (m[2] ?? m[3] ?? m[4]).trim()]);
    const args = Object.fromEntries(argPairs);
    for (const [k, v] of Object.entries(args)) {
        let m;
        if (v.match(/^\d+$/)) {
            args[k] = Number(v);
        }
        else if ((m = v.match(/^\[([^\]]+)\]/))) {
            args[k] = m[1].trim().split(',').map((e) => e.trim());
        }
    }
    const ret = doCommand(library, cmd, args);
    if (ret === undefined) {
    }
    else if (ret.isOk) {
        console.log(JSON.stringify(ret.val, null, 2));
    }
    else if (ret.errors) {
        errors(ret);
    }
    else {
        console.log(ret);
    }
}
function doCommand(library, cmd, args) {
    return (cmd === 'help')
        ? help()
        : library[cmd].call(library, args);
}
function help() {
    const msg = COMMANDS
        .map(c => c === 'help' ? `  ${c}` : `  ${c} PARAM=VALUE...`)
        .join('\n');
    console.log(msg);
}
const COMMANDS = ['help', 'addBook', 'findBooks', 'checkoutBook', 'returnBook'];
/******************************* Utilities *****************************/
function errors(result) {
    if (result.isOk)
        return;
    for (const err of result.errors) {
        let msg = `${err.options.code}: ${err.message}`;
        let opts = '';
        for (const [k, v] of Object.entries(err.options)) {
            if (k === 'code')
                continue;
            opts += `${k}=${v}`;
        }
        if (opts.length > 0)
            msg += '; ' + opts;
        console.error(msg);
    }
}
function panic(result) {
    errors(result);
    process.exit(1);
}
//# sourceMappingURL=main.js.map