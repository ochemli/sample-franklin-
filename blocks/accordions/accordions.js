const idGenerator = () => {
  let id = 0;

  return () => {
    id += 1;

    return id;
  };
};

const getId = idGenerator();

let activeItemId = null;

export default function decorate(block) {
  block.querySelectorAll('div.accordions div div').forEach((el) => {
    const header = el.querySelector('h1, h2, h3, h4, h5, h6');
    const panel = el.querySelector('h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p');
    const parentEl = header.parentElement;

    // wrap the content of header into button
    const buttonEl = document.createElement('button');
    buttonEl.classList.add('accordion-button');
    buttonEl.setAttribute('aria-expanded', 'false');
    buttonEl.setAttribute('aria-controls', 'collapseOne');

    const buttonTextEl = document.createElement('div');
    buttonTextEl.classList.add('button-text');
    buttonTextEl.innerHTML = header.innerHTML;

    const iconEl = document.createElement('div');
    iconEl.classList.add('accordion-icon');

    buttonEl.appendChild(iconEl);
    buttonEl.appendChild(buttonTextEl);
    header.innerHTML = '';
    header.classList.add('accordion-header');
    header.appendChild(buttonEl);

    // accordion-panel-hidden class is for initial hiding the accordion panel
    // the accordion-panel-hidden class should be removed after initil render
    panel.classList.add('accordion-panel', 'accordion-panel-hidden');

    header.id = `accordion-${getId()}`;
    parentEl.classList.add('accordion-wrapper', 'accordion-collapsed');

    header.addEventListener('click', () => {
      const headerHeight = header.getBoundingClientRect().height;
      let parentElHeight = headerHeight;

      panel.classList.remove('accordion-panel-hidden');
      parentEl.classList.toggle('accordion-collapsed');
      parentEl.setAttribute('style', `height: ${headerHeight}px`);

      // closing previously selected accordion
      if (activeItemId && activeItemId !== header.id) {
        document.querySelector(`#${activeItemId}`).click();
      }

      if (!parentEl.classList.contains('accordion-collapsed')) {
        const panelHeight = panel.getBoundingClientRect().height;

        parentElHeight = headerHeight + panelHeight;
        activeItemId = header.id;
        buttonEl.setAttribute('aria-expanded', 'true');
      } else {
        activeItemId = null;
        buttonEl.setAttribute('aria-expanded', 'false');
      }

      parentEl.setAttribute('style', `height: ${parentElHeight}px`);
    });
  });
}
