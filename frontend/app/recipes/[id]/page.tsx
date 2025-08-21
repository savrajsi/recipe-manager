import { notFound } from 'next/navigation';
import { DetailedRecipe } from '@/types/recipe';
import { RecipePageClient } from '@/components/RecipePageClient';

async function getRecipe(identifier: string): Promise<DetailedRecipe | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/recipes/${identifier}`, {
            cache: 'no-store' // Ensure fresh data for development
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch recipe');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
}

interface RecipePageProps {
    params: Promise<{ id: string }>; // Note: 'id' param now accepts both IDs and slugs
}

export default async function RecipePage({ params }: RecipePageProps) {
    const { id } = await params; // 'id' can be either numeric ID or slug
    const recipe = await getRecipe(id);

    if (!recipe) {
        notFound();
    }

    return <RecipePageClient recipe={recipe} />;
}
