function updateSlide(index, carousel) {
  const item = carousel.children[index];
  const left = item.offsetLeft + item.offsetWidth / 2
    - (item.parentNode.offsetLeft + item.parentNode.offsetWidth / 2);
  carousel.scrollTo({ top: 0, left, behavior: 'smooth' });
}

const setIncrement = (direction, amount, lenght) => {
  let increment = amount;
  if (direction === 'next') {
    increment = (increment === lenght - 1) ? increment = 0 : increment += 1;
  } else if (direction === 'prev') {
    increment = (increment === 0) ? increment = lenght - 1 : increment -= 1;
  }
  return increment;
};

export default function decorate(block) {
  const carouselChildren = [...block.children];

  const gridContainer = document.createElement('ul');
  gridContainer.classList.add('carousel-list');

  block.appendChild(gridContainer);

  carouselChildren.forEach((e) => {
    gridContainer.appendChild(e);
    e.outerHTML = `<li class="item">${e.innerHTML}</li>`;
  });

  const carouselItems = block.querySelectorAll('ul > li');

  carouselItems.forEach((li) => {
    // Add wrapper around the content
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('wrapper');
    contentContainer.innerHTML = li.innerHTML;
    li.innerHTML = '';
    li.append(contentContainer);
  });

  // create carousel controls
  const controlsContainer = document.createElement('ul');
  controlsContainer.classList.add('carousel-controls');

  const controlNext = document.createElement('li');
  controlNext.classList.add('carousel-control-next');
  const controlPrev = document.createElement('li');
  controlPrev.classList.add('carousel-control-prev');

  const iconNext = document.createElement('img');
  iconNext.src = '../../icons/chevron-left.svg';
  iconNext.classList.add('prev');
  const iconPrev = document.createElement('img');
  iconPrev.src = '../../icons/chevron-right.svg';
  iconPrev.classList.add('next');

  controlNext.append(iconNext);
  controlPrev.append(iconPrev);

  controlsContainer.appendChild(controlNext);
  controlsContainer.appendChild(controlPrev);

  gridContainer.parentNode.append(controlsContainer);

  const controlItems = block.querySelectorAll('ul.carousel-controls > li');

  let amount = 0;

  controlItems.forEach((controlItem) => {
    controlItem.addEventListener('click', (e) => {
      const direction = e.target.classList.value;
      const carouselParent = e.target.closest('.carousel');
      const clickedCarousel = carouselParent.querySelector('.carousel-list');
      const carouselLength = clickedCarousel.children.length;

      amount = setIncrement(direction, amount, carouselLength);
      updateSlide(amount, clickedCarousel);
    });
  });
}
