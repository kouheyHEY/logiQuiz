import MessageWindow from "../MessageWindow";
import CardPad, { type CardPadProps } from "./CardPad";

export type GameAreaProps = {
    message: string;
    isMessageVisible?: boolean;
    onCardSelect?: CardPadProps["onCardSelect"];
    deck?: CardPadProps["deck"];
    messageTone?: "default" | "danger";
    tutorialHand?: CardPadProps["tutorialHand"];
};

export default function GameArea({
    message,
    isMessageVisible = true,
    onCardSelect,
    deck,
    messageTone = "default",
    tutorialHand,
}: GameAreaProps) {
    return (
        <div className="game-area">
            <CardPad
                onCardSelect={onCardSelect}
                deck={deck}
                tutorialHand={tutorialHand}
            />
            <MessageWindow
                message={message}
                isVisible={isMessageVisible}
                tone={messageTone}
            />
        </div>
    );
}
