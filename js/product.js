
class Product {
    #id = this.generateRandomId();
    #stock = 1;
    #name;
    #category;
    #productVolume;
    #expirationDate;
    #addToListWhenExpires = false;
    constructor(name, category, productVolume, expirationDate){
        this.#name = name;
        this.#category = category;
        this.#productVolume = parseInt(productVolume);
        this.#expirationDate = expirationDate;
    }
    //// GETTER / SETTER--
    getProductId(){
        return this.#id;
    }
    //!----
    getStock(){
        return this.#stock;
    }
    increaseStock(){
        this.#stock += 1;
    }
    //!----
    getProductName(){
        let formattedName = this.#name.at(0).toUpperCase()+this.#name.substring(1).toLowerCase();
        return formattedName;
    }
    //!----
    getCategory(){
        return this.#category;
    }
    setCategory(newCategory){
        this.#category = newCategory;
    }
    //!----
    getProductVolume(){
        return this.#productVolume;
    }
    //!----
    getExpirationDate(){
        return this.#expirationDate;
    }
    /* Methode, die eine im Parameter übergebene Zahl an Tagen auf das heutige Datum aufaddiert 
    und als formatierten String zurück gibt */
    setExpirationDate(days){
        //Rufe aktuellen Zeitstempel auf
        let date = new Date();
        //Extrahiere den heutigen Tag des Monats
        let dayOfMonth = date.getDate();
        //Summiere gültige Tage auf den heutigen Tag auf
        date.setDate(dayOfMonth+(days-1))
        //Weise formatiertes neues Ablaufdatum dem Produkt zu 
        this.#expirationDate = date.toISOString().substring(0,10);
    }
    //!----
    getPath(){
        return `./img/foodIcons/${this.#name.toLowerCase()}.png`
    }
    //!----
    getAltTag(){
        return `Picture of ${this.#name}`
    }
    getAddToList(){
        return this.#addToListWhenExpires;
    }
    setAddToList(isChecked){
        this.#addToListWhenExpires = isChecked;
    }
    //// METHODEN--
    //Methode zur Ermittlung ob Ablaufdatum überschritten wird oder ist 
    /* der Methode können folgende Argumente übergeben werden:
    - "tomorrow" && "1" => Produkte die morgen ablaufen
    - 2 => Produkte die morgen ÜBERablaufen
    - WICHTIG => wird nichts übergeben als Parameter übergeben, also: .isExpired() 
    => Produkte die das MHD bereits überschritten haben
    */
    isExpired(when){
        //Ein Tag in Millisekunden
        const ONE_DAY = 1000*60*60*24;
        // Das Ablaufdatum des Produktes
        let expirationDate = new Date(this.#expirationDate);
        // Das aktuelle Datum
        let now = new Date()
        // Setze Uhrzeiten beider Zeitstempel gleich
        expirationDate.setHours(0,0,0,0);
        now.setHours(0,0,0,0);
        // Nutze als Case im Fall vom Argument "tomorrow" die Tatsache, dass das MHD nur morgen ablaufen kann wenn es heute erreicht wurde 
        switch (when) {        
            case "tomorrow":
                //console.log("Difference "+(expirationDate.getTime()-now.getTime())+" now  "+now.getTime()+"   product "+ expirationDate.getTime());
                return expirationDate.getTime() === now.getTime();
            case 1:
                return expirationDate.getTime() === ONE_DAY+now.getTime();
            case 2:
                return expirationDate.getTime() <= (ONE_DAY*when)+now.getTime();
            case 3:
                return expirationDate.getTime() <= (ONE_DAY*when)+now.getTime();
            default: 
                return now.getTime() > expirationDate.getTime();
        }
    }
    // Hilfsfunktion zum Erstellen von Produkt IDs
    generateRandomId() {
        // getTime() = milliseconds since Jan 1, 1970, 00:00:00.000 GMT
        // getTime() = 13 Stellen + eine Zufallszahl zwischen 1 und 100000
        return new Date().getTime() + Math.floor(Math.random() * 100000 + 1);
    }

    //Hilfsfunktion zur Ausgabe des Produkts
    toText(){        
        return `${this.getProductName()} - Expiry Date: ${new Date(this.#expirationDate).toLocaleDateString('de-DE')} - Required Space: ${this.#productVolume} %`
    }

}

export default Product;