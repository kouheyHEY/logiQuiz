import {
    advanceEnemyTurn,
    createEnemyBattleState,
    createEnemyLoopState,
    createEnemyLine,
    getNextEnemyAfterVictory,
    normalEnemies,
    strongEnemies,
    tutorialEnemy,
} from "./enemyLogic";

describe("enemyLogic", () => {
    it("最初の敵はグーだけを出し、パーで勝てると教える", () => {
        const initial = createEnemyBattleState(tutorialEnemy, () => 0.99);
        expect(initial.plannedHand).toBe("グー");
        expect(initial.deck).toEqual({ グー: Infinity, チョキ: 0, パー: 0 });
        expect(initial.line).toContain("パーなら勝てる");
    });

    it("チュートリアル後は通常敵をランダムに選ぶ", () => {
        const loop = createEnemyLoopState(() => 0);
        expect(
            getNextEnemyAfterVictory(tutorialEnemy, loop, () => 0).profile.id,
        ).toBe(normalEnemies[0].id);
        expect(
            getNextEnemyAfterVictory(tutorialEnemy, loop, () => 0.99).profile
                .id,
        ).toBe(normalEnemies[2].id);
    });

    it("強敵までの通常敵数を3〜5人から抽選する", () => {
        expect(createEnemyLoopState(() => 0).normalWinsRequired).toBe(3);
        expect(createEnemyLoopState(() => 0.5).normalWinsRequired).toBe(4);
        expect(createEnemyLoopState(() => 0.99).normalWinsRequired).toBe(5);
    });

    it("通常敵を設定人数倒すと強敵が出現する", () => {
        let loop = { normalWins: 0, normalWinsRequired: 3 };
        let enemy = normalEnemies[0];

        for (let wins = 1; wins <= 3; wins += 1) {
            const next = getNextEnemyAfterVictory(enemy, loop, () => 0);
            enemy = next.profile;
            loop = next.loop;
            expect(Boolean(enemy.isStrong)).toBe(wins === 3);
        }
    });

    it("強敵撃破後は通常敵へ戻り、間隔を再抽選する", () => {
        const values = [0, 0.99];
        const next = getNextEnemyAfterVictory(
            strongEnemies[0],
            { normalWins: 0, normalWinsRequired: 3 },
            () => values.shift() ?? 0,
        );

        expect(next.profile.id).toBe(normalEnemies[0].id);
        expect(next.loop).toEqual({ normalWins: 0, normalWinsRequired: 5 });
    });

    it("嘘松は嘘をつく判定で実際と異なる手を宣言する", () => {
        const line = createEnemyLine(strongEnemies[0], "グー", () => 0);
        expect(line).not.toContain("次はグー");
    });

    it("敵が手を出しても使用可能な手は消費されない", () => {
        const initial = createEnemyBattleState(normalEnemies[0], () => 0);
        expect(initial.plannedHand).toBe("グー");

        const next = advanceEnemyTurn(initial, () => 0);
        expect(next.deck.グー).toBe(Infinity);
        expect(next.plannedHand).toBe("グー");
    });
});
