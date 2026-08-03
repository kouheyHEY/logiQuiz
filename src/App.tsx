import GameView from "./component/GameView";
import AnimationMock from "./component/AnimationMock";

function App() {
  const isAnimationMock =
    new URLSearchParams(window.location.search).get("view") ===
    "animation-mock";

  if (isAnimationMock) {
    return <AnimationMock />;
  }

  return (
    <>
      <section id="center">
        <GameView />
      </section>
    </>
  );
}

export default App;
