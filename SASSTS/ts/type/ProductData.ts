export type ProductData = {
	code: string;
	product: {
		allergens_tags: Array<string>;
		brands: string;
		ecoscore_grade: string;
		"energy-kcal_100g": number;
		fat_100g: number;
		image_url: string;
		ingredients_text: string;
		ingredients_text_fr: string;
		nova_group: number;
		nutrient_levels: {
			fat: string;
			salt: string;
			"saturated-fat": string;
			sugars: string;
		};
		nutriscore_grade: string;
		product_name: string;
		quantity: string;
		salt_100g: number;
		"saturated-fat_100g": number;
		sugars_100g: number;
	};
	status: number;
	status_verbose: string;
};
