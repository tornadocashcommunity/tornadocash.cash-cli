/**
 * Correct the resolve field of fflate as we don't use browser esm
 * 
 * See issue https://github.com/101arrowz/fflate/issues/211
 */
import fs from 'fs';

const pkgJson = JSON.parse(fs.readFileSync('./node_modules/fflate/package.json', { encoding: 'utf8' }));
const backupJson = JSON.stringify(pkgJson, null, 2);

let changes = false

if (pkgJson.module.includes('browser')) {
  pkgJson.module = './esm/index.mjs';

  changes = true;
}

if (pkgJson.exports['.']?.import?.types && pkgJson.exports?.['.']?.import?.types.includes('browser')) {
  pkgJson.exports['.'] = {
    ...pkgJson.exports['.'],
    "import": {
      "types": "./esm/index.d.mts",
      "default": "./esm/index.mjs"
    },
    "require": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.cjs"
    }
  }

  changes = true;
}


if (changes) {
  fs.writeFileSync('./node_modules/fflate/package.backup.json', backupJson + '\n');
  fs.writeFileSync('./node_modules/fflate/package.json', JSON.stringify(pkgJson, null, 2) + '\n');
}
