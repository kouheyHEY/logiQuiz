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

    it("あいこの結果フェーズで画面中央演出を表示する", () => {
        const { container } = render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "グー",
                    result: "draw",
                    phase: "resolved",
                }}
            />,
        );

        expect(
            container.querySelector(".battle-stage__aiko-overlay"),
        ).toHaveTextContent("AIKO");
    });

    it("カード公開中はAIKO演出を表示しない", () => {
        const { container } = render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "グー",
                    result: "draw",
                    phase: "revealing",
                }}
            />,
        );

        expect(
            container.querySelector(".battle-stage__aiko-overlay"),
        ).not.toBeInTheDocument();
    });
});
