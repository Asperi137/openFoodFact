"use strict";
const regexScoreLettre = /[a,b,c,d,e]/;
const regexScoreChiffre = /[1,2,3,4]/;
class Produit {
    img = "../images/logoLegume.webp";
    nom = "";
    producteur = "";
    quantite = "";
    ingredient = "";
    alergenes = "";
    nutriscore = "../images/nutriscore-X.svg";
    nova = "../images/novaX.svg";
    ecoscore = "../images/ecoscore-X.svg";
    energy = "";
    sugars = "";
    salt = "";
    fat = "";
    satured = "";
    constructor(resultat) {
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
            }
            else if (resultat.product.ingredients_text) {
                this.ingredient = resultat.product.ingredients_text;
            }
            if (resultat.product.allergens_tags) {
                const alergenesLst = resultat.product.allergens_tags;
                console.log(alergenesLst);
                let listAlergenes = "";
                for (let element of alergenesLst) {
                    listAlergenes += element.substring(3) + ", ";
                }
                console.log(listAlergenes);
                this.alergenes = listAlergenes;
            }
            if (resultat.product.nutriscore_grade && regexScoreLettre.test(resultat.product.nutriscore_grade)) {
                this.nutriscore = "../images/nutriscore-" + resultat.product.nutriscore_grade + ".svg";
            }
            if (resultat.product.nova_group && regexScoreChiffre.test(resultat.product.nova_group)) {
                this.nova = "../images/nova" + resultat.product.nova_group + ".svg";
            }
            if (resultat.product.ecoscore_grade && regexScoreLettre.test(resultat.product.ecoscore_grade)) {
                this.ecoscore = "../images/ecoscore-" + resultat.product.ecoscore_grade + ".svg";
            }
            const nutriments = resultat.product.nutriments;
            if (nutriments["energy-kcal_100g"] && nutriments["energy-kcal_unit"]) {
                const energie100g = nutriments["energy-kcal_100g"];
                const ajr = " (" + energie100g / 20 + "% des AJR)";
                this.energy =
                    "<td>Calories : </td><td>" + energie100g + nutriments["energy-kcal_unit"] + "</td><td>" + ajr + "</td>";
            }
            if (nutriments.sugars_100g && nutriments.sugars_unit && resultat.product.nutrient_levels.sugars) {
                this.sugars =
                    "<td>Glucides : </td><td>" +
                        nutriments.sugars_100g +
                        nutriments.sugars_unit +
                        "</td><td>" +
                        this.nutrimentlvl(resultat, "sugars") +
                        "</td>";
            }
            if (nutriments.salt_100g && nutriments.salt_unit && resultat.product.nutrient_levels.salt) {
                this.salt =
                    "<td>Sodium : </td><td>" +
                        nutriments.salt_100g +
                        nutriments.salt_unit +
                        "</td><td>" +
                        this.nutrimentlvl(resultat, "salt") +
                        "</td>";
            }
            if (nutriments.fat_100g && nutriments.fat_unit && resultat.product.nutrient_levels.fat) {
                this.fat =
                    "<td>Lipides :  </td><td>" +
                        nutriments.fat_100g +
                        nutriments.fat_unit +
                        "</td><td>" +
                        this.nutrimentlvl(resultat, "fat") +
                        "</td>";
            }
            if (nutriments["saturated-fat_100g"] &&
                nutriments["saturated-fat_unit"] &&
                resultat.product.nutrient_levels["saturated-fat"]) {
                this.satured =
                    "<td>Acide gras saturés : </td><td>" +
                        nutriments["saturated-fat_100g"] +
                        nutriments["saturated-fat_unit"] +
                        "</td><td>" +
                        this.nutrimentlvl(resultat, "saturated-fat") +
                        "</td>";
            }
        }
    }
    afficherProduit() {
        const imageProduit = document.getElementById("img-produit");
        imageProduit.src = this.img;
        const nomProduit = document.getElementById("nom-produit");
        nomProduit.innerText = this.nom;
        const nomProducteur = document.getElementById("nom-producteur");
        nomProducteur.innerText = this.producteur;
        const quantity = document.getElementById("quantity");
        quantity.innerText = this.quantite;
        const ingredients = document.getElementById("ingredients");
        ingredients.innerText = this.ingredient;
        const alergenes = document.getElementById("alergene");
        alergenes.innerHTML = this.alergenes;
        this.afficherScore();
        this.afficherNutriment();
    }
    afficherScore() {
        const imageNutriscore = document.getElementById("img-nutriscore");
        imageNutriscore.src = this.nutriscore;
        const imageNova = document.getElementById("img-nova");
        imageNova.src = this.nova;
        const imgEcoscore = document.getElementById("img-ecoscore");
        imgEcoscore.src = this.ecoscore;
    }
    afficherNutriment() {
        const energy = document.getElementById("energy");
        energy.innerHTML = this.energy;
        const sucre = document.getElementById("sugars");
        sucre.innerHTML = this.sugars;
        const salt = document.getElementById("salt");
        salt.innerHTML = this.salt;
        const fat = document.getElementById("fat");
        fat.innerHTML = this.fat;
        const saturated = document.getElementById("saturated-fat");
        saturated.innerHTML = this.satured;
    }
    //fonction qui retourn les pastils en fonction du niveau
    nutrimentlvl(produit, nutriment) {
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
}
const boutonRechercher = document.querySelector("#btn-search");
boutonRechercher?.addEventListener("click", async function (e) {
    e.preventDefault();
    const search = document.getElementById("txt-search");
    const codeBarre = search.value;
    const requete = "https://world.openfoodfacts.org/api/v2/product/" + codeBarre;
    if (/\d{8,13}/.test(codeBarre)) {
        const resultat = await fetch(requete).then((res) => res.json());
        const prod = new Produit(resultat);
        prod.afficherProduit();
    }
    else {
        search.value = "code barre non valide";
    }
});
