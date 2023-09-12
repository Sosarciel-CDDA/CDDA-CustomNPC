const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// 将 exec 函数封装为返回 Promise 的函数
function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function main() {
  await execAsync('rmdir /S /Q "./CustomNpc/"');
  /**
  call tsc
call tsc-alias
node index
"./tools/EocScript" --input ./eocscript --output ./CustomNpc
pause
*/
}

main();