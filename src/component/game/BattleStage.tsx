import { Hand, HandFist, Scissors, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BattleSequence } from "../../hooks/useBattleSequence";
import type { Hand as HandType } from "./gameLogic";

export type BattleStageProps = {
    sequence: BattleSequence | null;
    onRetry?: () => void;
};

const handIcons: Record<HandType, LucideIcon> = {
    グー: HandFist,
    チョキ: Scissors,
    パー: Hand,
};

const resultLabels = {
    win: "勝利！",
    lose: "敗北",
    draw: "あいこ",
} as const;

function Face({
    hand,
    owner,
}: {
    hand: HandType;
    owner: "あなた" | "相手";
}) {
    const Icon = handIcons[hand];

    return (
        <div className="battle-card__face battle-card__face--front">
            <Icon size={42} strokeWidth={1.8} />
            <span>{owner}</span>
            <strong>{hand}</strong>
        </div>
    );
}

export default function BattleStage({ sequence, onRetry }: BattleStageProps) {
    if (!sequence) {
        return (
            <section
                className="battle-stage battle-stage--idle"
                aria-hidden="true"
            >
                <div className="battle-stage__field" />
                <div className="battle-stage__result" />
            </section>
        );
    }

    const isRevealed = sequence.phase !== "dealing";
    const isResolved = sequence.phase === "resolved";

    return (
        <section
            className={`battle-stage battle-stage--${sequence.phase} battle-stage--${sequence.result}`}
            aria-live="polite"
            aria-label={
                isResolved
                    ? `あなたは${sequence.playerHand}、相手は${sequence.opponentHand}。${resultLabels[sequence.result]}`
                    : "カードを公開しています"
            }
        >
            <div className="battle-stage__field">
                <div className="battle-card battle-card--player">
                    <div className="battle-card__inner">
                        <Face hand={sequence.playerHand} owner="あなた" />
                    </div>
                </div>

                <div className="battle-stage__versus">VS</div>

                <div
                    className={`battle-card battle-card--opponent ${isRevealed ? "is-revealed" : ""}`}
                >
                    <div className="battle-card__inner">
                        <div className="battle-card__face battle-card__face--back">
                            <Sparkles size={38} />
                            <span>相手</span>
                            <strong>?</strong>
                        </div>
                        <Face hand={sequence.opponentHand} owner="相手" />
                    </div>
                </div>
            </div>

            <div className="battle-stage__result" aria-hidden="true">
                {isResolved
                    ? resultLabels[sequence.result]
                    : isRevealed
                      ? "オープン！"
                      : "カードを出す…"}
            </div>

            {isResolved && sequence.result === "lose" && onRetry ? (
                <button
                    type="button"
                    className="battle-stage__retry"
                    onClick={onRetry}
                >
                    リトライ
                </button>
            ) : null}

            {isResolved && sequence.result === "draw" ? (
                <div className="battle-stage__aiko-overlay" aria-hidden="true">
                    <span>AIKO</span>
                </div>
            ) : null}
        </section>
    );
}
