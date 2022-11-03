//Referenz auf den Title-Container im Modal
let modalTitle = document.querySelector("#exampleModalLabel");
//Referenz auf den Container im Modal
let modalBody = document.querySelector(".modal-body");

export function renderModalShoppingList(shoppingList) {
    modalBody.replaceChildren();

    modalTitle.innerHTML = "Shopping List";
    
    let listContainer = document.createElement("ol");
    listContainer.classList.add("list-group", "list-group-numbered");

    if (shoppingList.size > 0) {
        //Da nicht leer => Erstelle für jedes Listenelement einen Listenpunkt
        for (const product of shoppingList.values()) {

            //Erstelle "li" als Zähler
            let listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.innerText = product.getProductName();

            //Wrapper für die Button
            let wrapper = document.createElement("div");
            wrapper.classList.add("btn-group", "float-end");
            wrapper.role = "group";

            //Button zur Erhöhung der Anzahl
            let plusBtn = document.createElement("button");
            plusBtn.type = "button";
            plusBtn.classList.add("btn", "btn-outline-primary");
            //Erhöhe Amount beim Klick
            plusBtn.addEventListener("click", evt => {
                innerShowDiv.innerText = product.amountOnShoppingList += 1;
            })

            //Plus-Icon
            let plusIcon = document.createElement("i");
            plusIcon.classList.add("fa-solid", "fa-plus");
            plusIcon.setAttribute("aria-hidden","true");
            plusBtn.appendChild(plusIcon);


            let innerShowDiv = document.createElement("button");
            innerShowDiv.classList.add("btn", "btn-outline-primary");
            innerShowDiv.disabled = true;
            innerShowDiv.innerText = product.amountOnShoppingList;

            //Button um die Anzahl zu verkleinern
            let minusBtn = document.createElement("button");
            minusBtn.type = "button";
            minusBtn.classList.add("btn", "btn-outline-primary");
            minusBtn.addEventListener("click", evt => {
                innerShowDiv.innerText = product.amountOnShoppingList -= 1;
                if (product.amountOnShoppingList < 1) {
                    shoppingList.delete(product.getProductId());
                    renderModalShoppingList(shoppingList)
                }
            })

            //Minus-Icon
            let trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash");
            trashIcon.setAttribute("aria-hidden","true");
            minusBtn.appendChild(trashIcon);

            //Füge an die Parent-Elemente an
            wrapper.appendChild(plusBtn)
            wrapper.appendChild(innerShowDiv)
            wrapper.appendChild(minusBtn)

            listItem.appendChild(wrapper);

            listContainer.appendChild(listItem);
        }

    } else {
        //Da Liste leer ist => Erstelle einen Punkt mit dieser Meldung 
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.innerText = "No items on shopping list"

        listContainer.appendChild(listItem);
    }
    modalBody.appendChild(listContainer);

}

export default renderModalShoppingList;