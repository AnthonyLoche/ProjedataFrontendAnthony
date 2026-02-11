<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  },
  theme: {
    type: String,
    default: 'light'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['chart-click', 'chart-ready'])

const chartRef = ref(null)
let chartInstance = null

// Inicializar gráfico
function initChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value, props.theme)
  
  // Configurar opções
  chartInstance.setOption(props.options)
  
  // Adicionar listener de clique
  chartInstance.on('click', (params) => {
    emit('chart-click', params)
  })
  
  emit('chart-ready', chartInstance)
}

// Redimensionar gráfico
function resizeChart() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// Atualizar gráfico quando options mudar
watch(() => props.options, (newOptions) => {
  if (chartInstance) {
    chartInstance.setOption(newOptions)
  }
}, { deep: true })

// Atualizar loading
watch(() => props.loading, (loading) => {
  if (chartInstance) {
    if (loading) {
      chartInstance.showLoading()
    } else {
      chartInstance.hideLoading()
    }
  }
})

// Lifecycle hooks
onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', resizeChart)
})

// Expor métodos
defineExpose({
  getInstance: () => chartInstance,
  resize: resizeChart
})
</script>