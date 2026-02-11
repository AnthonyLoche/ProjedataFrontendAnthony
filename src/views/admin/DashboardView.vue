<template>
  <div>
    <!-- Cards de métricas -->
    <v-row class="mb-6">
      <v-col v-for="metric in metrics" :key="metric.title" cols="12" lg="3" sm="6">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <div class="d-flex align-center">
            <v-icon class="mr-4" :color="metric.color" size="36">{{ metric.icon }}</v-icon>
            <div>
              <p class="text-caption text-text-muted">{{ metric.title }}</p>
              <h2 class="text-h5 font-weight-bold text-text-main">{{ metric.value }}</h2>
              <p v-if="metric.trend" class="text-caption mt-1" :class="metric.trendClass">
                <v-icon :size="14" :class="metric.trendIcon">{{ metric.trendIcon }}</v-icon>
                {{ metric.trend }}
              </p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos principais -->
    <v-row class="mb-6">
      <!-- Gráfico de barras: Distribuição de preços -->
      <v-col cols="12" lg="8">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Produtos por Faixa de Preço
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="priceDistributionChart"
              height="320px"
              :theme="theme"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de rosca: Produtos por quantidade de matérias-primas -->
      <v-col cols="12" lg="4">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Produtos por Qtd de Matérias-Primas
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="productByRawMaterialCountChart"
              height="320px"
              :theme="theme"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos secundários -->
    <v-row class="mb-6">
      <!-- Gráfico de barras: Matérias-primas mais usadas -->
      <v-col cols="12" lg="6">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Matérias-Primas Mais Utilizadas
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="mostUsedRawMaterialsChart"
              height="280px"
              :theme="theme"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de barras horizontal: Estoque baixo -->
      <v-col cols="12" lg="6">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Matérias-Primas com Estoque Baixo
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="lowStockChart"
              height="280px"
              :theme="theme"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EChartsWrapper from '@/components/admin/EChartsWrapper.vue'
import { useProductStore } from '@/stores/product'
import { useRawMaterialStore } from '@/stores/rawMaterial'

const theme = ref('light')

// Stores
const productStore = useProductStore()
const rawMaterialStore = useRawMaterialStore()

// Carrega os dados ao montar o componente
onMounted(async () => {
  await Promise.all([
    productStore.getAllProducts(),
    rawMaterialStore.getAllRawMaterials()
  ])
})

// --------------------------------------------
// MÉTRICAS (cards)
// --------------------------------------------
const totalProducts = computed(() => productStore.state.products.length)

const totalValueSum = computed(() =>
  productStore.state.products.reduce((acc, p) => acc + p.value, 0)
)

const averageValue = computed(() =>
  productStore.state.products.length
    ? (totalValueSum.value / productStore.state.products.length).toFixed(2)
    : '0.00'
)

const mostExpensive = computed(() =>
  productStore.state.products.length
    ? Math.max(...productStore.state.products.map(p => p.value)).toFixed(2)
    : '0.00'
)

const productsWithoutRawMaterial = computed(() =>
  productStore.state.products.filter(p => !p.rawMaterials?.length).length
)

const totalRawMaterials = computed(() => rawMaterialStore.state.rawMaterials.length)

const totalStockQuantity = computed(() =>
  rawMaterialStore.state.rawMaterials.reduce((acc, rm) => acc + rm.qnt, 0)
)

// Estoque baixo (ex: < 50)
const LOW_STOCK_THRESHOLD = 50
const lowStockCount = computed(() =>
  rawMaterialStore.state.rawMaterials.filter(rm => rm.qnt < LOW_STOCK_THRESHOLD).length
)

// Receita potencial total (cálculo local simplificado)
const productionPotential = computed(() => {
  return productStore.state.products.map(product => {
    if (!product.rawMaterials?.length) {
      return { maxProduction: 0, potentialRevenue: 0 }
    }

    const maxByMaterial = product.rawMaterials.map(rm => {
      const material = rawMaterialStore.state.rawMaterials.find(m => m.id === rm.idRawMaterial)
      return material ? Math.floor(material.qnt / rm.qnt) : Infinity
    })

    const maxProduction = Math.min(...maxByMaterial)
    const potentialRevenue = maxProduction * product.value
    return { maxProduction, potentialRevenue }
  })
})

const totalPotentialRevenue = computed(() =>
  productionPotential.value.reduce((acc, p) => acc + p.potentialRevenue, 0)
)

const totalProducibleUnits = computed(() =>
  productionPotential.value.reduce((acc, p) => acc + p.maxProduction, 0)
)

// Array final de métricas para os cards
const metrics = computed(() => [
  {
    title: 'Total de Produtos',
    value: totalProducts.value,
    icon: 'mdi-package-variant',
    color: 'primary',
    trend: null
  },
  {
    title: 'Valor Total dos Produtos',
    value: `R$ ${Number(totalValueSum.value).toFixed(2)}`,
    icon: 'mdi-cash-multiple',
    color: 'success',
    trend: null
  },
  {
    title: 'Valor Médio',
    value: `R$ ${averageValue.value}`,
    icon: 'mdi-chart-line',
    color: 'info',
    trend: null
  },
  {
    title: 'Produto Mais Caro',
    value: `R$ ${mostExpensive.value}`,
    icon: 'mdi-trending-up',
    color: 'error',
    trend: null
  },
  {
    title: 'Sem Matéria-Prima',
    value: productsWithoutRawMaterial.value,
    icon: 'mdi-alert-circle',
    color: 'warning',
    trend: null
  },
  {
    title: 'Total de Matérias-Primas',
    value: totalRawMaterials.value,
    icon: 'mdi-package',
    color: 'teal',
    trend: null
  },
  {
    title: 'Estoque Total (unidades)',
    value: totalStockQuantity.value.toLocaleString(),
    icon: 'mdi-counter',
    color: 'green',
    trend: null
  },
  {
    title: 'Estoque Baixo (<50)',
    value: lowStockCount.value,
    icon: 'mdi-alert',
    color: 'orange',
    trend: null
  },
  {
    title: 'Receita Potencial Total',
    value: `R$ ${totalPotentialRevenue.value.toFixed(2)}`,
    icon: 'mdi-cash-100',
    color: 'deep-purple',
    trend: null
  },
  {
    title: 'Unidades Produzíveis',
    value: totalProducibleUnits.value.toLocaleString(),
    icon: 'mdi-factory',
    color: 'brown',
    trend: null
  }
])

// --------------------------------------------
// GRÁFICOS
// --------------------------------------------

// 1. Distribuição de preços dos produtos
const priceDistributionChart = computed(() => {
  const ranges = [
    { min: 0, max: 50, label: 'R$ 0–50' },
    { min: 50, max: 100, label: 'R$ 50–100' },
    { min: 100, max: 200, label: 'R$ 100–200' },
    { min: 200, max: Infinity, label: 'R$ 200+' }
  ]

  const counts = ranges.map(range =>
    productStore.state.products.filter(p => p.value >= range.min && p.value < range.max).length
  )

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ranges.map(r => r.label),
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      name: 'Nº de Produtos',
      nameTextStyle: { color: '#666' },
      axisLabel: { color: '#666' }
    },
    series: [{
      name: 'Produtos',
      type: 'bar',
      data: counts,
      itemStyle: { color: '#2196F3' },
      barWidth: '50%'
    }]
  }
})

// 2. Produtos por quantidade de matérias-primas utilizadas
const productByRawMaterialCountChart = computed(() => {
  const groups = [
    { label: '0', count: 0 },
    { label: '1', count: 0 },
    { label: '2', count: 0 },
    { label: '3+', count: 0 }
  ]

  productStore.state.products.forEach(p => {
    const qty = p.rawMaterials?.length || 0
    if (qty === 0) groups[0].count++
    else if (qty === 1) groups[1].count++
    else if (qty === 2) groups[2].count++
    else groups[3].count++
  })

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} produtos ({d}%)' },
    legend: { orient: 'vertical', left: 'left', top: 'center' },
    series: [{
      name: 'Produtos',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
      data: groups.map(g => ({
        value: g.count,
        name: `${g.label} matérias-primas`
      }))
    }]
  }
})

// 3. Matérias-primas mais utilizadas (top 5)
const mostUsedRawMaterialsChart = computed(() => {
  const usageMap = new Map()
  productStore.state.products.forEach(product => {
    product.rawMaterials?.forEach(rm => {
      usageMap.set(rm.idRawMaterial, (usageMap.get(rm.idRawMaterial) || 0) + 1)
    })
  })

  const sorted = Array.from(usageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const names = sorted.map(([id]) => {
    const material = rawMaterialStore.state.rawMaterials.find(m => m.id === id)
    return material ? material.name : `ID ${id}`
  })
  const counts = sorted.map(([, count]) => count)

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: { rotate: 15, color: '#666' }
    },
    yAxis: {
      type: 'value',
      name: 'Produtos que utilizam',
      nameTextStyle: { color: '#666' },
      axisLabel: { color: '#666' }
    },
    series: [{
      name: 'Utilizações',
      type: 'bar',
      data: counts,
      itemStyle: { color: '#FF9800' },
      barWidth: '60%'
    }]
  }
})

// 4. Matérias-primas com estoque baixo (top 5 menores estoques)
const lowStockChart = computed(() => {
  const lowStockMaterials = rawMaterialStore.state.rawMaterials
    .filter(rm => rm.qnt < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.qnt - b.qnt)
    .slice(0, 5)

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      name: 'Quantidade em estoque',
      nameTextStyle: { color: '#666' },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'category',
      data: lowStockMaterials.map(rm => rm.name),
      axisLabel: { color: '#666' }
    },
    series: [{
      name: 'Estoque',
      type: 'bar',
      data: lowStockMaterials.map(rm => rm.qnt),
      itemStyle: { color: '#F44336' },
      barWidth: '60%'
    }]
  }
})
</script>

<style scoped>
.text-text-muted {
  color: rgba(0, 0, 0, 0.6) !important;
}

.text-text-main {
  color: rgba(0, 0, 0, 0.87) !important;
}

.text-success {
  color: #4CAF50 !important;
}

.text-warning {
  color: #FF9800 !important;
}
</style>