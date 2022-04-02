#!node
import { readFile, writeFile } from 'fs/promises';
import { Command } from 'commander';
import chalk from 'chalk';
import { Environment as env } from './SunDesign/Compiler.js';

const program = new Command();

const VERSION = '0.0.1';

const TITLE = `    _____ _____  __  __ _      _____                      _ _           
  / ____|| ___ \\|  \\/  | |    / ____|                    (_) |          
  | (___ | |  | | \\  / | |   | |     ___  _ __ ___  _ __  _| | ___ _ __ 
  \\___  \\| |  | | |\\/| | |   | |    / _ \\| '_ \` _ \\| '_ \\| | |/ _ \\ '__|
  ____)  | |__| | |  | | |___| |___| (_) | | | | | | |_) | | |  __/ |   
  |_____/|_____/|_|  |_|______\\_____\\___/|_| |_| |_| .__/|_|_|\\___|_|   
                                                   | |                  
                                                   |_|                  `;

program
	.version(VERSION)
	.option('-f <path>', "the path of the source file", "main.sdml")
	.option('-e <entry>', "the name of the input sdml component", "main")
	.option('-o <path>', "the name of the output sdml compiled js file", "main.js")
	.option('--mermaid [path]', "output mermaid data", false)
	.option('--flowchart [path]', "output mmd flowchart data", false)
	.option('--three <path>', "output mermaid data", "Three.js")
	.option('--no-for-diff', "set compile flag forDiff to false")
	.option('--no-if-cache', "set compile flag ifBranchCache to false")
	.option('--no-const-inline', "set compile flag inlineConstantExp to false")
	.option('--test', "compile the sdml file but do not save the result", false);

program.parse(process.argv);

const opts = program.opts();

const OPT = { for_diff: opts.forDiff, if_branch_cache: opts.ifCache, inline_contanst_exp: opts.constInline };
const ENV = new env(undefined, OPT);

const time_start = process.hrtime();
function Time() {
	var precision = 3; // 3 decimal places
	var elapsed = process.hrtime(time_start)[1] / 1000000; // divide by a million to get nano to milli
	return (process.hrtime(time_start)[0] + "s, " + elapsed.toFixed(precision) + "ms"); // print message + time
}

console.log('');
console.log(chalk.italic.bold(TITLE) + `version:${VERSION}`);
console.log('');

try {
	console.log(chalk.bgBlueBright.whiteBright.bold(`  SDML Compiling  `) + '');
	ENV.component(opts.e, opts.f);
	Promise.all(ENV.promises).then(() => {
		if (opts.flowchart) {
			console.log(chalk.bgBlueBright.whiteBright.bold(` FlowChart Gening `));
			const mermaid_str = ENV.caches[opts.f].compile_res.to_Mermaid();
			const str = mermaid_str;
			const filepath = opts.flowchart === true ? 'flowchart.mmd' : opts.flowchart;
			console.log(chalk.blueBright.bold(` FlowChart Gening `) + ' : finished');
			writeFile(filepath, str).then(() => {
			}).catch(err => {
				console.log(chalk.red.bold(`Failed to write file '${filepath}'\nmore info:`));
				console.log(chalk.red(`  ${err.message}`));
			})
		}
		else if (opts.mermaid) {
			console.log(chalk.bgBlueBright.whiteBright.bold(`  Mermaid Gening  `));
			const code = [];
			for (const url in ENV.caches) {
				code.push({ url, mermaid: ENV.caches[url].compile_res.to_Mermaid() })
			}
			const str = code.map(({ url, mermaid }) => `File: ${url}\n${mermaid}`).join("\n=============================================================================\n");
			const filepath = opts.mermaid === true ? 'mermaid.txt' : opts.mermaid;
			console.log(chalk.blueBright.bold(` Mermaid Gening`) + ' : finished');
			writeFile(filepath, str).then(() => {
			}).catch(err => {
				console.log(chalk.red.bold(`Failed to write file '${filepath}'\nmore info:`));
				console.log(chalk.red(`  ${err.message}`));
			})
		}
		else {
			console.log(chalk.bgBlueBright.whiteBright.bold(` Code  Generating `));
			const code = ENV.generate();
			const entry = ENV.get_ClassName(opts.e);
			console.log(chalk.blueBright.bold(` Code  Generating `) + ' : finished');
			if (!opts.test)
				writeFile(opts.o, `import * as THREE from '${opts.three}';\n\n${code}\n\nexport { ${entry} as ${opts.e} };`).then(() => {
				}).catch(err => {
					console.log(chalk.red.bold(`Failed to write file '${opts.o}'\nmore info:`));
					console.log(chalk.red(`  ${err.message}`));
				})
		}

	}).then(() => {
		console.log(chalk.bgGreen.white.bold(` Compile Finished `));
		console.log(` in ${Time()}\n`);
	}).catch(err => {
		console.log(chalk.bgRedBright.white.bold(`  Error Occoured  `));
		console.log(chalk.redBright.bold(`Failed to compile file '${opts.f}'\nmore info:`));
		console.log(err.message);
		console.log(chalk.bgRedBright.white.bold(`  Compile Failed  \n`));
	})
}
catch (err) {
	console.log(chalk.red.bold(`Failed to compile file '${opts.f}'\nmore info:`));
	console.log(chalk.red(`  ${err.message}`));
}
