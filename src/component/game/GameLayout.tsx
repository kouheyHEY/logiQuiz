import GameHeader, { type GameHeaderProps } from "../GameStatusHeader";
import type { BattleSequence } from "../../hooks/useBattleSequence";
import BattleStage from "./BattleStage";
import EnemyPanel from "./EnemyPanel";
import type { EnemyProfile } from "./enemyLogic";
import type { GameAreaProps } from "./GameArea";
import GameArea from "./GameArea";
import { INITIAL_LIFE, type Deck, type Hand } from "./gameLogic";

export type GameLayoutProps = {
    life?: number;
    winStreak?: number;
    aikoCount?: number;
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
    tutorialHand?: Hand;
    onRetry?: () => void;
};

export default function GameLayout({
    life = INITIAL_LIFE,
    winStreak = 0,
    aikoCount = 0,
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
    tutorialHand,
    onRetry,
}: GameLayoutProps) {
    const headerProps: GameHeaderProps = {
        life,
        winStreak,
        aikoCount,
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
            <BattleStage
                sequence={battleSequence}
                isGameOver={isGameOver}
                onRetry={onRetry}
            />
            <GameArea
                message={message}
                isMessageVisible={isMessageVisible}
                messageTone={isGameOver ? "danger" : "default"}
                onCardSelect={onCardSelect}
                deck={deck}
                tutorialHand={tutorialHand}
            />
        </div>
    );
}
