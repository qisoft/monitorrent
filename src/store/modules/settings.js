import api from '../../api/monitorrent'
import types from '../types'

const state = {
    loading: true,
    settings: {
        updateInterval: null,
        proxy: {
            enabled: false,
            http: null,
            https: null
        },
        newVersionCheck: {
            enabled: false,
            preRelease: false,
            interval: null
        }
    }
}

const getters = {
}

const actions = {
    async loadSettings ({ commit }) {
        const result = await Promise.all(
            api.settings.getUpdateInterval(),
            api.settings.proxy.isEnabled(),
            api.settings.proxy.getUrl('http'),
            api.settings.proxy.getUrl('https'),
            api.settings.newVersionChecker()
        )

        const settings = {
            updateInterval: result[0],
            proxy: {
                enabled: result[1],
                http: result[2],
                https: result[3]
            },
            newVersionCheck: {
                enabled: result[4].enabled,
                preRelease: result[4].include_prerelease,
                interval: result[4].interval
            }
        }

        commit(types.SET_SETTINGS, settings)
    },
    async setUpdateInterval ({ commit }, value) {
        await api.settings.setUpdateInterval(value)

        commit(types.SET_UPDATE_INTERVAL, value)
    },
    setProxyEnabled ({ commit }, value) {
        commit(types.SET_PROXY_ENABLED, value)
    },
    setProxy ({ commit }, params) {
        commit(types.SET_PROXY, params)
    },
    setNewVersionCheckEnabled ({ commit }, value) {
        commit(types.SET_NEW_VERSION_CHECKED_ENABLED, value)
    },
    setNewVersionCheckIncludePrerelease ({ commit }, value) {
        commit(types.SET_NEW_VERSION_CHECKED_INCLUDE_PRERELEASE, value)
    },
    setNewVersionCheckInterval ({ commit }, value) {
        commit(types.SET_NEW_VERSION_CHECKED_INTERVAL, value)
    }
}

const mutations = {
    [types.SET_SETTINGS] (state, settings) {
        state.loading = false
        state.settings = settings
    },
    [types.SET_UPDATE_INTERVAL] (state, value) {
        state.settings.updateInterval = value
    },
    [types.SET_PROXY_ENABLED] (state, value) {
        state.settings.proxy.enabled = value
    },
    [types.SET_PROXY] (state, { type, value }) {
        state.settings.proxy[type] = value
    },
    [types.SET_NEW_VERSION_CHECKED_ENABLED] (state, value) {
        state.settings.newVersionCheck.enabled = value
    },
    [types.SET_NEW_VERSION_CHECKED_INCLUDE_PRERELEASE] (state, value) {
        state.settings.newVersionCheck.preRelease = value
    },
    [types.SET_NEW_VERSION_CHECKED_INTERVAL] (state, value) {
        state.settings.newVersionCheck.interval = value
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}