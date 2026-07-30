import { render, screen } from "@testing-library/react";
import GameHeader from "./GameStatusHeader";

describe("GameStatusHeader", () => {
    const baseProps = {
        life: 1,
        winStreak: 0,
        aikoCount: 0,
        timeLeft: 0,
        timerState: "running" as const,
        isTimerValid: true,
    };

    it("ライフがヘッダーに表示される", () => {
        render(<GameHeader {...baseProps} life={2} />);
        expect(screen.getByText("ライフ: 2")).toBeInTheDocument();
    });

    it("AIKOの累計数がヘッダーに表示される", () => {
        render(<GameHeader {...baseProps} aikoCount={4} />);
        expect(screen.getByText("AIKO: 4")).toBeInTheDocument();
    });

    // Requirements 1.2: winStreak=5 が "連勝数" ラベルとともに表示されること
    it('winStreak=5 が "連勝数" ラベルとともに表示される', () => {
        render(<GameHeader {...baseProps} winStreak={5} />);
        expect(screen.getByText(/連勝数/)).toBeInTheDocument();
        expect(screen.getByText(/5/)).toBeInTheDocument();
    });

    // Requirements 1.4: isTimerValid=true, timeLeft=30 のとき "30" が表示される
    it('isTimerValid=true, timeLeft=30 のとき "30" が表示される', () => {
        render(<GameHeader {...baseProps} isTimerValid={true} timeLeft={30} />);
        expect(screen.getByText(/30/)).toBeInTheDocument();
    });

    // Requirements 1.3: isTimerValid=false のとき "∞" が表示される
    it('isTimerValid=false のとき "∞" が表示される', () => {
        render(
            <GameHeader {...baseProps} isTimerValid={false} timeLeft={30} />,
        );
        expect(screen.getByText(/∞/)).toBeInTheDocument();
        expect(screen.queryByText(/30/)).not.toBeInTheDocument();
    });

    // Requirements 1.5: timeLeft=0, isTimerValid=true のとき "0" が表示され "∞" でない
    it('timeLeft=0, isTimerValid=true のとき "0" が表示され "∞" でない', () => {
        render(
            <GameHeader
                {...baseProps}
                isTimerValid={true}
                timeLeft={0}
                winStreak={5}
            />,
        );
        // 残り時間の行に "0" が含まれることを確認（"∞" でないこと）
        expect(screen.getByText(/残り時間/)).toHaveTextContent("0");
        expect(screen.queryByText("∞")).not.toBeInTheDocument();
    });

    // Requirements 5.3: rerender で winStreak が変更されたとき新しい値が表示される（useState バグ修正確認）
    it("rerender で winStreak が変更されたとき、新しい値が表示される", () => {
        const { rerender } = render(
            <GameHeader {...baseProps} winStreak={1} />,
        );
        expect(screen.getByText("連勝数: 1")).toBeInTheDocument();

        rerender(<GameHeader {...baseProps} winStreak={10} />);
        expect(screen.getByText("連勝数: 10")).toBeInTheDocument();
    });
});
