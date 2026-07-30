import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardButton from "./CardButton";

describe("CardButton", () => {
    // Requirements 4.1: label props が表示されること
    it("label props に渡した数値がボタンのテキストとして表示される", () => {
        render(<CardButton label={7} />);
        expect(screen.getByRole("button")).toHaveTextContent("7");
    });

    it("label が 1 のときも正しく表示される", () => {
        render(<CardButton label={1} />);
        expect(screen.getByRole("button")).toHaveTextContent("1");
    });

    it("label が 12 のときも正しく表示される", () => {
        render(<CardButton label={12} />);
        expect(screen.getByRole("button")).toHaveTextContent("12");
    });

    // Requirements 4.2: disabled=true のとき <button disabled> が描画されること
    it("disabled=true のとき button 要素に disabled 属性が付与される", () => {
        render(<CardButton label={3} disabled={true} />);
        expect(screen.getByRole("button", { hidden: true })).toBeDisabled();
    });

    // Requirements 4.3: disabled=false のとき disabled 属性が付与されないこと
    it("disabled=false のとき button 要素に disabled 属性が付与されない", () => {
        render(<CardButton label={3} disabled={false} />);
        expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("disabled を省略したとき button 要素に disabled 属性が付与されない", () => {
        render(<CardButton label={3} />);
        expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("敵側カードは操作できない閲覧用要素として表示される", () => {
        render(
            <CardButton
                label="グー"
                count={Infinity}
                displayOnly
                orientation="opponent"
            />,
        );
        expect(
            screen.getByRole("img", { name: "グー、使用可能" }),
        ).toHaveTextContent("∞");
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    // Requirements 4.3 & 4.4: disabled=false のとき onClick が呼ばれること
    it("disabled=false のときクリックすると onClick が呼ばれる", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<CardButton label={5} disabled={false} onClick={handleClick} />);
        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled を省略したときクリックすると onClick が呼ばれる", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<CardButton label={5} onClick={handleClick} />);
        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Requirements 4.4: disabled=true のとき onClick が呼ばれないこと
    it("disabled=true のときクリックしても onClick が呼ばれない", async () => {
        const handleClick = vi.fn();
        render(<CardButton label={5} disabled={true} onClick={handleClick} />);
        // user-event は disabled ボタンをクリックしないため fireEvent で試みる
        fireEvent.click(screen.getByRole("button", { hidden: true }));
        expect(handleClick).not.toHaveBeenCalled();
    });
});
