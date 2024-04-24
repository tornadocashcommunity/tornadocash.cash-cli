import figlet from 'figlet';
import Standard from './fonts/figletStandard';
import { tornadoProgram } from './program';

figlet.parseFont('Standard', Standard);

console.log(`
====================================================================

${figlet.textSync('Tornado CLI', { font: 'Standard' })}

====================================================================\n
`);

tornadoProgram().parse();
