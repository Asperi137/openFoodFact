$("#btn-search").click(async function (e) {
	e.preventDefault();
	//récupération des données pour les afficher
	const codeBarre = $("#txt-search").val();
	const requete = "https://world.openfoodfacts.org/api/v2/product/" + codeBarre;

	let produit = "";
	if (/\d{8,13}/.test(codeBarre)) {
		$.getJSON(requete, function (data) {
			produit = data;
			if (produit.count === 0) {
				alert("Le produit n'est pas présent dans la base de données");
			} else {
				afficherProduit(produit);
			}
		});
	} else {
		alert("veuiller entrer un code barre valide");
	}
});

const afficherProduit = function (produit) {
	//affichage de l'image du produit
	const imageProduit = $("#img-produit");
	imageProduit.attr("src", "images/logoLegume.webp");
	if (produit.product.image_url) {
		imageProduit.attr("src", produit.product.image_url);
	}

	//affichage du nom du produit
	const nomProduit = $("#nom-produit");
	if (produit.product.product_name) {
		nomProduit.text(produit.product.product_name);
	}

	//affichage du fabriquant du produit
	const nomProducteur = $("#nom-producteur");
	if (produit.product.brands) {
		nomProducteur.text(produit.product.brands);
	}

	//affichage de la quantité présente dans le produit
	const quantity = $("quantity");
	if (produit.product.quantity) {
		quantity.text(produit.product.quantity);
	}

	//affichage du nutriscore du produit
	const imageNutriscore = $("#img-nutriscore");
	imageNutriscore.attr("src", "images/nutriscoreX.jpg");
	if (produit.product.nutriscore_grade && /[a,b,c,d,e]/.test(produit.product.nutriscore_grade)) {
		imageNutriscore.attr("src", "images/nutriscore-" + produit.product.nutriscore_grade + ".svg");
	} else {
		imageNutriscore.attr("src", "images/nutriscore-X.svg");
	}

	//affichage du groupe nova du produit
	const imageNova = $("#img-nova");
	imageNova.attr("src", "images/nova1.jpg");
	if (produit.product.nova_group && /[1,2,3,4]/.test(produit.product.nova_group)) {
		imageNova.attr("src", "images/nova" + produit.product.nova_group + ".svg");
	} else {
		imageNova.attr("src", "images/novaX.svg");
	}

	//affichage de l'eco-score du produit
	const imgEcoscore = $("#img-ecoscore");
	imgEcoscore.attr("src", "images/ecoscore-na.svg");
	if (produit.product.ecoscore_grade && /[a,b,c,d,e]/.test(produit.product.ecoscore_grade)) {
		imgEcoscore.attr("src", "images/ecoscore-" + produit.product.ecoscore_grade + ".svg");
	} else {
		imgEcoscore.attr("src", "images/ecoscore-X.svg");
	}

	//affichage des ingrédients du produit
	const ingredients = $("#ingredients");
	if (produit.product.ingredients_text_fr) {
		ingredients.text(produit.product.ingredients_text_fr);
	} else if (produit.product.ingredients_text) {
		ingredients.text(produit.product.ingredients_text);
	}

	//affichage des alergènes du produit
	const alergenes = $("#alergene");
	if (produit.product.allergens_tags) {
		const alergenesLst = produit.product.allergens_tags;
		let listAlergenes = "";
		for (let element of alergenesLst) {
			listAlergenes += element.substring(3) + ", ";
		}
		alergenes.text(listAlergenes);
	} else {
		alergenes.text("aucun alergènes connus");
	}

	afficherNutriment(produit);
};

const afficherNutriment = function (produit) {
	//affichage des nutriment pour 100g avec le "niveau" sous forme de pastil de couleur
	const nutriments = produit.product.nutriments;

	//Calories
	const energy = $("#energy");
	if (nutriments["energy-kcal_100g"] && nutriments["energy-kcal_unit"]) {
		const energie100g = nutriments["energy-kcal_100g"];
		const ajr = " (" + energie100g / 20 + "% des AJR)";
		energy.html(
			"<td>Calories : </td><td>" + energie100g + nutriments["energy-kcal_unit"] + "</td><td>" + ajr + "</td>"
		);
	}
	//sucre
	const sucre = $("#sugars");
	if (nutriments.sugars_100g && nutriments.sugars_unit && produit.product.nutrient_levels.sugars) {
		sucre.html(
			"<td>Glucides : </td><td>" +
				nutriments.sugars_100g +
				nutriments.sugars_unit +
				"</td><td>" +
				nutrimentlvl(produit, "sugars") +
				"</td>"
		);
	}

	//Sodium
	const salt = $("#salt");
	if (nutriments.salt_100g && nutriments.salt_unit && produit.product.nutrient_levels.salt) {
		salt.html(
			"<td>Sodium : </td><td>" +
				nutriments.salt_100g +
				nutriments.salt_unit +
				"</td><td>" +
				nutrimentlvl(produit, "salt") +
				"</td>"
		);
	}

	//Lipides
	const fat = $("#fat");
	if (nutriments.fat_100g && nutriments.fat_unit && produit.product.nutrient_levels.fat) {
		fat.html(
			"<td>Lipides :  </td><td>" +
				nutriments.fat_100g +
				nutriments.fat_unit +
				"</td><td>" +
				nutrimentlvl(produit, "fat") +
				"</td>"
		);
	}

	//graisse saturés
	const saturated = $("#saturated-fat");
	if (
		nutriments["saturated-fat_100g"] &&
		nutriments["saturated-fat_unit"] &&
		produit.product.nutrient_levels["saturated-fat"]
	) {
		saturated.html(
			"<td>Acide gras saturés : </td><td>" +
				nutriments["saturated-fat_100g"] +
				nutriments["saturated-fat_unit"] +
				"</td><td>" +
				nutrimentlvl(produit, "saturated-fat") +
				"</td>"
		);
	}
};

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
