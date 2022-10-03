const boutonRechercher: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#btn-search");
boutonRechercher?.addEventListener("click", async function (e) {
	e.preventDefault();
	//récupération des données
	const search = document.getElementById("txt-search") as HTMLInputElement;
	const codeBarre: string = search.value;
	const requete = "https://world.openfoodfacts.org/api/v2/product/" + codeBarre;
	if (/\d{8,13}/.test(codeBarre)) {
		const produit = await fetch(requete).then((produit) => produit.json());
		if (produit) {
			afficherProduit(produit);
		}
	} else {
		search.value = "code barre non valide";
	}
});

const afficherProduit = function (produit: any) {
	//affichage de l'image du produit
	const imageProduit = document.getElementById("img-produit") as HTMLImageElement;
	imageProduit.src = "images/logoLegume.webp";
	if (produit.product.image_url) {
		imageProduit.src = produit.product.image_url;
	}

	//affichage du nom du produit
	const nomProduit = document.getElementById("nom-produit") as HTMLElement;
	if (produit.product.product_name) {
		nomProduit.innerText = produit.product.product_name;
	}

	//affichage du fabriquant du produit
	const nomProducteur = document.getElementById("nom-producteur") as HTMLElement;
	if (produit.product.brands) {
		nomProducteur.innerText = produit.product.brands;
	}

	//affichage de la quantité présente dans le produit
	const quantity = document.getElementById("quantity") as HTMLElement;
	if (produit.product.quantity) {
		quantity.innerText = produit.product.quantity;
	}

	//affichage du nutriscore du produit
	const imageNutriscore = document.getElementById("img-nutriscore") as HTMLImageElement;
	imageNutriscore.src = "images/nutriscoreX.jpg";
	if (produit.product.nutriscore_grade && /[a,b,c,d,e]/.test(produit.product.nutriscore_grade)) {
		imageNutriscore.src = "images/nutriscore-" + produit.product.nutriscore_grade + ".svg";
	}

	//affichage du groupe nova du produit
	const imageNova = document.getElementById("img-nova") as HTMLImageElement;
	imageNova.src = "images/nova1.jpg";
	if (produit.product.nova_group && /[1,2,3,4]/.test(produit.product.nova_group)) {
		imageNova.src = "images/nova" + produit.product.nova_group + ".svg";
	}

	//affichage de l'eco-score du produit
	const imgEcoscore = document.getElementById("img-ecoscore") as HTMLImageElement;
	imgEcoscore.src = "images/ecoscore-na.svg";
	if (produit.product.ecoscore_grade && /[a,b,c,d,e]/.test(produit.product.ecoscore_grade)) {
		imgEcoscore.src = "images/ecoscore-" + produit.product.ecoscore_grade + ".svg";
	}

	//affichage des ingrédients du produit
	const ingredients = document.getElementById("ingredients") as HTMLElement;
	if (produit.product.ingredients_text_fr) {
		ingredients.innerText = produit.product.ingredients_text_fr;
	} else if (produit.product.ingredients_text) {
		ingredients.innerText = produit.product.ingredients_text;
	}

	//affichage des alergènes du produit
	const alergenes = document.getElementById("alergene") as HTMLElement;
	if (produit.product.allergens_tags) {
		const alergenesLst = produit.product.allergens_tags;
		let listAlergenes = "";
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
	const energy = document.getElementById("energy") as HTMLElement;
	if (nutriments["energy-kcal_100g"] && nutriments["energy-kcal_unit"]) {
		const energie100g = nutriments["energy-kcal_100g"];
		const ajr = " (" + energie100g / 20 + "% des AJR)";
		energy.innerHTML =
			"<td>Calories : </td><td>" + energie100g + nutriments["energy-kcal_unit"] + "</td><td>" + ajr + "</td>";
	}
	//sucre
	const sucre = document.getElementById("sugars") as HTMLElement;
	if (nutriments.sugars_100g && nutriments.sugars_unit && produit.product.nutrient_levels.sugars) {
		sucre.innerHTML =
			"<td>Glucides : </td><td>" +
			nutriments.sugars_100g +
			nutriments.sugars_unit +
			"</td><td>" +
			nutrimentlvl(produit, "sugars") +
			"</td>";
	}

	//Sodium
	const salt = document.getElementById("salt") as HTMLElement;
	if (nutriments.salt_100g && nutriments.salt_unit && produit.product.nutrient_levels.salt) {
		salt.innerHTML =
			"<td>Sodium : </td><td>" +
			nutriments.salt_100g +
			nutriments.salt_unit +
			"</td><td>" +
			nutrimentlvl(produit, "salt") +
			"</td>";
	}

	//Lipides
	const fat = document.getElementById("fat") as HTMLElement;
	if (nutriments.fat_100g && nutriments.fat_unit && produit.product.nutrient_levels.fat) {
		fat.innerHTML =
			"<td>Lipides :  </td><td>" +
			nutriments.fat_100g +
			nutriments.fat_unit +
			"</td><td>" +
			nutrimentlvl(produit, "fat") +
			"</td>";
	}

	//graisse saturés
	const saturated = document.getElementById("saturated-fat") as HTMLElement;
	if (
		nutriments["saturated-fat_100g"] &&
		nutriments["saturated-fat_unit"] &&
		produit.product.nutrient_levels["saturated-fat"]
	) {
		saturated.innerHTML =
			"<td>Acide gras saturés : </td><td>" +
			nutriments["saturated-fat_100g"] +
			nutriments["saturated-fat_unit"] +
			"</td><td>" +
			nutrimentlvl(produit, "saturated-fat") +
			"</td>";
	}
};

//fonction qui retourn les pastils en fonction du niveau
function nutrimentlvl(produit: any, nutriment: string): String {
	const level: String = produit.product.nutrient_levels[nutriment];
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
