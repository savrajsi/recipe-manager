import { Recipe, Ingredient, ShoppingListItem, ShoppingList } from './types';

// Unit conversion constants and mappings
const VOLUME_CONVERSIONS: Record<string, number> = {
    // All conversions to fluid ounces as base unit
    'cup': 8,
    'cups': 8,
    'c': 8,
    'fl oz': 1,
    'fl. oz': 1,
    'fluid ounce': 1,
    'fluid ounces': 1,
    'oz': 1, // Assume fluid oz for liquids
    'tbsp': 0.5,
    'tablespoon': 0.5,
    'tablespoons': 0.5,
    'tsp': 0.167,
    'teaspoon': 0.167,
    'teaspoons': 0.167,
    'ml': 0.034,
    'l': 33.814,
    'liter': 33.814,
    'liters': 33.814,
    'pint': 16,
    'pints': 16,
    'pt': 16,
    'quart': 32,
    'quarts': 32,
    'qt': 32,
    'gallon': 128,
    'gallons': 128,
    'gal': 128
};

const WEIGHT_CONVERSIONS: Record<string, number> = {
    // All conversions to ounces as base unit
    'oz': 1,
    'ounce': 1,
    'ounces': 1,
    'lb': 16,
    'pound': 16,
    'pounds': 16,
    'lbs': 16,
    'g': 0.035,
    'gram': 0.035,
    'grams': 0.035,
    'kg': 35.274,
    'kilogram': 35.274,
    'kilograms': 35.274
};

// Categories that typically use volume measurements
const LIQUID_CATEGORIES = ['liquid', 'oil', 'condiment', 'sauce', 'dairy'];
const BAKING_CATEGORIES = ['baking', 'flour', 'sugar'];

// Utility function to parse ingredient amount (handles fractions and decimals)
export const parseAmount = (amount: string): number => {
    if (amount.includes('/')) {
        const [numerator, denominator] = amount.split('/').map(Number);
        return numerator / denominator;
    }
    return parseFloat(amount) || 0;
};

// Normalize unit names for better matching
export const normalizeUnit = (unit: string): string => {
    return unit.toLowerCase().trim().replace(/\.$/, ''); // Remove trailing period
};

// Check if two units are convertible
export const areUnitsConvertible = (unit1: string, unit2: string, category: string): boolean => {
    const norm1 = normalizeUnit(unit1);
    const norm2 = normalizeUnit(unit2);

    // Same unit is always convertible
    if (norm1 === norm2) return true;

    // Check if both are volume units
    const isVolume1 = norm1 in VOLUME_CONVERSIONS;
    const isVolume2 = norm2 in VOLUME_CONVERSIONS;

    // Check if both are weight units
    const isWeight1 = norm1 in WEIGHT_CONVERSIONS;
    const isWeight2 = norm2 in WEIGHT_CONVERSIONS;

    // For liquid/baking categories, prioritize volume conversions
    if (LIQUID_CATEGORIES.includes(category) || BAKING_CATEGORIES.includes(category)) {
        return isVolume1 && isVolume2;
    }

    // For other categories, allow both volume and weight conversions
    return (isVolume1 && isVolume2) || (isWeight1 && isWeight2);
};

// Convert amount between compatible units
export const convertUnits = (amount: number, fromUnit: string, toUnit: string, category: string): { amount: number; unit: string } => {
    const normFrom = normalizeUnit(fromUnit);
    const normTo = normalizeUnit(toUnit);

    // No conversion needed
    if (normFrom === normTo) {
        return { amount, unit: toUnit };
    }

    // Try volume conversion first for liquid/baking categories
    if ((LIQUID_CATEGORIES.includes(category) || BAKING_CATEGORIES.includes(category)) &&
        normFrom in VOLUME_CONVERSIONS && normTo in VOLUME_CONVERSIONS) {

        const baseAmount = amount * VOLUME_CONVERSIONS[normFrom];
        const convertedAmount = baseAmount / VOLUME_CONVERSIONS[normTo];
        return { amount: convertedAmount, unit: toUnit };
    }

    // Try weight conversion
    if (normFrom in WEIGHT_CONVERSIONS && normTo in WEIGHT_CONVERSIONS) {
        const baseAmount = amount * WEIGHT_CONVERSIONS[normFrom];
        const convertedAmount = baseAmount / WEIGHT_CONVERSIONS[normTo];
        return { amount: convertedAmount, unit: toUnit };
    }

    // Try volume conversion as fallback
    if (normFrom in VOLUME_CONVERSIONS && normTo in VOLUME_CONVERSIONS) {
        const baseAmount = amount * VOLUME_CONVERSIONS[normFrom];
        const convertedAmount = baseAmount / VOLUME_CONVERSIONS[normTo];
        return { amount: convertedAmount, unit: toUnit };
    }

    // No conversion possible, return original
    return { amount, unit: fromUnit };
};

// Choose the best unit for display (prefer common cooking units)
export const chooseBestUnit = (units: string[], category: string): string => {
    const normalized = units.map(normalizeUnit);

    // Preference order for different categories
    const volumePreference = ['cups', 'cup', 'tbsp', 'tsp', 'fl oz', 'oz'];
    const weightPreference = ['lb', 'oz', 'g'];
    // const countPreference = ['pieces', 'items', 'leaves', 'cloves']; // Future use

    // For liquid/baking categories, prefer volume units
    if (LIQUID_CATEGORIES.includes(category) || BAKING_CATEGORIES.includes(category)) {
        for (const preferred of volumePreference) {
            if (normalized.includes(preferred)) {
                return units[normalized.indexOf(preferred)];
            }
        }
    }

    // For protein/meat categories, prefer weight units
    if (category === 'protein' || category === 'meat') {
        for (const preferred of weightPreference) {
            if (normalized.includes(preferred)) {
                return units[normalized.indexOf(preferred)];
            }
        }
    }

    // Return the first unit as fallback
    return units[0];
};

// Aggregate ingredients from multiple recipes
export const aggregateIngredients = (
    recipes: Recipe[],
    ingredients: Ingredient[],
    servingAdjustments: Record<string, number> = {}
): ShoppingListItem[] => {
    const ingredientMap = new Map<string, Ingredient>();
    ingredients.forEach(ing => ingredientMap.set(ing.id, ing));

    const aggregatedMap = new Map<string, {
        ingredient: Ingredient;
        amounts: { amount: number; unit: string; recipeId: string; recipeName: string }[];
    }>();

    // Collect all ingredient usages
    recipes.forEach(recipe => {
        const servingMultiplier = servingAdjustments[recipe.id] || 1;

        recipe.ingredients.forEach(recipeIngredient => {
            const ingredient = ingredientMap.get(recipeIngredient.ingredientId);
            if (!ingredient) return;

            const amount = parseAmount(recipeIngredient.amount) * servingMultiplier;

            if (!aggregatedMap.has(ingredient.id)) {
                aggregatedMap.set(ingredient.id, {
                    ingredient,
                    amounts: []
                });
            }

            aggregatedMap.get(ingredient.id)!.amounts.push({
                amount,
                unit: recipeIngredient.unit,
                recipeId: recipe.id,
                recipeName: recipe.title
            });
        });
    });

    // Convert to ShoppingListItems with intelligent unit conversion
    const shoppingListItems: ShoppingListItem[] = [];

    aggregatedMap.forEach(({ ingredient, amounts }) => {
        // Group amounts by convertible units
        const unitGroups = new Map<string, { amount: number; unit: string; recipes: string[]; recipeNames: string[] }>();

        amounts.forEach(({ amount, unit, recipeId, recipeName }) => {
            let groupKey = normalizeUnit(unit);
            let targetUnit = unit;
            let convertedAmount = amount;

            // Try to find an existing compatible unit group
            for (const [existingUnit] of unitGroups) {
                if (areUnitsConvertible(unit, existingUnit, ingredient.category)) {
                    const conversion = convertUnits(amount, unit, existingUnit, ingredient.category);
                    groupKey = normalizeUnit(existingUnit);
                    targetUnit = existingUnit;
                    convertedAmount = conversion.amount;
                    break;
                }
            }

            if (!unitGroups.has(groupKey)) {
                unitGroups.set(groupKey, {
                    amount: 0,
                    unit: targetUnit,
                    recipes: [],
                    recipeNames: []
                });
            }

            const group = unitGroups.get(groupKey)!;
            group.amount += convertedAmount;
            if (!group.recipes.includes(recipeId)) {
                group.recipes.push(recipeId);
                group.recipeNames.push(recipeName);
            }
        });

        // Create shopping list items for each unit group
        unitGroups.forEach(({ amount, unit, recipes, recipeNames }) => {
            // Choose the best unit for display
            const allUnitsInGroup = amounts
                .filter(a => areUnitsConvertible(a.unit, unit, ingredient.category))
                .map(a => a.unit);
            const bestUnit = chooseBestUnit([...new Set(allUnitsInGroup)], ingredient.category);

            // Convert to best unit if different
            const finalConversion = convertUnits(amount, unit, bestUnit, ingredient.category);

            shoppingListItems.push({
                ingredientId: ingredient.id,
                name: ingredient.name,
                category: ingredient.category,
                totalAmount: Math.round(finalConversion.amount * 100) / 100, // Round to 2 decimal places
                unit: finalConversion.unit,
                originalUnit: unit,
                recipes,
                recipeNames
            });
        });
    });

    return shoppingListItems.sort((a, b) => a.name.localeCompare(b.name));
};

// Group shopping list items by category
export const groupByCategory = (items: ShoppingListItem[]): Record<string, ShoppingListItem[]> => {
    const grouped: Record<string, ShoppingListItem[]> = {};

    // Define category order for better UX (future use for sorting)
    // const categoryOrder = [
    //     'produce', 'vegetable', 'fruit', 'meat', 'protein', 'seafood',
    //     'dairy', 'baking', 'grain', 'cereal', 'pasta', 'condiment',
    //     'sauce', 'oil', 'spice', 'herb', 'other'
    // ];

    items.forEach(item => {
        const category = item.category || 'other';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(item);
    });

    // Sort items within each category
    Object.keys(grouped).forEach(category => {
        grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
};

// Generate a complete shopping list
export const generateShoppingList = (
    recipes: Recipe[],
    ingredients: Ingredient[],
    servingAdjustments: Record<string, number> = {}
): ShoppingList => {
    const items = aggregateIngredients(recipes, ingredients, servingAdjustments);
    const groupedByCategory = groupByCategory(items);

    return {
        id: `shopping-list-${Date.now()}`,
        items,
        recipeIds: recipes.map(r => r.id),
        recipeNames: recipes.map(r => r.title),
        createdAt: new Date().toISOString(),
        groupedByCategory
    };
};
