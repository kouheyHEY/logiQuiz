import { useState } from "react";
import {
    useBattleSequence,
    type BattlePayload,
} from "../hooks/useBattleSequence";
import GameLayout from "./game/GameLayout";
import type { PlayerHand } from "./game/gameLogic";
import {
    calculateRemainingLife,
    INITIAL_LIFE,
    initialDeck,
    judgeResult,
} from "./game/gameLogic";
import {
    advanceEnemyTurn,
    createEnemyBattleState,
    createEnemyLoopState,
    getNextEnemyAfterVictory,
    tutorialEnemy,
} from "./game/enemyLogic";
import {
    completeTutorial,
    hasCompletedTutorial,
} from "./game/tutorialStorage";

function GameView() {
    const [life, setLife] = useState(INITIAL_LIFE);
    const [winStreak, setWinStreak] = useState(0);
    const [aikoCount, setAikoCount] = useState(0);
    const [currentOpponent, setCurrentOpponent] = useState(1);
    const [message, setMessage] = useState(
        "グー・チョキ・パーのいずれかを選択してください。",
    );
    const [gameOver, setGameOver] = useState(false);
    const [enemyState, setEnemyState] = useState(() =>
        createEnemyBattleState(tutorialEnemy),
    );
    const [enemyLoop, setEnemyLoop] = useState(() =>
        createEnemyLoopState(),
    );
    const [strongEnemyWins, setStrongEnemyWins] = useState(0);
    const [guchopaCount, setGuchopaCount] = useState(0);
    const [showCardTutorial, setShowCardTutorial] = useState(
        () => !hasCompletedTutorial(),
    );

    const isStrongEnemyBattle =
        enemyState.profile.isStrong === true && !gameOver;

    const resolveBattle = ({
        opponentHand: opponent,
        result,
    }: BattlePayload) => {
        const nextEnemyState = advanceEnemyTurn(enemyState);

        if (isStrongEnemyBattle) {
            if (result === "draw") {
                const nextLife = calculateRemainingLife(life, result);
                setAikoCount((prev) => prev + 1);
                setLife(nextLife);
                if (nextLife <= 0) {
                    setGameOver(true);
                    setMessage(
                        `強敵の出した手は ${opponent}。あいこでライフを 0.5 失い、ゲームオーバーです。`,
                    );
                    return;
                }
                setEnemyState(nextEnemyState);
                setMessage(
                    `強敵の出した手は ${opponent}。あいこでライフを 0.5 失いました。`,
                );
                return;
            }

            if (result === "lose") {
                const nextLife = calculateRemainingLife(life, result);
                setLife(nextLife);
                if (nextLife <= 0) {
                    setGameOver(true);
                    setMessage(
                        `強敵の出した手は ${opponent}。敗北しました。ライフが 0 になりゲームオーバーです。`,
                    );
                    return;
                }
                setEnemyState(createEnemyBattleState(enemyState.profile));
                setMessage(
                    `強敵の出した手は ${opponent}。敗北しました。ライフを 1 失い、同じ相手との対戦を続行します。`,
                );
                return;
            }

            const nextWins = strongEnemyWins + 1;
            setStrongEnemyWins(nextWins);
            if (nextWins >= (enemyState.profile.requiredWins ?? 1)) {
                const nextOpponent = currentOpponent + 1;
                const nextEncounter = getNextEnemyAfterVictory(
                    enemyState.profile,
                    enemyLoop,
                );
                setCurrentOpponent(nextOpponent);
                setEnemyState(createEnemyBattleState(nextEncounter.profile));
                setEnemyLoop(nextEncounter.loop);
                setStrongEnemyWins(0);
                setWinStreak((prev) => prev + 1);
                setGuchopaCount((prev) => prev + 1);
                setMessage(
                    `強敵を撃破しました！無敵の手「グチョパ」を手に入れました。`,
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
            const nextLife = calculateRemainingLife(life, result);
            setAikoCount((prev) => prev + 1);
            setLife(nextLife);
            if (nextLife <= 0) {
                setGameOver(true);
                setMessage(
                    `相手の出した手は ${opponent}。あいこでライフを 0.5 失い、ゲームオーバーです。`,
                );
                return;
            }
            setEnemyState(nextEnemyState);
            setMessage(
                `相手の出した手は ${opponent}。あいこでライフを 0.5 失いました。`,
            );
            return;
        }

        if (result === "win") {
            setWinStreak((prev) => prev + 1);
            const nextOpponent = currentOpponent + 1;
            const nextEncounter = getNextEnemyAfterVictory(
                enemyState.profile,
                enemyLoop,
            );
            setCurrentOpponent(nextOpponent);
            setEnemyState(createEnemyBattleState(nextEncounter.profile));
            setEnemyLoop(nextEncounter.loop);
            setStrongEnemyWins(0);
            setMessage(
                `相手の出した手は ${opponent}。勝利しました！次の対戦へ進みます。`,
            );
            return;
        }

        const nextLife = calculateRemainingLife(life, result);
        setLife(nextLife);
        if (nextLife <= 0) {
            setGameOver(true);
            setMessage(
                `相手の出した手は ${opponent}。敗北しました。ライフが 0 になりゲームオーバーです。`,
            );
            return;
        }
        setWinStreak(0);
        setEnemyState(createEnemyBattleState(enemyState.profile));
        setMessage(
            `相手の出した手は ${opponent}。敗北しました。同じ相手との対戦を続行します。`,
        );
    };

    const {
        sequence: battleSequence,
        isPlaying: isBattlePlaying,
        start: startBattle,
        finish: finishBattle,
    } = useBattleSequence(resolveBattle, { holdResolved: gameOver });

    const handleRetry = () => {
        finishBattle();

        const nextEnemyLoop = createEnemyLoopState();
        const retryProfile =
            enemyState.profile.id === tutorialEnemy.id
                ? tutorialEnemy
                : getNextEnemyAfterVictory(
                      tutorialEnemy,
                      nextEnemyLoop,
                  ).profile;

        setCurrentOpponent(1);
        setEnemyLoop(nextEnemyLoop);
        setEnemyState(createEnemyBattleState(retryProfile));
        setStrongEnemyWins(0);
        setWinStreak(0);
        setGuchopaCount(0);

        setLife(INITIAL_LIFE);
        setGameOver(false);
        setMessage(
            "ライフを回復し、相手とボスまでの進行をリセットしました。",
        );
    };

    const handleCardSelect = (chosen: PlayerHand) => {
        if (
            gameOver ||
            isBattlePlaying
        ) {
            return;
        }

        const opponent = enemyState.plannedHand;
        if (chosen === "グチョパ") {
            if (guchopaCount <= 0) {
                return;
            }
            setGuchopaCount((prev) => Math.max(0, prev - 1));
        }
        if (showCardTutorial && chosen === "パー") {
            completeTutorial();
            setShowCardTutorial(false);
        }
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
                opponentNumber={currentOpponent}
                enemy={enemyState.profile}
                enemyDeck={enemyState.deck}
                enemyLine={enemyState.line}
                enemyCurrentWins={strongEnemyWins}
                battleSequence={battleSequence}
                message={message}
                isMessageVisible
                isGameOver={gameOver}
                deck={{
                    ...initialDeck,
                    グチョパ: guchopaCount,
                }}
                tutorialHand={showCardTutorial ? "パー" : undefined}
                onRetry={handleRetry}
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
