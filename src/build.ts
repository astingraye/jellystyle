import * as fs from 'fs';
import { getPathFromProjectRoot } from './utils/getPathFromProjectRoot.js';
import * as sass from "sass";
import chalk from 'chalk';

function readFilesRecursively(dir) {
	let results = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = `${dir}/${entry.name}`;
		if (entry.isDirectory()) {
			results = results.concat(readFilesRecursively(fullPath));
		} else {
			results.push(fullPath);
		}
	}

	return results;
}

function extractProperties(content: string): { [key: string]: string } {
	const properties: { [key: string]: string } = {};
	const matches = [...content.matchAll(/\/\/\s*@([a-zA-Z0-9\-]+)\s*:\s*(.*?)(?:\n|$)/g)];

	matches.forEach(match => {
		const key = match[1];
		const value = match[2];
		properties[key] = value;
	});

	return properties;
}

export function buildSass() {
	const stylePath = getPathFromProjectRoot('/styles');

	const sassFiles = readFilesRecursively(stylePath)
		.filter((e) => !e.includes('styles/main'))
		.map((e) => ({
			name: new RegExp(
				`${getPathFromProjectRoot('/styles/')}(.*)\.scss`
			).exec(e)[1],
			path: e,
		}));

	console.log(
		`Loaded Styles!\n\n${sassFiles
			.map((e) => {
				const fileContents = fs.readFileSync(e.path, 'utf8');

				const props = extractProperties(fileContents);

				const description = props?.description;

				const matchName = props?.name;

				return `${matchName ?? e.name}${
					description ? ` - ${chalk.green(description)}` : ''
				}`;
			})
			.join('\n\n')}`
	);

	fs.writeFileSync(
		`${stylePath}/main.scss`,
		sassFiles.map((e) => `@use '${e.name}' as *;`).join('\n')
	);

    try {
        const data = sass.compile(getPathFromProjectRoot("/styles/main.scss"), {
            style: "compressed"
        }).css;

        fs.writeFileSync(getPathFromProjectRoot("/compiled.css"), data)
    }
    catch {
        console.log(chalk.red("! ERROR COMPILING !"));
    }
}
