import readline from 'readline';
import color from "../utilities/colours.js";

export default class Terminal 
{
	UPDATE_INDEX;
	#STORAGE = [];

	COLORS = { 
		processing: color.info, 
		success: color.success,
		default: '%s' 
	};


	addLine(text, type = 'processing') {
		const index = this.#STORAGE.length + 1;

		this.#STORAGE[index] = {
			text: text,
			type: type,
		};

		console.log(
			this.COLORS[type],
			text.replace(' @space ', this.getMIddleSpace(text.replace(' @space ')))
		);
		return index;
	}

	updateLine(text, type = 'success', INDEX = null) {
		let _index = INDEX ? INDEX : this.#STORAGE.length - 1;
		this.#STORAGE[_index] = {
			text: text,
			type: type,
		};

		let msg = this.COLORS[type].replace(
			'%s',
			text.replace(' @space ', this.getMIddleSpace(text.replace(' @space ')))
		);

		if (INDEX) this.reload();
		else {
			process.stdout.moveCursor(0, -1);
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
			process.stdout.write(msg);
		}
	}

	reload() {
		console.clear();
		Object.values(this.#STORAGE).forEach((node) => {
			console.log(
                this.COLORS[node.type],
                node.text.replace(' @space ', this.getMIddleSpace(node.text.replace(' @space ')))
            );
		});
	}

	getMIddleSpace(str = null) {
		const terminalWidth = process.stdout.columns || 80;
		const middleSpace = terminalWidth - (str.length + 2);
		return middleSpace > 0 ? ' ' + '-'.repeat(middleSpace) + ' ' : ' ';
	}

	ask(question, options) {
		this.reload();
		//
		const _this = this;
		var message_id = null;

		return new Promise((resolve) => {

			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			let currentIndex = 0;

			function render() {
				let outputs = question + '\n';
				options.forEach((choice, i) => {
					const selected = i === currentIndex ? '◉' : '◯';
					if (i === currentIndex) {

						outputs += _this.COLORS['success'].replace('%s',` ${selected} ${choice} \n`);
					} 
					else outputs += ` ${selected} ${choice} \n`;
				});

				outputs += '\nUse arrow keys (↑ ↓) and press Enter';

				if (!message_id) message_id = _this.addLine(outputs, 'default');
				else _this.updateLine(outputs, 'default', message_id);
			}

			render();


			readline.emitKeypressEvents(process.stdin);
			process.stdin.setRawMode(true);
			process.stdin.removeAllListeners('keypress');

			process.stdin.on('keypress', (_, key) => {
				if (key.name === 'up') {
					currentIndex = (currentIndex - 1 + options.length) % options.length;
					render();
				} 
				else if (key.name === 'down') {
					currentIndex = (currentIndex + 1) % options.length;
					render();
				} 
				else if (key.name === 'return') {
					rl.close();
					process.stdin.setRawMode(false);
					delete this.#STORAGE[message_id];
					this.reload();
					resolve(options[currentIndex]);
				} 
				else if (key.ctrl && key.name === 'c') {
					rl.close();
					process.exit();
				}
			});
		});
	}
}