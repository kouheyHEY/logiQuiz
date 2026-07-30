import type { Deck, Hand } from "./gameLogic";
import CardButton from "./CardButton";

export type CardPadProps = {
    onCardSelect?: (value: Hand) => void;
    deck?: Deck;
    orientation?: "player" | "opponent";
};

const hands: Hand[] = ["グー", "チョキ", "パー"];

export default function CardPad({
    onCardSelect,
    deck,
    orientation = "player",
}: CardPadProps) {
    return (
        <div className={`card-pad card-pad--${orientation}`}>
            {hands.map((hand) => (
                <CardButton
                    key={hand}
                    label={hand}
                    count={deck?.[hand]}
                    displayOnly={orientation === "opponent"}
                    orientation={orientation}
                    disabled={
                        orientation === "player" &&
                        (!onCardSelect || (deck?.[hand] ?? 1) <= 0)
                    }
                    onClick={() => onCardSelect?.(hand)}
                />
            ))}
        </div>
    );
}
