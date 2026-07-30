/**
 * 引数の型
 */
import { Heart, Trophy, Clock2, Equal } from "lucide-react";

export type GameHeaderProps = {
    /** ライフ */
    life?: number;
    /** 連勝数 */
    winStreak: number;
    /** あいこの累計数 */
    aikoCount: number;
    /** 残り時間 */
    timeLeft: number;
    /** タイマーの状態 */
    timerState: "running" | "paused" | "finished";
    /** タイマー有効状態 */
    isTimerValid: boolean;
};

/**
 * ゲーム画面でのヘッダ
 * @param props プロパティ
 * @returns ヘッダ
 */
export default function GameHeader({
    life = 1,
    winStreak,
    aikoCount,
    timeLeft,
    isTimerValid,
}: GameHeaderProps) {
    return (
        <div className="game-header">
            <div className="game-header__content">
                <div className="game-header__row">
                    <Heart size={20} />
                    <h2>ライフ: {life}</h2>
                </div>
                <div className="game-header__row">
                    <Trophy size={20} />
                    <h2>連勝数: {winStreak}</h2>
                </div>
                <div className="game-header__row game-header__row--aiko">
                    <Equal size={20} />
                    <h2>AIKO: {aikoCount}</h2>
                </div>
                <div className="game-header__row">
                    <Clock2 size={20} />
                    <h2>残り時間: {isTimerValid ? timeLeft : "∞"}</h2>
                </div>
            </div>
        </div>
    );
}
