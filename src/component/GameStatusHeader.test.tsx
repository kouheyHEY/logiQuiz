import { render, screen } from "@testing-library/react";
import GameHeader from "./GameStatusHeader";

describe("GameStatusHeader", () => {
    const baseProps = {
        life: 2,
        winStreak: 0,
        aikoCount: 0,
    };

    it("ライフを2つのハートで表示する", () => {
        const { container } = render(<GameHeader {...baseProps} />);
        expect(screen.getByLabelText("ライフ: 2")).toBeInTheDocument();
        expect(container.querySelectorAll(".game-header__heart")).toHaveLength(2);
        expect(
            container.querySelectorAll(".game-header__heart-fill"),
        ).toHaveLength(2);
    });

    it("0.5ライフを半分塗られたハートで表示する", () => {
        const { container } = render(
            <GameHeader {...baseProps} life={0.5} />,
        );
        const fill = container.querySelector<SVGElement>(
            ".game-header__heart-fill",
        );
        expect(screen.getByLabelText("ライフ: 0.5")).toBeInTheDocument();
        expect(fill).toHaveStyle({ clipPath: "inset(0 50% 0 0)" });
    });

    it("0.25ライフを4分の1だけ塗られたハートで表示する", () => {
        const { container } = render(
            <GameHeader {...baseProps} life={0.25} />,
        );
        const fill = container.querySelector<SVGElement>(
            ".game-header__heart-fill",
        );

        expect(fill).toHaveStyle({ clipPath: "inset(0 75% 0 0)" });
    });

    it("増えたライフを追加ハートとコンパクトな超過表示で表す", () => {
        const { container } = render(
            <GameHeader {...baseProps} life={5.25} />,
        );

        expect(container.querySelectorAll(".game-header__heart")).toHaveLength(3);
        expect(screen.getByText("+2.25")).toBeInTheDocument();
        expect(screen.getByLabelText("ライフ: 5.25")).toBeInTheDocument();
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

    it("制限時間を表示しない", () => {
        render(<GameHeader {...baseProps} />);
        expect(screen.queryByText(/残り時間/)).not.toBeInTheDocument();
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
