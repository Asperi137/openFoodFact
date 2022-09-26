const boutonRechercher = document.querySelector("#btn-search");
boutonRechercher.addEventListener("click", async function (e) {
    e.preventDefault();
    const codeBarre = document.getElementById("txt-search").value;



        const requete = "https://world.openfoodfacts.org/api/v2/product/" + codeBarre;;

        const produit = await fetch(requete).then((produit) => produit.json());


        const imageProduit = document.getElementById("img-produit");
        imageProduit.src = produit.product.image_url;

        const nomProduit = document.getElementById("nom-produit");
    nomProduit.innerText = produit.product.product_name;
    
    const nomProducteur = document.getElementById("nom-producteur");
    nomProducteur.innerText = produit.product.brands;

    const quantity = document.getElementById("quantity");
		quantity.innerText = produit.product.quantity;

        const imageNutriscore = document.getElementById("img-nutriscore");
        imageNutriscore.src = "images/nutriscore" + produit.product.nutriscore_grade.toUpperCase() + ".jpg";

        const imageNova = document.getElementById("img-nova");
        imageNova.src = "images/nova" + produit.product.nova_group + ".jpg";

        const ingredients = document.getElementById("ingredients");
        if (produit.product.ingredients_text_fr) {
            ingredients.innerText = produit.product.ingredients_text_fr;
        } else {
            ingredients.innerText = produit.product.ingredients_text;
        }

    const alergenes = document.getElementById("alergene");
    let listAlergenes = "";
    if (produit.product.allergens !== "") {
        const alergenesLst = produit.product.allergens_tags;
        for (let element of alergenesLst) {
            listAlergenes += element.substring(3) + ", ";
        }
        alergenes.innerText = listAlergenes;
    } else {
        
        alergenes.innerText = "aucun alergènes connus";
    }
    const nutriments = produit.product.nutriments;
    const energy = document.getElementById("energy");
		energy.innerText = " Calories : " + nutriments["energy-kcal_100g"] + nutriments["energy-kcal_unit"];
    

    const sucre = document.getElementById("sugars");
    sucre.innerText = "Glucides : " + nutriments.sugars_100g + nutriments.sugars_unit + nutrimentlvl(produit, "sugars");
    
    const salt = document.getElementById("salt");
    salt.innerText = "Sodium : " + nutriments.salt_100g + nutriments.salt_unit + nutrimentlvl(produit, "salt");

    const fat = document.getElementById("fat");
		fat.innerText = "Lipides : " + nutriments.fat_100g + nutriments.fat_unit + nutrimentlvl(produit, "fat");

    const saturated = document.getElementById("saturated-fat");
    saturated.innerText =
			"graisse saturés : " +
			nutriments["saturated-fat_100g"] +
			nutriments["saturated-fat_unit"] +
			nutrimentlvl(produit,"saturated-fat");
        
});

function nutrimentlvl(produit,nutriment) {
	const level = produit.product.nutrient_levels[nutriment];
    switch (level) {
			case "low":
				return " 🟢";
			case "moderate":
				return " 🟠";
			case "high":
				return " 🔴";
		}
	return level;
}