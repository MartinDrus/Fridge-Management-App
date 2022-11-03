import createNewProductCard from "./_createNewProductCard.js";
import renderProgressBar from "./_renderProgressBar.js";
import { fridge } from "./main.js";

// Referenz auf Produkte-Container
const fridgeProductsContainer = document.querySelector('#fridge-products-container');
//!----------- Output ----------- */
//Hole Ausgabefeld für Anzahl der Produkte im Kühlschrank
const productAmount = document.querySelector("#products-amount-span");
//Hole Ausgabefeld für freie Kühlschrank Kapazität
const freeCapacity = document.querySelector("#fridge-free-capacity-span");
//Hole Ausgabefeld für Anzahl der Produkte, die bereits abgelaufen sind
const expiredProducts = document.querySelector("#products-expired-span");
//Hole Ausgabefeld für Anzahl der Produkte, die morgen ablaufen
const expiresTomorrowProducts = document.querySelector("#products-until-tomorrow-span");
//Hole Ausgabefeld für die Anzahl der kleinsten Produkte
const amountOfSmallestProducts = document.querySelector("#smallest-product-span");
//Hole Ausgabefeld für die Anzahl der größten Produkte
const amountOfLargestProducts = document.querySelector("#biggest-product-span");

export function renderFridge(storage) {
    //Starte Neuberechnung des Kühlschrank-Volumens
    renderProgressBar(() => fridge.getSpaceConsumption())
    // alles löschen replaceChildren
    fridgeProductsContainer.replaceChildren();
    //Prüfe ob der Kühlschrankspeicher Einträge hat
    if (storage !== undefined && storage.size !== 0) {
        //schleife übers storage
        for (const product of storage.values()) {
            //Erstelle neue produktcard
            let card = createNewProductCard(product, () => fridge.deleteProduct(product.getProductId()), () => fridge.addToShoppingList(product));
            //Anzahl der Produkte im Kühlschrank
            productAmount.innerHTML = fridge.getContentQuantity();
            //freie Kühlschrank Kapazität
            freeCapacity.innerHTML = fridge.residualCapacity();
            //Anzahl der Produkte, die bereits abgelaufen sind
            expiredProducts.innerHTML = fridge.getExpiredProducts().length;
            //Anzahl der Produkte, die morgen ablaufen;
            expiresTomorrowProducts.innerHTML = fridge.getExpiredProducts("tomorrow").length;
            //Anzahl der kleinsten Produkte
            amountOfSmallestProducts.innerHTML = fridge.lowestProductCapacityConsumption().length;
            //Anzahl der größten Produkte
            amountOfLargestProducts.innerHTML = fridge.highestProductCapacityConsumption().length;
            //?hänge neue productCard an container an (fridgeProductsContainer)
            fridgeProductsContainer.appendChild(card);
        }
    } else {
        console.log("Prüfe das Hinzufügen / fridgeStorage leer");
        //Anzahl der Produkte im Kühlschrank
        productAmount.innerHTML = 0;
        //freie Kühlschrank Kapazität
        freeCapacity.innerHTML = fridge.getFridgeVolume();
        //Anzahl der Produkte, die bereits abgelaufen sind
        expiredProducts.innerHTML = 0;
        //Anzahl der Produkte, die morgen ablaufen;
        expiresTomorrowProducts.innerHTML = 0;
        //Anzahl der kleinsten Produkte
        amountOfSmallestProducts.innerHTML = 0;
        //Anzahl der größten Produkte
        amountOfLargestProducts.innerHTML = 0;
    }
}

export default renderFridge;