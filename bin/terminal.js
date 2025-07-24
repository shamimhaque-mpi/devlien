export default class Terminal {
  UPDATE_INDEX;
  #STORAGE = [];
  COLORS = { processing: '\x1b[33m%s\x1b[0m', success: '\x1b[32m%s\x1b[0m' };


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
      console.log(this.COLORS[node.type], node.text);
    });
  }

  getMIddleSpace(str = null) {
    const terminalWidth = process.stdout.columns || 80;
    const middleSpace = terminalWidth - (str.length + 2);
    return middleSpace > 0 ? ' ' + '-'.repeat(middleSpace) + ' ' : ' ';
  }
}