import { readBlockConfig } from '../../scripts/lib-franklin.js';

function getFormElement(fieldName, type = 'input') {
  return document.querySelector(`#contact ${type}[name=${fieldName}]`);
}

function addRequiredDiv(fieldName) {
  const requiredNode = document.createElement('div');
  requiredNode.innerText = fieldName.includes('email')
    ? 'A valid email address is required'
    : 'This field is required';
  requiredNode.classList.add('required-field');
  const fieldType = fieldName.includes('paragraph-text') ? 'textarea' : 'input';
  const pDiv = getFormElement(fieldName, fieldType).parentNode;
  if (pDiv.parentNode.children.length === 2) {
    pDiv.insertAdjacentElement('afterend', requiredNode);
  }
}

async function submitForm(form, endpoint) {
  const payload = {};
  const formFields = [...form];
  formFields.forEach((ff) => {
    if (ff.localName === 'button') return;
    const name = ff.name.includes('-')
      ? ff.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      : ff.name;
    payload[name] = ff.localName === 'select' ? ff.options[ff.selectedIndex].value : ff.value;
  });
  const action = endpoint.trim();
  const resp = await fetch(action, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  });
  if (resp.ok) {
    const block = document.querySelector('.contact-form.block');
    const thanksDiv = document.createElement('div');
    const thanks = document.createElement('p');
    thanks.className = 'thanks-title';
    thanks.innerText = 'THANK YOU!';
    const thanksCopy = document.createElement('p');
    thanksCopy.innerText = 'Your information has been submitted. Someone will be in touch with you shortly.';
    thanksCopy.className = 'thanks-text';
    thanksDiv.append(thanks);
    thanksDiv.append(thanksCopy);
    block.replaceWith(thanksDiv);
  }
}

async function validateForm(event, endpoint, form) {
  let valid = true;
  const configForm = {
    firstName: { required: true },
    lastName: { required: true },
    'email-address': { required: true, emailPattern: true },
    'paragraph-text': { required: true, type: 'textarea' },
  };
  const emailRegex = /^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm;
  event.preventDefault();

  Object.keys(configForm).forEach((fieldName) => {
    const type = configForm[fieldName].type ?? 'input';
    const { value } = getFormElement(fieldName, type);
    const { required, emailPattern } = configForm[fieldName];
    const isEmpty = required && value === '';
    const notEmail = emailPattern && !emailRegex.test(value);

    if (isEmpty || notEmail) {
      addRequiredDiv(fieldName);
      valid = false;
    }
  });

  if (valid) {
    await submitForm(form, endpoint);
  }
}

function fieldFocus(event) {
  const pDiv = event.currentTarget.parentNode.parentNode;
  if (pDiv.children.length > 2) {
    pDiv.children[2].remove();
  }
}

/**
 * decorate the contact form
 * @param {HTMLElement} block form element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.innerHTML = `
  <form id="contact">
    <div class="row">
      <div class="form-element col-left">
        <div class="required">First Name</div>
        <div><input type="text" name="firstName"/></div>
      </div>
      <div class="form-element col-right">
        <div class="required">Last Name</div>
        <div><input type="text" name="lastName"/></div>
      </div>
    </div>
    <div class="form-element picker">
      <div>Are you a dealer or a customer?</div>
      <div>
        <select name="dealer-customer">
          <option value="Dealer">Dealer</option>
          <option value="Customer">Customer</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
    <div class="form-element">
      <div>Phone</div>
      <div><input type="text" name="phone"/></div>
    </div>
    <div class="form-element">
      <div class="required">Email Address</div>
      <div><input type="text" name="email-address"/></div>
    </div>
    <div class="form-element question">
      <div class="required">How can we help you?</div>
      <div><textarea name="paragraph-text"></textarea></div>
    </div>
    <div class="form-element">
      <div><button type="submit"/>Submit</button></div>
    </div>
  </form>
  `;

  const form = block.querySelector('#contact');
  const inputs = block.querySelectorAll('#contact input');
  inputs.forEach((input) => {
    input.addEventListener('focus', fieldFocus);
  });

  const ta = block.querySelector('#contact textarea');
  ta.addEventListener('focus', fieldFocus);
  form.addEventListener('submit', (event) => validateForm(event, config.endpoint, form));
}
