//Referenz auf den Title-Container im Modal
let modalTitle = document.querySelector("#exampleModalLabel");
//Referenz auf den Container im Modal
let modalBody = document.querySelector(".modal-body");

export function renderModalInfoPanel(title, callbackArrayFkt) {
  modalBody.replaceChildren();
  //Füge den übergebenen String als Titel hinzu
  modalTitle.innerHTML = title;

  //Erstelle einen Container mit Bootstrap-Klasse für die Auflistung
  let listContainer = document.createElement("ul");
  listContainer.classList.add("list-group");
  modalBody.appendChild(listContainer);
  //Prüfe ob das übergebene Array leer ist
  if (callbackArrayFkt().length > 0) {
    //Da nicht leer => Erstelle für jedes Listenelement einen Listenpunkt
    callbackArrayFkt().forEach((element) => {
      let listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.innerText = element;
      //Hänge für jedes Element einen Listenpunkt an
      listContainer.appendChild(listItem);
    });
  } else {
    //Da Liste leer ist => Erstelle einen Punkt mit dieser Meldung
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    if (title.trim() === "Until tomorrow") {
      listItem.innerText = `No products expire tomorrow`;
    } else {
      listItem.innerText = `No ${title.toLowerCase()}`;
    }
    listContainer.appendChild(listItem);
  }
}

export default renderModalInfoPanel;
