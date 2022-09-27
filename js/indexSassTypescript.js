const boutonRechercher = document.querySelector("#btn-search");
boutonRechercher.addEventListener("click", async function (e) {
	e.preventDefault();
	//récupération des données pour les afficher
	const codeBarre = document.getElementById("txt-search").value;
	requete = "json/3017620424403.json";
	//requete = "json/3083681081534.json";
	//const requete = "https://world.openfoodfacts.org/api/v2/product/" + codeBarre;
	const produit = await fetch(requete).then((produit) => produit.json());
	//affichage de l'image du produit
	const imageProduit = document.getElementById("img-produit");
	imageProduit.src = produit.product.image_url;
	//affichage du nom du produit
	const nomProduit = document.getElementById("nom-produit");
	nomProduit.innerText = produit.product.product_name;
	//affichage du fabriquant du produit
	const nomProducteur = document.getElementById("nom-producteur");
	nomProducteur.innerText = produit.product.brands;
	//affichage de la quantité présente dans le produit
	const quantity = document.getElementById("quantity");
	quantity.innerText = produit.product.quantity;
	//affichage du nutriscore du produit
	const imageNutriscore = document.getElementById("img-nutriscore");
	imageNutriscore.src = "images/nutriscore" + produit.product.nutriscore_grade.toUpperCase() + ".jpg";
	//affichage du groupe nova du produit
	const imageNova = document.getElementById("img-nova");
	imageNova.src = "images/nova" + produit.product.nova_group + ".jpg";
	//affichage de l'eco-score du produit
	const imgEcoscore = document.getElementById("img-ecoscore");
	imgEcoscore.src = "images/ecoscore-" + produit.product.ecoscore_grade + ".svg";

	//affichage des ingrédients du produit
	const ingredients = document.getElementById("ingredients");
	if (produit.product.ingredients_text_fr) {
		ingredients.innerText = produit.product.ingredients_text_fr;
	} else {
		ingredients.innerText = produit.product.ingredients_text;
	}
	//affichage des alergènes du produit
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
	//affichage des nutriment pour 100g avec le "niveau" sous forme de pastil de couleur
	const nutriments = produit.product.nutriments;
	//Calories
	const energy = document.getElementById("energy");
	const energie100g = nutriments["energy-kcal_100g"];
	const ajr = " (" + energie100g / 20 + "% des AJR)";
	energy.innerHTML = "<td>Calories : </td><td>" + energie100g + nutriments["energy-kcal_unit"] + ajr + "</td>";
	//sucre
	const sucre = document.getElementById("sugars");
	sucre.innerHTML =
		"<td>Glucides : </td><td>" +
		nutriments.sugars_100g +
		nutriments.sugars_unit +
		nutrimentlvl(produit, "sugars") +
		"</td>";
	//Sodium
	const salt = document.getElementById("salt");
	salt.innerHTML =
		"<td>Sodium : </td><td>" + nutriments.salt_100g + nutriments.salt_unit + nutrimentlvl(produit, "salt") + "</td>";
	//Lipides
	const fat = document.getElementById("fat");
	fat.innerHTML =
		"<td>Lipides :  </td><td>" + nutriments.fat_100g + nutriments.fat_unit + nutrimentlvl(produit, "fat") + "</td>";
	//graisse saturés
	const saturated = document.getElementById("saturated-fat");
	saturated.innerHTML =
		"<td>graisse saturés : </td><td>" +
		nutriments["saturated-fat_100g"] +
		nutriments["saturated-fat_unit"] +
		nutrimentlvl(produit, "saturated-fat") +
		"</td>";
});

//fonction qui retourn les pastils en fonction du niveau
function nutrimentlvl(produit, nutriment) {
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
