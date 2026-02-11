<template>
  <v-card class="pa-6 w-100" flat rounded="xl" elevation="0">
    <v-row align="center" class="mb-6" justify="space-between">
      <v-col cols="12" md="4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="48" class="mr-3">
            <v-icon icon="mdi-cube-outline" color="white" size="28" />
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold text-text-main">
              {{ title }}
            </h2>
            <p class="text-caption text-text-muted mb-0">
              Gerencie seu catálogo de produtos
            </p>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="8">
        <div class="d-flex align-center justify-end gap-3">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar produto"
            placeholder="Digite o nome..."
            variant="outlined"
            density="comfortable"
            clearable
            hide-details
            class="search-field"
          />
          
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus" 
            @click="openDialog"
            size="large"
            elevation="2"
            class="text-none"
          >
            Adicionar
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-data-table 
      v-model:items-per-page="itemsPerPage" 
      v-model:page="page" 
      class="elevation-0 custom-data-table clickable-rows"
      :headers="headers" 
      item-key="id" 
      :items="filteredItems" 
      :search="search"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 20, title: '20' },
        { value: 50, title: '50' },
        { value: -1, title: 'Todos' }
      ]" 
      :loading="isLoading"
      hover
      @click:row="handleRowClick"
    >
      <!-- ID Column -->
      <template #item.id="{ item }">
        <v-chip 
          size="small" 
          variant="tonal" 
          color="primary"
        >
          #{{ item.id }}
        </v-chip>
      </template>

      <!-- Name Column -->
      <template #item.name="{ item }">
        <div class="d-flex align-center">
          <v-avatar color="primary-lighten" size="32" class="mr-3">
            <v-icon icon="mdi-cube" size="18" />
          </v-avatar>
          <span class="font-weight-medium text-text-main">
            {{ item.name }}
          </span>
        </div>
      </template>

      <!-- Value Column -->
      <template #item.value="{ item }">
        <div class="d-flex align-center">
          <v-icon icon="mdi-currency-usd" size="16" class="mr-1 text-success" />
          <span class="font-weight-bold text-success">
            {{ formatCurrency(item.value) }}
          </span>
        </div>
      </template>

      <!-- Raw Materials Column -->
      <template #item.rawMaterials="{ item }">
        <div v-if="item.rawMaterials && item.rawMaterials.length > 0">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-chip 
                v-bind="props"
                size="small" 
                variant="tonal" 
                color="info"
                prepend-icon="mdi-package-variant"
              >
                {{ item.rawMaterials.length }} {{ item.rawMaterials.length === 1 ? 'item' : 'itens' }}
              </v-chip>
            </template>
            <div class="pa-2">
              <div 
                v-for="(material, index) in item.rawMaterials" 
                :key="index"
                class="text-caption mb-1"
              >
                • {{ material.rawMaterialName }} ({{ material.qnt }} un.)
              </div>
            </div>
          </v-tooltip>
        </div>
        <v-chip 
          v-else
          size="small" 
          variant="tonal" 
          color="grey"
        >
          Sem matérias-primas
        </v-chip>
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <div class="actions-container" @click.stop>
          <v-tooltip text="Editar" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="primary"
                @click="editProduct(item)"
              />
            </template>
          </v-tooltip>

          <v-tooltip text="Excluir" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="openDeleteDialog(item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>

      <!-- Loading State -->
      <template #loading>
        <v-skeleton-loader type="table-row@5" />
      </template>

      <!-- No Data State -->
      <template #no-data>
        <div class="text-center py-12">
          <v-icon class="mb-4" color="grey-lighten-1" size="80">
            mdi-cube-off-outline
          </v-icon>
          <p class="text-h6 font-weight-bold text-text-main mb-2">
            Nenhum produto encontrado
          </p>
          <p class="text-body-2 text-text-muted mb-4">
            Comece adicionando seu primeiro produto ao catálogo
          </p>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-plus" 
            @click="openDialog"
            variant="tonal"
          >
            Adicionar Agora
          </v-btn>
        </div>
      </template>

      <!-- Footer -->
      <template #bottom>
        <div class="d-flex justify-space-between align-center pa-4">
          <div class="text-caption text-text-muted">
            Mostrando {{ paginationText }}
          </div>
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="5"
            rounded="circle"
            density="comfortable"
          />
        </div>
      </template>
    </v-data-table>
  </v-card>

  <DeleteModal 
    v-model="deleteDialog" 
    :selected-item="selectedItem" 
    :onDelete="store.deleteProduct" 
    type="Produto" 
  />
  <ProductAddModal v-model="dialog" @saved="handleSaved" />
  <ProductEditModal 
    v-model="editDialog" 
    :selected-item="selectedItem" 
    @saved="handleSaved" 
  />
  <!-- Adicione aqui o modal de métricas quando criar -->
  <ProductShowMetrics 
    v-model="metricDialog" 
    :selected-item="selectedItem" 
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductAddModal from './ProductAddModal.vue'
import DeleteModal from '../DeleteModal.vue'
import ProductEditModal from './ProductEditModal.vue'
import ProductShowMetrics from './ProductShowMetrics.vue'

defineProps({
  title: { type: String, default: 'Produtos' },
  addButtonText: { type: String, default: 'Adicionar Novo Produto' },
})

const store = useProductStore()

const page = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editDialog = ref(false)
const metricDialog = ref(false)
const selectedItem = ref(null)
const search = ref('')

const items = computed(() => store.state.products)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  
  const searchLower = search.value.toLowerCase()
  return items.value.filter(item => 
    item.name.toLowerCase().includes(searchLower) ||
    item.id.toString().includes(searchLower)
  )
})

const pageCount = computed(() => {
  if (itemsPerPage.value === -1) return 1
  return Math.ceil(filteredItems.value.length / itemsPerPage.value)
})

const paginationText = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value + 1
  const end = Math.min(page.value * itemsPerPage.value, filteredItems.value.length)
  return `${start}-${end} de ${filteredItems.value.length} itens`
})

const headers = [
  { title: 'ID', key: 'id', align: 'start', sortable: true },
  { title: 'Nome do Produto', key: 'name', align: 'start', sortable: true },
  { title: 'Valor', key: 'value', align: 'start', sortable: true },
  { title: 'Matérias-Primas', key: 'rawMaterials', align: 'start', sortable: false },
  { title: 'Ações', key: 'actions', align: 'end', sortable: false },
]

onMounted(async () => {
  isLoading.value = true
  await store.getAllProducts()
  isLoading.value = false
})

function handleRowClick(event, { item }) {
  openMetricDialog(item)
}

function editProduct(item) {
  selectedItem.value = item
  editDialog.value = true
}

function openDialog() {
  dialog.value = true
}

function openDeleteDialog(item) {
  selectedItem.value = item
  deleteDialog.value = true
}

function openMetricDialog(item) {
  selectedItem.value = item
  metricDialog.value = true
  console.log('Abrindo métricas para:', item)
}

function handleSaved() {
  store.getAllProducts()
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>

<style scoped>
.custom-data-table {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 12px;
  overflow: hidden;
}

.custom-data-table :deep(.v-data-table__th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.custom-data-table :deep(tbody tr) {
  transition: all 0.2s ease;
}

.custom-data-table.clickable-rows :deep(tbody tr) {
  cursor: pointer;
}

.custom-data-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.text-text-main {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.text-text-muted {
  color: gray !important;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.v-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
}

:deep(.v-data-table-footer) {
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
  margin-top: 8px;
}

.search-field {
  flex: 1;
  max-width: 400px;
}

.gap-3 {
  gap: 12px;
}
</style>