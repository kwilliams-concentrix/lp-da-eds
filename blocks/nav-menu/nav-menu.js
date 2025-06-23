/**
 * Builds a navigation submenu by iterating through the table rows and transforming the markup.
 * @param {*} block The component block code to be extrapolated and transformed
 */

import { isMobile, highlightedLinks } from '../header/header.js';

export default function decorate(block) {
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

  // render the submenu
  const rows = [...block.children];
  rows.map((row, i) => {
    // separate the key and value columns
    const [key, value] = [...row.children];

    // build the first column
    const col = document.createElement('div');
    col.classList.add('menu-col');

    if (i === 0) {
      // handle the first column
      [...value.children].map((row, rowIndex) => {
        if (rowIndex === 0) {
          // handle the section title and additional elements
          [...value.children].forEach((elem, elemIndex) => {
            if (elemIndex === 0) {
              const sectionLink = value.children[0].querySelector('a');
              const sectionName = sectionLink.textContent.trim();

              block.setAttribute('data-section-name', sectionName);

              // create the section title element
              const sectionTitle = document.createElement('div');
              sectionTitle.classList.add('section-title');
              sectionTitle.textContent = sectionName;
              col.appendChild(sectionTitle);

              // create nav menu link
              const navLink = document.createElement('a');
              navLink.href = sectionLink.href;
              navLink.classList.add('nav-link');
              navLink.title = sectionName;
              navLink.textContent = sectionName;

              // if section name is in array, add highlight class
              if (highlightedLinks.includes(sectionName)) {
                navLink.classList.add('highlight');
              }

              // navDrop.classList.add('TOP-LEVEL-SUBMENU');
              navDrop.appendChild(navLink);

              // add arrow
              const arrowRight = document.createElement('span');
              arrowRight.classList = 'arrow-right';
              arrowRight.innerHTML = `<img src="../icons/chevron-right.svg" alt="test" />`;
              navLink.appendChild(arrowRight);
            } else {
              // transfer additional elements to the section title column
              col.appendChild(elem);
            }

            // append first column to the container
            container.appendChild(col);
          });
        }
      });
    } else {
      // handle subsequent columns
      // separate the key and value columns
      const [key, value] = [...row.children];

      // new column container
      const col = document.createElement('div');

      if (value.children.length > 0) {
        col.classList.add('menu-col');
      } else {
        col.classList.add('menu-col', 'empty');
      }

      // mark columns with images
      if (value.querySelectorAll('img').length > 0) {
        col.classList.add('image-content');
      }

      const submenuList = document.createElement('ul');
      const listItem = document.createElement('li');
      submenuList.appendChild(listItem);

      // add all children from the current row
      [...value.children].map((child) => {
        [...child.children].map((elem) => {
          if (elem.children.length === 1) {
            [...elem.childNodes].map((node) => {
              const li = document.createElement('li');

              if (node.nodeType === 3) {
                const textNodeContent = node.textContent.trim();
                if (textNodeContent.length > 0) {
                  const paragraph = document.createElement('p');
                  paragraph.textContent = textNodeContent;
                  li.appendChild(paragraph);
                }
              } else {
                li.appendChild(node);
              }
              submenuList.appendChild(li);
            });
          }

          // if child has submenu
          if (elem.children.length > 1) {
            // loop through children
            [...elem.children].map((childElem) => {
              // link
              if (childElem.tagName === 'A') {
                // take apart and rebuild link
                const childLink = childElem;

                if (childElem.nextElementSibling.tagName === 'UL') {
                  childLink.classList.add('nav-link');
                }

                // add arrow
                const arrowRight = document.createElement('span');
                arrowRight.classList = 'arrow-right';
                arrowRight.innerHTML = `<img src="../icons/chevron-right.svg" alt="test" />`;
                childLink.appendChild(arrowRight);

                listItem.appendChild(childLink);
              }

              // list
              if (childElem.tagName === 'UL') {
                listItem.classList.add('submenu-category');
                listItem.appendChild(childElem);
              }

              // paragraph
              if (childElem.tagName === 'P') {
                col.appendChild(childElem);
              }

              // picture
              if (childElem.tagName === 'PICTURE') {
                col.appendChild(childElem);
              }
            });
          }

          // append processed markup
          col.appendChild(submenuList);
        });
      });

      // append column to the container
      container.appendChild(col);
    }
  });

  block.innerHTML = '';
  block.appendChild(navDrop);
  block.appendChild(submenu);
}
