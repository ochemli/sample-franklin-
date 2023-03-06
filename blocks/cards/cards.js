import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function hideModal(evt) {
  evt.target.classList.remove('show-modal');
}

function playVideo(evt) {
  const playDiv = evt.target.parentNode.parentNode.querySelector('.modal');
  playDiv.addEventListener('click', hideModal);
  playDiv.classList.add('show-modal');
}
function createVimeoModals(elm) {
  const anchors = elm.querySelectorAll('a');
  anchors.forEach((anc) => {
    // put the play icon over the image preview
    const play = document.createElement('div');
    play.setAttribute('data-toggle', 'modal');
    play.classList.add('play', 'fade');
    anc.parentNode.previousElementSibling.append(play);
    play.addEventListener('click', playVideo);
    // create modal div w/vimeo video
    const videoNode = document.createElement('div');
    const videoIframe = document.createElement('iframe');
    videoIframe.setAttribute('width', '560');
    videoIframe.setAttribute('height', '315');
    videoIframe.setAttribute('loading', 'lazy');
    videoIframe.src = anc.href;
    videoIframe.setAttribute('allowfullscreen', '');
    videoNode.classList.add('modal');
    videoNode.append(videoIframe);
    anc.parentNode.parentNode.append(videoNode);
    anc.parentNode.remove();
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  createVimeoModals(ul);
  block.append(ul);
}
