import { fireEvent, render, screen } from "@testing-library/react";
import BattleStage from "./BattleStage";

describe("BattleStage", () => {
    it("待機中もバトルフィールドの領域を描画する", () => {
        const { container } = render(<BattleStage sequence={null} />);

        expect(
            container.querySelector(".battle-stage--idle"),
        ).toBeInTheDocument();
        expect(
            container.querySelector(".battle-stage__field"),
        ).toBeInTheDocument();
        expect(
            container.querySelector(".battle-stage__result"),
        ).toBeInTheDocument();
    });

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
        const { container } = render(
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
        expect(
            container.querySelector(".battle-stage__event-overlay--win"),
        ).toHaveTextContent("WIN");
    });

    it("グチョパはhand-metalアイコンで表示する", () => {
        const { container } = render(
            <BattleStage
                sequence={{
                    playerHand: "グチョパ",
                    opponentHand: "グー",
                    result: "win",
                    phase: "resolved",
                }}
            />,
        );

        expect(
            container.querySelector(
                ".battle-card--player .lucide-hand-metal",
            ),
        ).toBeInTheDocument();
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
            container.querySelector(".battle-stage__event-overlay--draw"),
        ).toHaveTextContent("AIKO");
        expect(
            container.querySelector(".battle-stage__aiko-beetle"),
        ).toBeInTheDocument();
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
            container.querySelector(".battle-stage__event-overlay"),
        ).not.toBeInTheDocument();
    });

    it("敗北時は控えめなLOSE演出を表示する", () => {
        const { container } = render(
            <BattleStage
                sequence={{
                    playerHand: "チョキ",
                    opponentHand: "グー",
                    result: "lose",
                    phase: "resolved",
                }}
            />,
        );

        expect(
            container.querySelector(".battle-stage__event-overlay--lose"),
        ).toHaveTextContent("LOSE");
    });

    it("ライフが残る敗北時はリトライを表示しない", () => {
        render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "パー",
                    result: "lose",
                    phase: "resolved",
                }}
                onRetry={vi.fn()}
            />,
        );

        expect(
            screen.queryByRole("button", { name: "リトライ" }),
        ).not.toBeInTheDocument();
    });

    it("敗北でゲームオーバーになった場合はリトライを表示する", () => {
        const onRetry = vi.fn();
        render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "パー",
                    result: "lose",
                    phase: "resolved",
                }}
                isGameOver
                onRetry={onRetry}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "リトライ" }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it("あいこでゲームオーバーになった場合もリトライを表示する", () => {
        const onRetry = vi.fn();
        render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "グー",
                    result: "draw",
                    phase: "resolved",
                }}
                isGameOver
                onRetry={onRetry}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "リトライ" }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it("ライフが残る通常のあいこではリトライを表示しない", () => {
        render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "グー",
                    result: "draw",
                    phase: "resolved",
                }}
                onRetry={vi.fn()}
            />,
        );

        expect(
            screen.queryByRole("button", { name: "リトライ" }),
        ).not.toBeInTheDocument();
    });

    it("ゲームオーバーでも処理が未指定ならリトライを表示しない", () => {
        render(
            <BattleStage
                sequence={{
                    playerHand: "グー",
                    opponentHand: "パー",
                    result: "lose",
                    phase: "resolved",
                }}
                isGameOver
            />,
        );

        expect(
            screen.queryByRole("button", { name: "リトライ" }),
        ).not.toBeInTheDocument();
    });
});
