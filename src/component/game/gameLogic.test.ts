import {
    calculateRecoveredLife,
    calculateRemainingLife,
    hands,
    INITIAL_LIFE,
    initialDeck,
    judgeResult,
    mapNumberToHand,
    normalizeDeck,
} from "./gameLogic";

describe("gameLogic", () => {
    it("ライフ2で開始し、あいこで0.5・敗北で1減る", () => {
        expect(INITIAL_LIFE).toBe(2);
        expect(calculateRemainingLife(2, "draw")).toBe(1.5);
        expect(calculateRemainingLife(2, "lose")).toBe(1);
        expect(calculateRemainingLife(2, "win")).toBe(2);
        expect(calculateRemainingLife(0.5, "lose")).toBe(0);
    });

    it("回復は最大ライフ2を超えず、ゲームオーバー後は復活しない", () => {
        expect(calculateRecoveredLife(1, 0.5)).toBe(1.5);
        expect(calculateRecoveredLife(1.5, 0.5)).toBe(2);
        expect(calculateRecoveredLife(2, 0.5)).toBe(2);
        expect(calculateRecoveredLife(0, 0.5)).toBe(0);
    });

    it("maps numeric input to the correct hand choices in a loop", () => {
        const expected = [
            "グー",
            "チョキ",
            "パー",
            "グー",
            "チョキ",
            "パー",
        ] as const;
        for (let value = 1; value <= expected.length; value += 1) {
            expect(mapNumberToHand(value)).toBe(expected[value - 1]);
        }
    });

    it("プレイヤーはすべての手を無制限に使える", () => {
        expect(initialDeck).toEqual({
            グー: Infinity,
            チョキ: Infinity,
            パー: Infinity,
            グチョパ: 0,
        });
    });

    it("judges all hand combinations correctly using loops", () => {
        const winsAgainstMap = {
            グー: "チョキ",
            チョキ: "パー",
            パー: "グー",
        } as const;

        for (const player of hands) {
            for (const opponent of hands) {
                const expected =
                    player === opponent
                        ? "draw"
                        : winsAgainstMap[player] === opponent
                          ? "win"
                          : "lose";
                expect(judgeResult(player, opponent)).toBe(expected);
            }
        }
    });

    it("カード状態を使用不可0または無制限に正規化する", () => {
        expect(
            normalizeDeck({
                グー: -5,
                チョキ: 10,
                パー: 2,
            }),
        ).toEqual({
            グー: 0,
            チョキ: Infinity,
            パー: Infinity,
        });
    });

    it("グチョパは通常のすべての手に勝つ", () => {
        for (const opponent of hands) {
            expect(judgeResult("グチョパ", opponent)).toBe("win");
        }
    });
});
