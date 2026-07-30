import MessageWindow from "../MessageWindow";
import CardPad, { type CardPadProps } from "./CardPad";

export type GameAreaProps = {
    message: string;
    isMessageVisible?: boolean;
    onCardSelect?: CardPadProps["onCardSelect"];
    deck?: CardPadProps["deck"];
    messageTone?: "default" | "danger";
};

export default function GameArea({
    message,
    isMessageVisible = true,
    onCardSelect,
    deck,
    messageTone = "default",
}: GameAreaProps) {
    return (
        <div className="game-area">
            <CardPad onCardSelect={onCardSelect} deck={deck} />
            <MessageWindow
                message={message}
                isVisible={isMessageVisible}
                tone={messageTone}
            />
        </div>
    );
}
