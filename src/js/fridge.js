
// Meine Frigde-App am ist an einen Kühlschrank gebunden.Die Maße sind voreingestellt.
class Fridge {
    #fridgeVolume;
    #fridgeStorage = new Map();
    #shoppingList = new Map()

    constructor(newFridgeVolume = 100){
        this.#fridgeVolume = newFridgeVolume;
    }

    getFridgeVolume(){
        return this.#fridgeVolume;
    }
    getFridgeStorage(){
        return this.#fridgeStorage;
    }
    //Kompletter Speicher wird gelöscht und neu übergeben
    //Momentan einzig für Sortierung genutzt
    setFridgeStorage(newStorageContent){
        this.clearFridge();
        this.#fridgeStorage = newStorageContent;
    }
    getShoppingList(){
        return this.#shoppingList;
    }
    //?Methode zur Ermittlung der Anzahl (Integer) eingelagerter Produkte
    getContentQuantity(){
        let productArray = Array.from(this.#fridgeStorage.values());
        return productArray.reduce((acc, curr) => acc + curr.getStock(),0);
    }

    //?Methode zum Hinzufügen zur Einkaufsliste
    addToShoppingList(product){
        if (this.#shoppingList.has(product.getProductId())) {
            this.#shoppingList.get(product.getProductId()).amountOnShoppingList += 1;
        } else {
            this.#shoppingList.set(product.getProductId(), product);
            this.#shoppingList.get(product.getProductId()).amountOnShoppingList = 1;
        }
        let resultArray = Array.from(this.#shoppingList.values())
        return resultArray.reduce((acc, curr) => acc + curr.amountOnShoppingList, 0);
    }

    //?Methode zum Hinzufügen neuer Produkte
    addNewProduct(product){
        //Erstelle Prüfvariable
        let addedSuccessfully = false;
        //Erstelle Prüfzahl => Wie viel Platz ist nach dem Hinzufügen vorhanden?
        let volumeAfterAddition = this.residualCapacity() - product.getProductVolume();
        //Verbleibt genügend Platz? => true
        if (volumeAfterAddition >= 0) {
            for(const listedProduct of this.#fridgeStorage.values()){
                if(product.getProductName() === listedProduct.getProductName() && product.getExpirationDate() === listedProduct.getExpirationDate()){
                    //Erhöhe den Bestand
                    listedProduct.increaseStock();
                    return addedSuccessfully = true;
                }
            }
                //Hole die ID des Produktes um sie als Key der Map zu nutzen
                let productId = product.getProductId();
                //Befülle Map mit ID als Key und ProductObjekt als Value der Map
                this.#fridgeStorage.set(productId,product);
                //Setze Prüfvariable auf Erfolg - Early RETURN
                return addedSuccessfully = true;
        } else console.log("Nicht genügend Platz im Kühlschrank");//Verbleibt genügend Platz? => false => Console-Ausgabe 
        //Return false
        return addedSuccessfully;
    }

    //?Methode zur Ermittlung der bereits verbrauchten Kapazität
    getSpaceConsumption() {
        //Erstelle Summenvariable
        let usedStorage = 0;
        //Iteriere über alle Produkte und summiere deren Größe
        for (const product of this.#fridgeStorage.values()) {
            //Mulitipliziere das Volumen und dem Bestand und summiere
            usedStorage += (product.getProductVolume()*product.getStock());
        }
        //Zurückgegeben wird der aktuell verbrauchte Platz im KS  
        return usedStorage;
    }

    //?Methode zur Ermittlung der freien Kapazität (Restkapazität)
    residualCapacity() {
        //Direkter Zugriff auf die Klassenvariable
        let availableCapacity = this.#fridgeVolume;
        //Zugriff über Methode zur Ermittlung der bereits genutzten Kapzität 
        let usedCapacity = this.getSpaceConsumption();
        //Differenz zwischen verfügbarem und genutztem Speicher 
        return availableCapacity - usedCapacity;
    }

    //?Methode zum Entfernen vorhandener Produkte
    deleteProduct(productID){
        //Prüfe anhand ID ob Produkt im Storage
        if(this.#fridgeStorage.has(productID)){
            //Entferne Produkt
            this.#fridgeStorage.delete(productID);
        } else console.log(`Produkt nicht gefunden`);
        //Gebe den Speicher ohne gelöschtes Produkt wieder
        return this.#fridgeStorage;
    }

    //?Methode zum Entfernen aller vorhandenen Produkte
    clearFridge(){
        //Entferne kompletten Speicherinhalt
        this.#fridgeStorage.clear();
    }

    //?Methode die abgelaufene oder kurz vor Verfall stehende Produkte in einem Array speichert
    getExpiredProducts(when){
        // Importiere Map in ein Array
        let productArray = Array.from(this.#fridgeStorage.values());
        let searchedProducts = [];
        productArray.forEach(product => {
            //Prüfe je nach Kriterium und füge ins Result-Array ein
            if(product.isExpired(when)) searchedProducts.push(product.toText())
        });
        //Gebe Array mit Produkten und deren Informationen zurück
        return searchedProducts;
    }

    //? Eine Methode zum Sortieren der Produkte nach Ablaufdatum
    sortbyExpDate(){
        // Importiere Map in ein Array        
        let productArray = Array.from(this.#fridgeStorage.values());
        productArray.sort((a,b) => new Date(a.getExpirationDate()) - new Date(b.getExpirationDate()));
        const temp = new Map(
            productArray.map(object => {
              return [object.getProductId(), object];
            }),
        );
        //Tausche unsortierten gegen sortierten Inhalt aus
        this.setFridgeStorage(temp);
    }

    //?Methode um Produkte anhand der Kategorie zu filtern
    filterByCategory(query){
        //Map to Array
        let productArray = Array.from(this.#fridgeStorage.values());
        //Filtere nach Kategorie
        let filteredArray =  productArray.filter(product => product.getCategory() === query);
        //Array to Map
        return new Map(
            filteredArray.map(product => {
              return [product.getProductId(), product];
            }),
        );
    }

    //?Methode zum Entfernen aller abgelaufenen Produkte
    deleteExpiredProducts(){
        //Iteriere über alle Produkte im Kühlschrank
        this.#fridgeStorage.forEach(product => {
            //Prüfe jedes Produkt ob Mindesthaltbarkeit überschritten
            //Falls Mindesthaltbarkeit überschritten => nutze bereits geschriebene Methoden
            if (product.isExpired()) this.deleteProduct(product.getProductId());
        });
    }

    //?Methode zur Ermittlung des Produktes (derProdukte!) mit dem kleinsten Volumen 
    lowestProductCapacityConsumption(){
        let lowCapaProducts = [];
        //Iteriere über Kühlschrankinhalt
        for (const product of this.#fridgeStorage.values()) {
            //Füge Produkte mit dem kleinsten Platzverbrauch hinzu
            if(product.getProductVolume() === this.getMinCapa())lowCapaProducts.push(product.toText());
        }
        return lowCapaProducts;
    }

    //?Methode zur Ermittlung des Produktes (derProdukte!) mit dem größten Volumen
    highestProductCapacityConsumption(){
        let highCapaProducts = [];
        //Iteriere über Kühlschrankinhalt
        for (const product of this.#fridgeStorage.values()) {
            //Füge Produkte mit dem höchsten Platzverbrauch hinzu
            if(product.getProductVolume() === this.getMaxCapa())highCapaProducts.push(product.toText());
        }
        return highCapaProducts;
    }

    /*-----Hilfsmethoden----- O(1) < O(log(n)) < O(n) < O(n*log(n)) < O(n^2) < O(2^n) < O(n!)*/
    //Gibt die geringste Verbrauchseinheit aller im Kühlschrank befindlichen Produkte zurück 
    getMinCapa() {
        // Importiere Map in ein Array        
        let productArray = Array.from(this.#fridgeStorage.values());
        //Finde den kleinsten PLatzverbrauch
        let minA = productArray.reduce((a,b)=>a.getProductVolume()<b.getProductVolume()?a:b).getProductVolume(); // 30 chars time complexity:  O(n) 
        let minB = Math.min(...productArray.map(x => x.getProductVolume())); // 26 chars time complexity: >O(2n)
        let minC = productArray.sort((a,b)=>a.getProductVolume()-b.getProductVolume())[0].getProductVolume(); // 27 chars time complexity:  O(nlogn)
        return minA;
    }

    //Gibt die höchste Verbrauchseinheit aller im Kühlschrank befindlichen Produkte zurück 
    getMaxCapa(){
        // Importiere Map in ein Array
        let productArray = Array.from(this.#fridgeStorage.values());
        //Finde den höchsten Platzverbrauch
        let maxA = productArray.reduce((a,b)=>a.getProductVolume()>b.getProductVolume()?a:b).getProductVolume(); // 30 chars time complexity:  O(n)
        let maxB = Math.max(...productArray.map(x => x.getProductVolume())); // 26 chars time complexity: >O(2n)
        let maxC = productArray.sort((a,b)=>b.getProductVolume()-a.getProductVolume())[0].getProductVolume(); // 27 chars time complexity:  O(nlogn) 
        return maxA;
    }
}


export default Fridge;