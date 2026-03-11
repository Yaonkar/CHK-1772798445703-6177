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

const API_URL = "http://localhost:5000/api/scripts";

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

if (browseBtn && fileInput) {
  browseBtn.addEventListener("click", () => {
    fileInput.click();
  });
}

if (description && charCount) {
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
if (dropArea && fileInput) {
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
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message";
  formMessage.classList.add(type);
}

function resetProgress() {
  if (progressWrapper) progressWrapper.classList.add("hidden");
  if (progressFill) progressFill.style.width = "0%";
  if (progressText) progressText.textContent = "0%";
}

function startFakeProgress() {
  if (!progressWrapper || !progressFill || !progressText) return null;

  progressWrapper.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressText.textContent = "0%";

  let progress = 0;

  const interval = setInterval(() => {
    if (progress < 90) {
      progress += 10;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }
  }, 120);

  return interval;
}

function completeProgress(interval) {
  if (interval) clearInterval(interval);
  if (progressFill) progressFill.style.width = "100%";
  if (progressText) progressText.textContent = "100%";
}

if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title")?.value.trim();
    const category = document.getElementById("category")?.value;
    const desc = description?.value.trim();
    const terms = document.getElementById("terms")?.checked;
    const writerInput = document.getElementById("writer");
    const statusInput = document.getElementById("status");
    const tagsInput = document.getElementById("tags");
    const coverImageInput = document.getElementById("coverImage");

    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (!title || !category || !desc || !fileInput || fileInput.files.length === 0) {
      showMessage("Please fill all required fields and select a PDF file.", "error");
      return;
    }

    if (!terms) {
      showMessage("Please confirm the upload permission checkbox.", "error");
      return;
    }

    const pdfFile = fileInput.files[0];

    if (pdfFile.type !== "application/pdf") {
      showMessage("Only PDF files are allowed for script upload.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("writer", writerInput?.value.trim() || "Unknown Writer");
    formData.append("description", desc);
    formData.append("genre", category);
    formData.append("status", statusInput?.value || "open");
    formData.append("tags", tagsInput?.value.trim() || "");
    formData.append("scriptFile", pdfFile);

    if (coverImageInput && coverImageInput.files.length > 0) {
      formData.append("coverImage", coverImageInput.files[0]);
    }

    const progressInterval = startFakeProgress();

    try {
      showMessage("Uploading script to backend...", "success");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      completeProgress(progressInterval);
      showMessage("Script uploaded successfully.", "success");

      setTimeout(() => {
        window.location.href = "scripts.html";
      }, 1000);
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval);
      resetProgress();
      console.error("Upload error:", error);
      showMessage(error.message || "Could not upload content.", "error");
    }
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    selectedFile.textContent = "No file selected";
    resetProgress();
    if (charCount) charCount.textContent = "0 / 300";
    formMessage.textContent = "";
    formMessage.className = "form-message";
  });
}