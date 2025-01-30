const ALL_SCREENS = {
  "LIST": "list",
  "SETTINGS": "settings",
};

let activeScreen = ALL_SCREENS.LIST;

let nextcloudDomain = null;
let nextcloudUsername = null;
let nextcloudToken = null;

const BASE_PATH = "index.php/apps/bookmarks/public/rest/v2/bookmark";

const LOCAL_STORAGE_KEYS = {
  domain: "mnb-domain",
  username: "mnb-username",
  token: "mnb-token",
};

async function setActiveScreen(newActiveScreen) {
  Object
    .keys(ALL_SCREENS)
    .forEach(async  (screen) => {
      await updateScreen(ALL_SCREENS[screen], newActiveScreen == screen);
    });
}

async function updateScreen(screenName, state) {
  if (screenName == ALL_SCREENS.LIST && state) {
    await loadBookmarkList();
  }

  document.getElementById(`${screenName}-screen`).classList = state ? [] : [ "invisible" ];
  document.getElementById(`${screenName}-screen-button`).disabled = state;
}

// Load Nextcloud settings from storage
function loadNextcloudSettings() {
  nextcloudDomain = localStorage.getItem(LOCAL_STORAGE_KEYS.domain);
  nextcloudUsername = localStorage.getItem(LOCAL_STORAGE_KEYS.username);
  nextcloudToken = localStorage.getItem(LOCAL_STORAGE_KEYS.token);

  document.getElementById("nextcloud-domain").value = nextcloudDomain;
  document.getElementById("nextcloud-username").value = nextcloudUsername;
}

// Save Nextcloud settings to storage
function saveNextcloudSettings() {
  nextcloudDomain = document.getElementById("nextcloud-domain").value;
  nextcloudUsername = document.getElementById("nextcloud-username").value;

  localStorage.setItem(LOCAL_STORAGE_KEYS.domain, nextcloudDomain);
  localStorage.setItem(LOCAL_STORAGE_KEYS.username, nextcloudUsername);

  let nextcloudPassword = document.getElementById("nextcloud-password").value;
  document.getElementById("nextcloud-password").value = null;
  nextcloudToken = btoa(nextcloudUsername + ":" + nextcloudPassword);

  localStorage.setItem(LOCAL_STORAGE_KEYS.token, nextcloudToken);
}

// Update settings button
function updateNextcloudSettings() {
  saveNextcloudSettings();
  loadNextcloudSettings();
}

// Get all bookmarks for given user
async function getAllBookmarks() {
  let endpoint = `${nextcloudDomain}/${BASE_PATH}?page=-1`;

  let rawResponse = await window.fetch(endpoint, {
    "Authorization": `Basic ${nextcloudToken}`,
    "Accepts": "application/json",
  });

  let responseJson = await rawResponse.json();

  return responseJson.data;
}

// Create element for given bookmark
function createBookmarkElement(bookmark) {
  let el = document.createElement("li");
  el.innerHTML =
    `<a href=${bookmark.url}>${bookmark.title}</a>`;

  return el;
}

async function loadBookmarkList() {
  document.getElementById("bookmark-list").replaceChildren([]);
  let bookmarks = await getAllBookmarks();
  bookmarks
    .forEach((bookmark) => {
      let bookmarkElement = createBookmarkElement(bookmark);
      document
        .getElementById("bookmark-list")
        .appendChild(bookmarkElement);
    });
}

// On launch load Nextcloud settings from storage
loadNextcloudSettings();

// Register button listeners
Object
  .keys(ALL_SCREENS)
  .forEach((screen) => {
    document
      .getElementById(`${ALL_SCREENS[screen]}-screen-button`)
      .addEventListener("click", async () => {
        await setActiveScreen(screen);
      });
  });

document
  .getElementById("settings-update-button")
  .addEventListener("click", updateNextcloudSettings);

window.addEventListener("load", async function () {
  loadBookmarkList();
})

