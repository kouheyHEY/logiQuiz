import { render, screen } from "@testing-library/react";
import BattleStage from "./BattleStage";

describe("BattleStage", () => {
    it("公開フェーズでは相手カードにめくり状態を付ける", () => {
        const { container } = render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "チョキ",
                    result: "win",
                    phase: "revealing",
                }}
            />,
        );

        expect(
            container.querySelector(".battle-card--opponent"),
        ).toHaveClass("is-revealed");
        expect(screen.getByText("オープン！")).toBeInTheDocument();
    });

    it("結果フェーズで勝敗を表示する", () => {
        render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "チョキ",
                    result: "win",
                    phase: "resolved",
                }}
            />,
        );

        expect(screen.getByText("勝利！")).toBeInTheDocument();
    });
});
