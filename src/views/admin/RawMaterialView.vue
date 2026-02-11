<template>
  <DashboardMetrics :metrics="metrics" />
  <RawMaterialTable
    :items="rawMaterialStore.rawMaterials"
    :isLoading="rawMaterialStore.isLoading"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { DashboardMetrics, RawMaterialTable } from '@/components'
import { useRawMaterialStore } from '@/stores';

const rawMaterialStore = useRawMaterialStore();

const metrics = ref([
  {
    title: 'Total de Amostras em Pendência',
    value: 100,
    icon: 'mdi-alert',
    color: 'warning',
  },
  {
    title: 'Total de Amostras em Análise',
    value: 100,
    icon: 'mdi-test-tube',
    color: 'purple',
  },
  {
    title: 'Total de Amostras Concluídas',
    value: 100,
    icon: 'mdi-check',
    color: 'success',
  },
  {
    title: 'Total de Amostras Rejeitadas',
    value: 100,
    icon: 'mdi-close-box',
    color: 'error',
  }
])

onMounted(async () => {
  await rawMaterialStore.getAllRawMaterials();
});
</script>
