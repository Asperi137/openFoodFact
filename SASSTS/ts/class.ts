import { ProductData } from "./type";

export class Produit {
	img: string = "../images/logoLegume.webp";
	nom: string = "";
	producteur: string = "";
	quantite: string = "";
	ingredient: string = "";
	alergenes: string = "";
	nutriscore: string = "../images/nutriscore-X.svg";
	nova: string = "../images/novaX.svg";
	ecoscore: string = "../images/ecoscore-X.svg";
	energy: string = "";
	sugars: string = "";
	salt: string = "";
	fat: string = "";
	satured: string = "";
	constructor(resultat: ProductData) {
		if (resultat) {
			if (resultat.product.image_url) {
				this.img = resultat.product.image_url;
			}
			if (resultat.product.product_name) {
				this.nom = resultat.product.product_name;
			}
			if (resultat.product.brands) {
				this.producteur = resultat.product.brands;
			}
			if (resultat.product.quantity) {
				this.quantite = resultat.product.quantity;
			}
			if (resultat.product.ingredients_text_fr) {
				this.ingredient = resultat.product.ingredients_text_fr;
			} else if (resultat.product.ingredients_text) {
				this.ingredient = resultat.product.ingredients_text;
			}
			if (resultat.product.allergens_tags) {
				const alergenesLst = resultat.product.allergens_tags;
				let listAlergenes = "";
				for (let element of alergenesLst) {
					listAlergenes += element.substring(3) + ", ";
				}
				this.alergenes = listAlergenes;
			}
			const regexScoreLettre: RegExp = /[a,b,c,d,e]/;
			if (resultat.product.nutriscore_grade && regexScoreLettre.test(resultat.product.nutriscore_grade)) {
				this.nutriscore = "../images/nutriscore-" + resultat.product.nutriscore_grade + ".svg";
			}
			if (resultat.product.nova_group && resultat.product.nova_group <= 4 && resultat.product.nova_group >= 1) {
				this.nova = "../images/nova" + resultat.product.nova_group + ".svg";
			}
			if (resultat.product.ecoscore_grade && regexScoreLettre.test(resultat.product.ecoscore_grade)) {
				this.ecoscore = "../images/ecoscore-" + resultat.product.ecoscore_grade + ".svg";
			}
			if (resultat.product["energy-kcal_100g"]) {
				const energie100g = resultat.product["energy-kcal_100g"];
				const ajr = " (" + energie100g / 20 + "% des AJR)";
				this.energy = "<td>Calories : </td><td>" + energie100g + " kcal</td><td>" + ajr + "</td>";
			}
			if (resultat.product.sugars_100g && resultat.product.nutrient_levels.sugars) {
				this.sugars =
					"<td>Glucides : </td><td>" +
					resultat.product.sugars_100g +
					" g</td><td>" +
					this.nutrimentlvl(resultat.product.nutrient_levels.sugars) +
					"</td>";
			}
			if (resultat.product.salt_100g && resultat.product.nutrient_levels.salt) {
				this.salt =
					"<td>Sodium : </td><td>" +
					resultat.product.salt_100g +
					" g</td><td>" +
					this.nutrimentlvl(resultat.product.nutrient_levels.salt) +
					"</td>";
			}
			if (resultat.product.fat_100g && resultat.product.nutrient_levels.fat) {
				this.fat =
					"<td>Lipides :  </td><td>" +
					resultat.product.fat_100g +
					" g</td><td>" +
					this.nutrimentlvl(resultat.product.nutrient_levels.fat) +
					"</td>";
			}
			if (resultat.product["saturated-fat_100g"] && resultat.product.nutrient_levels["saturated-fat"]) {
				this.satured =
					"<td>Acide gras saturés : </td><td>" +
					resultat.product["saturated-fat_100g"] +
					" g</td><td>" +
					this.nutrimentlvl(resultat.product.nutrient_levels["saturated-fat"]) +
					"</td>";
			}
		}
	}
	afficherProduit() {
		const imageProduit = document.getElementById("img-produit") as HTMLImageElement;
		imageProduit.src = this.img;
		const nomProduit = document.getElementById("nom-produit") as HTMLElement;
		nomProduit.innerText = this.nom;
		const nomProducteur = document.getElementById("nom-producteur") as HTMLElement;
		nomProducteur.innerText = this.producteur;
		const quantity = document.getElementById("quantity") as HTMLElement;
		quantity.innerText = this.quantite;
		const ingredients = document.getElementById("ingredients") as HTMLElement;
		ingredients.innerText = this.ingredient;
		const alergenes = document.getElementById("alergene") as HTMLElement;
		alergenes.innerHTML = this.alergenes;
		this.afficherScore();
		this.afficherNutriment();
	}
	afficherScore() {
		const imageNutriscore = document.getElementById("img-nutriscore") as HTMLImageElement;
		imageNutriscore.src = this.nutriscore;
		const imageNova = document.getElementById("img-nova") as HTMLImageElement;
		imageNova.src = this.nova;
		const imgEcoscore = document.getElementById("img-ecoscore") as HTMLImageElement;
		imgEcoscore.src = this.ecoscore;
	}
	afficherNutriment() {
		const energy = document.getElementById("energy") as HTMLElement;
		energy.innerHTML = this.energy;
		const sucre = document.getElementById("sugars") as HTMLElement;
		sucre.innerHTML = this.sugars;
		const salt = document.getElementById("salt") as HTMLElement;
		salt.innerHTML = this.salt;
		const fat = document.getElementById("fat") as HTMLElement;
		fat.innerHTML = this.fat;
		const saturated = document.getElementById("saturated-fat") as HTMLElement;
		saturated.innerHTML = this.satured;
	}
	nutrimentlvl(level: string): String {
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
}
