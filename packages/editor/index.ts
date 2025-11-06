function setClasses() {
  let styles = document.querySelector('style');
  if (!styles) {
    styles = document.createElement('style');
  }

  // Fixed classes
  const div_line = `.vertical-division-line {self-stretch: 1; border-right: 1px solid #999999}`;

  const container_class = `.parent-container { background-color: #323232; width: 100%; height: 100%;display: flex;flex-direction: row; gap: 0;}`;

  const container_class__numbers = `.number-container { self-stretch: 1; min-width: 40px; max-width: 60px; font-size: 14px; text-align: right; }`;
  const number_span = '.number_span {font-size: 14px; color: white;}';
  const dummy_number_span = `.dummy_number_span {opacity: 0; position: absolute; top: 0; left: 0;}`;

  const container_class__code = `.code-container { self-stretch: 1; flex: 1; font-size: 14px }`;

  styles.innerHTML += container_class;

  styles.innerHTML += container_class__numbers;
  styles.innerHTML += number_span;
  styles.innerHTML += dummy_number_span;

  styles.innerHTML += div_line;

  styles.innerHTML += container_class__code;

  document.querySelector('head')?.insertAdjacentElement('beforeend', styles);
}

function createContainer(parentId: string) {
  const div = document.createElement('div');
  div.classList.add('parent-container');

  const number_div = document.createElement('div');
  number_div.classList.add('number-container');

  const dummy_span = document.createElement('span');
  dummy_span.classList.add('number_span', 'dummy_number_span');

  number_div.insertAdjacentElement('beforeend', dummy_span);

  const div_line = document.createElement('div');
  div_line.classList.add('vertical-division-line');

  const code_div = document.createElement('div');
  code_div.classList.add('code-container');

  div.insertAdjacentElement('beforeend', number_div);
  div.insertAdjacentElement('beforeend', div_line);
  div.insertAdjacentElement('beforeend', code_div);

  console.log(div);

  document.getElementById(parentId)?.insertAdjacentElement('beforeend', div);
}

function setupNumbers(numbersDiv: HTMLDivElement) {
  // Get dimensions using dummy span
  const dummy_span = document.querySelector('dummy_number_span');

  if (!dummy_span) {
    console.error(
      'There was some error initializing the editor dummy span not found'
    );
    return;
  }

  const height: string = getComputedStyle(dummy_span).height; // pixels
  const width: string = getComputedStyle(dummy_span).width;

  const number_span = document.createElement('span');
}

class Editor {
  parentId: string;
  initialized: boolean = false;
  getCodeOn: 'update' | 'manual' | 'timed' = 'manual';
  code: string = '';

  constructor(parentId: string, getCode: (code: string) => void) {
    this.parentId = parentId;
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;

    setClasses();
    createContainer(this.parentId);
  }

  updateGetCodeOn(method: 'manual' | 'timed' | 'update') {
    this.getCodeOn = method;
  }
}

function initEditor(parentId: string) {
  const editor = new Editor(parentId, (code: string) => {});
  editor.initialize();
}

export { Editor };
export default initEditor;
