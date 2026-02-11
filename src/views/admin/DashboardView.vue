<template>
  <div>
    <v-row class="mb-6">
      <!-- Métricas -->
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
      <!-- Gráfico de linha: Amostras por mês -->
      <v-col cols="12" lg="8">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Amostras Analisadas por Mês
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="lineChartOptions"
              height="320px"
              :theme="theme"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de rosca: Distribuição por status -->
      <v-col cols="12" lg="4">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Distribuição por Status
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="pieChartOptions"
              height="320px"
              :theme="theme"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos secundários -->
    <v-row class="mb-6">
      <!-- Gráfico de barras: Tipos de amostra -->
      <v-col cols="12" lg="6">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Tipos de Amostra Mais Comuns
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="barChartOptions"
              height="280px"
              :theme="theme"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Gráfico de barras horizontal: Laboratórios -->
      <v-col cols="12" lg="6">
        <v-card class="pa-4 elevation-1" flat rounded="lg">
          <v-card-title class="text-subtitle-1 font-weight-bold text-text-main">
            Amostras por Laboratório
          </v-card-title>
          <v-card-text>
            <EChartsWrapper
              :options="horizontalBarOptions"
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
import { ref, computed } from 'vue'
import EChartsWrapper from '@/components/admin/EChartsWrapper.vue'

// Tema
const theme = ref('light')

// Métricas
const metrics = ref([
  {
    title: 'Total de Amostras',
    value: '1,234',
    icon: 'mdi-test-tube',
    color: 'blue-darken-2',
    trend: '+12% em relação ao mês anterior',
    trendClass: 'text-success',
    trendIcon: 'mdi-trending-up'
  },
  {
    title: 'Amostras Pendentes',
    value: '156',
    icon: 'mdi-clock-outline',
    color: 'orange-darken-2',
    trend: '+8 desde ontem',
    trendClass: 'text-warning',
    trendIcon: 'mdi-alert-circle'
  },
  {
    title: 'Taxa de Conclusão',
    value: '87.5%',
    icon: 'mdi-check-circle-outline',
    color: 'green-darken-2',
    trend: '+2.3% em relação ao mês anterior',
    trendClass: 'text-success',
    trendIcon: 'mdi-trending-up'
  },
  {
    title: 'Turnaround Médio',
    value: '4.2 dias',
    icon: 'mdi-calendar-clock',
    color: 'purple-darken-2',
    trend: '-0.5 dias em relação ao mês anterior',
    trendClass: 'text-success',
    trendIcon: 'mdi-trending-down'
  }
])

// Dados fictícios para gráficos
const ultimosMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const tiposAmostra = ['Sangue', 'Urina', 'Tecido', 'Água', 'Solo', 'Ar', 'Alimento']
const laboratorios = ['Lab Central', 'Lab Norte', 'Lab Sul', 'Lab Leste', 'Lab Oeste']

// Gráfico de linha: Amostras por mês
const lineChartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c} amostras'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ultimosMeses,
    axisLabel: {
      color: '#666'
    }
  },
  yAxis: {
    type: 'value',
    name: 'Número de Amostras',
    nameTextStyle: {
      color: '#666'
    },
    axisLabel: {
      color: '#666'
    }
  },
  series: [
    {
      name: 'Amostras',
      type: 'line',
      data: [125, 145, 178, 190, 210, 234, 256, 245, 267, 289, 312, 334],
      smooth: true,
      itemStyle: {
        color: '#2196F3'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(33, 150, 243, 0.3)'
          }, {
            offset: 1, color: 'rgba(33, 150, 243, 0.05)'
          }]
        }
      },
      lineStyle: {
        width: 3
      }
    }
  ]
}))

// Gráfico de rosca: Distribuição por status
const pieChartOptions = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center'
  },
  series: [
    {
      name: 'Status',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 567, name: 'Concluído', itemStyle: { color: '#4CAF50' } },
        { value: 234, name: 'Em Análise', itemStyle: { color: '#2196F3' } },
        { value: 156, name: 'Pendente', itemStyle: { color: '#FF9800' } },
        { value: 67, name: 'Rejeitado', itemStyle: { color: '#F44336' } }
      ]
    }
  ]
}))

// Gráfico de barras: Tipos de amostra
const barChartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: tiposAmostra,
    axisLabel: {
      rotate: 45,
      color: '#666'
    }
  },
  yAxis: {
    type: 'value',
    name: 'Número de Amostras',
    nameTextStyle: {
      color: '#666'
    },
    axisLabel: {
      color: '#666'
    }
  },
  series: [
    {
      name: 'Amostras',
      type: 'bar',
      data: [320, 289, 245, 178, 145, 120, 98],
      itemStyle: {
        color: function(params) {
          const colors = ['#1976D2', '#2196F3', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD', '#F5F5F5']
          return colors[params.dataIndex] || '#1976D2'
        }
      },
      barWidth: '60%'
    }
  ]
}))

// Gráfico de barras horizontal: Laboratórios
const horizontalBarOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    name: 'Número de Amostras',
    nameTextStyle: {
      color: '#666'
    },
    axisLabel: {
      color: '#666'
    }
  },
  yAxis: {
    type: 'category',
    data: laboratorios,
    axisLabel: {
      color: '#666'
    }
  },
  series: [
    {
      name: 'Amostras',
      type: 'bar',
      data: [456, 389, 345, 278, 215],
      itemStyle: {
        color: function(params) {
          const colors = ['#7B1FA2', '#9C27B0', '#BA68C8', '#CE93D8', '#E1BEE7']
          return colors[params.dataIndex] || '#7B1FA2'
        }
      },
      barWidth: '60%'
    }
  ]
}))
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