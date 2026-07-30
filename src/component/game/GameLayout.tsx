import GameHeader, { type GameHeaderProps } from "../GameStatusHeader";
import type { BattleSequence } from "../../hooks/useBattleSequence";
import BattleStage from "./BattleStage";
import EnemyPanel from "./EnemyPanel";
import type { EnemyProfile } from "./enemyLogic";
import type { GameAreaProps } from "./GameArea";
import GameArea from "./GameArea";
import type { Deck } from "./gameLogic";

export type GameLayoutProps = {
    life?: number;
    winStreak?: number;
    timeLeft?: number;
    timerState?: GameHeaderProps["timerState"];
    isTimerValid?: boolean;
    opponentNumber?: number;
    enemy?: EnemyProfile;
    enemyDeck?: Deck;
    enemyLine?: string;
    enemyCurrentWins?: number;
    battleSequence?: BattleSequence | null;
    message?: string;
    isMessageVisible?: boolean;
    isGameOver?: boolean;
    onCardSelect?: GameAreaProps["onCardSelect"];
    deck?: Deck;
};

export default function GameLayout({
    life = 1,
    winStreak = 0,
    timeLeft = 0,
    timerState = "paused",
    isTimerValid = false,
    opponentNumber = 1,
    enemy,
    enemyDeck,
    enemyLine = "",
    enemyCurrentWins = 0,
    battleSequence = null,
    message = "グー・チョキ・パーからカードを選択してください。",
    isMessageVisible = true,
    isGameOver = false,
    onCardSelect,
    deck,
}: GameLayoutProps) {
    const headerProps: GameHeaderProps = {
        life,
        winStreak,
        timeLeft,
        timerState,
        isTimerValid,
    };

    return (
        <div className="game-layout">
            <GameHeader {...headerProps} />
            {enemy && enemyDeck ? (
                <EnemyPanel
                    opponentNumber={opponentNumber}
                    profile={enemy}
                    deck={enemyDeck}
                    line={enemyLine}
                    currentWins={enemyCurrentWins}
                />
            ) : (
                <div className="game-opponent">
                    <span className="game-opponent__label">
                        対戦相手 {opponentNumber}
                    </span>
                </div>
            )}
            <BattleStage sequence={battleSequence} />
            <GameArea
                message={message}
                isMessageVisible={isMessageVisible}
                messageTone={isGameOver ? "danger" : "default"}
                onCardSelect={onCardSelect}
                deck={deck}
            />
        </div>
    );
}
