import {
    advanceEnemyTurn,
    createEnemyBattleState,
    createEnemyLine,
    getEnemyForOpponent,
    strongEnemies,
} from "./enemyLogic";

describe("enemyLogic", () => {
    it("通常敵3種を順番に選ぶ", () => {
        expect(getEnemyForOpponent(1).name).toBe("グーを出したい男");
        expect(getEnemyForOpponent(2).name).toBe("チョキが大好きな女");
        expect(getEnemyForOpponent(3).name).toBe("手のひら関");
        expect(getEnemyForOpponent(4).name).toBe("グーを出したい男");
    });

    it("10人ごとに強敵を交互に選ぶ", () => {
        expect(getEnemyForOpponent(10).name).toBe("嘘松");
        expect(getEnemyForOpponent(20).name).toBe("抵抗する男");
        expect(getEnemyForOpponent(30).name).toBe("嘘松");
    });

    it("嘘松は嘘をつく判定で実際と異なる手を宣言する", () => {
        const line = createEnemyLine(strongEnemies[0], "グー", () => 0);
        expect(line).not.toContain("次はグー");
    });

    it("敵が手を出しても使用可能な手は消費されない", () => {
        const initial = createEnemyBattleState(1, () => 0);
        expect(initial.plannedHand).toBe("グー");

        const next = advanceEnemyTurn(initial, () => 0);
        expect(next.deck.グー).toBe(Infinity);
        expect(next.plannedHand).toBe("グー");
    });
});
