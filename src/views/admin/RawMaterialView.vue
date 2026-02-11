<script setup>
import { computed, onMounted } from 'vue'
import { DashboardMetrics, RawMaterialTable } from '@/components'
import { useRawMaterialStore } from '@/stores'

const rawMaterialStore = useRawMaterialStore()

onMounted(async () => {
  await rawMaterialStore.getAllRawMaterials()
})

/* =========================
   MÉTRICAS BASEADAS NO BACK
========================= */

const totalRawMaterials = computed(() =>
  rawMaterialStore.state.rawMaterials.length
)

const totalStock = computed(() =>
  rawMaterialStore.state.rawMaterials.reduce((acc, rm) => acc + rm.qnt, 0)
)

const lowStockCount = computed(() =>
  rawMaterialStore.state.rawMaterials.filter(rm => rm.qnt > 0 && rm.qnt < 10).length
)

const outOfStockCount = computed(() =>
  rawMaterialStore.state.rawMaterials.filter(rm => rm.qnt === 0).length
)

const highestStock = computed(() => {
  if (!rawMaterialStore.state.rawMaterials.length) return 0
  return Math.max(
    ...rawMaterialStore.state.rawMaterials.map(rm => rm.qnt)
  )
})

/* =========================
   ARRAY FINAL DE MÉTRICAS
========================= */

const metrics = computed(() => [
  {
    title: 'Total de Matérias-Primas',
    value: totalRawMaterials.value,
    icon: 'mdi-package-variant',
    color: 'primary',
  },
  {
    title: 'Quantidade Total em Estoque',
    value: totalStock.value,
    icon: 'mdi-warehouse',
    color: 'success',
  },
  {
    title: 'Estoque Baixo (< 10)',
    value: lowStockCount.value,
    icon: 'mdi-alert',
    color: 'warning',
  },
  {
    title: 'Sem Estoque',
    value: outOfStockCount.value,
    icon: 'mdi-close-circle',
    color: 'error',
  },
  {
    title: 'Maior Estoque',
    value: highestStock.value,
    icon: 'mdi-trending-up',
    color: 'info',
  }
])
</script>

<template>
  <DashboardMetrics :metrics="metrics" />
  <RawMaterialTable />
</template>
