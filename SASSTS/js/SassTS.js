import { Produit } from "./class.js";
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
