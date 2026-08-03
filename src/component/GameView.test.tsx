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
        vi.restoreAllMocks();
        window.localStorage.clear();
    });

    const resolveCurrentBattle = () => {
        act(() => {
            vi.advanceTimersByTime(420);
        });
        act(() => {
            vi.advanceTimersByTime(620);
        });
        act(() => {
            vi.advanceTimersByTime(1800);
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

    it("あいこでゲームオーバーになってもリトライできる", () => {
        render(<GameView />);

        // 最初の練習相手は必ずグーなので、グーを4回出してライフを0にする。
        for (let count = 0; count < 4; count += 1) {
            fireEvent.click(
                screen.getByRole("button", { name: "グー、使用可能" }),
            );
            resolveCurrentBattle();
        }

        expect(screen.getByLabelText("ライフ: 0")).toBeInTheDocument();
        expect(screen.getByText("あいこ")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "リトライ" }),
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "リトライ" }));

        expect(screen.getByLabelText("ライフ: 2")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "リトライ" }),
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "グー、使用可能" }),
        ).toBeEnabled();
    });

    it("リトライすると相手と強敵までの進行を最初から作り直す", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        const { container } = render(<GameView />);

        const play = (name: string) => {
            fireEvent.click(screen.getByRole("button", { name }));
            resolveCurrentBattle();
        };
        const expectOpponent = (number: number) => {
            expect(
                container.querySelector(".enemy-panel__number"),
            ).toHaveTextContent(`対戦相手 ${number}`);
        };

        // チュートリアル後、通常敵を1人倒してボス進行を1つ進める。
        play("パー、使用可能");
        play("パー、使用可能");
        expectOpponent(3);

        // グーを出す通常敵に敗北してリトライする。
        play("チョキ、使用可能");
        fireEvent.click(screen.getByRole("button", { name: "リトライ" }));

        expectOpponent(1);
        expect(screen.getByText("グーを出したい男")).toBeInTheDocument();
        expect(screen.queryByText("強敵")).not.toBeInTheDocument();

        // 以前の1勝は破棄され、改めて通常敵を3人倒してから強敵になる。
        play("パー、使用可能");
        play("パー、使用可能");
        expect(screen.queryByText("強敵")).not.toBeInTheDocument();

        play("パー、使用可能");
        expect(screen.getByText("強敵")).toBeInTheDocument();
        expectOpponent(4);
    });

    it("勝利してもライフは回復せず、強敵撃破で右端にグチョパを得る", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        render(<GameView />);

        const winWithPaper = () => {
            fireEvent.click(
                screen.getByRole("button", { name: "パー、使用可能" }),
            );
            resolveCurrentBattle();
        };

        // チュートリアル1勝、通常敵3勝、強敵へ2勝。
        for (let count = 0; count < 6; count += 1) {
            winWithPaper();
        }

        expect(screen.getByLabelText("ライフ: 2")).toBeInTheDocument();
        expect(
            screen.getAllByText(/無敵の手「グチョパ」を手に入れました/),
        ).not.toHaveLength(0);

        const buttons = screen.getAllByRole("button");
        expect(buttons[buttons.length - 1]).toHaveAccessibleName(
            "グチョパ、使用可能",
        );

        fireEvent.click(
            screen.getByRole("button", { name: "グチョパ、使用可能" }),
        );
        resolveCurrentBattle();

        expect(screen.getByLabelText("ライフ: 2")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", { name: "チョキ、使用可能" }),
        );
        resolveCurrentBattle();
        fireEvent.click(screen.getByRole("button", { name: "リトライ" }));

        expect(
            screen.queryByRole("button", { name: "グチョパ、使用可能" }),
        ).not.toBeInTheDocument();
    });

    it.each([
        ["パー、使用可能", "win", "WIN", 2],
        ["グー、使用可能", "draw", "AIKO", 1.5],
        ["チョキ、使用可能", "lose", "LOSE", 1],
    ])(
        "グー固定の相手に %s を出すと画面結果が %s になる",
        (buttonName, result, label, expectedLife) => {
            const { container } = render(<GameView />);

            fireEvent.click(screen.getByRole("button", { name: buttonName }));
            act(() => {
                vi.advanceTimersByTime(420);
            });
            act(() => {
                vi.advanceTimersByTime(620);
            });

            expect(
                container.querySelector(
                    `.battle-stage__event-overlay--${result}`,
                ),
            ).toHaveTextContent(label);
            expect(
                screen.getByLabelText(`ライフ: ${expectedLife}`),
            ).toBeInTheDocument();
        },
    );
});
