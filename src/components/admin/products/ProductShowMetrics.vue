<template>
  <v-dialog v-model="internalDialog" max-width="600">
    <v-card>
      <!-- Header aprimorado -->
      <v-card-title class="px-6 py-4 bg-metrics-gradient">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="48" class="mr-3">
              <v-icon icon="mdi-chart-line" color="white" size="28" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">
                Métricas do Produto
              </div>
              <div class="text-caption text-medium-emphasis">
                Análise de produção e receita potencial
              </div>
            </div>
          </div>
          
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="close"
          />
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="px-6 py-5">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          />
          <p class="text-body-2 text-medium-emphasis">
            Calculando métricas...
          </p>
        </div>

        <!-- Metrics Content -->
        <div v-else-if="metrics">
          <!-- Product Name -->
          <v-card variant="tonal" color="primary" class="mb-4 pa-4">
            <div class="d-flex align-center">
              <v-icon icon="mdi-cube" size="32" class="mr-3" />
              <div>
                <div class="text-caption text-medium-emphasis">
                  Produto
                </div>
                <div class="text-h6 font-weight-bold">
                  {{ metrics.productName }}
                </div>
              </div>
            </div>
          </v-card>

          <!-- Metrics Cards -->
          <v-row class="mb-4">
            <!-- Max Production -->
            <v-col cols="12" md="6">
              <v-card 
                variant="outlined" 
                class="pa-4 metric-card"
                :class="{ 'no-stock': metrics.maxProduction === 0 }"
              >
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Produção Máxima
                  </div>
                  <v-icon 
                    :icon="metrics.maxProduction > 0 ? 'mdi-factory' : 'mdi-alert-circle'" 
                    :color="metrics.maxProduction > 0 ? 'primary' : 'error'"
                    size="20"
                  />
                </div>
                <div class="d-flex align-center">
                  <div class="text-h4 font-weight-bold" :class="getProductionColor()">
                    {{ metrics.maxProduction }}
                  </div>
                  <div class="text-caption text-medium-emphasis ml-2">
                    unidades
                  </div>
                </div>
                <v-divider class="my-3" />
                <div class="d-flex align-center">
                  <v-chip 
                    :color="getProductionChipColor()" 
                    size="small" 
                    variant="tonal"
                    :prepend-icon="getProductionIcon()"
                  >
                    {{ getProductionStatus() }}
                  </v-chip>
                </div>
              </v-card>
            </v-col>

            <!-- Potential Revenue -->
            <v-col cols="12" md="6">
              <v-card 
                variant="outlined" 
                class="pa-4 metric-card"
                :class="{ 'no-revenue': metrics.potentialRevenue === 0 }"
              >
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Receita Potencial
                  </div>
                  <v-icon 
                    icon="mdi-cash-multiple" 
                    :color="metrics.potentialRevenue > 0 ? 'success' : 'grey'"
                    size="20"
                  />
                </div>
                <div class="d-flex align-center">
                  <div class="text-h4 font-weight-bold text-success">
                    {{ formatCurrency(metrics.potentialRevenue) }}
                  </div>
                </div>
                <v-divider class="my-3" />
                <div class="d-flex align-center justify-space-between">
                  <v-chip 
                    color="success" 
                    size="small" 
                    variant="tonal"
                    prepend-icon="mdi-trending-up"
                  >
                    Receita Total
                  </v-chip>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatCurrency(getUnitPrice()) }}/un
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Analysis Summary -->
          <v-alert
            v-if="metrics.maxProduction === 0"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-4"
            icon="mdi-alert"
          >
            <div class="text-body-2">
              <strong>Atenção!</strong> Não há matérias-primas suficientes em estoque para produzir este produto.
            </div>
          </v-alert>

          <v-alert
            v-else-if="metrics.maxProduction < 10"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
            icon="mdi-information"
          >
            <div class="text-body-2">
              <strong>Estoque baixo!</strong> Considere repor as matérias-primas para aumentar a capacidade de produção.
            </div>
          </v-alert>

          <v-alert
            v-else
            type="success"
            variant="tonal"
            density="compact"
            class="mb-4"
            icon="mdi-check-circle"
          >
            <div class="text-body-2">
              <strong>Ótimo!</strong> Você tem estoque suficiente para uma boa produção.
            </div>
          </v-alert>

          <!-- Additional Info -->
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-2 font-weight-bold mb-3">
              <v-icon icon="mdi-information-outline" size="20" class="mr-2" />
              Informações Adicionais
            </div>
            <v-list density="compact" class="pa-0">
              <v-list-item class="px-0">
                <template #prepend>
                  <v-icon icon="mdi-package-variant" size="20" class="mr-2" />
                </template>
                <v-list-item-title class="text-body-2">
                  Matérias-primas necessárias por unidade
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend>
                  <v-icon icon="mdi-calculator" size="20" class="mr-2" />
                </template>
                <v-list-item-title class="text-body-2">
                  Cálculo baseado no estoque atual
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend>
                  <v-icon icon="mdi-update" size="20" class="mr-2" />
                </template>
                <v-list-item-title class="text-body-2">
                  Atualizado em tempo real
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="text-center py-8">
          <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4" />
          <p class="text-h6 font-weight-bold mb-2">
            Erro ao carregar métricas
          </p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Não foi possível calcular as métricas do produto.
          </p>
          <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            @click="loadMetrics"
            variant="tonal"
          >
            Tentar Novamente
          </v-btn>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-spacer />
        
        <v-btn 
          variant="tonal" 
          @click="close"
          prepend-icon="mdi-close"
        >
          Fechar
        </v-btn>

        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          @click="loadMetrics"
          variant="elevated"
          :loading="isLoading"
        >
          Atualizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from '@/stores/product'

const props = defineProps({
  modelValue: Boolean,
  selectedItem: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue'])

const productStore = useProductStore()

const internalDialog = ref(false)
const isLoading = ref(false)
const hasError = ref(false)
const metrics = ref(null)

watch(
  () => props.modelValue,
  (val) => {
    internalDialog.value = val
    if (val && props.selectedItem) {
      loadMetrics()
    }
  }
)

watch(internalDialog, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    resetMetrics()
  }
})

async function loadMetrics() {
  if (!props.selectedItem?.id) return

  isLoading.value = true
  hasError.value = false
  metrics.value = null

  try {
    const data = await productStore.getProductMetrics(props.selectedItem.id)
    metrics.value = data
  } catch (error) {
    console.error('Error loading metrics:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function close() {
  internalDialog.value = false
}

function resetMetrics() {
  metrics.value = null
  hasError.value = false
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

function getUnitPrice() {
  if (!metrics.value || metrics.value.maxProduction === 0) return 0
  return metrics.value.potentialRevenue / metrics.value.maxProduction
}

function getProductionColor() {
  if (!metrics.value) return 'text-grey'
  if (metrics.value.maxProduction === 0) return 'text-error'
  if (metrics.value.maxProduction < 10) return 'text-warning'
  return 'text-primary'
}

function getProductionChipColor() {
  if (!metrics.value) return 'grey'
  if (metrics.value.maxProduction === 0) return 'error'
  if (metrics.value.maxProduction < 10) return 'warning'
  if (metrics.value.maxProduction < 50) return 'info'
  return 'success'
}

function getProductionIcon() {
  if (!metrics.value) return 'mdi-help-circle'
  if (metrics.value.maxProduction === 0) return 'mdi-alert-circle'
  if (metrics.value.maxProduction < 10) return 'mdi-alert'
  return 'mdi-check-circle'
}

function getProductionStatus() {
  if (!metrics.value) return 'Desconhecido'
  if (metrics.value.maxProduction === 0) return 'Sem Estoque'
  if (metrics.value.maxProduction < 10) return 'Estoque Baixo'
  if (metrics.value.maxProduction < 50) return 'Estoque Regular'
  return 'Estoque Bom'
}
</script>

<style scoped>
.bg-metrics-gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
}

.metric-card {
  transition: all 0.3s ease;
  height: 100%;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-card.no-stock {
  border-color: rgb(var(--v-theme-error));
  background-color: rgba(var(--v-theme-error), 0.02);
}

.metric-card.no-revenue {
  opacity: 0.7;
}

.v-list {
  background: transparent;
}
</style>