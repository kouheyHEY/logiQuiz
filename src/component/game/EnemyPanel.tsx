import { ShieldAlert } from "lucide-react";
import { useTypewriterText } from "../../hooks/useTypewriterText";
import type { Deck } from "./gameLogic";
import type { EnemyProfile } from "./enemyLogic";
import CardPad from "./CardPad";

export type EnemyPanelProps = {
    opponentNumber: number;
    profile: EnemyProfile;
    deck: Deck;
    line: string;
    currentWins?: number;
};

export default function EnemyPanel({
    opponentNumber,
    profile,
    deck,
    line,
    currentWins = 0,
}: EnemyPanelProps) {
    const { displayedText, isComplete } = useTypewriterText(line);
    const remainingWins = Math.max(
        0,
        (profile.requiredWins ?? 1) - currentWins,
    );

    return (
        <section className="enemy-panel" aria-label={`対戦相手 ${profile.name}`}>
            <div className="enemy-panel__heading">
                <div>
                    <span className="enemy-panel__number">
                        対戦相手 {opponentNumber}
                    </span>
                    <h1 className="enemy-panel__name">{profile.name}</h1>
                </div>
                {profile.isStrong ? (
                    <span className="enemy-panel__strong-tag">
                        <ShieldAlert size={12} />
                        強敵
                    </span>
                ) : null}
            </div>

            <p className="enemy-panel__trait">{profile.trait}</p>

            <blockquote className="enemy-panel__speech" aria-live="polite">
                <span className="visually-hidden">{line}</span>
                <span aria-hidden="true">{displayedText}</span>
                {!isComplete ? (
                    <span
                        className="message-window__cursor"
                        aria-hidden="true"
                    />
                ) : null}
            </blockquote>

            <div className="enemy-panel__cards">
                <CardPad deck={deck} orientation="opponent" />
                {profile.isStrong ? (
                    <span className="enemy-panel__wins">
                        撃破まであと {remainingWins} 勝
                    </span>
                ) : null}
            </div>
        </section>
    );
}
