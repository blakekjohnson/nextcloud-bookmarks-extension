let activeScreen = "SEARCH";

let nextcloudDomain = null;
let nextcloudUsername = null;
let nextcloudToken = null;

const LOCAL_STORAGE_KEYS = {
  domain: "mnb-domain",
  username: "mnb-username",
  token: "mnb-token",
};

// Toggle between search page state
function setSearchScreenActive() {
  document.getElementById("search-screen").classList = [];
  document.getElementById("settings-screen").classList = [ "invisible" ];

  document.getElementById("search-page-button").disabled = true;
  document.getElementById("settings-page-button").disabled = false;
}

// Toggle between settings page state
function setSettingsScreenActive() {
  document.getElementById("settings-screen").classList = [];
  document.getElementById("search-screen").classList = [ "invisible" ];

  document.getElementById("settings-page-button").disabled = true;
  document.getElementById("search-page-button").disabled = false;
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

  let unencryptedToken = 
    `${nextcloudUsername}:${document.getElementById("nextcloud-password")}`;
  document.getElementById("nextcloud-password").value = null;
  nextcloudToken = btoa(unencryptedToken);

  localStorage.setItem(LOCAL_STORAGE_KEYS.token, nextcloudToken);
}

// Update settings button
function updateNextcloudSettings() {
  saveNextcloudSettings();
  loadNextcloudSettings();
}

// Search bookmarks
function searchNextcloudBookmarks() {
  let query = document.getElementById("nextcloud-search").value;

  console.log(nextcloudToken);
  window
    .fetch(`${nextcloudDomain}/index.php/apps/bookmarks/public/rest/v2/bookmark?search=${query}`, {
      headers: {
        "Authorization": `basic ${nextcloudToken}`,
      },
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

// On launch load Nextcloud settings from storage
loadNextcloudSettings();

// Register button listeners
document
  .getElementById("search-page-button")
  .addEventListener("click", setSearchScreenActive);
document
  .getElementById("settings-page-button")
  .addEventListener("click", setSettingsScreenActive);
document
  .getElementById("settings-update-button")
  .addEventListener("click", updateNextcloudSettings);
document
  .getElementById("nextcloud-search-button")
  .addEventListener("click", searchNextcloudBookmarks);

