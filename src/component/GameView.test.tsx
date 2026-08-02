import { act, fireEvent, render, screen } from "@testing-library/react";
import { TUTORIAL_COMPLETED_KEY } from "./game/tutorialStorage";
import GameView from "./GameView";

describe("GameView", () => {
    beforeEach(() => {
        window.localStorage.setItem(TUTORIAL_COMPLETED_KEY, "true");
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });

    const resolveCurrentBattle = () => {
        act(() => {
            vi.advanceTimersByTime(420);
        });
        act(() => {
            vi.advanceTimersByTime(620);
        });
    };

    it("ゲームオーバー後もリトライして敗北ループを続けられる", () => {
        render(<GameView />);

        // 最初の練習相手は必ずグーなので、チョキなら確実に敗北する。
        fireEvent.click(
            screen.getByRole("button", { name: "チョキ、使用可能" }),
        );
        resolveCurrentBattle();

        fireEvent.click(screen.getByRole("button", { name: "リトライ" }));
        expect(screen.getByLabelText("ライフ: 1")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", { name: "チョキ、使用可能" }),
        );
        resolveCurrentBattle();

        expect(screen.getByLabelText("ライフ: 0")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "リトライ" }),
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "リトライ" }));

        expect(screen.getByLabelText("ライフ: 2")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "リトライ" }),
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "チョキ、使用可能" }),
        ).toBeEnabled();
    });
});
