import { act, render, screen } from "@testing-library/react";
import MessageWindow from "./MessageWindow";

describe("MessageWindow", () => {
  it("message='Hello' が表示されること", () => {
    render(<MessageWindow message="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("isVisible=false のとき message が表示されないこと", () => {
    render(<MessageWindow message="Hello" isVisible={false} />);
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });

  it("isVisible 省略時（デフォルト true）に message が表示されること", () => {
    render(<MessageWindow message="Default Visible" />);
    expect(screen.getByText("Default Visible")).toBeInTheDocument();
  });

  it("props 変更後に再レンダリングで表示値が更新されること（useState バグ修正確認）", () => {
    const { rerender } = render(<MessageWindow message="First" />);
    expect(screen.getByText("First")).toBeInTheDocument();

    rerender(<MessageWindow message="Second" />);
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("メッセージが1文字ずつ表示されること", () => {
    vi.useFakeTimers();
    render(<MessageWindow message="ABC" />);

    const visualText = screen.getByTestId("typewriter-visual");
    expect(visualText).toHaveTextContent("");

    act(() => {
      vi.advanceTimersByTime(20);
    });
    expect(visualText).toHaveTextContent("A");

    act(() => {
      vi.advanceTimersByTime(40);
    });
    expect(visualText).toHaveTextContent("ABC");

    vi.useRealTimers();
  });

  it("danger tone のときゲームオーバー用の表示になる", () => {
    const { container } = render(
      <MessageWindow message="ゲームオーバーです。" tone="danger" />,
    );
    expect(container.firstElementChild).toHaveClass("message-window--danger");
  });
});
