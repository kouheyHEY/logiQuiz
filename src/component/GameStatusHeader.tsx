/**
 * 引数の型
 */
import { Heart, Trophy, Equal } from "lucide-react";
import { INITIAL_LIFE } from "./game/gameLogic";

export type GameHeaderProps = {
    /** ライフ */
    life?: number;
    /** 連勝数 */
    winStreak: number;
    /** あいこの累計数 */
    aikoCount: number;
};

/**
 * ゲーム画面でのヘッダ
 * @param props プロパティ
 * @returns ヘッダ
 */
export default function GameHeader({
    life = INITIAL_LIFE,
    winStreak,
    aikoCount,
}: GameHeaderProps) {
    return (
        <div className="game-header">
            <div className="game-header__content">
                <div className="game-header__row">
                    <h2>ライフ</h2>
                    <div
                        className="game-header__hearts"
                        role="img"
                        aria-label={`ライフ: ${life}`}
                    >
                        {Array.from({ length: INITIAL_LIFE }, (_, index) => {
                            const fillPercent = Math.max(
                                0,
                                Math.min(100, (life - index) * 100),
                            );

                            return (
                                <span
                                    className="game-header__heart"
                                    key={index}
                                    aria-hidden="true"
                                >
                                    <Heart className="game-header__heart-outline" />
                                    {fillPercent > 0 ? (
                                        <Heart
                                            className="game-header__heart-fill"
                                            fill="currentColor"
                                            style={{
                                                clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                                            }}
                                        />
                                    ) : null}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className="game-header__row">
                    <Trophy size={20} />
                    <h2>連勝数: {winStreak}</h2>
                </div>
                <div className="game-header__row game-header__row--aiko">
                    <Equal size={20} />
                    <h2>AIKO: {aikoCount}</h2>
                </div>
            </div>
        </div>
    );
}
