export interface Ingredient {
    id: string;
    name: string;
    category: string;
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    commonAllergens: string[];
    dietary: string[];
}

export interface RecipeIngredient {
    ingredientId: string;
    amount: string;
    unit: string;
}

export interface Recipe {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    description: string;
    servings: number;
    prepTime: string;
    cookTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
    ingredients: RecipeIngredient[];
    instructions: string[];
    tags: string[];
    dateAdded: string;
}

export interface RecipeData {
    recipes: Recipe[];
    ingredients: Ingredient[];
}

export interface RecipeWithNutrition extends Recipe {
    caloriesPerServing: number;
}

export interface DetailedRecipeIngredient extends RecipeIngredient {
    ingredient: Ingredient;
}

export interface DetailedRecipe extends Omit<Recipe, 'ingredients'> {
    ingredients: DetailedRecipeIngredient[];
    totalNutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    caloriesPerServing: number;
}
