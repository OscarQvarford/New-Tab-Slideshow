const nameInput = document.getElementById('name-input');
const backgroundInput = document.getElementById('background-input');
const backgroundForm = document.getElementById('background-form');
const backgroundFormTitle = document.getElementById('background-form-title');
const labels = document.getElementsByTagName('label');

let backgroundMode = 'add';

// Change from add/remove setting on click

window.addEventListener('click', (e) => {
  if (e.target.className.includes('inactive')) {

    // Setting backgroundMode to the currently displayed settings menu

    backgroundMode = e.target.id;

    // Toggling the class 'inactive' on the menu items

    (e.target.nextSibling !== null) ?
      (e.target.nextSibling.classList.toggle('inactive'),
      labels[0].style.visibility = 'visible') :
      (e.target.parentNode.firstChild.classList.toggle('inactive'),
      labels[0].style.visibility = 'hidden');
    e.target.classList.toggle('inactive');

    // Setting the setting description text

    backgroundFormTitle.innerHTML = (e.target.id === 'add') ?
      'Add background' :
      'Remove background by name';
  }
}, true);

let storageFiles = JSON.parse(localStorage.getItem('storageFiles')) || {};

console.log(Object.keys(storageFiles));
console.log(storageFiles);

// On form submission, update local storage, variables

backgroundForm.addEventListener('submit', (e) => {

  console.log(Object.keys(storageFiles));
  console.log(storageFiles);

  e.preventDefault();

  // In add setting mode

  if (backgroundMode === 'add') {

    // Creating new image, filereader to get the raw image data

    const image = new Image();
    const reader = new FileReader();

    // Getting the data

    reader.onload = (e) => image.src = e.target.result;
    reader.readAsDataURL(backgroundInput.files[0]);

    // Try and update storageFiles object and store it in local storage,
    // calling function to update values
    // If storageFiles exceeds the local storage quota,
    // then reset the storageFiles object

    image.onload = () => {
      const backgroundData = {
        img: image.src
      }

      try {
        storageFiles[nameInput.value] = backgroundData;
        localStorage.setItem('storageFiles', JSON.stringify(storageFiles));
        clearInterval(slideInterval);
        updateValues();
      }
      catch(err) {
        storageFiles = JSON.parse(localStorage.getItem('storageFiles')) || {};
        console.log('Local storage error: ' + err);
      }
    }
  }

  // In remove setting mode

  // Delete the property of which the image wished to be removed is contained
  // Updating local storage and calling function to update values

  else {
    delete storageFiles[nameInput.value];
    localStorage.setItem('storageFiles', JSON.stringify(storageFiles));
    clearInterval(slideInterval);
    updateValues();
  }
}, false);

// The function changing the background source,
// called in intervals

const changeBackground = () => {
  index = (index != fileNames.length - 1) ? index + 1 : 0;
  background.src = blurredBackground.src = storageFiles[fileNames[index]].img;
}

const background = document.getElementById('background');
const blurredBackground = document.getElementById('blurred-background');
const list = document.getElementById('list');
let index, fileNames, slideInterval;

// Updating and calling all necessary variables and functions

const updateValues = () => {
  index = 0;
  fileNames = Object.keys(storageFiles);

  // If there are images to display, then it will start changeBackground()
  // Else, it will set the source of the background images to an
  // empty string

  if (fileNames.length) {
    changeBackground();
    slideInterval = setInterval(changeBackground, 5000);
  } else background.src = blurredBackground.src = '';

  // Emptying list before reapplying new values to it

  list.innerHTML = '';
  for (let prop in storageFiles) {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = prop;
    list.appendChild(item);
  }
}
updateValues();
