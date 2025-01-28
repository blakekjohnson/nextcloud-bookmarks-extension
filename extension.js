let settingsVisible = false;

// Toggle between settings state
function toggleSettingsState() {
  settingsVisible = !settingsVisible;
  let updatedClassList = settingsVisible ? [] : [ "invisible" ];

  document.getElementById("settings-screen").classList = updatedClassList;
}

// Register button listeners
document
  .getElementById("settings-button")
  .addEventListener("click", toggleSettingsState);

