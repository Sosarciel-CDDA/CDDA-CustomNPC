"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execAsync = void 0;
const child_process_1 = require("child_process");
/**将 exec 函数封装为返回 Promise 的函数*/
function execAsync(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({ stdout, stderr });
            }
        });
    });
}
exports.execAsync = execAsync;
