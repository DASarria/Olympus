import { useMemo } from 'react';

/**
 * Custom hook to calculate the transform style for a carousel
 * @param index Current index in the carousel
 * @param itemWidth Width of each carousel item
 * @returns An object with transform style and className
 */
export function useCarouselTransform(index: number, itemWidth: number = 280) {
  const transformStyle = useMemo(() => {
    return { 
      transform: `translateX(-${index * itemWidth}px)`,
      className: `carousel-pos-${index}`
    };
  }, [index, itemWidth]);

  return transformStyle;
}