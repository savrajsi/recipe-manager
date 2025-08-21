// Enhanced OR approach with visual tag grouping
export const TAG_GROUPS = {
    dietary: {
        label: 'Dietary',
        tags: ['vegetarian', 'vegan']
    },
    style: {
        label: 'Style & Occasion',
        tags: ['healthy', 'family', 'baking', 'salad', 'seafood']
    }
} as const;

// Meal time options (radio button style, like difficulty)
export const MEAL_TIME_OPTIONS = ['breakfast', 'lunch', 'dinner', 'dessert'] as const;

// Flattened list for backward compatibility (excluding meal time and dietary since they're handled separately)
export const FILTER_OPTIONS = {
    tags: [
        ['italian', 'asian', 'mexican', 'greek', 'japanese', 'indian'], // cuisine tags
        ...TAG_GROUPS.style.tags
    ].flat(),
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    difficulty: ['easy', 'medium', 'hard'] as const,
    sort: [
        { value: 'newest' as const, label: 'Newest First' },
        { value: 'prep-time' as const, label: 'Prep Time' },
        { value: 'difficulty' as const, label: 'Difficulty' },
        { value: 'calories' as const, label: 'Calories' }
    ]
} as const;

export const DEBOUNCE_DELAY = 300;

// Popular ingredients for quick selection (based on frequency in recipes)
export const POPULAR_INGREDIENTS = [
    'chicken', 'flour', 'tomato', 'olive oil', 'onion',
    'butter', 'cheese', 'eggs', 'pasta', 'rice'
] as const;

export type SortOption = 'newest' | 'prep-time' | 'difficulty' | 'calories';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
