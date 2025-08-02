import fs from 'fs';
import path from 'path';

export default class Template {
	//
	constructor(baseDir = 'components', fileExtension = '.dl') {
		this.baseDir = baseDir;
		this.fileExtension = fileExtension;
	}

	isFileExists(file) {
		return fs.existsSync(path.join(this.baseDir, file));
	}

	async readFile(file) {
		return await fs.promises.readFile(path.join(this.baseDir, file), 'utf-8');
	}

	/**
	 * Build and process the template file content, handling extends or includes.
	 *
	 * @param  {string}  file         The template file path to read and process.
	 * @param  {Object}  [data={}]    Data context to pass during rendering (optional).
	 * @param  {boolean} [isExtendable=false]  Whether to process @extends directives.
	 * @return {Promise<string>}      The processed template content as a string.
	 */
	async build(file, isExtendable = false) {
		if (!this.isFileExists(file)) {
			return `Template "${file}" not found`;
		}

		let comtent = await this.readFile(file);
		if (isExtendable)
			return await this.processExtends(comtent, file.replace(this.fileExtension, ''));
		else 
			return await this.processIncludes(comtent, file);
	}

	/**
	 * Process @include directives within the template by replacing them
	 * with unique placeholders and recursively building included templates.
	 *
	 * @param  {string} template  The raw template string containing @include directives.
	 * @param  {string} file      The current template file name (used for context).
	 * @return {Promise<Object>}  An object containing processed content, script, and includes:
	 * {
	 *   content: string,
	 *   script: string,
	 *   includes: Object<string, Object>
	 * }
	 */
	async processIncludes(template, file) {
		var params = {
			file: file,
			content: '',
			script: '',
			includes: {},
		};

		//
		const includeRegex = /@include\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
		const matches = [...template.matchAll(includeRegex)];
		template = template.replace(/@extend\s*\(\s*['"]([^'"]+)['"]\s*\)/g, '');

		var index = 0;
		for (const match of matches) 
		{
			index++;
			const file = `${match[1]}${this.fileExtension}`;

			if (this.isFileExists(file)) {
				template = template.replace(match[0], `@${index}component`);
				params.includes[`@${index}component`] = await this.build(file);
			} 
			else {
				template = template.replace(match[0],`<!-- include "${match[1]}" not found -->`);
			}
		}

		const { content, script } = this.parseComponent(template);
		params.content = content;
		params.script = script;

		return params;
	}

	/**
	 * Extract the content inside the <template> tag and the script block
	 * marked by @script ... @endscript from the component string.
	 *
	 * @param  {string} tamplate  The raw component string containing template and script.
	 * @return {Object}           An object with `content` and `script` properties.
	 */
	parseComponent(tamplate) {
		const templateMatch = tamplate.match(/<template>([\s\S]*?)<\/template>/);
		const scriptMatch = tamplate.match(/@script([\s\S]*?)@endscript/);

		return {
			content: templateMatch ? templateMatch[1] : '',
			script: scriptMatch ? scriptMatch[1] : '',
		};
	}

	/**
	 * Process the @extend directive in the template by loading the specified parent layout,
	 * replacing the @yield directive in the layout with an @include of the current template,
	 * then processing includes recursively.
	 *
	 * @param  {string} template  The template content containing the @extend directive.
	 * @param  {string} parant    The current template name (used for @include replacement).
	 * @return {Promise<Object>}  The processed template object with content, script, and includes.
	 */
	async processExtends(template, parant) {
		//
		const includeRegex = /@extend\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
		const matches = [...template.matchAll(includeRegex)];

		if(matches.length)
		{
			const [replaceable, repath] = matches[0];
			if (this.isFileExists(repath + this.fileExtension)) {
				const layout = await this.readFile(repath + this.fileExtension);
				template = template.replace(replaceable, '');
				template = layout.replace(/@yield/g, (xpr) => {
					return `@include('${parant}')`;
				});
			} 
			else {
				template = template.replace(replaceable, `<!-- extend "${repath}" not found -->`);
			}
			return await this.processIncludes(template, repath + this.fileExtension);
		}
		return await this.processIncludes(template, parant + this.fileExtension);
	}
}
