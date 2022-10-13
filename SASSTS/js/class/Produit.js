/**
 * toutes les information nécessaire a l'affichage
 * @export
 * @class Produit
 */
export class Produit {
    regexScoreLettre = /^[a-e]$/;
    img = '../images/logoLegume.webp';
    nom = '';
    producteur = '';
    quantite = '';
    ingredient = '';
    alergenes = '';
    nutriscore = '../images/nutriscore-X.svg';
    nova = '../images/novaX.svg';
    ecoscore = '../images/ecoscore-X.svg';
    energy = '';
    sugars = '';
    salt = '';
    fat = '';
    satured = '';
    /**
     * constructeur de la class Produit
     * @param resultat
     */
    constructor(resultat) {
        if (resultat) {
            this.setImage(resultat.product.image_url);
            this.setNom(resultat.product.product_name);
            this.setProducteur(resultat.product.brands);
            this.setQuantity(resultat.product.quantity);
            this.setIngredient(resultat.product.ingredients_text_fr, resultat.product.ingredients_text);
            this.setAlergene(resultat.product.allergens_tags);
            this.setNutriscores(resultat.product.nutriscore_grade);
            this.setNova(resultat.product.nova_group);
            this.setEcoscore(resultat.product.ecoscore_grade);
            this.setEnergy(resultat.product['energy-kcal_100g']);
            this.setSugars(resultat.product.sugars_100g, resultat.product.nutrient_levels.sugars);
            this.setSalt(resultat.product.salt_100g, resultat.product.nutrient_levels.salt);
            this.setFat(resultat.product.fat_100g, resultat.product.nutrient_levels.fat);
            this.setSaturated(resultat.product['saturated-fat_100g'], resultat.product.nutrient_levels['saturated-fat']);
        }
    }
    /**
     * setter image
     *
     * @param {string} image_url
     * @memberof Produit
     */
    setImage(image_url) {
        if (image_url) {
            this.img = image_url;
        }
    }
    /**
     * setter nom
     *
     * @param {string} product_name
     * @memberof Produit
     */
    setNom(product_name) {
        if (product_name) {
            this.nom = product_name;
        }
    }
    /**
     * setter producteur
     *
     * @param {string} brands
     * @memberof Produit
     */
    setProducteur(brands) {
        if (brands) {
            this.producteur = brands;
        }
    }
    /**
     * setter quantity
     *
     * @param {string} quantity
     * @memberof Produit
     */
    setQuantity(quantity) {
        if (quantity) {
            this.quantite = quantity;
        }
    }
    /**
     * setter ingredient
     *
     * @param {string} ingredients_text_fr
     * @param {string} ingredients_text
     * @memberof Produit
     */
    setIngredient(ingredients_text, ingredients_text_fr) {
        if (ingredients_text_fr) {
            this.ingredient = ingredients_text_fr;
        }
        else if (ingredients_text) {
            this.ingredient = ingredients_text;
        }
    }
    /**
     * setter Alergene
     *
     * @param {Array<string>} allergens_tags
     * @memberof Produit
     */
    setAlergene(allergens_tags) {
        if (allergens_tags) {
            const alergenesLst = allergens_tags;
            let listAlergenes = '';
            for (let element of alergenesLst) {
                listAlergenes += element.substring(3) + ', ';
            }
            this.alergenes = listAlergenes;
        }
    }
    /**
     * setter nutriscore
     *
     * @param {string} nutriscore_grade
     * @memberof Produit
     */
    setNutriscores(nutriscore_grade) {
        if (nutriscore_grade && this.regexScoreLettre.test(nutriscore_grade)) {
            this.nutriscore = '/images/nutriscore-' + nutriscore_grade + '.svg';
        }
    }
    /**
     * setter Nova
     *
     * @param {number} nova_group
     * @memberof Produit
     */
    setNova(nova_group) {
        if (nova_group && nova_group <= 4 && nova_group >= 1) {
            this.nova = '/images/nova' + nova_group + '.svg';
        }
    }
    /**
     * setter ecoscore
     *
     * @param {string} ecoscore_grade
     * @memberof Produit
     */
    setEcoscore(ecoscore_grade) {
        if (ecoscore_grade && this.regexScoreLettre.test(ecoscore_grade)) {
            this.ecoscore = '/images/ecoscore-' + ecoscore_grade + '.svg';
        }
    }
    /**
     * setter energy
     *
     * @param {number} energy
     * @memberof Produit
     */
    setEnergy(energy) {
        if (energy) {
            const ajr = ' (' + energy / 20 + '% des AJR)';
            this.energy = '<td>Calories : </td><td>' + energy + ' kcal</td><td>' + ajr + '</td>';
        }
    }
    /**
     * setter sugars
     *
     * @param {number} sugars_100g
     * @param {string} sugars
     * @memberof Produit
     */
    setSugars(sugars_100g, sugars) {
        if (sugars_100g && sugars) {
            this.sugars =
                '<td>Glucides : </td><td>' + sugars_100g + ' g</td><td>' + this.nutrimentlvl(sugars) + '</td>';
        }
    }
    /**
     * setter salt
     *
     * @param {number} salt_100g
     * @param {string} salt
     * @memberof Produit
     */
    setSalt(salt_100g, salt) {
        if (salt_100g && salt) {
            this.salt = '<td>Sodium : </td><td>' + salt_100g + ' g</td><td>' + this.nutrimentlvl(salt) + '</td>';
        }
    }
    /**
     * setter fat
     *
     * @param {number} fat_100g
     * @param {string} fat
     * @memberof Produit
     */
    setFat(fat_100g, fat) {
        if (fat_100g && fat) {
            this.fat = '<td>Lipides :  </td><td>' + fat_100g + ' g</td><td>' + this.nutrimentlvl(fat) + '</td>';
        }
    }
    /**
     * setter Saturated fat
     *
     * @param {number} saturated_100g
     * @param {string} saturated
     * @memberof Produit
     */
    setSaturated(saturated_100g, saturated) {
        if (saturated_100g && saturated) {
            this.satured =
                '<td>Acide gras saturés : </td><td>' +
                    saturated_100g +
                    ' g</td><td>' +
                    this.nutrimentlvl(saturated) +
                    '</td>';
        }
    }
    /**
     *affiche le produit dans la page
     *
     * @memberof Produit
     */
    afficherProduit() {
        this.afficherImage();
        this.afficherNom();
        this.afficherProducteur();
        this.afficherQuantity();
        this.afficherIngredient();
        this.afficherAlergene();
        this.afficherNutriscore();
        this.afficherNova();
        this.afficherEcoscore();
        this.afficherEnergie();
        this.afficherSucre();
        this.afficherSel();
        this.afficherGraisse();
        this.afficherSaturer();
    }
    afficherImage() {
        const imageProduit = document.getElementById('img-produit');
        imageProduit.src = this.img;
    }
    afficherNom() {
        const nomProduit = document.getElementById('nom-produit');
        nomProduit.innerText = this.nom;
    }
    afficherProducteur() {
        const nomProducteur = document.getElementById('nom-producteur');
        nomProducteur.innerText = this.producteur;
    }
    afficherQuantity() {
        const quantity = document.getElementById('quantity');
        quantity.innerText = this.quantite;
    }
    afficherIngredient() {
        const ingredients = document.getElementById('ingredients');
        ingredients.innerText = this.ingredient;
    }
    afficherAlergene() {
        const alergenes = document.getElementById('alergene');
        alergenes.innerHTML = this.alergenes;
    }
    afficherNutriscore() {
        const imageNutriscore = document.getElementById('img-nutriscore');
        imageNutriscore.src = this.nutriscore;
    }
    afficherNova() {
        const imageNova = document.getElementById('img-nova');
        imageNova.src = this.nova;
    }
    afficherEcoscore() {
        const imgEcoscore = document.getElementById('img-ecoscore');
        imgEcoscore.src = this.ecoscore;
    }
    afficherEnergie() {
        const energy = document.getElementById('energy');
        energy.innerHTML = this.energy;
    }
    afficherSucre() {
        const sucre = document.getElementById('sugars');
        sucre.innerHTML = this.sugars;
    }
    afficherSel() {
        const salt = document.getElementById('salt');
        salt.innerHTML = this.salt;
    }
    afficherGraisse() {
        const fat = document.getElementById('fat');
        fat.innerHTML = this.fat;
    }
    afficherSaturer() {
        const saturated = document.getElementById('saturated-fat');
        saturated.innerHTML = this.satured;
    }
    /**
     * renvoi une pastille de couleur en fonction de niveau de qualité
     *
     * @param {string} level
     * @return {string}
     * @memberof Produit
     */
    nutrimentlvl(level) {
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
}
