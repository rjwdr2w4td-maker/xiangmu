import { ref, watch } from 'vue'
import { changePlots } from '@/data/security'

const PLOTS_STORAGE_KEY = 'grainSecurityPlots'

function loadPlots() {
  const stored = localStorage.getItem(PLOTS_STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return [...changePlots]
}

function savePlots(plots) {
  localStorage.setItem(PLOTS_STORAGE_KEY, JSON.stringify(plots))
}

const plots = ref(loadPlots())

watch(plots, (newPlots) => {
  savePlots(newPlots)
}, { deep: true })

export function usePlotStore() {
  const updatePlotStatus = (plotId, status, statusName, extraData = {}) => {
    const index = plots.value.findIndex(p => p.id === plotId)
    if (index !== -1) {
      plots.value[index] = {
        ...plots.value[index],
        status,
        statusName,
        ...extraData
      }
    }
  }

  const addCheckResult = (plotId, checkResult) => {
    const index = plots.value.findIndex(p => p.id === plotId)
    if (index !== -1) {
      plots.value[index].checkResult = checkResult
      plots.value[index].status = 'reported'
      plots.value[index].statusName = '待审核'
    }
  }

  const getPlotById = (plotId) => {
    return plots.value.find(p => p.id === plotId)
  }

  const getPlotsByStatus = (status) => {
    return plots.value.filter(p => p.status === status)
  }

  const resetPlots = () => {
    plots.value = [...changePlots]
    localStorage.removeItem(PLOTS_STORAGE_KEY)
  }

  return {
    plots,
    updatePlotStatus,
    addCheckResult,
    getPlotById,
    getPlotsByStatus,
    resetPlots
  }
}
