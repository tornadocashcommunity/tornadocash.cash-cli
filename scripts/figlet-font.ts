import fs from 'fs'

let figletStandard = fs.readFileSync('./node_modules/figlet/importable-fonts/Standard.js', { encoding: 'utf8' }) as string;

figletStandard = figletStandard.replace('export default `', '')

figletStandard = figletStandard.replace('         `', '')

fs.writeFileSync('./src/fonts/figletStandard.ts', `
export const figletStandard: string = \`${figletStandard}\`;
export default figletStandard;
`)