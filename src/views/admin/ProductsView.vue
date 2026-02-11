<template>
  <DashboardMetrics :metrics="metrics" />
</template>
<script setup>
import { ref } from 'vue'
import { DashboardMetrics } from '@/components'

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
</script>
