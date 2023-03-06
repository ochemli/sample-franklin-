import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  await decorateIcons(footer);
  const lcol = document.createElement('div');
  lcol.classList.add('footer-lcol');
  const mcol = document.createElement('div');
  mcol.classList.add('footer-mcol');
  const rcol = document.createElement('div');
  rcol.classList.add('footer-rcol');
  const parent = footer.querySelector('div > div');
  parent.classList.add('footer-nav');
  const lcolNav = footer.querySelector('div > div > ul');
  lcol.append(lcolNav);
  const mcolNav = footer.querySelector('div > div > p');
  mcol.append(mcolNav);
  const rcolNav = footer.querySelector('div > div > p');
  rcol.append(rcolNav);
  parent.append(lcol, mcol, rcol);
  block.append(footer);
}
