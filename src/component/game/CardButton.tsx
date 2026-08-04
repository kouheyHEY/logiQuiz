import { HandFist, Scissors, Hand, HandMetal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CardButtonProps = {
    /** ボタンに表示するラベル */
    label: string | number;
    /** クリック時のコールバック */
    onClick?: () => void;
    /** 無効化フラグ */
    disabled?: boolean;
    /** 0なら使用不可、正数なら使用可能 */
    count?: number;
    /** 敵側の閲覧専用カード */
    displayOnly?: boolean;
    /** 盤面上の向き */
    orientation?: "player" | "opponent";
};

const handIcons: Record<string, LucideIcon> = {
    グー: HandFist,
    チョキ: Scissors,
    パー: Hand,
    グチョパ: HandMetal,
};

export default function CardButton({
    label,
    onClick,
    disabled = false,
    count,
    displayOnly = false,
    orientation = "player",
}: CardButtonProps) {
    const Icon = handIcons[String(label)] ?? Hand;
    const isGuchopa = String(label) === "グチョパ";
    const isAvailable = count === undefined || count > 0;
    const availabilityLabel =
        count === undefined
            ? undefined
            : isGuchopa
              ? String(count)
              : isAvailable
                ? "∞"
                : "0";
    const accessibleLabel =
        count === undefined
            ? String(label)
            : `${String(label)}、${isAvailable ? "使用可能" : "使用不可"}`;
    const className = [
        "card-button",
        `card-button--${orientation}`,
        isGuchopa ? "card-button--guchopa" : "",
        !isAvailable ? "is-unavailable" : "",
    ]
        .filter(Boolean)
        .join(" ");
    const content = (
        <>
            <span className="card-button__icon">
                <Icon size={32} />
            </span>
            <span className="card-button__label">{label}</span>
            {availabilityLabel !== undefined ? (
                <span className="card-button__count">
                    {availabilityLabel}
                </span>
            ) : null}
        </>
    );

    if (displayOnly) {
        return (
            <div className={className} role="img" aria-label={accessibleLabel}>
                {content}
            </div>
        );
    }

    return (
        <button
            type="button"
            className={className}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            aria-label={accessibleLabel}
        >
            {content}
        </button>
    );
}
