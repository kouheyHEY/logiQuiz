import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameLayout from "./GameLayout";

/**
 * GameLayout ユニットテスト
 *
 * GameLayout はまだ実装されていないため、これらのテストは RED（失敗）状態です。
 * コンポーネント実装後に GREEN になることを期待しています。
 *
 * Validates: Requirements 1.1, 2.1, 5.4, 5.5
 */

describe("GameLayout", () => {
    // -----------------------------------------------------------------------
    // テスト 1: GameHeader が描画されている（"連勝数" テキストの存在確認）
    // -----------------------------------------------------------------------
    it("「連勝数」テキストが表示される（GameHeader が描画されている）", () => {
        render(<GameLayout winStreak={3} />);
        // GameHeader は「連勝数」ラベルを持つ
        expect(screen.getByText(/連勝数/)).toBeInTheDocument();
    });

    // -----------------------------------------------------------------------
    // テスト 2: ボタンが表示される（GameArea → CardPad が描画されている）
    // -----------------------------------------------------------------------
    it("ボタンが表示される（GameArea → CardPad が描画されている）", () => {
        render(<GameLayout />);
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).toHaveTextContent("グー");
        expect(buttons[1]).toHaveTextContent("チョキ");
        expect(buttons[2]).toHaveTextContent("パー");
    });

    // -----------------------------------------------------------------------
    // テスト 3: GameHeader が GameArea より先に DOM に現れる（DOM 順序）
    // -----------------------------------------------------------------------
    it("GameHeader が GameArea より先に DOM に現れる", () => {
        render(
            <GameLayout
                winStreak={1}
                message="テストメッセージ"
            />,
        );

        // 「連勝数」を含む要素（GameHeader 内）を取得
        const headerElement = screen.getByText(/連勝数/);
        // ボタン群（NumberPad 内）を取得
        const buttons = screen.getAllByRole("button");
        const firstButton = buttons[0];

        // DOM ツリー上で headerElement が firstButton より前に現れることを確認
        // Node.DOCUMENT_POSITION_FOLLOWING (4) は「引数ノードが this の後に来る」を意味する
        const position = headerElement.compareDocumentPosition(firstButton);
        expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    // -----------------------------------------------------------------------
    // テスト 4: props 未指定時にフォールバック値でクラッシュせずに描画される
    //           winStreak=0、初期ライフ2で表示される
    // -----------------------------------------------------------------------
    it("props 未指定時にフォールバック値でクラッシュせず描画される", () => {
        // props を一切渡さない
        expect(() => render(<GameLayout />)).not.toThrow();

        expect(screen.getByLabelText("ライフ: 2")).toBeInTheDocument();
        expect(screen.queryByText(/残り時間/)).not.toBeInTheDocument();

        // winStreak=0 のフォールバックにより 0 が表示される
        expect(screen.getByText(/連勝数/)).toBeInTheDocument();
    });

    // -----------------------------------------------------------------------
    // テスト 5: onCardSelect コールバックがボタンクリック時に呼ばれる
    // -----------------------------------------------------------------------
    it("ボタンクリック時に onCardSelect コールバックが呼ばれる", async () => {
        const user = userEvent.setup();
        const onCardSelect = vi.fn();

        render(<GameLayout onCardSelect={onCardSelect} />);

        const button = screen.getByRole("button", { name: "グー" });
        await user.click(button);

        expect(onCardSelect).toHaveBeenCalledOnce();
        expect(onCardSelect).toHaveBeenCalledWith("グー");
    });
});
