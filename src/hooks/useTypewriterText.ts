import { useEffect, useMemo, useState } from "react";

export type TypewriterOptions = {
    enabled?: boolean;
    characterDelay?: number;
};

const punctuationPattern = /[、。！？!?]/;

export function getTypewriterDelay(
    character: string,
    characterDelay: number,
): number {
    return punctuationPattern.test(character)
        ? characterDelay * 4
        : characterDelay;
}

export function useTypewriterText(
    text: string,
    { enabled = true, characterDelay = 20 }: TypewriterOptions = {},
) {
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate =
        enabled && !prefersReducedMotion && characterDelay > 0;
    const animationKey = `${text}\u0000${enabled}\u0000${characterDelay}\u0000${prefersReducedMotion}`;
    const characters = useMemo(() => Array.from(text), [text]);
    const [animation, setAnimation] = useState(() => ({
        key: animationKey,
        displayedText: shouldAnimate ? "" : enabled ? text : "",
        isComplete: !shouldAnimate || characters.length === 0,
    }));

    useEffect(() => {
        if (!shouldAnimate || characters.length === 0) {
            return;
        }

        let currentIndex = 0;
        let timeoutId: number | undefined;

        const revealNextCharacter = () => {
            currentIndex += 1;
            const isComplete = currentIndex >= characters.length;
            setAnimation({
                key: animationKey,
                displayedText: characters.slice(0, currentIndex).join(""),
                isComplete,
            });

            if (!isComplete) {
                timeoutId = window.setTimeout(
                    revealNextCharacter,
                    getTypewriterDelay(
                        characters[currentIndex - 1],
                        characterDelay,
                    ),
                );
            }
        };

        timeoutId = window.setTimeout(revealNextCharacter, characterDelay);

        return () => {
            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [animationKey, characterDelay, characters, shouldAnimate]);

    if (animation.key !== animationKey) {
        return {
            displayedText: shouldAnimate ? "" : enabled ? text : "",
            isComplete: !shouldAnimate || characters.length === 0,
        };
    }

    return {
        displayedText: animation.displayedText,
        isComplete: animation.isComplete,
    };
}
