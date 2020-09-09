export const state = () => ({
  intro: false,
  disconnect: false,
  input: '',
  hallPlanList: {},
  config: {},
})

// mutations
export const mutations = {
  setIntro(state, status) {
    state.intro = status
  },
  setDisconnect(state, status) {
    state.disconnect = status
  },
  setInput(state, value) {
    state.input = value
  },
  setHallPlanList(state, hallPlanList) {
    const newHallPlanList = {}
    hallPlanList.forEach((item) => {
      newHallPlanList[item.sessionId] = item.place
    })

    state.hallPlanList = {... newHallPlanList}
  },
  setConfig(state, value) {
    state.config = value
  },
}

// actions
export const actions = {}
