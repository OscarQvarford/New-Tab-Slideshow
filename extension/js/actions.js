let userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};

if (userPreferences.searchBar === undefined) userPreferences.searchBar = true;
if (userPreferences.searchEngine === undefined) userPreferences.searchEngine = 'Google';
if (userPreferences.searchBarPosition === undefined) userPreferences.searchBarPosition = 'middle';

const searchBar = document.getElementById('search-bar');
searchBar.value = '';

searchBar.addEventListener('focus', function() {
  this.placeholder = '';
});
searchBar.addEventListener('focusout', function() {
  this.placeholder = 'Search ' + userPreferences.searchEngine;
});

const settingTab = document.getElementsByClassName('setting-tab');
const backgroundSettingsTab = document.getElementsByClassName('background-settings-tab');
const backgroundSettings = document.getElementById('background-settings');
const generalSettings = document.getElementById('general-settings');

settingTab[0].addEventListener('click', function() {
  generalSettings.style.display = 'none';
  backgroundSettings.style.display = 'block';
});

settingTab[1].addEventListener('click', function() {
  backgroundSettings.style.display = 'none';
  generalSettings.style.display = 'block';
});

const dropDown = document.getElementsByClassName('drop-down');
const dropDownItems = document.getElementsByClassName('item');
function setSearchEngine() {
  let searchEngines = ['Bing', 'DuckDuckGo', 'Ecosia', 'Google'];
  dropDown[0].innerHTML = userPreferences.searchEngine;
  searchBar.placeholder = 'Search ' + userPreferences.searchEngine;
  searchEngines.splice(searchEngines.indexOf(userPreferences.searchEngine), 1);

  for (let i = 0; i < searchEngines.length; i++) {
    dropDownItems[i].firstChild.innerHTML = searchEngines[i];
  }
  localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}
setSearchEngine();

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(e) {
  e.preventDefault();
  console.log('submitted');
  if (searchBar.value != '') {
    let searchValue = searchBar.value.replace(/ /g, "+");
    if (userPreferences.searchEngine !== 'DuckDuckGo') {
      window.location.href = 'http://' + userPreferences.searchEngine.toLowerCase() + '.com/search?q=' + searchValue;
    } else {
      window.location.href = 'http://duckduckgo.com/?q=' + searchValue;
    }
  }
});

const settings = document.getElementById('settings');
const settingsButton = document.getElementById('settings-button');
const exitButton = document.getElementById('exit');
settingsButton.addEventListener('click', function() {
  settings.style = 'display: block; opacity: 1;';
});

exit.addEventListener('click', function() {
  settings.style = 'display: none; opacity: 0;';
});

let clickedSearchEngine;

settings.addEventListener('click', function(e) {
  if (e.target.className.includes('dark-mode')) {
    setUserPreferences(false, 'darkMode');
  } else if (e.target.className.includes('search-bar')) {
    setUserPreferences(false, 'searchBar');
  } else if (e.target.className.includes('search-engine')) {
    if (e.target.className === 'search-engine') {
      userPreferences.searchEngine = e.target.innerHTML;
    } else {
      userPreferences.searchEngine = e.target.firstChild.innerHTML;
    }
    setSearchEngine();
  } else if (e.target.className.includes('search_bar-top')) {
    setUserPreferences(false, 'searchBarTop');
  } else if (e.target.className.includes('search_bar-middle')) {
    setUserPreferences(false, 'searchBarMiddle');
  }
});

console.log(userPreferences);


const bar = document.getElementsByClassName('bar');
const circle = document.getElementsByClassName('circle');

const searchCover = document.getElementById('search-cover');

const searchButton = document.getElementById('search-button');
const selectionButtonOutline = document.getElementsByClassName('selection-button-outline');
const selectionButton = document.getElementsByClassName('selection-button');

const setUserPreferences = (onStartUp, change) => {
  const enableDarkMode = () => {
    bar[0].style.backgroundColor = '#30304D';
    circle[0].style.marginLeft = '32px';
    document.body.style.backgroundColor = '#171717';
    document.documentElement.style.setProperty('--theme-color-1', '#1E1F27');
    document.documentElement.style.setProperty('--theme-color-2', '#1F1F1F');
    document.documentElement.style.setProperty('--theme-color-3', '#0F0F0F');
    document.documentElement.style.setProperty('--theme-text-color-1', '#FFFFFF');
    document.documentElement.style.setProperty('--theme-text-color-2', '#E4E4E4');
    if (!onStartUp) userPreferences.darkMode = true;
  }
  const disableDarkMode = () => {
   bar[0].style.backgroundColor = '#DEDEDE';
   circle[0].style.marginLeft = '2px';
   document.body.style.backgroundColor = '#EDEDED';
   document.documentElement.style.setProperty('--theme-color-1', '#FFFFFF');
   document.documentElement.style.setProperty('--theme-color-2', '#FAFAFA');
   document.documentElement.style.setProperty('--theme-color-3', '#C8C8C8');
   document.documentElement.style.setProperty('--theme-text-color-1', '#000000');
   document.documentElement.style.setProperty('--theme-text-color-2', '#505050');
   if (!onStartUp) userPreferences.darkMode = false;
  }

  const enableSearchBar = () => {
    bar[1].style.backgroundColor = '#30304D';
    circle[1].style.marginLeft = '32px';
    searchCover.style.display = 'none';
    searchBar.style.display = searchButton.style.display = 'block';
    if (!onStartUp) userPreferences.searchBar = true;
  }
  const disableSearchBar = () => {
    bar[1].style.backgroundColor = '#DEDEDE';
    circle[1].style.marginLeft = '2px';
    searchCover.style.display = 'block';
    searchBar.style.display = searchButton.style.display = 'none';
    if (!onStartUp) userPreferences.searchBar = false;
  }

  const searchBarTop = () => {
    selectionButtonOutline[0].style.borderColor = selectionButton[0].style.backgroundColor = '#30304D';
    selectionButtonOutline[1].style.borderColor = selectionButton[1].style.backgroundColor = '#C8C8C8';
    searchBar.style.top = searchButton.style.top = '0';
    searchBar.style.marginTop = searchButton.style.marginTop = '40px';
    if (!onStartUp) userPreferences.searchBarPosition = 'top';
  }
  const searchBarMiddle = () => {
    selectionButtonOutline[1].style.borderColor = selectionButton[1].style.backgroundColor = '#30304D';
    selectionButtonOutline[0].style.borderColor = selectionButton[0].style.backgroundColor = '#C8C8C8';
    searchBar.style.top = searchButton.style.top = '50%';
    searchBar.style.marginTop = searchButton.style.marginTop = '-40px';
    if (!onStartUp) userPreferences.searchBarPosition = 'middle';
  }

  switch (change) {
    case 'darkMode':
      if (userPreferences.darkMode !== true) enableDarkMode();
      else disableDarkMode();
      break;
    case 'searchBar':
      if (userPreferences.searchBar !== true) enableSearchBar();
      else disableSearchBar();
      break;
    case 'searchBarTop':
      searchBarTop();
      break;
    case 'searchBarMiddle':
      searchBarMiddle();
      break;
    default:
      userPreferences.darkMode ? enableDarkMode() : disableDarkMode();
      userPreferences.searchBar ? enableSearchBar() : disableSearchBar();
      (userPreferences.searchBarPosition === 'top') ? searchBarTop() : searchBarMiddle();
  }
  localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}
setUserPreferences(true);
