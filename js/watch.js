const urlParams = new URLSearchParams(window.location.search);
const filmId = urlParams.get("id");

async function loadFilm() {

  try {

    const response = await fetch(`http://localhost:5000/api/films/${filmId}`);

    const film = await response.json();

    document.getElementById("filmTitle").textContent = film.title;

    document.getElementById("creatorName").textContent =
      "Creator: " + film.creatorName;

    document.getElementById("filmDescription").textContent =
      film.description;

    document.getElementById("videoSource").src =
      "http://localhost:5000/uploads/" + film.videoFile;

    document.getElementById("videoPlayer").load();

  } catch (error) {

    console.error("Error loading film:", error);

  }

}

loadFilm();