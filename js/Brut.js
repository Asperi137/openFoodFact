const boutonRechercher = document.querySelector("#btn-search");
boutonRechercher.addEventListener("click", async function (e) {
	e.preventDefault();
	//récupération des données pour les afficher
	const codeBarre = document.getElementById("txt-search").value;
	const requete = "https://world.openfoodfacts.org/api/v2/product/" + codeBarre;
	let produit = "";
	if (/\d{8,13}/.test(codeBarre)) {
		produit = await fetch(requete).then((produit) => produit.json());
	} else {
		document.getElementById("txt-search").value = "code barre non valide";
	}
	//si le produit existe on modifie les champs
	if (produit) {
		//affichage de l'image du produit
		const imageProduit = document.getElementById("img-produit");
		imageProduit.src = "images/logoLegume.webp";
		if (produit.product.image_url) {
			imageProduit.src = produit.product.image_url;
		}

		//affichage du nom du produit
		const nomProduit = document.getElementById("nom-produit");
		if (produit.product.product_name) {
			nomProduit.innerText = produit.product.product_name;
		}

		//affichage du fabriquant du produit
		const nomProducteur = document.getElementById("nom-producteur");
		if (produit.product.brands) {
			nomProducteur.innerText = produit.product.brands;
		}

		//affichage de la quantité présente dans le produit
		const quantity = document.getElementById("quantity");
		if (produit.product.quantity) {
			quantity.innerText = produit.product.quantity;
		}

		//affichage du nutriscore du produit
		const imageNutriscore = document.getElementById("img-nutriscore");
		imageNutriscore.src = "images/nutriscoreX.jpg";
		if (produit.product.nutriscore_grade && /[a,b,c,d,e]/.test(produit.product.nutriscore_grade)) {
			imageNutriscore.src = "images/nutriscore" + produit.product.nutriscore_grade.toUpperCase() + ".jpg";
		}

		//affichage du groupe nova du produit
		const imageNova = document.getElementById("img-nova");
		imageNova.src = "images/nova1.jpg";
		if (produit.product.nova_group && /[1,2,3,4]/.test(produit.product.nova_group)) {
			imageNova.src = "images/nova" + produit.product.nova_group + ".jpg";
		}

		//affichage de l'eco-score du produit
		const imgEcoscore = document.getElementById("img-ecoscore");
		imgEcoscore.src = "images/ecoscore-na.svg";
		if (produit.product.ecoscore_grade && /[a,b,c,d,e]/.test(produit.product.ecoscore_grade)) {
			imgEcoscore.src = "images/ecoscore-" + produit.product.ecoscore_grade + ".svg";
		}

		//affichage des ingrédients du produit
		const ingredients = document.getElementById("ingredients");
		if (produit.product.ingredients_text_fr) {
			ingredients.innerText = produit.product.ingredients_text_fr;
		} else if (produit.product.ingredients_text) {
			ingredients.innerText = produit.product.ingredients_text;
		}

		//affichage des alergènes du produit
		const alergenes = document.getElementById("alergene");
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
		const energy = document.getElementById("energy");
		if (nutriments["energy-kcal_100g"] && nutriments["energy-kcal_unit"]) {
			const energie100g = nutriments["energy-kcal_100g"];
			const ajr = " (" + energie100g / 20 + "% des AJR)";
			energy.innerHTML =
				"<td>Calories : </td><td>" + energie100g + nutriments["energy-kcal_unit"] + "</td><td>" + ajr + "</td>";
		}
		//sucre
		const sucre = document.getElementById("sugars");
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
		const salt = document.getElementById("salt");
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
		const fat = document.getElementById("fat");
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
		const saturated = document.getElementById("saturated-fat");
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
	}
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
