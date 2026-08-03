import {
    hands,
    type Deck,
    type Hand,
    type PlayerDeck,
    type PlayerHand,
} from "./gameLogic";
import CardButton from "./CardButton";

export type CardPadProps = {
    onCardSelect?: (value: PlayerHand) => void;
    deck?: Deck | PlayerDeck;
    orientation?: "player" | "opponent";
    tutorialHand?: Hand;
};

export default function CardPad({
    onCardSelect,
    deck,
    orientation = "player",
    tutorialHand,
}: CardPadProps) {
    const activeTutorialHand =
        orientation === "player" ? tutorialHand : undefined;
    const hasGuchopa =
        orientation === "player" &&
        deck !== undefined &&
        "グチョパ" in deck &&
        deck.グチョパ > 0;
    const displayedHands: PlayerHand[] = hasGuchopa
        ? [...hands, "グチョパ"]
        : hands;

    return (
        <div
            className={`card-pad card-pad--${orientation} ${activeTutorialHand ? "card-pad--tutorial" : ""} ${hasGuchopa ? "card-pad--has-guchopa" : ""}`}
        >
            {activeTutorialHand ? (
                <div className="card-tutorial__overlay" aria-hidden="true" />
            ) : null}
            {displayedHands.map((hand) => {
                const isTutorialTarget = activeTutorialHand === hand;
                const count =
                    hand === "グチョパ"
                        ? deck && "グチョパ" in deck
                            ? deck.グチョパ
                            : 0
                        : deck?.[hand];

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
                            count={count}
                            displayOnly={orientation === "opponent"}
                            orientation={orientation}
                            disabled={
                                orientation === "player" &&
                                (!onCardSelect ||
                                    (count ?? 1) <= 0 ||
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
