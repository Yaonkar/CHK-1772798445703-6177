const requestForm = document.getElementById("requestForm");
const requestMessageBox = document.getElementById("requestMessageBox");

if (requestForm) {
  requestForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const projectTitle = document.getElementById("projectTitle").value.trim();
    const creatorName = document.getElementById("creatorName").value.trim();
    const roleNeeded = document.getElementById("roleNeeded").value;
    const deadline = document.getElementById("deadline").value.trim();
    const projectDescription = document.getElementById("projectDescription").value.trim();
    const requestMessage = document.getElementById("requestMessage").value.trim();

    const token = localStorage.getItem("token");

    if (!projectTitle || !creatorName || !roleNeeded || !projectDescription || !requestMessage) {
      requestMessageBox.style.color = "#fca5a5";
      requestMessageBox.textContent = "Please fill in all required fields.";
      return;
    }

    requestMessageBox.style.color = "#ffffff";
    requestMessageBox.textContent = "Sending request...";

    try {
      const response = await fetch("http://localhost:5000/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          projectTitle,
          creatorName,
          roleNeeded,
          deadline,
          projectDescription,
          requestMessage
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      requestMessageBox.style.color = "#86efac";
      requestMessageBox.textContent = data.message || "Collaboration request sent successfully.";

      requestForm.reset();

    } catch (error) {
      requestMessageBox.style.color = "#fca5a5";
      requestMessageBox.textContent = error.message || "Server error";
      console.log(error);
    }
  });
}