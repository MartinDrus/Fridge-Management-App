
// Import der Produkt Klasse aus der externen Datei
import Product from "./product.js";
// Import der in der Main erzeugten Fridge-Instanz
import { fridge } from "./main.js";
// Import der Funktion für die GUI Ausgaben
import renderFridge from "./renderFridge.js";

//Referenz auf die CheckBox Custom-Exp-Date
let checkboxCustomDate = document.querySelector("#custom-expdate-preset-input");

// Referenz auf Input für die Category des neuen Produkts
const addProductCategoryInput = document.querySelector('#form-select-product-category');
// Referenz auf Input für Name des neuen Produkts
const addProductNameInput = document.querySelector('#form-add-product-name');
// Referenz auf Input für Volumen des neuen Produkts
const addProductVolInput = document.querySelector('#form-add-product-volume');
// Referenz auf Input für Ablaufdatum des neuen Produkts
const addProductExpDateInput = document.querySelector('#form-add-product-exp-date');

// Referenz auf Button für Bestätigung des neuen Produkts
const addProductSubmitBTN = document.querySelector('#btn-add-product');
// Referenz auf Button für die Kategorie Filterung
const searchBTN = document.querySelector("#search-product-category-btn");

//! Import aller Preset-Button
const presets = document.querySelectorAll(".preset-class")

//Funktion läuft über alle Presets und extrahiert den den Text des HTML-Tags
export function renderPreset(){
    presets.forEach(preset => {
        preset.addEventListener("click", presetEvent => {
            let htmlTagName = presetEvent.target.innerText;
            createPreset(htmlTagName);
        });
    });
}

// Use this Numbers to choose a category:
// -Beverages = 0
// -Dairy Products = 1
// -Vegetables = 2
// -Animal Products = 3
// -Spread = 4
// -Sauces = 5
function createPreset(productName) {

    let categoryNumber
    let productVolume;
    let daysTilExpiry;

    switch (productName.toLowerCase()) {
        case "salami":
            categoryNumber = 3;
            productVolume = 2;
            daysTilExpiry = 21;
            break;
        case "cheese":
            categoryNumber = 1;
            productVolume = 1;
            daysTilExpiry = 12;
            break;
        case "milk":
            categoryNumber = 1;
            productVolume = 3;
            daysTilExpiry = 90;
            break;
        case "yogurt":
            categoryNumber = 1;
            productVolume = 1;
            daysTilExpiry = 12;
            break;
        case "broccoli":
            categoryNumber = 2;
            productVolume = 3;
            daysTilExpiry = 3;
            break;
        case "zucchini":
            categoryNumber = 2;
            productVolume = 2;
            daysTilExpiry = 12;
            break;
        case "carrots":
            categoryNumber = 2;
            productVolume = 2;
            daysTilExpiry = 9;
            break;          
        case "eggs":
            categoryNumber = 3;
            productVolume = 2;
            daysTilExpiry = 9;
            break;
        case "butter":
            categoryNumber = 1;
            productVolume = 2;
            daysTilExpiry = 120;
            break;
        case "jam":
            categoryNumber = 4;
            productVolume = 2;
            daysTilExpiry = 90;
            break;
        case "eggplants":
            categoryNumber = 2;
            productVolume = 2;
            daysTilExpiry = 9;
            break;
        case "cucumber":
            categoryNumber = 2;
            productVolume = 2;
            daysTilExpiry = 4;
            break;
        case "sausage":
            categoryNumber = 3;
            productVolume = 2;
            daysTilExpiry = 3;
            break;
        case "fish":
            categoryNumber = 3;
            productVolume = 2;
            daysTilExpiry = 1;
            break;
        case "wine":
            categoryNumber = 0;
            productVolume = 3;
            daysTilExpiry = 1;
            break;
        case "juice":
            categoryNumber = 0;
            productVolume = 3;
            daysTilExpiry = 12;
            break;
        default:
            break;
    }

    let name = productName;
    //Hole die Kategoriebezeichung aus dem Input-Select
    let productCategory = addProductCategoryInput.children[categoryNumber].innerText;

    if (checkboxCustomDate.checked) {
        //Name und Volumen werden automatisch befüllt
        addProductNameInput.value = productName;
        addProductVolInput.value = productVolume;

        //Erstelle eine vordefinierte Option für das Kategoriefeld und hänge diese an
        let selectedOption = document.createElement("option");
        selectedOption.selected = true;
        selectedOption.innerText = productCategory;
        addProductCategoryInput.appendChild(selectedOption);

        //Sobald das Datum eingetragen wurde => Aktiviere Add-BTN
        addProductExpDateInput.addEventListener("input", date => {
            if (date.target.value.length === 10) addProductSubmitBTN.disabled = false;//Aktiviere Add-Button
        });
        
    } else {
        // Erzeuge sofot ein neues Produkt ohne den Add-BTN
        let productDesignation = new Product(name, productCategory, productVolume,"-");
        productDesignation.setExpirationDate(daysTilExpiry);
        if (fridge.addNewProduct(productDesignation)) {
            renderFridge(fridge.getFridgeStorage());
            //Aktiviere Suchfeld
            searchBTN.disabled = false;
        }
    }
}

export default renderPreset;






