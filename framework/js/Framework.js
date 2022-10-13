$('#btn-search').click(async function (e) {
	e.preventDefault();
	const requete = 'https://world.openfoodfacts.org/api/v2/product/' + $('#txt-search').val();
	if (/^\d{8,13}$/.test($('#txt-search').val())) {
		$.getJSON(requete, function (data) {
			if (data.count === 0) {
				alert("Le produit n'est pas présent dans la base de données");
			} else {
				afficherProduit(data);
			}
		});
	} else {
		alert('veuiller entrer un code barre valide');
	}
});

function afficherProduit(produit) {
	if (produit.product.image_url) {
		$('#img-produit').attr('src', produit.product.image_url);
	} else {
		$('#img-produit').attr('src', '/images/logoLegume.webp');
	}

	if (produit.product.product_name) {
		$('#nom-produit').text(produit.product.product_name);
	}

	if (produit.product.brands) {
		$('#nom-producteur').text(produit.product.brands);
	}

	if (produit.product.quantity) {
		$('quantity').text(produit.product.quantity);
	}

	if (produit.product.nutriscore_grade && /^[a-e]$/.test(produit.product.nutriscore_grade)) {
		$('#img-nutriscore').attr('src', '/images/nutriscore-' + produit.product.nutriscore_grade + '.svg');
	} else {
		$('#img-nutriscore').attr('src', '/images/nutriscoreX.jpg');
	}

	if (produit.product.nova_group && /^[1-4]$/.test(produit.product.nova_group)) {
		$('#img-nova').attr('src', '/images/nova' + produit.product.nova_group + '.svg');
	} else {
		$('#img-nova').attr('src', '/images/nova1.jpg');
	}

	if (produit.product.ecoscore_grade && /^[a-e]$/.test(produit.product.ecoscore_grade)) {
		$('#img-ecoscore').attr('src', '/images/ecoscore-' + produit.product.ecoscore_grade + '.svg');
	} else {
		$('#img-ecoscore').attr('src', '/images/ecoscore-X.svg');
	}

	if (produit.product.ingredients_text_fr) {
		$('#ingredients').text(produit.product.ingredients_text_fr);
	} else if (produit.product.ingredients_text) {
		$('#ingredients').text(produit.product.ingredients_text);
	}

	if (produit.product.allergens_tags) {
		const alergenesLst = produit.product.allergens_tags;
		let listAlergenes = '';
		for (let element of alergenesLst) {
			listAlergenes += element.substring(3) + ', ';
		}
		$('#alergene').text(listAlergenes);
	} else {
		$('#alergene').text('aucun alergènes connus');
	}

	afficherNutriment(produit);
}

const afficherNutriment = function (produit) {
	//affichage des nutriment pour 100g avec le "niveau" sous forme de pastil de couleur
	const nutriments = produit.product.nutriments;

	if (nutriments['energy-kcal_100g']) {
		const energie100g = nutriments['energy-kcal_100g'];
		const ajr = ' (' + energie100g / 20 + '% des AJR)';
		$('#energy').html('<td>Calories : </td><td>' + energie100g + 'kcal</td><td>' + ajr + '</td>');
	}

	if (nutriments.sugars_100g && produit.product.nutrient_levels.sugars) {
		$('#sugars').html(
			'<td>Glucides : </td><td>' +
				nutriments.sugars_100g +
				'g</td><td>' +
				nutrimentlvl(produit, 'sugars') +
				'</td>'
		);
	}

	if (nutriments.salt_100g && produit.product.nutrient_levels.salt) {
		$('#salt').html(
			'<td>Sodium : </td><td>' + nutriments.salt_100g + 'g</td><td>' + nutrimentlvl(produit, 'salt') + '</td>'
		);
	}

	if (nutriments.fat_100g && produit.product.nutrient_levels.fat) {
		$('#fat').html(
			'<td>Lipides :  </td><td>' + nutriments.fat_100g + 'g</td><td>' + nutrimentlvl(produit, 'fat') + '</td>'
		);
	}

	if (nutriments['saturated-fat_100g'] && produit.product.nutrient_levels['saturated-fat']) {
		$('#saturated-fat').html(
			'<td>Acide gras saturés : </td><td>' +
				nutriments['saturated-fat_100g'] +
				'g</td><td>' +
				nutrimentlvl(produit, 'saturated-fat') +
				'</td>'
		);
	}
};

//fonction qui retourn les pastils en fonction du niveau
function nutrimentlvl(produit, nutriment) {
	const level = produit.product.nutrient_levels[nutriment];
	switch (level) {
		case 'low':
			return ' 🟢';
		case 'moderate':
			return ' 🟠';
		case 'high':
			return ' 🔴';
	}
	return level;
}
