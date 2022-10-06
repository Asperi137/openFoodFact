"use strict";
const regexScoreLettre = /[a,b,c,d,e]/;
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
                let listAlergenes = "";
                for (let element of alergenesLst) {
                    listAlergenes += element.substring(3) + ", ";
                }
                this.alergenes = listAlergenes;
            }
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
    nutrimentlvl(level) {
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
    const requete = "https://world.openfoodfacts.org/api/v2/product/" +
        codeBarre +
        ".json?fields=allergens_tags,brands,nutriscore_grade,ecoscore_grade,image_url,ingredients_text,ingredients_text_fr,nova_group," +
        "energy-kcal_100g,sugars_100g,salt_100g,fat_100g,saturated-fat_100g,product_name,quantity,nutrient_levels";
    if (/\d{8,13}/.test(codeBarre)) {
        await fetch(requete)
            .then(function (response) {
            return response.json();
        })
            .then(function (response) {
            const prod = new Produit(response);
            prod.afficherProduit();
        });
    }
    else {
        search.value = "code barre non valide";
    }
});
