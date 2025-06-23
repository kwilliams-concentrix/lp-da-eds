import { isMobile } from '../header/header.js';

/**
 * Renders a feature column programmatically.
 * @param {Number} columnNumber The column number used in the class name.
 * @returns Markup for a feature column.
 */
const createFeatureColumn = (columnNumber) => {
  const col = document.createElement('div');
  col.classList.add('menu-col', `col-${columnNumber}`);

  // create a submenu list
  const submenuList = document.createElement('ul');

  const listItem = document.createElement('li');
  listItem.classList.add('submenu-category');

  // const container = document.createElement('div');
  // container.classList.add('container');

  submenuList.appendChild(listItem);
  // listItem.appendChild(container);
  col.appendChild(submenuList);

  return col;
};

/**
 * Renders the feature description text programmatically.
 * @param {*} descriptionNode The description text to be displayed.
 * @param {*} col The target column where the description will be appended.
 */
const createFeatureDescription = (descriptionNode, col) => {
  if (descriptionNode.children.length > 0) {
    const feature_description = descriptionNode.children[0].textContent.trim();
    const p = document.createElement('p');
    p.classList.add('feature-description');
    p.textContent = feature_description;
    col.querySelector('.feature-title').after(p);
  }
};

/**
 * Renders the feature image programmatically.
 * @param {*} imageNode The feature image node from the Adobe EDS row.
 * @param {*} col The target column where the feature image will be appended.
 */
const createFeatureImage = (imageNode, col) => {
  if (imageNode.children.length > 0) {
    const featureImage = imageNode.children[0];
    featureImage.classList.add('feature-image');
    col.querySelector('.feature-description').after(featureImage);
  }
};

/**
 * Renders the title link programmatically. Renders a submenu of links, if present.
 * @param {*} linksNode The link element for the feature title.
 * @param {*} col The target column where the feature title will be appended.
 */
const createFeatureLinks = (linksNode, col) => {
  const titleLink = document.createElement('a');
  [...linksNode.firstElementChild.children].forEach((child) => {
    [...child.children].forEach((elem) => {
      if (elem.tagName === 'A') {
        // if the child is a link, add it to the column
        titleLink.classList.add('feature-title');
        titleLink.href = elem.href;
        titleLink.textContent = elem.textContent.trim();
        col.querySelector('.submenu-category').append(titleLink);
      }

      if (elem.tagName === 'UL') {
        // if there is a submenu, add an arrow to the parent link
        const arrowRight = document.createElement('span');
        arrowRight.classList = 'arrow-right';
        arrowRight.innerHTML = `<img src="../icons/chevron-right.svg" alt="test" />`;
        titleLink.appendChild(arrowRight);

        // append the submenu to the parent
        col.querySelector('.submenu-category').append(elem);
      }
    });
  });
};

/**
 * Builds a navigation submenu by iterating through the table rows and transforming the markup.
 * @param {*} block The component block code to be extrapolated and transformed
 */
export default function decorate(block) {
  block.id = 'site-nav';

  // submenu wrapper
  const submenu = document.createElement('div');
  submenu.classList.add('submenu-wrapper');
  submenu.addEventListener('mouseleave', (e) => {
    if (!isMobile()) {
      e.target.parentElement.classList.remove('show');
    }
  });

  // submenu content container
  const container = document.createElement('div');
  container.classList.add('container');
  submenu.appendChild(container);

  // top-level menu items
  const navDrop = document.createElement('div');
  navDrop.classList.add('nav-drop');
  navDrop.addEventListener('mouseenter', (e) => {
    document.querySelectorAll('#nav .show').forEach((el) => {
      el.classList.remove('show');
    });
    e.target.parentElement.classList.add('show');
  });
  navDrop.addEventListener('click', (e) => {
    e.preventDefault();
  });

  const col_1 = createFeatureColumn(1);
  const col_2 = createFeatureColumn(2);
  const col_3 = createFeatureColumn(3);

  // render the submenu
  const rows = [...block.children];
  rows.map((row) => {
    // separate the key and value columns
    const [key, value] = [...row.children];

    // normalize the key
    const rowKey = key.textContent.trim().toLowerCase();

    // create the section title column
    if (rowKey === 'submenu title') {
      const sectionLink = value.children[0].querySelector('a');
      const sectionName = sectionLink.textContent.trim();

      const titleContainer = document.createElement('div');
      titleContainer.classList.add('container', 'title-container');
      submenu.prepend(titleContainer);
      const col = document.createElement('div');
      col.classList.add('menu-col', 'section-title-col');

      // create the section title element
      const sectionTitle = document.createElement('div');
      sectionTitle.classList.add('section-title');
      sectionTitle.textContent = sectionName;
      col.appendChild(sectionTitle);
      titleContainer.appendChild(col);
    }

    const submenuList = document.createElement('ul');
    const listItem = document.createElement('li');
    submenuList.appendChild(listItem);

    // submenu title
    if (rowKey === 'submenu title') {
      const submenuLink = value.firstElementChild.firstElementChild;
      const submenuTitle = submenuLink.textContent.trim();
      const navLink = document.createElement('a');

      if (submenuTitle.length > 0) {
        navLink.classList.add('nav-link');
        navLink.href = submenuLink.href;
        navLink.setAttribute('title', submenuTitle);
        navLink.textContent = submenuTitle;
      }

      navDrop.append(navLink);

      // add arrow
      const arrowRight = document.createElement('span');
      arrowRight.classList = 'arrow-right';
      arrowRight.innerHTML = `<img src="../icons/chevron-right.svg" alt="test" />`;
      navLink.appendChild(arrowRight);
    }

    // Feature 1 column
    if (rowKey === 'feature 1 links') {
      if (value.children.length > 0) {
        createFeatureLinks(value, col_1);
      }
    }

    if (rowKey === 'feature 1 description') {
      if (value.children.length > 0) {
        createFeatureDescription(value, col_1);
      }
    }

    if (rowKey === 'feature 1 image') {
      if (value.children.length > 0) {
        createFeatureImage(value, col_1);
      }
    }

    // Feature 2 column
    if (rowKey === 'feature 2 links') {
      if (value.children.length > 0) {
        createFeatureLinks(value, col_2);
      }
    }

    if (rowKey === 'feature 2 description') {
      if (value.children.length > 0) {
        createFeatureDescription(value, col_2);
      }
    }

    if (rowKey === 'feature 2 image') {
      if (value.children.length > 0) {
        createFeatureImage(value, col_2);
      }
    }

    // Feature 3 column
    if (rowKey === 'feature 3 links') {
      if (value.children.length > 0) {
        createFeatureLinks(value, col_3);
      }
    }

    if (rowKey === 'feature 3 description') {
      if (value.children.length > 0) {
        createFeatureDescription(value, col_3);
      }
    }

    if (rowKey === 'feature 3 image') {
      if (value.children.length > 0) {
        createFeatureImage(value, col_3);
      }
    }

    // append columns to the container
    container.appendChild(col_1);
    container.appendChild(col_2);
    container.appendChild(col_3);
  });

  block.innerHTML = '';
  block.appendChild(navDrop);
  block.appendChild(submenu);
}
