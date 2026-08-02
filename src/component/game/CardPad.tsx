import type { Deck, Hand } from "./gameLogic";
import CardButton from "./CardButton";

export type CardPadProps = {
    onCardSelect?: (value: Hand) => void;
    deck?: Deck;
    orientation?: "player" | "opponent";
    tutorialHand?: Hand;
};

const hands: Hand[] = ["グー", "チョキ", "パー"];

export default function CardPad({
    onCardSelect,
    deck,
    orientation = "player",
    tutorialHand,
}: CardPadProps) {
    const activeTutorialHand =
        orientation === "player" ? tutorialHand : undefined;

    return (
        <div
            className={`card-pad card-pad--${orientation} ${activeTutorialHand ? "card-pad--tutorial" : ""}`}
        >
            {activeTutorialHand ? (
                <div className="card-tutorial__overlay" aria-hidden="true" />
            ) : null}
            {hands.map((hand) => {
                const isTutorialTarget = activeTutorialHand === hand;

                return (
                    <div
                        className={`card-pad__item ${isTutorialTarget ? "is-tutorial-target" : ""}`}
                        key={hand}
                    >
                        {isTutorialTarget ? (
                            <div className="card-tutorial__hint" role="status">
                                パーを選んでみよう
                            </div>
                        ) : null}
                        <CardButton
                            label={hand}
                            count={deck?.[hand]}
                            displayOnly={orientation === "opponent"}
                            orientation={orientation}
                            disabled={
                                orientation === "player" &&
                                (!onCardSelect ||
                                    (deck?.[hand] ?? 1) <= 0 ||
                                    (activeTutorialHand !== undefined &&
                                        !isTutorialTarget))
                            }
                            onClick={() => onCardSelect?.(hand)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
