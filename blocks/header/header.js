import { decorateIcons, decorateButtons, getMetadata } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const MQ = window.matchMedia('(min-width: 992px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && MQ.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!MQ.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function setupKeyboardAttributes(navDrops) {
  if (!MQ.matches) {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
    return;
  }

  navDrops.forEach((drop) => {
    if (!drop.hasAttribute('tabindex')) {
      drop.setAttribute('role', 'button');
      drop.setAttribute('tabindex', 0);
      drop.addEventListener('focus', focusNavSection);
    }
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || MQ.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  setupKeyboardAttributes(navDrops);
  const { addEventListener: add, removeEventListener: remove } = window;
  const listener = !expanded || MQ.matches ? add : remove;
  // collapse menu on escape press
  listener.bind(window)('keydown', closeOnEscape);
}

function addMQListener(nav, navSection, navSections) {
  navSection.addEventListener('click', () => {
    if (!MQ.matches) {
      const expanded = navSection.getAttribute('aria-expanded') === 'true';
      toggleAllNavSections(navSections);
      navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    }
  });
}

function cleanAnchorNavTags(navLis) {
  navLis.forEach((li) => {
    const navLink = li.querySelector('a');
    const { hash } = new URL(navLink.href);
    navLink.setAttribute('href', hash);
  });
}

function addSectionsId(sections) {
  sections.forEach((tag) => { tag.id = tag.dataset.id; });
}

function setActiveLink(navLinks, hash = window.location.hash) {
  const activeLink = navLinks.filter((li) => {
    const { hash: aHash } = li.firstChild;
    return aHash === hash;
  });
  const link = hash !== '' ? activeLink[0] : navLinks[0];
  if (link) {
    link.classList.add('active');
  }
}

function removeActiveClass(navLinks) {
  navLinks.forEach((li) => {
    li.classList.remove('active');
  });
}

function setNavUnderline(sections, navLinks) {
  const options = { threshold: 0.2 };
  const callback = (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting, target } = entry;
      if (isIntersecting) {
        removeActiveClass(navLinks);
        setActiveLink(navLinks, `#${target.id}`);
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);

  sections.forEach((section) => observer.observe(section));
}

function addScrollListener(block) {
  window.onscroll = () => {
    block.classList.toggle('transparent', window.scrollY <= 70);
  };
}

function reRenderLoginBtn(loginBtn) {
  const btnContainer = loginBtn.children[0];
  const button = btnContainer.children[0];
  const btnContainerClass = 'button-container';
  window.onresize = () => {
    const isDecorated = btnContainer.classList.contains(btnContainerClass);
    if (MQ.matches && !isDecorated) {
      btnContainer.className = btnContainerClass;
      button.setAttribute('title', 'LOGIN');
      button.className = 'button';
    } else if (!MQ.matches && isDecorated) {
      btnContainer.removeAttribute('class');
      button.removeAttribute('title');
      button.removeAttribute('class');
    }
  };
}

function addActiveClassListener(navLinks) {
  const navUl = navLinks[0].parentElement;
  const loginBtn = navUl.querySelector('.button');
  navUl.onclick = (e) => {
    const { tagName } = e.target;
    if (tagName !== 'A' || e.target === loginBtn) return;
    removeActiveClass(navLinks);
    e.target.parentElement.classList.add('active');
  };
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) return;
  const html = await resp.text();
  block.classList.toggle('transparent', MQ.matches && window.scrollY <= 70);

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;

  const classes = ['brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const navLis = navSections.querySelectorAll(':scope > ul > li');
    const navLinks = [...navLis].slice(0, -1);
    const sections = document.querySelectorAll('[data-id]');
    if (MQ.matches) {
      decorateButtons(navSections);
      addScrollListener(block);
    }
    [...navLis].at(-1).querySelector('a').target = '_blank';
    reRenderLoginBtn([...navLis].at(-1));
    cleanAnchorNavTags(navLinks);
    addSectionsId(sections); // for anchor tag navigation
    setActiveLink(navLinks);
    setNavUnderline(sections, navLinks);

    navLis.forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      addMQListener(nav, navSection, navSections);
    });
    // add onclick to change active class
    addActiveClassListener(navLinks);

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, MQ.matches);
    MQ.addEventListener('change', () => toggleMenu(nav, navSections, MQ.matches));
  }

  decorateIcons(nav);
  block.append(nav);
}
