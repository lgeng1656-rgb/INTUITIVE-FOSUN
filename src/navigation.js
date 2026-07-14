export function createInitialState() {
  return { current: "home", stage: null, history: [] };
}

export function openStage(_state, stage) {
  return {
    current: `${stage}-overview`,
    stage,
    history: ["home"]
  };
}

export function openPage(state, pageId) {
  return {
    ...state,
    current: pageId,
    history: [...state.history, state.current]
  };
}

export function goBack(state) {
  if (state.history.length === 0) {
    return state;
  }

  const current = state.history.at(-1);
  return {
    current,
    stage: current === "home" ? null : state.stage,
    history: state.history.slice(0, -1)
  };
}
