
// Defining all essential static DOM elements

const background = document.getElementById('background');
const blurredBackground = document.getElementById('blurred-background');
const list = document.getElementById('list');
const nameInput = document.getElementById('name-input');
const backgroundInput = document.getElementById('background-input');
const backgroundForm = document.getElementById('background-form');
const backgroundFormTitle = document.getElementById('background-form-title');
const labels = document.getElementsByTagName('label');

// Defining necessary variables

let index, fileNames, slideTimeout;

// Saving all image data stored in local storage to the storageFiles object.

let storageFiles = JSON.parse(localStorage.getItem('storageFiles')) || {};
console.log(storageFiles);

// Trying to update storageFiles object and store it in local storage,
// calling function to update values
// If storageFiles exceeds the local storage quota,
// then reset the storageFiles object

const updateStorage = () => {
  try {
    localStorage.setItem('storageFiles', JSON.stringify(storageFiles));
    clearTimeout(slideTimeout);
    updateValues();
  }
  catch(err) {
    storageFiles = JSON.parse(localStorage.getItem('storageFiles')) || {};
    console.log(`Local storage error: ${err}`);
  }
}

// Changing the background source, called in intervals from updateValues()

const changeBackground = () => {
  console.log('running ' + storageFiles[fileNames[index]].time);
  index = (index !== fileNames.length - 1) ? index + 1 : 0;
  background.src = blurredBackground.src = storageFiles[fileNames[index]].img;
  slideTimeout = setTimeout(changeBackground, storageFiles[fileNames[index]].time);
}

// Updating and calling all necessary variables and functions

const updateValues = () => {

  // Assigning an array of the properties inside of storageFiles

  fileNames = Object.keys(storageFiles);

  // Setting index to a random integer between 0 and the length of fileNamse,
  // thus the background will start on a random background image

  index = Math.floor(Math.random() * fileNames.length);

  // Emptying list before reapplying new values to it

  list.innerHTML = '';
  for (let prop in storageFiles) {
    if (storageFiles[prop].time === undefined) storageFiles[prop].time = 5000;
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <p class="item-name">${prop}</p>
      <form class="${prop} background-time">
        <input type="number" min="0" value="${storageFiles[prop].time / 1000}" placeholder="Seconds shown">
      </form>
      <div class="${prop} item-remove"></div>
    `;
    list.appendChild(item);
  }

  // If there are images to display, then it will start changeBackground()
  // Else, it will set the source of the background images to an empty string

  if (fileNames.length) changeBackground();
  else background.src = blurredBackground.src = '';

}
updateValues();

// Defining backgroundMode which will be used to indicate which setting section
// is being displayed

let backgroundMode = 'add';

// Switching between the add/remove setting section on click

window.addEventListener('click', (e) => {

  if (e.target.className.includes('inactive')) {

    // Setting backgroundMode to the currently displayed settings menu

    backgroundMode = e.target.id;

    // Toggling the class 'inactive' between the menu items so it becomes
    // feasible to change between the 'add' menu and the 'remove'

    if (e.target.nextSibling !== null) {
      e.target.nextSibling.classList.toggle('inactive');
      labels[0].style.visibility = 'visible';
    } else {
      e.target.parentNode.firstChild.classList.toggle('inactive')
      labels[0].style.visibility = 'hidden';
    }
    e.target.classList.toggle('inactive');

    // Setting the setting description text

    backgroundFormTitle.innerHTML = (e.target.id === 'add') ?
      'Add background' :
      'Remove background by name';
  }

  if (e.target.classList.item(1) === 'item-remove') {
    delete storageFiles[e.target.classList.item(0)];
    updateStorage();
  }

}, true);

// On form submission, update local storage, variables

window.addEventListener('submit', (e) => {

  e.preventDefault();

  if (e.target.id === 'background-form') {

    // In add setting mode

    if (backgroundMode === 'add') {

      // Creating new image, filereader to get the raw image data

      const image = new Image();
      const reader = new FileReader();

      // Getting the data

      reader.onload = (e) => image.src = e.target.result;
      reader.readAsDataURL(backgroundInput.files[0]);

      // When the image has finished loading save the raw image data inside
      // the backgroundData object, then assign it to a property of storageFiles
      // named the given name of the image

      image.onload = () => {
        const backgroundData = {
          img: image.src
        }
        storageFiles[nameInput.value] = backgroundData;

        updateStorage();

      }
    }

    // In remove setting mode

    // Delete the property of which the image wished to be removed is contained
    // Updating local storage with the updated storageFiles object if it does
    // not exceed to quota

    else {
      delete storageFiles[nameInput.value];
      updateStorage();
    }

  }

}, false);

window.addEventListener('input', function(e) {
  if (e.target.parentNode.classList.item(1) === 'background-time') {
    const secondsShown = (parseInt(e.target.value) >= 1) ?
      parseInt(e.target.value) :
      e.target.value = 5;
    storageFiles[e.target.parentNode.classList.item(0)].time = secondsShown * 1000;
    updateStorage();
  }
});
