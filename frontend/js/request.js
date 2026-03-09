const requestForm = document.getElementById("requestForm");
const requestMessageBox = document.getElementById("requestMessageBox");

requestForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const projectTitle = document.getElementById("projectTitle").value.trim();
  const creatorName = document.getElementById("creatorName").value.trim();
  const roleNeeded = document.getElementById("roleNeeded").value;
  const projectDescription = document.getElementById("projectDescription").value.trim();
  const requestMessage = document.getElementById("requestMessage").value.trim();

  if (!projectTitle || !creatorName || !roleNeeded || !projectDescription || !requestMessage) {
    requestMessageBox.style.color = "#fca5a5";
    requestMessageBox.textContent = "Please fill in all required fields.";
    return;
  }

  requestMessageBox.style.color = "#86efac";
  requestMessageBox.textContent = "Collaboration request sent successfully.";

  requestForm.reset();
});