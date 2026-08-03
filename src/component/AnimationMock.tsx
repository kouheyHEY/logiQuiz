import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { BattleSequence } from "../hooks/useBattleSequence";
import GameLayout from "./game/GameLayout";
import { initialDeck, type JudgeResult } from "./game/gameLogic";
import { strongEnemies } from "./game/enemyLogic";

type PreviewEvent = "win" | "lose" | "draw";

const previews: Record<
    PreviewEvent,
    {
        label: string;
        resultText: string;
        sequence: BattleSequence;
        life: number;
        winStreak: number;
        aikoCount: number;
        message: string;
    }
> = {
    win: {
        label: "勝利",
        resultText: "WIN",
        sequence: {
            playerHand: "グー",
            opponentHand: "チョキ",
            result: "win",
            phase: "resolved",
        },
        life: 2,
        winStreak: 6,
        aikoCount: 0,
        message: "勝利しました！次の対戦へ進みます。",
    },
    lose: {
        label: "敗北",
        resultText: "LOSE",
        sequence: {
            playerHand: "チョキ",
            opponentHand: "グー",
            result: "lose",
            phase: "resolved",
        },
        life: 1,
        winStreak: 0,
        aikoCount: 0,
        message: "敗北しました。ライフを 1 失いました。",
    },
    draw: {
        label: "AIKO",
        resultText: "AIKO",
        sequence: {
            playerHand: "パー",
            opponentHand: "パー",
            result: "draw",
            phase: "resolved",
        },
        life: 1.5,
        winStreak: 0,
        aikoCount: 1,
        message: "あいこです。AIKO が 1 増え、ライフを 0.5 失いました。",
    },
};

const resultClass: Record<JudgeResult, string> = {
    win: "animation-mock--win",
    lose: "animation-mock--lose",
    draw: "animation-mock--draw",
};

export default function AnimationMock() {
    const [previewEvent, setPreviewEvent] = useState<PreviewEvent>("win");
    const [replayKey, setReplayKey] = useState(0);
    const preview = previews[previewEvent];
    const enemy = strongEnemies[1];

    const selectPreview = (nextEvent: PreviewEvent) => {
        setPreviewEvent(nextEvent);
        setReplayKey((current) => current + 1);
    };

    return (
        <main className={`animation-mock ${resultClass[preview.sequence.result]}`}>
            <nav className="animation-mock__controls" aria-label="アニメーションモック">
                <span className="animation-mock__title">演出モック</span>
                <div className="animation-mock__tabs">
                    {(Object.keys(previews) as PreviewEvent[]).map((event) => (
                        <button
                            type="button"
                            className={previewEvent === event ? "is-active" : ""}
                            aria-pressed={previewEvent === event}
                            onClick={() => selectPreview(event)}
                            key={event}
                        >
                            {previews[event].label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="animation-mock__replay"
                    aria-label="アニメーションをもう一度再生"
                    onClick={() => setReplayKey((current) => current + 1)}
                >
                    <RotateCcw size={16} aria-hidden="true" />
                    再生
                </button>
            </nav>

            <div className="animation-mock__viewport" key={`${previewEvent}-${replayKey}`}>
                <div className="game-view">
                    <GameLayout
                        life={preview.life}
                        winStreak={preview.winStreak}
                        aikoCount={preview.aikoCount}
                        opponentNumber={7}
                        enemy={enemy}
                        enemyDeck={enemy.deck}
                        enemyLine="……"
                        enemyCurrentWins={0}
                        battleSequence={preview.sequence}
                        message={preview.message}
                        isMessageVisible
                        deck={initialDeck}
                    />
                </div>

                <div className="animation-mock__event-layer" aria-hidden="true">
                    <span>{preview.resultText}</span>
                </div>

                {previewEvent === "draw" ? (
                    <div className="animation-mock__hud-feedback" aria-hidden="true">
                        <span className="animation-mock__aiko-change">+1</span>
                        <span className="animation-mock__life-change">−0.5</span>
                    </div>
                ) : null}
            </div>
        </main>
    );
}
