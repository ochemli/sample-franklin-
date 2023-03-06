export default function decorate(block) {
  const [header, subheader] = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const desciption = block.querySelectorAll('h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p');

  if (header) {
    header.classList.add('section-divider-header');
  }

  if (subheader) {
    subheader.classList.add('section-divider-subheader');
  }

  if (desciption.length) {
    const descriptionWrapper = document.createElement('div');

    descriptionWrapper.append(...desciption);
    block.appendChild(descriptionWrapper);
  }
}
