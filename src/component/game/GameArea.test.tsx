import { render, screen } from "@testing-library/react";
import GameArea from "./GameArea";

describe("GameArea", () => {
    it("メッセージテキストが表示される（MessageWindow が描画されている）", () => {
        render(<GameArea message="テストメッセージ" />);
        expect(screen.getByText("テストメッセージ")).toBeInTheDocument();
    });

    it("3個の手札ボタンが表示される（グー・チョキ・パー）", () => {
        render(<GameArea message="テスト" />);
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).toHaveTextContent("グー");
        expect(buttons[1]).toHaveTextContent("チョキ");
        expect(buttons[2]).toHaveTextContent("パー");
    });

    it("カードを使用不可0または無制限として表示する", () => {
        render(
            <GameArea
                message="使用可否テスト"
                deck={{ グー: 0, チョキ: Infinity, パー: Infinity }}
                onCardSelect={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: "グー、使用不可" }),
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "チョキ、使用可能" }),
        ).toHaveTextContent("∞");
    });

    it("カード群が MessageWindow より先に DOM に現れる", () => {
        const { container } = render(<GameArea message="順序テスト" />);

        const children = container.firstElementChild?.children;
        expect(children).toBeTruthy();

        const firstChild = children![0];
        const lastChild = children![children!.length - 1];

        const buttonsInFirst = firstChild.querySelectorAll("button");
        expect(buttonsInFirst.length).toBeGreaterThan(0);
        expect(lastChild.textContent).toContain("順序テスト");

        const messageEl = screen.getByText("順序テスト");
        const firstButton = screen.getAllByRole("button")[0];
        const position = firstButton.compareDocumentPosition(messageEl);
        expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("isMessageVisible=false のとき message が非表示になる", () => {
        render(<GameArea message="非表示テスト" isMessageVisible={false} />);
        expect(screen.queryByText("非表示テスト")).not.toBeInTheDocument();
    });
});
