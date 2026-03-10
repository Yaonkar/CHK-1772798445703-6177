const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("file");
const browseBtn = document.getElementById("browseBtn");
const selectedFile = document.getElementById("selectedFile");
const formMessage = document.getElementById("formMessage");
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");
const progressWrapper = document.getElementById("progressWrapper");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const dropArea = document.getElementById("dropArea");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const resetBtn = document.getElementById("resetBtn");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

if (browseBtn) {
  browseBtn.addEventListener("click", () => {
    fileInput.click();
  });
}

if (description) {
  description.addEventListener("input", () => {
    charCount.textContent = `${description.value.length} / 300`;
  });
}

if (fileInput) {
  fileInput.addEventListener("change", () => {
    updateSelectedFile(fileInput.files);
  });
}

function updateSelectedFile(files) {
  if (files && files.length > 0) {
    selectedFile.textContent = `Selected: ${files[0].name}`;
  } else {
    selectedFile.textContent = "No file selected";
  }
}

/* Drag and drop */
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove("dragover");
  });
});

dropArea.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    updateSelectedFile(files);
  }
});

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message";
  formMessage.classList.add(type);
}

function simulateProgress(callback) {
  progressWrapper.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressText.textContent = "0%";

  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      callback();
    }
  }, 120);
}

if (uploadForm) {
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const desc = description.value.trim();
    const terms = document.getElementById("terms").checked;

    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (!title || !category || !desc || fileInput.files.length === 0) {
      showMessage("Please fill all required fields and select a file.", "error");
      return;
    }

    if (!terms) {
      showMessage("Please confirm the upload permission checkbox.", "error");
      return;
    }

    simulateProgress(() => {
      showMessage("Content uploaded successfully.", "success");
    });
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    selectedFile.textContent = "No file selected";
    progressWrapper.classList.add("hidden");
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    charCount.textContent = "0 / 300";
    formMessage.textContent = "";
    formMessage.className = "form-message";
  });
}