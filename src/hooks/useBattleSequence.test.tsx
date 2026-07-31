import { act, fireEvent, render, screen } from "@testing-library/react";
import { useBattleSequence, type BattlePayload } from "./useBattleSequence";

const battle: BattlePayload = {
    playerHand: "グー",
    opponentHand: "チョキ",
    result: "win",
};

function Harness({
    onResolve,
    payload = battle,
}: {
    onResolve: (value: BattlePayload) => void;
    payload?: BattlePayload;
}) {
    const { sequence, start } = useBattleSequence(onResolve);

    return (
        <>
            <button type="button" onClick={() => start(payload)}>
                start
            </button>
            <span>{sequence?.phase ?? "idle"}</span>
        </>
    );
}

describe("useBattleSequence", () => {
    it("カードを出す、公開、結果の順番で進行する", () => {
        vi.useFakeTimers();
        const onResolve = vi.fn();
        render(<Harness onResolve={onResolve} />);

        fireEvent.click(screen.getByRole("button", { name: "start" }));
        expect(screen.getByText("dealing")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(420);
        });
        expect(screen.getByText("revealing")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(620);
        });
        expect(screen.getByText("resolved")).toBeInTheDocument();
        expect(onResolve).toHaveBeenCalledWith(battle);

        act(() => {
            vi.advanceTimersByTime(900);
        });
        expect(screen.getByText("idle")).toBeInTheDocument();

        vi.useRealTimers();
    });

    it("あいこの結果表示だけ1800ms維持する", () => {
        vi.useFakeTimers();
        const drawBattle: BattlePayload = {
            playerHand: "グー",
            opponentHand: "グー",
            result: "draw",
        };
        render(<Harness onResolve={vi.fn()} payload={drawBattle} />);

        fireEvent.click(screen.getByRole("button", { name: "start" }));
        act(() => {
            vi.advanceTimersByTime(420);
        });
        act(() => {
            vi.advanceTimersByTime(620);
        });
        expect(screen.getByText("resolved")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1799);
        });
        expect(screen.getByText("resolved")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(screen.getByText("idle")).toBeInTheDocument();

        vi.useRealTimers();
    });
});
