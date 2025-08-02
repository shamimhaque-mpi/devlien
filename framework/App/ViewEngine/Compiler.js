import vm from 'vm';

export default class Compiler {
  html = '';
  dataset = {};

  /**
   * Initialize a new instance of the template engine and render the given component.
   *
   * @param  {Object} component  The root component object to be rendered.
   * @return {Promise<string>}   The rendered HTML output.
   */
  static async execute(component, dataset = {}) {
    const _this = new this();
    _this.component = component;
    return _this.execute(component, dataset);
  }

  /**
   * Render the component by executing its script, processing conditionals,
   * compiling variables, and recursively injecting included child components.
   *
   * @param  {Object} component  The component object containing content, script, and includes.
   * @param  {Object} [dataset={}]  The data context used for rendering the template.
   * @return {string}  The fully rendered HTML output.
   */
  execute(component, dataset = {}) {
    dataset = Object.assign(dataset, this.runScript(component.script));

    component.content = this.processConditionals(component.content);

    var content = this.renderTemplate(component.content, dataset);

    if (component.includes && Object.values(component.includes).length)
      for (const key in component.includes) {
        content = content.replace(
          key,
          this.execute(component.includes[key], dataset)
        );
      }
    return content;
  }

  /**
   * Compile Blade-style conditional directives (@if, @elseif, @else, @endif)
   * into JavaScript if-else syntax.
   *
   * @param  {string} template
   * @return {string}
   */
  processConditionals(template) {
    template = template
      .replace(
        /@if\s*\((.*?)\)/g,
        (_, cond) => '`); if (' + cond + ') { output.push(`'
      )
      .replace(
        /@elseif\s*\((.*?)\)/g,
        (_, cond) => '`); } else if (' + cond + ') { output.push(`'
      )
      .replace(/@else/g, '`); } else { output.push(`')
      .replace(/@endif/g, '`); } output.push(`');

    return template;
  }

  /**
   * Compile Blade-style @foreach and @endforeach directives
   * into JavaScript for-loop syntax.
   *
   * @param  {string} template
   * @return {string}
   */
  processForLoop(template) {
    template = template
      .replace(
        /@foreach\s*\((.*?)\)/g,
        (_, loop) => '`); for (' + loop + ') { output.push(`'
      )
      .replace(/@endforeach/g, '`); } output.push(`');
    return template;
  }

  /**
   * Compile and render the given template string by processing conditionals,
   * loops, and variable placeholders using the provided dataset.
   *
   * @param  {string} template  The raw template string containing Blade-like syntax.
   * @param  {Object} dataset   The data context used to resolve variables and expressions.
   * @return {string}           The rendered HTML output, or an error message if rendering fails.
   */
  renderTemplate(template, dataset) {
    //
    template = this.processConditionals(template);
    template = this.processForLoop(template);
    // Replace {{ variable }} with ${ variable }
    template = template.replace(
      /{{\s*(.*?)\s*}}/g,
      (_, key) => '${' + key + '}'
    );

    // Wrap it in a renderable function
    const wrapped = '`' + template + '`';

    try {
      const renderFn = new Function(
        'with(this) { const output = []; output.push(' +
          wrapped +
          '); return output.join(""); }'
      );
      return renderFn.call(dataset);
    } catch (err) {
      return `Template render error: ${err.message}`;
    }
  }

  /**
   * Safely execute the given script code in a sandboxed VM context and
   * return an object containing its declared variables.
   *
   * @param  {string} code  The JavaScript code block to be executed.
   * @return {Object}       An object containing the exported variables from the script.
   */
  runScript(code) {
    const sandbox = {};
    const wrapper = `
      (function() {
        ${code}
        return { ${this.extractIdentifiers(code)
          .join(', ')
          .replace('()', '')} };
      })()
    `;

    vm.createContext(sandbox);
    const result = vm.runInContext(wrapper, sandbox);

    return result;
  }

  /**
   * Extract all variable and function identifiers from the given script string.
   * Supports detection of `const`, `let`, `var`, and named `function` declarations.
   *
   * @param  {string} script  The JavaScript source code to parse.
   * @return {string[]}       An array of declared identifier names.
   */
  extractIdentifiers(script) {
    const identifiers = new Set();

    // Match const/let/var
    const varRegex = /\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)/g;
    let match;
    while ((match = varRegex.exec(script)) !== null) {
      identifiers.add(match[1]);
    }

    // Match function declarations
    const fnRegex = /function\s+([a-zA-Z_$][\w$]*)\s*\(/g;
    while ((match = fnRegex.exec(script)) !== null) {
      identifiers.add(match[1]);
    }

    return Array.from(identifiers);
  }
}
