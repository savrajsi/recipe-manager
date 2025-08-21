import express, { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import {
    RecipeData,
    Recipe,
    RecipeIngredient,
    Ingredient,
    RecipeWithNutrition,
    DetailedRecipe,
    DetailedRecipeIngredient,
    RecipeQueryParams
} from './types';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// In-memory cache for recipe data
let dataCache: RecipeData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for production (perfect for Railway deployment)

// Enhanced getData with caching
const getData = async (): Promise<RecipeData> => {
    const now = Date.now();

    // Return cached data if it's still fresh
    if (dataCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('📦 Using cached data');
        return dataCache;
    }

    // Read fresh data from file
    console.log('💾 Reading fresh data from disk...');
    const data = await fs.readFile(path.join(__dirname, '../db/data.json'), 'utf8');
    dataCache = JSON.parse(data) as RecipeData;
    cacheTimestamp = now;

    console.log('✅ Data cache refreshed - will be valid for 30 minutes');
    return dataCache;
};

// Utility function to parse ingredient amount (handles fractions and decimals)
const parseAmount = (amount: string): number => {
    // Handle fractions like "1/3", "0.5", "2.25", etc.
    if (amount.includes('/')) {
        const [numerator, denominator] = amount.split('/').map(Number);
        return numerator / denominator;
    }
    return parseFloat(amount) || 0;
};

const getNutritionForIngredient = (recipeIngredient: RecipeIngredient, ingredient: Ingredient) => {
    const amount = parseAmount(recipeIngredient.amount);
    const unit = recipeIngredient.unit.toLowerCase();
    const baseNutrition = ingredient.nutrition;

    // Debug: Show input values
    console.log(`DEBUG: ${ingredient.name} - category: "${ingredient.category}", unit: "${unit}", amount: ${amount}`);

    // Default multiplier - will be adjusted based on unit conversions
    let multiplier = amount;

    /*
     * Unit-aware nutrition calculation based on ingredient category
     * Handles the fact that nutrition databases use different base units:
     * - Meat/dairy: typically per 100g (standard nutrition labeling)
     * - Baking ingredients: typically per cup (standard cooking measurement)
     * - Oils/condiments: typically per tablespoon (standard serving size)
     * - Produce: typically per piece/item (natural unit)
     */
    switch (ingredient.category) {
        case 'dairy':
        case 'meat':
        case 'seafood':
        case 'protein':
            console.log(`DEBUG: Hit dairy/meat/seafood/protein case for ${ingredient.name}`);
            // Nutrition data is typically per 100g (FDA standard for nutrition labels)
            if (unit === 'g' || unit === 'grams') {
                multiplier = amount / 100; // Convert grams to 100g portions
                console.log(`DEBUG: Using grams conversion: ${amount} / 100 = ${multiplier}`);
            } else if (unit === 'lb' || unit === 'pound') {
                // 1 pound = 454 grams (standard conversion)
                multiplier = (amount * 454) / 100; // Convert lb → grams → 100g portions
                console.log(`DEBUG: Using pounds conversion: (${amount} * 454) / 100 = ${multiplier}`);
            } else if (unit === 'oz' || unit === 'ounce') {
                // 1 ounce = 28.35 grams (standard conversion)
                multiplier = (amount * 28.35) / 100; // Convert oz → grams → 100g portions
                console.log(`DEBUG: Using ounces conversion: (${amount} * 28.35) / 100 = ${multiplier}`);
            }
            break;

        case 'baking':
        case 'grain':
        case 'cereal':
        case 'pasta':
            console.log(`DEBUG: Hit baking/grain/cereal/pasta case for ${ingredient.name}`);
            // Baking ingredients typically measured per cup in recipes
            if (unit === 'cup' || unit === 'cups') {
                multiplier = amount; // Nutrition data is per cup
                console.log(`DEBUG: Using cups conversion: ${amount} cups = ${multiplier}`);
            } else if (unit === 'lb' || unit === 'pound') {
                // For pasta: nutrition data is per 100g, recipe uses pounds
                // 1 pound = 454 grams (standard conversion)
                multiplier = (amount * 454) / 100; // Convert lb → grams → 100g portions
                console.log(`DEBUG: Using pounds-to-grams conversion: (${amount} * 454) / 100 = ${multiplier}`);
            }
            break;

        case 'dairy-alternative':
            console.log(`DEBUG: Hit dairy-alternative case for ${ingredient.name}`);
            // Liquid alternatives typically measured in metric
            if (unit === 'ml' || unit === 'milliliter') {
                multiplier = amount / 100; // Nutrition data per 100ml (standard for liquids)
                console.log(`DEBUG: Using ml conversion: ${amount} / 100 = ${multiplier}`);
            } else if (unit === 'cup' || unit === 'cups') {
                // 1 US cup = 240 milliliters (standard conversion)
                multiplier = (amount * 240) / 100; // Convert cups → ml → 100ml portions
                console.log(`DEBUG: Using cups-to-ml conversion: (${amount} * 240) / 100 = ${multiplier}`);
            }
            break;

        case 'oil':
        case 'condiment':
        case 'sweetener':
        case 'spice':
            console.log(`DEBUG: Hit oil/condiment/sweetener/spice case for ${ingredient.name}`);
            // Small quantities typically measured per tablespoon/teaspoon
            if (unit === 'tbsp' || unit === 'tablespoon') {
                multiplier = amount; // Nutrition data is per tablespoon
                console.log(`DEBUG: Using tablespoon conversion: ${amount} tbsp = ${multiplier}`);
            } else if (unit === 'tsp' || unit === 'teaspoon') {
                // 1 tablespoon = 3 teaspoons (standard conversion)
                multiplier = amount / 3; // Convert tsp → tbsp
                console.log(`DEBUG: Using teaspoon conversion: ${amount} / 3 = ${multiplier}`);
            }
            break;

        case 'vegetable':
        case 'fruit':
        case 'herb':
        case 'seaweed':
            console.log(`DEBUG: Hit vegetable/fruit/herb/seaweed case for ${ingredient.name}`);
            // Produce typically measured per piece/item (natural units)
            if (unit === 'large' || unit === 'medium' || unit === 'small' || unit === 'whole' ||
                unit === 'head' || unit === 'leaves' || unit === 'sheets' || unit === 'pieces') {
                multiplier = amount; // Nutrition data is per piece/item
                console.log(`DEBUG: Using piece/item conversion: ${amount} ${unit} = ${multiplier}`);
            } else if (unit === 'cup' || unit === 'cups') {
                multiplier = amount; // For measured vegetables (like chopped broccoli)
                console.log(`DEBUG: Using cups conversion for vegetables: ${amount} cups = ${multiplier}`);
            }
            break;

        case 'legume':
            console.log(`DEBUG: Hit legume case for ${ingredient.name}`);
            // Canned goods typically measured per can
            if (unit === 'can') {
                multiplier = amount; // Nutrition data is per can
                console.log(`DEBUG: Using can conversion: ${amount} can = ${multiplier}`);
            }
            break;

        // Default case: assume nutrition data matches recipe unit (multiplier = amount)
        default:
            console.log(`DEBUG: Using default case for ${ingredient.name} (category: ${ingredient.category})`);
    }

    console.log(`DEBUG: Final multiplier for ${ingredient.name}: ${multiplier}`);
    console.log(`DEBUG: Final calories: ${baseNutrition.calories} * ${multiplier} = ${baseNutrition.calories * multiplier}`);

    // Apply the calculated multiplier to all nutrition values
    return {
        calories: baseNutrition.calories * multiplier,
        protein: baseNutrition.protein * multiplier,
        carbs: baseNutrition.carbs * multiplier,
        fat: baseNutrition.fat * multiplier
    };
};

const calculateRecipeNutrition = (recipe: Recipe, ingredientsDb: Ingredient[]) => {
    const totalNutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    };

    recipe.ingredients.forEach(recipeIngredient => {
        const ingredient = ingredientsDb.find(ing => ing.id === recipeIngredient.ingredientId);
        if (ingredient) {
            const nutrition = getNutritionForIngredient(recipeIngredient, ingredient);

            totalNutrition.calories += nutrition.calories;
            totalNutrition.protein += nutrition.protein;
            totalNutrition.carbs += nutrition.carbs;
            totalNutrition.fat += nutrition.fat;

            // Debug logging to verify calculations
            console.log(`${recipeIngredient.amount} ${recipeIngredient.unit} ${ingredient.name}: ${Math.round(nutrition.calories)} calories`);
        }
    });

    console.log(`Total recipe calories: ${Math.round(totalNutrition.calories)}`);
    return totalNutrition;
};

// Add calories per serving to recipe
const addCaloriesPerServing = (recipe: Recipe, ingredientsDb: Ingredient[]): RecipeWithNutrition => {
    const totalNutrition = calculateRecipeNutrition(recipe, ingredientsDb);
    const caloriesPerServing = Math.round(totalNutrition.calories / recipe.servings);

    return {
        ...recipe,
        caloriesPerServing
    };
};

// Create detailed recipe with full ingredient information
const createDetailedRecipe = (recipe: Recipe, ingredientsDb: Ingredient[]): DetailedRecipe | null => {
    const detailedIngredients: DetailedRecipeIngredient[] = [];

    for (const recipeIngredient of recipe.ingredients) {
        const ingredient = ingredientsDb.find(ing => ing.id === recipeIngredient.ingredientId);
        if (!ingredient) {
            console.warn(`Ingredient not found: ${recipeIngredient.ingredientId}`);
            return null;
        }

        detailedIngredients.push({
            ...recipeIngredient,
            ingredient
        });
    }

    const totalNutrition = calculateRecipeNutrition(recipe, ingredientsDb);
    const caloriesPerServing = Math.round(totalNutrition.calories / recipe.servings);

    return {
        id: recipe.id,
        title: recipe.title,
        slug: recipe.slug,
        imageUrl: recipe.imageUrl,
        description: recipe.description,
        servings: recipe.servings,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        instructions: recipe.instructions,
        tags: recipe.tags,
        dateAdded: recipe.dateAdded,
        ingredients: detailedIngredients,
        totalNutrition,
        caloriesPerServing
    };
};

// Filter recipes based on query parameters
const filterRecipes = (recipes: Recipe[], query: RecipeQueryParams, ingredientsDb: Ingredient[]): Recipe[] => {
    return recipes.filter(recipe => {
        // Search in title, description, and ingredient names
        if (query.search) {
            const searchLower = query.search.toLowerCase();
            const matchesSearch =
                recipe.title.toLowerCase().includes(searchLower) ||
                recipe.description.toLowerCase().includes(searchLower) ||
                recipe.ingredients.some(recipeIng => {
                    const ingredient = ingredientsDb.find(ing => ing.id === recipeIng.ingredientId);
                    return ingredient && ingredient.name.toLowerCase().includes(searchLower);
                });
            if (!matchesSearch) return false;
        }

        // Filter by difficulty
        if (query.difficulty && recipe.difficulty !== query.difficulty) {
            return false;
        }

        // Filter by meal time (check if recipe has the meal time tag)
        if (query.mealTime) {
            const mealTimeLower = query.mealTime.toLowerCase();
            const hasMealTimeTag = recipe.tags.some(tag =>
                tag.toLowerCase() === mealTimeLower
            );
            if (!hasMealTimeTag) return false;
        }

        // Filter by tags
        if (query.tags) {
            const queryTags = query.tags.split(',').map(tag => tag.trim().toLowerCase());
            const hasMatchingTag = queryTags.some(queryTag =>
                recipe.tags.some(recipeTag => recipeTag.toLowerCase().includes(queryTag))
            );
            if (!hasMatchingTag) return false;
        }

        // Filter by ingredients
        if (query.ingredients) {
            const queryIngredients = query.ingredients.split(',').map(ing => ing.trim().toLowerCase());
            const hasMatchingIngredient = queryIngredients.some(queryIng =>
                recipe.ingredients.some(recipeIng => {
                    const ingredient = ingredientsDb.find(ing => ing.id === recipeIng.ingredientId);
                    return ingredient && (
                        recipeIng.ingredientId.toLowerCase().includes(queryIng) ||
                        ingredient.name.toLowerCase().includes(queryIng)
                    );
                })
            );
            if (!hasMatchingIngredient) return false;
        }

        return true;
    });
};

// GET /api/recipes - with search/filter and calories per serving
app.get('/api/recipes', async (req: Request, res: Response) => {
    try {
        const data = await getData();
        const query: RecipeQueryParams = {
            search: req.query.search as string,
            tags: req.query.tags as string,
            ingredients: req.query.ingredients as string,
            difficulty: req.query.difficulty as 'easy' | 'medium' | 'hard',
            mealTime: req.query.mealTime as string  // Added meal time support
        };

        // Filter recipes based on query parameters
        const filteredRecipes = filterRecipes(data.recipes, query, data.ingredients);

        // Add calories per serving to each recipe
        const recipesWithNutrition: RecipeWithNutrition[] = filteredRecipes.map(recipe =>
            addCaloriesPerServing(recipe, data.ingredients)
        );

        res.json(recipesWithNutrition);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// GET /api/recipes/:identifier - with full ingredient details (supports both ID and slug)
app.get('/api/recipes/:identifier', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getData();
        const { identifier } = req.params;

        // Try to find by ID first, then by slug
        let recipe = data.recipes.find(r => r.id === identifier);
        if (!recipe) {
            recipe = data.recipes.find(r => r.slug === identifier);
        }

        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found' }); return;
        }

        // Create detailed recipe with full ingredient information
        const detailedRecipe = createDetailedRecipe(recipe, data.ingredients);

        if (!detailedRecipe) {
            res.status(500).json({ error: 'Failed to load recipe ingredients' }); return;
        }

        res.json(detailedRecipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});

// Utility function to scale ingredient amounts
const scaleIngredientAmount = (amount: string, scaleFactor: number): string => {
    const numAmount = parseAmount(amount);
    const scaledAmount = numAmount * scaleFactor;

    // Handle common fractions for better UX
    const commonFractions: { [key: number]: string } = {
        0.0625: '1/16',
        0.083: '1/12',
        0.1: '1/10',
        0.111: '1/9',
        0.125: '1/8',
        0.143: '1/7',
        0.167: '1/6',
        0.1875: '3/16',
        0.2: '1/5',
        0.222: '2/9',
        0.25: '1/4',
        0.286: '2/7',
        0.3: '3/10',
        0.3125: '5/16',
        0.333: '1/3',
        0.375: '3/8',
        0.4: '2/5',
        0.4167: '5/12',
        0.429: '3/7',
        0.4375: '7/16',
        0.444: '4/9',
        0.5: '1/2',
        0.5625: '9/16',
        0.556: '5/9',
        0.571: '4/7',
        0.5833: '7/12',
        0.6: '3/5',
        0.625: '5/8',
        0.6667: '2/3',
        0.6875: '11/16',
        0.7: '7/10',
        0.714: '5/7',
        0.75: '3/4',
        0.778: '7/9',
        0.8: '4/5',
        0.8125: '13/16',
        0.833: '5/6',
        0.857: '6/7',
        0.875: '7/8',
        0.889: '8/9',
        0.9: '9/10',
        0.9167: '11/12',
        0.9375: '15/16'
    };

    // Check if the scaled amount is close to a common fraction
    for (const [decimal, fraction] of Object.entries(commonFractions)) {
        if (Math.abs(scaledAmount - parseFloat(decimal)) < 0.01) {
            return fraction;
        }
    }

    // For mixed numbers (e.g., 1.5 -> 1 1/2)
    if (scaledAmount >= 1) {
        const wholePart = Math.floor(scaledAmount);
        const fractionalPart = scaledAmount - wholePart;

        for (const [decimal, fraction] of Object.entries(commonFractions)) {
            if (Math.abs(fractionalPart - parseFloat(decimal)) < 0.01) {
                return wholePart > 0 ? `${wholePart} ${fraction}` : fraction;
            }
        }
    }

    // Round to 2 decimal places and remove trailing zeros
    return parseFloat(scaledAmount.toFixed(2)).toString();
};

// Scale a detailed recipe to a new serving size
const scaleDetailedRecipe = (recipe: DetailedRecipe, newServings: number): DetailedRecipe => {
    const scaleFactor = newServings / recipe.servings;

    // Scale ingredients
    const scaledIngredients = recipe.ingredients.map(ingredient => ({
        ...ingredient,
        amount: scaleIngredientAmount(ingredient.amount, scaleFactor)
    }));

    // Scale nutrition (total nutrition scales, per-serving stays the same)
    const scaledTotalNutrition = {
        calories: recipe.totalNutrition.calories * scaleFactor,
        protein: recipe.totalNutrition.protein * scaleFactor,
        carbs: recipe.totalNutrition.carbs * scaleFactor,
        fat: recipe.totalNutrition.fat * scaleFactor
    };

    return {
        ...recipe,
        servings: newServings,
        ingredients: scaledIngredients,
        totalNutrition: scaledTotalNutrition,
        // caloriesPerServing stays the same since it's per serving
    };
};

// GET /api/recipes/:identifier/scale/:servings - get scaled recipe
app.get('/api/recipes/:identifier/scale/:servings', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getData();
        const { identifier, servings } = req.params;
        const newServings = parseInt(servings);

        // Validate servings
        if (isNaN(newServings) || newServings < 1 || newServings > 50) {
            res.status(400).json({ error: 'Invalid serving size. Must be between 1 and 50.' });
            return;
        }

        // Find recipe by ID or slug
        let recipe = data.recipes.find(r => r.id === identifier);
        if (!recipe) {
            recipe = data.recipes.find(r => r.slug === identifier);
        }

        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }

        // Create detailed recipe
        const detailedRecipe = createDetailedRecipe(recipe, data.ingredients);
        if (!detailedRecipe) {
            res.status(500).json({ error: 'Failed to load recipe ingredients' });
            return;
        }

        // Scale the recipe
        const scaledRecipe = scaleDetailedRecipe(detailedRecipe, newServings);

        res.json(scaledRecipe);
    } catch (error) {
        console.error('Error scaling recipe:', error);
        res.status(500).json({ error: 'Failed to scale recipe' });
    }
});

// Cache management endpoints for development
app.post('/api/cache/clear', (_req: Request, res: Response) => {
    dataCache = null;
    cacheTimestamp = 0;
    console.log('🧹 Cache cleared manually');
    res.json({
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/cache/status', (_req: Request, res: Response) => {
    const now = Date.now();
    const isValid = dataCache && (now - cacheTimestamp) < CACHE_DURATION;
    const timeRemaining = isValid ? Math.round((CACHE_DURATION - (now - cacheTimestamp)) / 1000) : 0;

    res.json({
        cached: !!dataCache,
        valid: isValid,
        timeRemainingSeconds: timeRemaining,
        lastRefreshed: cacheTimestamp ? new Date(cacheTimestamp).toISOString() : null
    });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});