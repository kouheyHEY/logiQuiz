import { render, screen } from "@testing-library/react";
import { normalEnemies, strongEnemies } from "./enemyLogic";
import EnemyPanel from "./EnemyPanel";

describe("EnemyPanel", () => {
    it("通常敵にも固定の敵ライフ領域を表示する", () => {
        const profile = normalEnemies[0];
        const { container } = render(
            <EnemyPanel
                opponentNumber={2}
                profile={profile}
                deck={profile.deck}
                line={profile.line}
            />,
        );

        expect(screen.getByLabelText("敵ライフ: 1 / 1")).toBeInTheDocument();
        expect(
            container.querySelectorAll(".enemy-panel__life-heart"),
        ).toHaveLength(1);
        expect(
            container.querySelectorAll(".enemy-panel__life-heart.is-active"),
        ).toHaveLength(1);
    });

    it("強敵への勝利に応じてハートの塗りだけを減らす", () => {
        const profile = strongEnemies[0];
        const { container, rerender } = render(
            <EnemyPanel
                opponentNumber={5}
                profile={profile}
                deck={profile.deck}
                line={profile.line}
                currentWins={0}
            />,
        );

        expect(screen.getByLabelText("敵ライフ: 2 / 2")).toBeInTheDocument();
        expect(
            container.querySelectorAll(".enemy-panel__life-heart"),
        ).toHaveLength(2);

        rerender(
            <EnemyPanel
                opponentNumber={5}
                profile={profile}
                deck={profile.deck}
                line={profile.line}
                currentWins={1}
            />,
        );

        expect(screen.getByLabelText("敵ライフ: 1 / 2")).toBeInTheDocument();
        expect(
            container.querySelectorAll(".enemy-panel__life-heart"),
        ).toHaveLength(2);
        expect(
            container.querySelectorAll(".enemy-panel__life-heart.is-active"),
        ).toHaveLength(1);
        expect(
            container.querySelectorAll(".enemy-panel__life-heart.is-empty"),
        ).toHaveLength(1);
    });
});
