import { useTypewriterText } from "../hooks/useTypewriterText";

/**
 * 引数の型
 * @type {MessageWindowProps}
 * @property {string} message - 表示するメッセージ
 * @property {boolean} isVisible - 表示状態
 */
export type MessageWindowProps = {
    message: string;
    isVisible?: boolean;
    characterDelay?: number;
    tone?: "default" | "danger";
};

/**
 * 受け取ったメッセージを表示するメッセージウインドウ
 *
 * @param {MessageWindowProps} props - メッセージと表示状態
 * @returns {JSX.Element} メッセージウインドウ
 */
export default function MessageWindow({
    message,
    isVisible = true,
    characterDelay,
    tone = "default",
}: MessageWindowProps) {
    const { displayedText, isComplete } = useTypewriterText(message, {
        enabled: isVisible,
        characterDelay,
    });

    return (
        <div className={`message-window message-window--${tone}`}>
            <div className="message-window__text" aria-live="polite">
                <span className="visually-hidden">
                    {isVisible ? message : ""}
                </span>
                <span aria-hidden="true" data-testid="typewriter-visual">
                    {displayedText}
                </span>
                {isVisible && !isComplete ? (
                    <span
                        className="message-window__cursor"
                        aria-hidden="true"
                    />
                ) : null}
            </div>
        </div>
    );
}
