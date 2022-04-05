#!node
import { readFile, writeFile } from 'fs/promises';
import { Command } from 'commander';
import chalk from 'chalk';
import { Environment as env } from './SunDesign/Compiler.js';
import { ALL_NODE_TYPES } from './SunDesign/TagCollection.js';
import { Types, TypesManagerSingleton } from './SunDesign/Core.js';
import { get_ParamsString } from './SunDesign/Compiler.js';
import { typeToString } from './SunDesign/sPARks.js';

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
const MANUAL = `    _____ _____  __  __ _      __  __                         _ 
  / ____|| __  \\|  \\/  | |    |  \\/  |                       | |
  | (___ | |  | | \\  / | |    | \\  / | __ _ _ __  _   _  __ _| |
  \\___ \\ | |  | | |\\/| | |    | |\\/| |/ _\` | '_ \\| | | |/ _\` | |
  ____)  | |__| | |  | | |____| |  | | (_| | | | | |_| | (_| | |
  |_____/|_____/|_|  |_|______|_|  |_|\\__,_|_| |_|\\__,_|\\__,_|_|
                                                                   `;

program
	.version(VERSION)
	.option('-f <path>', "the path of the source file", "main.sdml")
	.option('-e <entry>', "the name of the input sdml component", "main")
	.option('-o <path>', "the name of the output sdml compiled js file", "main.js")
	.option('-m <path>', "get manual", false)
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


if (opts.m !== false) {
	console.log('');
	console.log(chalk.italic.bold(MANUAL) + `version:${VERSION}`);
	console.log('');
	if (opts.m === 'listall') {
		console.log(chalk.bgMagenta(" ") + chalk.bgMagenta.white.bold("ALL NODES") + chalk.bgMagenta(" ") + '\n');
		for (const name in ALL_NODE_TYPES) {
			console.log(`  <${name} />`);
		}
		console.log("");
		process.exit();
	}
	const nodename = opts.m;
	if (nodename in ALL_NODE_TYPES) {
		const node = ALL_NODE_TYPES[nodename];
		const params = TypesManagerSingleton.param(nodename);

		console.log(chalk.bgMagenta(" ") + chalk.bgMagenta.white.bold("SIGNATURE") + chalk.bgMagenta(" ") + '\n');
		console.log(`  ${chalk.bold('<')}${chalk.redBright.bold(nodename)} ${params === undefined ? '' : Object.entries(params).map(([key, value]) => {
			if (value.default !== undefined) return `[${chalk.blueBright.bold.italic(key)}]=${chalk.greenBright.bold(`"${typeToString(value.datatype)}"`)}`;
			return `${chalk.blueBright.bold.italic(key)}=${chalk.greenBright.bold(`"${typeToString(value.datatype)}"`)}`;
		}).join(" ")}${chalk.bold('/>')}`);

		console.log('  \\\n    ' + chalk.bgCyan(" ") + chalk.bgCyan.white.bold("OUTPUT") + chalk.bgCyan(" ") + '\n');
		console.log(`${node.type === null ? '    not determined' : node.type.to_List().map(i => `    ${i}`).join('\n')}`);
		console.log('');


		console.log(chalk.bgBlue(" ") + chalk.bgBlue.white.bold("INPUTS") + chalk.bgBlue(" ") + '\n');
		if (node.inputs === null) {
			console.log('  (no sub nodes)', '\n');
		}
		else if (node.inputs === Types.ANY) {
			console.log('  (any)', '\n');
		}
		else if (node.inputs === Types.IGNORE) {
			console.log('  (any)', '\n');
		}
		else {
			let i = 1;
			for (const name in node.inputs) {
				console.log(`  ${chalk.blueBright.bold(i++)}. ${chalk.underline.italic.bold(name)}`);
				const node_inputs_arr = get_ParamsString(node.inputs[name], true);
				console.log(node_inputs_arr.map(i => `     ${i}`).join('\n'), '\n');
			}
		}

	}
	else {
		console.log(`${chalk.redBright.bold("Error ")}: node <${nodename} /> not found`);
		console.log(``);
	}
}
else {
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
					writeFile(opts.o, `import * as THREE from '${opts.three}';\n\nconst ${ENV.load_template_name} = [];\n\n${code}\n\nconst $load_promise = Promise.all(${ENV.load_template_name});\nexport { ${entry} as ${opts.e}, $load_promise as onLoad };`).then(() => {
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
}
