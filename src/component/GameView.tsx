import { useState } from "react";
import {
    useBattleSequence,
    type BattlePayload,
} from "../hooks/useBattleSequence";
import GameLayout from "./game/GameLayout";
import type { Hand } from "./game/gameLogic";
import { initialDeck, judgeResult } from "./game/gameLogic";
import {
    advanceEnemyTurn,
    createEnemyBattleState,
} from "./game/enemyLogic";

function GameView() {
    const [life, setLife] = useState(1);
    const [winStreak, setWinStreak] = useState(0);
    const [aikoCount, setAikoCount] = useState(0);
    const [currentOpponent, setCurrentOpponent] = useState(1);
    const [message, setMessage] = useState(
        "グー・チョキ・パーのいずれかを選択してください。",
    );
    const [gameOver, setGameOver] = useState(false);
    const [enemyState, setEnemyState] = useState(() =>
        createEnemyBattleState(1),
    );
    const [strongEnemyWins, setStrongEnemyWins] = useState(0);

    const isStrongEnemyBattle =
        enemyState.profile.isStrong === true && !gameOver;

    const resolveBattle = ({
        opponentHand: opponent,
        result,
    }: BattlePayload) => {
        const nextEnemyState = advanceEnemyTurn(enemyState);

        if (isStrongEnemyBattle) {
            if (result === "draw") {
                setAikoCount((prev) => prev + 1);
                setEnemyState(nextEnemyState);
                setMessage(
                    `強敵の出した手は ${opponent}。あいこです。`,
                );
                return;
            }

            if (result === "lose") {
                const nextLife = life - 1;
                setLife(nextLife);
                if (nextLife <= 0) {
                    setGameOver(true);
                    setMessage(
                        `強敵の出した手は ${opponent}。敗北しました。ライフが 0 になりゲームオーバーです。`,
                    );
                    return;
                }
                setEnemyState(createEnemyBattleState(currentOpponent));
                setMessage(
                    `強敵の出した手は ${opponent}。敗北しました。ライフを 1 失い、同じ相手との対戦を続行します。`,
                );
                return;
            }

            const nextWins = strongEnemyWins + 1;
            setStrongEnemyWins(nextWins);
            if (nextWins >= (enemyState.profile.requiredWins ?? 1)) {
                const nextOpponent = currentOpponent + 1;
                setCurrentOpponent(nextOpponent);
                setEnemyState(createEnemyBattleState(nextOpponent));
                setStrongEnemyWins(0);
                setWinStreak((prev) => prev + 1);
                setMessage(
                    `強敵を撃破しました！次の対戦へ進みます。`,
                );
                return;
            }
            setEnemyState(nextEnemyState);
            setMessage(
                `強敵に勝利しました！残り ${(enemyState.profile.requiredWins ?? 1) - nextWins} 回の勝利で撃破です。`,
            );
            return;
        }

        if (result === "draw") {
            setAikoCount((prev) => prev + 1);
            setEnemyState(nextEnemyState);
            setMessage(
                `相手の出した手は ${opponent}。あいこです。`,
            );
            return;
        }

        if (result === "win") {
            setWinStreak((prev) => prev + 1);
            const nextOpponent = currentOpponent + 1;
            setCurrentOpponent(nextOpponent);
            setEnemyState(createEnemyBattleState(nextOpponent));
            setStrongEnemyWins(0);
            setMessage(
                `相手の出した手は ${opponent}。勝利しました！次の対戦へ進みます。`,
            );
            return;
        }

        const nextLife = life - 1;
        setLife(nextLife);
        if (nextLife <= 0) {
            setGameOver(true);
            setMessage(
                `相手の出した手は ${opponent}。敗北しました。ライフが 0 になりゲームオーバーです。`,
            );
            return;
        }
        setWinStreak(0);
        setEnemyState(createEnemyBattleState(currentOpponent));
        setMessage(
            `相手の出した手は ${opponent}。敗北しました。同じ相手との対戦を続行します。`,
        );
    };

    const {
        sequence: battleSequence,
        isPlaying: isBattlePlaying,
        start: startBattle,
    } = useBattleSequence(resolveBattle);

    const handleCardSelect = (chosen: Hand) => {
        if (
            gameOver ||
            isBattlePlaying
        ) {
            return;
        }

        const opponent = enemyState.plannedHand;
        setMessage(`${chosen}を出した。相手のカードがめくられる……`);
        startBattle({
            playerHand: chosen,
            opponentHand: opponent,
            result: judgeResult(chosen, opponent),
        });
    };

    return (
        <div className="game-view">
            <GameLayout
                life={life}
                winStreak={winStreak}
                aikoCount={aikoCount}
                timeLeft={0}
                timerState="paused"
                isTimerValid={false}
                opponentNumber={currentOpponent}
                enemy={enemyState.profile}
                enemyDeck={enemyState.deck}
                enemyLine={enemyState.line}
                enemyCurrentWins={strongEnemyWins}
                battleSequence={battleSequence}
                message={message}
                isMessageVisible
                isGameOver={gameOver}
                deck={initialDeck}
                onCardSelect={
                    gameOver || isBattlePlaying
                        ? undefined
                        : handleCardSelect
                }
            />

        </div>
    );
}

export default GameView;
