//! ----------- IMPORTS ----------- */
//?Import von Klassen
// Import der Kühlschrank Klasse aus der externen Datei
import Fridge from "./fridge.js";
// Import der Produkt Klasse aus der externen Datei
import Product from "./product.js";
//?Import von Funktionen
// Import der Funktion für die GUI Ausgaben
import renderFridge from "./renderFridge.js";
// Import der Funktion für das Modal
import renderModalInfoPanel from "./renderModalInfoPanel.js";
// Import der Funktion für das Modal
import renderModalShoppingList from "./renderModalShoppingList.js";
// Import der Funktion für die Presets
import renderPreset from "./renderPresets.js";
/* -------------------------------------- */
//Die Instanz der Kühlschrank-Klasse
export const fridge = new Fridge();
//!----------- TEST SECTION ----------- */

console.log("HALOOOOOOO");

// let eier = new Product("Eier","ceec", 1, "2022-11-03");
// let milch = new Product("Milch", 3, "2023-3-15");
// let milch1 = new Product("Milch", 3, "2023-3-15");

// let käse = new Product("Käse", 3, "2022-10-27");
// let brokkoli = new Product("brokkoli", 2, "2022-10-28");
// let brokkoli1 = new Product("Brokkoli", 2, "2022-10-28");
// let brokkoli2 = new Product("brokkoli", 2, "2022-10-29");

////--------------------------------------------------------------------
//!----------- PRODUCT INPUT ----------- */
// Referenz auf Input für Name des neuen Produkts
const addProductNameInput = document.querySelector('#form-add-product-name');
// Referenz auf Input für die Category des neuen Produkts
const addProductCategoryInput = document.querySelector('#form-select-product-category');
// Referenz auf Input für Volumen des neuen Produkts
const addProductVolInput = document.querySelector('#form-add-product-volume');
// Referenz auf Input für Ablaufdatum des neuen Produkts
const addProductExpDateInput = document.querySelector('#form-add-product-exp-date');
// Referenz auf Button für Bestätigung des neuen Produkts
const addProductSubmitBTN = document.querySelector('#btn-add-product');
// Referenz auf Button für die Kategorie Filterung
const searchBTN = document.querySelector("#search-product-category-btn");

//!----------- ENABLE ADD BTN ----------- */
addProductNameInput.addEventListener("input", evt => {
    //Wenn das Namensfeld befüllt => nächste Abfrage
    if (evt.target.value.trim().length > 0) {
        addProductExpDateInput.addEventListener("input", evt => {
            //Sind Namen und Datum eingtragen => aktiviere
            if (evt.target.value.trim().length === 10) {
                addProductSubmitBTN.disabled = false;// aktiviere Button
            } else addProductSubmitBTN.disabled = true;
        });
    } else addProductSubmitBTN.disabled = true;
});



//!----------- ADD PRODUCT ----------- */
//?Reagiere auf den Add-Button für Produktaufnahme
addProductSubmitBTN.addEventListener("click", evt =>{
    let name = addProductNameInput.value;
    let category = addProductCategoryInput.value;
    let volume = addProductVolInput.value;
    let date = addProductExpDateInput.value;
    //Erstelle Produktinstanz 
    let newProduct = new Product(name, category, volume, date);
        //Wenn das Hinzufügen erfolgreich ist => renderFridge
        if (fridge.addNewProduct(newProduct)) {
            renderFridge(fridge.getFridgeStorage());
            //Aktiviere Suchfeld
            searchBTN.disabled = false;
        } 
    //Lösche die Eingabe aus dem Inputfeld
    addProductNameInput.value ="";
    addProductVolInput.value = 1;
    addProductExpDateInput.value ="";
    //Setze Cursor auf das Namensfeld
    addProductNameInput.focus();
    addProductSubmitBTN.disabled = true;
});

////--------------------------------------------------------------------
//!-------------------------------------- */
//Button zum Entfernen aller abgelaufenen Produkte aus dem Kühlschrank
const deleteAllExpiredBTN = document.querySelector("#clean-fridge-btn");
//Button zum Entfernen aller Produkte
const deleteALLProductsBTN = document.querySelector("#remove-all-products-btn");
//Button um den Kühlschrankinhalt (nach MHD) zu sortieren
const sortBestBeforeDateBTN = document.querySelector("#sort-products-by-exp-date-btn");
//Button um die Einkaufsliste anzuzeigen
const showShoppingList = document.querySelector("#show-shopping-list-btn");

//!----------- DELETE ----------- */
//? DEFROST - Entferne ALLE Produkte
deleteALLProductsBTN.addEventListener("click", evt => {
    fridge.clearFridge();
    renderFridge(fridge.getFridgeStorage());
    searchBTN.disabled = true;
});

//!-------- DELETE BY DATE -------- */
//? ABGELAUFEN - Entferne alle abgelaufenen Produkte
deleteAllExpiredBTN.addEventListener("click", evt =>{
    fridge.deleteExpiredProducts();
    renderFridge(fridge.getFridgeStorage());
});

//!----------- SORT ----------- */
//? SORTIERE - Sortiere Produkte nach Ablaufdatum
sortBestBeforeDateBTN.addEventListener("click", evt => {
    fridge.sortbyExpDate()
    renderFridge(fridge.getFridgeStorage());
});

//!----------- SHOPPING LIST ----------- */
//? SHOPPINGLIST - Erstelle die Liste
showShoppingList.addEventListener("click", evt => {
    renderModalShoppingList(fridge.getShoppingList());
});

//!----------- SEARCH ----------- */
searchBTN.addEventListener("click", evt => {
    const querySelector = document.querySelector("#search-select-product-category");
    let searchQuery = querySelector.children[querySelector.value].innerText;

    if (parseInt(querySelector.value) === 0) {
        renderFridge(fridge.getFridgeStorage());
    } else {
        let filteredMap = fridge.filterByCategory(searchQuery);
        renderFridge(filteredMap);
    }
});

////--------------------------------------------------------------------
//!----------- PRESETS ----------- */
renderPreset();
////--------------------------------------------------------------------
//!----------- INFO PANEL BTN----------- */
// Referenz auf Button für die Auflistung kleiner Produkte
let smallestProductBtn = document.querySelector("#smallest-product-btn");
// Referenz auf Button für die Auflistung größen Produkte
let biggestProductsBtn = document.querySelector("#biggest-product-btn");
// Referenz auf Button für die Auflistung aller abgelaufenen Produkte
let productsExpiredBtn = document.querySelector("#products-expired-btn");
// Referenz auf Button für die Auflistung aller Produkte, die morgen ablaufen
let productsUntilTomorrowBtn = document.querySelector("#products-until-tomorrow-btn");
//!----------- CLICK HANDLER MODAL ----------- */
//!-----------------SMALLEST-------------------- */
smallestProductBtn.addEventListener("click", evt => {
    let temp = smallestProductBtn.parentElement.innerText;
    let modalTitle = temp.substring(0,temp.length-1);
    renderModalInfoPanel(modalTitle, () => fridge.lowestProductCapacityConsumption());
});

//!-----------------BIGGEST--------------------- */
biggestProductsBtn.addEventListener("click", evt => {
    let elementTitle = biggestProductsBtn.parentElement.innerText;
    let modalTitle = elementTitle.substring(0,elementTitle.length-1);
    renderModalInfoPanel(modalTitle, () => fridge.highestProductCapacityConsumption());
});

//!-----------------EXPIRED------------------ */
productsExpiredBtn.addEventListener("click", evt => {
    let elementTitle = productsExpiredBtn.parentElement.innerText;
    let modalTitle = elementTitle.substring(0,elementTitle.length-1);
    renderModalInfoPanel(modalTitle, () => fridge.getExpiredProducts());
});

//!----------------UNTIL TOMORROW--------------------- */
productsUntilTomorrowBtn.addEventListener("click" , evt => {
    let elementTitle = productsUntilTomorrowBtn.parentElement.innerText;
    let modalTitle = elementTitle.substring(0,elementTitle.length-1);
    renderModalInfoPanel(modalTitle, () => fridge.getExpiredProducts("tomorrow"));
});
