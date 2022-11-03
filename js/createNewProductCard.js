import renderFridge from "./renderFridge.js";

let shoppingListBadge = document.querySelector("#shopping-badge");

function createNewProductCard(product, deleteCallback, addToList, ) {

    ////-OUTER CONTAINER
    // Erstelle äußeres Card-div
    let card = document.createElement('div');
    card.id = product.getProductName().toLowerCase()+"-identifier";
    // Hänge Bootstrap card-Klasse an
    card.classList.add('card');

    //// INNER CONTAINER
    // Erstelle inneres Card-Body-div
    let cardBody = document.createElement('div');
    // Hänge Bootstrap card-body-Klasse an
    cardBody.classList.add("card-body", "d-flex", "flex-column", "align-items-center");
    card.appendChild(cardBody);

    //// IMAGES
    let foodIcon = document.createElement("img");
    foodIcon.classList.add("card-img-top");
    foodIcon.src = product.getPath();
    foodIcon.alt = product.getAltTag();
    foodIcon.setAttribute("style", "width: 60px");
    //Kein passendes Bild gefunden => ErrorHandler
    foodIcon.addEventListener("error", evt => {
        foodIcon.src = "./img/foodIcons/cutlery.png";
    });
    cardBody.appendChild(foodIcon);

    //// NAME OF FOOD
    // Erstelle Card Titel
    let cardTitle = document.createElement('h5');
    // Hänge Bootstrap card-title Klasse an
    cardTitle.classList.add('card-title');
    // Fülle Card Titel mit übergebenem Produktnamen
    cardTitle.innerText = product.getProductName();
    cardBody.appendChild(cardTitle);

    //// EXPIRATION DATE
    // Erstelle Untertitel Element
    let cardSubTitle = document.createElement('h6');
    // Hänge Bootstrap card-subtitle Klasse an Untertitel Element an
    cardSubTitle.classList.add('card-subtitle', 'text-muted');

    //// COLOR CHANGE FOR EXPIRATION DATE
    // Wenn abgelaufen, ersetze Bootstrap Klasse für Textfarbe
    if (product.isExpired()) cardSubTitle.classList.replace('text-muted', 'text-danger');
    // Wenn kurz vor Ablauf, ersetze Bootstrap Klasse für Textfarbe
    else if (product.isExpired("tomorrow")) cardSubTitle.classList.replace('text-muted', 'text-warning');
    // Befülle Untertitel Element mit übergebenem Ablaufsdatum
    cardSubTitle.innerText = new Date(product.getExpirationDate()).toLocaleDateString('de-DE');
    cardBody.appendChild(cardSubTitle);

    //// VOLUMEN
    // Erstelle Text-Element für Produkt-Volumen
    let cardText = document.createElement('p');
    // Hänge Bootstrap card-text Klasse an Text-Element an
    cardText.classList.add('card-text', "mb-1");
    // Befülle Text-Element mit übergebenem Produktvolumen
    cardText.innerText = `Vol: ${product.getProductVolume()} %`;
    cardBody.appendChild(cardText);

    //// BUTTON GROUP CONTAINER
    let btnGroupContainer = document.createElement("div");
    btnGroupContainer.classList.add("btn-group");
    btnGroupContainer.role = "group";
    btnGroupContainer.setAttribute("aria-label","Basic checkbox toggle button group");

    //// EATEN / DELETE BUTTON
    // Erstelle Knopf zum Löschen des Produktes
    let deleteCardBtn = document.createElement('button');
    // Setze button-type
    deleteCardBtn.type = 'button';
    // Hänge Bootrap Button Klassen an abhängig davon, ob Produkt bereits abgelaufen oder nicht
    deleteCardBtn.classList.add('btn', 'btn-sm', (product.isExpired() ? 'btn-outline-danger' : 'btn-outline-primary'));

    // Prüfe, ob übergebenes Callback für den Löschknopf gültig ist
    if (typeof deleteCallback === 'function') {
        // Hänge übergebenes Callback auf das onClick-Event des Löschknopfs an
        deleteCardBtn.addEventListener('click', function(evt){
            let updatedStorage = deleteCallback();
            renderFridge(updatedStorage);
        });
    } else {
        // Gebe aus, dass übergebenes Callback ungültig ist
        console.log('%cDas mitgelieferte Callback zum Löschen des Produkts ist keine Funktion oder nicht vorhanden.', 'color: red;');
    }
    // Erstelle icon-Element für Löschknopf
    let deleteCardBtnIcon = document.createElement('i');
    // Hänge dem icon-Element abhängig von Ablaufszustand die entsprechende Bootstrap Klasse an
    deleteCardBtnIcon.classList.add('fa-solid', (product.isExpired() ? 'fa-trash' : 'fa-utensils'));
    // Hänge Lösch-Icon an Löschknopf an
    deleteCardBtn.appendChild(deleteCardBtnIcon);


    //// ADD TO CART WHEN EXPIRES
    let addToListWhenExpiresCheckbox = document.createElement("input");
    addToListWhenExpiresCheckbox.type = "checkbox"
    addToListWhenExpiresCheckbox.classList.add("btn-check");
    addToListWhenExpiresCheckbox.id = product.getProductId();
    addToListWhenExpiresCheckbox.autocomplete = "off";
    if(product.getAddToList()){
        addToListWhenExpiresCheckbox.checked = true;
    }
    addToListWhenExpiresCheckbox.addEventListener("change", evt => {
        product.setAddToList(evt.target.checked);
        if(product.isExpired(2)){
            let count = addToList(product);
            shoppingListBadge.innerText = count;
        }
    });

    //// LABEL FOR CHECKBOX
    let checkboxLabel = document.createElement("label");
    checkboxLabel.classList.add("btn","btn-outline-primary");
    checkboxLabel.setAttribute("for",product.getProductId());

    //// ICON FOR LABEL
    let cartIcon = document.createElement("i");
    cartIcon.classList.add("fa-solid", "fa-cart-shopping");
    checkboxLabel.appendChild(cartIcon);

    //// BUTTON FOR IMMEDIATE ADDITION TO LIST
    let addToCartBtn = document.createElement("button");
    addToCartBtn.type = "button";
    addToCartBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
    addToCartBtn.addEventListener("click", function (evt) {
        let count = addToList(product);
        shoppingListBadge.innerText = count;
    });

    //// ICON FOR ADDBUTTON
    let plusIcon = document.createElement("i");
    plusIcon.classList.add("fa-solid", "fa-plus");
    plusIcon.setAttribute("aria-hidden","true");
    addToCartBtn.appendChild(plusIcon);

    btnGroupContainer.appendChild(deleteCardBtn);
    btnGroupContainer.appendChild(addToListWhenExpiresCheckbox);
    btnGroupContainer.appendChild(checkboxLabel);
    btnGroupContainer.appendChild(addToCartBtn);

    cardBody.appendChild(btnGroupContainer);

    //// BADGE
    /*Checke Anzahl der Produkte => 
    Kommt ein Produkt mehrmals vor wird dies bereits beim hinzufügen erkannt
    => Somit reicht es den Stock zu prüfen und im Badge zu speichern*/
    if (product.getStock() > 1) {
        let outerSpan = document.createElement("span");
        outerSpan.classList.add("position-absolute", "top-0", "start-100", "translate-middle", "badge", "rounded-pill", "bg-danger");
        outerSpan.innerText = product.getStock();
    
        let innerSpan = document.createElement("span");
        innerSpan.classList.add("visually-hidden");
        innerSpan.innerText = "Amount of Products with same name and expiration date";
        outerSpan.appendChild(innerSpan);
    
        card.appendChild(outerSpan);
    }

    return card;
}


export default createNewProductCard;