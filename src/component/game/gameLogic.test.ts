import {
    hands,
    initialDeck,
    judgeResult,
    mapNumberToHand,
    normalizeDeck,
} from "./gameLogic";

describe("gameLogic", () => {
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
});
