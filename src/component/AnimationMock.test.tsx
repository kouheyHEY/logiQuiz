import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnimationMock from "./AnimationMock";

describe("AnimationMock", () => {
    it("勝利・敗北・AIKOの演出を切り替えられる", () => {
        render(<AnimationMock />);

        expect(screen.getByRole("button", { name: "勝利" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );

        fireEvent.click(screen.getByRole("button", { name: "AIKO" }));

        expect(screen.getByRole("button", { name: "AIKO" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        expect(screen.getByText("−0.5")).toBeInTheDocument();
    });

    it("再生ボタンを操作できる", () => {
        render(<AnimationMock />);
        expect(() =>
            fireEvent.click(
                screen.getByRole("button", {
                    name: "アニメーションをもう一度再生",
                }),
            ),
        ).not.toThrow();
    });
});
