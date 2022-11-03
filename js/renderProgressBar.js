//Hole Referenz auf den Container der Progressbar
let progressBarContainer = document.querySelector(".progress");

export function renderProgressBar(spaceConsumption) {
  progressBarContainer.replaceChildren();
  //Extrahiere das Gesamtvolumen
  let usedStorage = spaceConsumption();

  //?Erstelle die Befüllungsanzeige
  let progressBar = document.createElement("div");
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-label", "Used fridge volume");
  //Setze Minimum
  progressBar.setAttribute("aria-valuemin", "0");
  //Aktuell
  progressBar.style = `width: ${usedStorage}%;`;
  progressBar.setAttribute("aria-valuenow", `${usedStorage}`);
  //Setze Maximum
  progressBar.setAttribute("aria-valuemax", "100");
  progressBar.innerText = `${usedStorage}%`;
  //Füge den Container hinzu
  progressBarContainer.appendChild(progressBar);

  //?Setze Klassen für Farbänderung abhängig vom Gesamtvolumen
  switch (true) {
    case usedStorage < 8:
      progressBar.classList.add(
        "bg-danger",
        "progress-bar-striped",
        "progress-bar-animated",
        "progress-bar"
      );
      break;
    case usedStorage >= 8 && usedStorage < 25:
      progressBar.classList.add("progress-bar");
      break;
    case usedStorage >= 25 && usedStorage < 50:
      progressBar.classList.add("progress-bar", "bg-info");
      break;
    case usedStorage >= 50 && usedStorage < 75:
      progressBar.classList.add("progress-bar", "bg-warning");
      break;
    case usedStorage >= 75 && usedStorage < 95:
      progressBar.classList.add("progress-bar", "bg-danger");
      break;
    case usedStorage >= 95:
      progressBar.classList.add(
        "bg-danger",
        "progress-bar-striped",
        "progress-bar-animated",
        "progress-bar"
      );
      break;
  }
}

export default renderProgressBar;
