import { act, fireEvent, render, screen } from "@testing-library/react";
import { useBattleSequence, type BattlePayload } from "./useBattleSequence";

const battle: BattlePayload = {
    playerHand: "グー",
    opponentHand: "チョキ",
    result: "win",
};

function Harness({ onResolve }: { onResolve: (value: BattlePayload) => void }) {
    const { sequence, start } = useBattleSequence(onResolve);

    return (
        <>
            <button type="button" onClick={() => start(battle)}>
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
});
