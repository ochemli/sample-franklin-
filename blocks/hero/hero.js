import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const scrollbutton = document.createElement('div');
  scrollbutton.classList.add('scroll-button');
  const buttonContent = 'Scroll down';
  const buttonTarget = '#contact';
  scrollbutton.innerHTML = `<a href=${buttonTarget}>${buttonContent}</a>`;
  block.insertAdjacentElement('afterend', scrollbutton);

  const config = readBlockConfig(block);
  // setup metadata and remove all of them from the DOM
  if (config && Object.keys(config).length === 1) {
    const configKey = block.children[1].children[0];
    const configValue = block.children[1].children[1];
    const [key, value] = Object.entries(config)[0];
    const isKey = configKey.innerText === key;
    const isValue = configValue.innerText === value;
    if (isKey && isValue) block.children[1].remove();
    block.dataset[key] = value;
    if (key === 'id') block.id = value;
  }
  /* Move all buttons to one container */
  const firstButtonContainer = block.querySelector('.button-container');
  if (firstButtonContainer) {
    block.querySelectorAll('.button-container a.button').forEach((button, i) => {
      if (i === 0) return;
      const buttonContainer = button.parentNode;
      firstButtonContainer.append(button);
      button.classList.remove('primary');
      button.classList.add('secondary');
      buttonContainer.remove();
    });
  }
}
