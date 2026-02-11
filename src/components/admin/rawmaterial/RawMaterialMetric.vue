<template>
  <v-dialog v-model="internalDialog" max-width="700">
    <v-card>
      <!-- Header aprimorado -->
      <v-card-title class="px-6 py-4 bg-usage-gradient">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar color="info" size="48" class="mr-3">
              <v-icon icon="mdi-link-variant" color="white" size="28" />
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold">
                Produtos Vinculados
              </div>
              <div class="text-caption text-medium-emphasis">
                Produtos que utilizam esta matéria-prima
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
            color="info"
            size="64"
            class="mb-4"
          />
          <p class="text-body-2 text-medium-emphasis">
            Carregando produtos vinculados...
          </p>
        </div>

        <!-- Content -->
        <div v-else-if="products">
          <!-- Raw Material Name -->
          <v-card variant="tonal" color="info" class="mb-4 pa-4">
            <div class="d-flex align-center">
              <v-icon icon="mdi-package-variant" size="32" class="mr-3" />
              <div>
                <div class="text-caption text-medium-emphasis">
                  Matéria-Prima
                </div>
                <div class="text-h6 font-weight-bold">
                  {{ selectedItem?.name }}
                </div>
              </div>
            </div>
          </v-card>

          <!-- Summary Stats -->
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Total de Produtos
                  </div>
                  <v-icon icon="mdi-cube-outline" color="info" size="20" />
                </div>
                <div class="text-h4 font-weight-bold text-info">
                  {{ products.length }}
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-caption text-medium-emphasis">
                    Quantidade Total Necessária
                  </div>
                  <v-icon icon="mdi-sigma" color="success" size="20" />
                </div>
                <div class="text-h4 font-weight-bold text-success">
                  {{ getTotalQuantity() }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Products List -->
          <div v-if="products.length > 0">
            <div class="text-subtitle-2 font-weight-bold mb-3">
              <v-icon icon="mdi-format-list-bulleted" size="20" class="mr-2" />
              Lista de Produtos
            </div>

            <v-list class="pa-0">
              <v-list-item
                v-for="(product) in products"
                :key="product.id"
                class="px-0 mb-2"
              >
                <v-card variant="outlined" class="pa-4 product-card">
                  <v-row align="center">
                    <v-col cols="12" md="1">
                      <v-avatar color="info-lighten" size="40">
                        <v-icon icon="mdi-cube" size="20" />
                      </v-avatar>
                    </v-col>

                    <v-col cols="12" md="5">
                      <div>
                        <v-chip size="x-small" variant="tonal" color="primary" class="mb-1">
                          #{{ product.id }}
                        </v-chip>
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ product.name }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ product.rawMaterials.length }} {{ product.rawMaterials.length === 1 ? 'matéria-prima' : 'matérias-primas' }}
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="3">
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">
                          Quantidade Usada
                        </div>
                        <v-chip color="info" variant="tonal" prepend-icon="mdi-counter">
                          {{ getProductQuantity(product) }} unidades
                        </v-chip>
                      </div>
                    </v-col>

                    <v-col cols="12" md="3">
                      <div class="text-center">
                        <div class="text-caption text-medium-emphasis mb-1">
                          Valor do Produto
                        </div>
                        <div class="text-h6 font-weight-bold text-success">
                          {{ formatCurrency(product.value) }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Additional Materials (if any) -->
                  <div v-if="product.rawMaterials.length > 1" class="mt-3">
                    <v-divider class="mb-2" />
                    <div class="text-caption text-medium-emphasis mb-2">
                      Outras matérias-primas:
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      <v-chip
                        v-for="(material, matIndex) in getOtherMaterials(product)"
                        :key="matIndex"
                        size="small"
                        variant="tonal"
                        color="grey"
                      >
                        {{ material.rawMaterialName }} ({{ material.qnt }} un.)
                      </v-chip>
                    </div>
                  </div>
                </v-card>
              </v-list-item>
            </v-list>
          </div>

          <!-- Empty State -->
          <v-card v-else variant="tonal" color="grey-lighten-3" class="pa-8 text-center">
            <v-icon icon="mdi-package-variant-closed-remove" size="64" color="grey-lighten-1" class="mb-4" />
            <p class="text-h6 font-weight-bold text-medium-emphasis mb-2">
              Nenhum produto vinculado
            </p>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Esta matéria-prima ainda não está sendo utilizada em nenhum produto.
            </p>
          </v-card>

          <!-- Impact Alert -->
          <v-alert
            v-if="products.length > 0"
            type="info"
            variant="tonal"
            density="compact"
            class="mt-4"
            icon="mdi-information"
          >
            <div class="text-body-2">
              <strong>Atenção:</strong> Alterações no estoque desta matéria-prima afetarão a produção de {{ products.length }} {{ products.length === 1 ? 'produto' : 'produtos' }}.
            </div>
          </v-alert>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="text-center py-8">
          <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4" />
          <p class="text-h6 font-weight-bold mb-2">
            Erro ao carregar produtos
          </p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Não foi possível buscar os produtos vinculados.
          </p>
          <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            @click="loadProducts"
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
          v-if="products && products.length > 0"
          color="info"
          prepend-icon="mdi-refresh"
          @click="loadProducts"
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
import { useRawMaterialStore } from '@/stores/rawmaterial'

const props = defineProps({
  modelValue: Boolean,
  selectedItem: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue'])

const rawMaterialStore = useRawMaterialStore()

const internalDialog = ref(false)
const isLoading = ref(false)
const hasError = ref(false)
const products = ref(null)

watch(
  () => props.modelValue,
  (val) => {
    internalDialog.value = val
    if (val && props.selectedItem) {
      loadProducts()
    }
  }
)

watch(internalDialog, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    resetProducts()
  }
})

async function loadProducts() {
  if (!props.selectedItem?.id) return

  isLoading.value = true
  hasError.value = false
  products.value = null

  try {
    const data = await rawMaterialStore.getAllProductsUsingRawMaterial(props.selectedItem.id)
    products.value = data || []
  } catch (error) {
    console.error('Error loading products:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function close() {
  internalDialog.value = false
}

function resetProducts() {
  products.value = null
  hasError.value = false
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

function getProductQuantity(product) {
  const material = product.rawMaterials.find(
    rm => rm.idRawMaterial === props.selectedItem?.id
  )
  return material?.qnt || 0
}

function getTotalQuantity() {
  if (!products.value || products.value.length === 0) return 0
  
  return products.value.reduce((total, product) => {
    return total + getProductQuantity(product)
  }, 0)
}

function getOtherMaterials(product) {
  return product.rawMaterials.filter(
    rm => rm.idRawMaterial !== props.selectedItem?.id
  )
}
</script>

<style scoped>
.bg-usage-gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-info), 0.05) 100%);
}

.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgb(var(--v-theme-info));
}

.v-list {
  background: transparent;
}

.gap-2 {
  gap: 8px;
}
</style>