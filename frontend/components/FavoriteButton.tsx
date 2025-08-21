'use client';

import React from 'react';

interface FavoriteButtonProps {
    recipeId: string;
    isFavorite: boolean;
    onToggle: (recipeId: string) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    recipeId,
    isFavorite,
    onToggle,
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(recipeId);
    };

    return (
        <button
            onClick={handleClick}
            className={`
                transition-all duration-200 hover:scale-110 
                ${className}
            `}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                className={`${sizeClasses[size]} transition-colors duration-200`}
                fill={isFavorite ? '#ef4444' : 'none'}
                stroke={isFavorite ? '#ef4444' : 'currentColor'}
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
};

export default FavoriteButton;
