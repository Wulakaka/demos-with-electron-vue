const state = () => ({
  widgetMap: new Map(),
  widgetList: [],
  activeWidgetId: null
})

const getters = {
  activeWidget: state => state.widgetMap.get(state.activeWidgetId)
}

const mutations = {
  SET_WIDGET_MAP (state, widget) {
    let originalData = state.widgetMap.get(widget.id)
    if (originalData) {
      originalData = Object.assign(originalData, widget)
    } else {
      state.widgetMap.set(widget.id, widget)
    }
  },
  DELETE_WIDGET (state, id) {
    state.widgetMap.delete(id)
  },
  SET_WIDGET_LIST (state) {
    state.widgetList = [...state.widgetMap.values()]
  },
  SET_ACTIVE_WIDGET (state, id) {
    state.activeWidgetId = id
  }
}

const actions = {
  setWidgetMap ({ commit }, data) {
    commit('SET_WIDGET_MAP', data)
    commit('SET_WIDGET_LIST')
  },
  deleteWidget ({ commit }, id) {
    commit('DELETE_WIDGET', id)
    commit('SET_WIDGET_LIST')
  },
  setActiveWidget ({ commit }, widget) {
    commit('SET_ACTIVE_WIDGET', widget)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
