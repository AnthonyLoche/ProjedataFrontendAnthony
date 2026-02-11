<script setup>
import { computed, onMounted } from 'vue'
import { DashboardMetrics, ProductTable } from '@/components'
import { useProductStore } from '@/stores/product'

const store = useProductStore()

onMounted(() => {
  store.getAllProducts()
})

const totalProducts = computed(() => store.state.products.length)

const totalValueSum = computed(() =>
  store.state.products.reduce((acc, p) => acc + p.value, 0)
)

const averageValue = computed(() => {
  if (!store.state.products.length) return 0
  return totalValueSum.value / store.state.products.length
})

const mostExpensive = computed(() => {
  if (!store.state.products.length) return 0
  return Math.max(...store.state.products.map(p => p.value))
})

const productsWithoutRawMaterial = computed(() =>
  store.state.products.filter(p => !p.rawMaterials?.length).length
)

const productWithMostRawMaterials = computed(() => {
  if (!store.state.products.length) return 0
  return Math.max(
    ...store.state.products.map(p => p.rawMaterials?.length || 0)
  )
})

const metrics = computed(() => [
  {
    title: 'Total de Produtos',
    value: totalProducts.value,
    icon: 'mdi-package-variant',
    color: 'primary',
  },
  {
    title: 'Valor Total dos Produtos',
    value: `R$ ${totalValueSum.value.toFixed(2)}`,
    icon: 'mdi-cash-multiple',
    color: 'success',
  },
  {
    title: 'Valor Médio',
    value: `R$ ${averageValue.value.toFixed(2)}`,
    icon: 'mdi-chart-line',
    color: 'info',
  },
  {
    title: 'Produto Mais Caro',
    value: `R$ ${mostExpensive.value}`,
    icon: 'mdi-trending-up',
    color: 'error',
  },
  {
    title: 'Sem Matéria-Prima',
    value: productsWithoutRawMaterial.value,
    icon: 'mdi-alert-circle',
    color: 'warning',
  },
  {
    title: 'Maior Nº Matérias-Primas',
    value: productWithMostRawMaterials.value,
    icon: 'mdi-layers',
    color: 'purple',
  }
])
</script>

<template>
  <DashboardMetrics :metrics="metrics" />
  <ProductTable />
</template>
