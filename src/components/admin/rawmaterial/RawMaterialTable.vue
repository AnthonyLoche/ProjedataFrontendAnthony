<template>
  <v-card class="pa-4 w-100" flat rounded="lg">
    <v-row align="center" class="mb-4" justify="space-between">
      <v-col cols="12" md="6">
        <h2 class="text-h6 font-weight-bold text-text-main">
          {{ title }}
        </h2>
      </v-col>

      <v-col class="text-right" cols="12" md="6">
        <v-btn color="#FF8C00" prepend-icon="mdi-plus" @click="openDialog">
          Adicionar Nova Matéria-Prima
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table v-model:items-per-page="itemsPerPage" v-model:page="page" class="elevation-0 custom-data-table"
      :headers="headers" item-key="id" :items="items" :items-per-page-options="[5, 10, 20, 50]" :loading="isLoading">
      <template #item.name="{ item }">
        <span class="font-weight-medium text-text-main">
          {{ item.name }}
        </span>
      </template>

      <template #item.qnt="{ item }">
        {{ item.qnt }}
      </template>

      <template #item.actions="{ item }">
        <div class="actions-container">
          <v-icon class="mr-2 text-text-muted action-icon" size="small" @click="editRawMaterial(item)">
            mdi-pencil
          </v-icon>

          <v-icon class="text-text-muted action-icon" size="small" @click="openDeleteDialog(item)">
            mdi-delete
          </v-icon>
        </div>
      </template>

      <template #no-data>
        <div class="text-center py-8">
          <v-icon class="mb-4" color="grey-lighten-2" size="64">
            mdi-database-remove
          </v-icon>
          <p class="text-body-1 text-text-muted">
            Nenhuma matéria-prima encontrada
          </p>
        </div>
      </template>
    </v-data-table>
  </v-card>

  <RawMaterialAddModal v-model="dialog" @saved="handleSaved" />
  <DeleteModal v-model="deleteDialog" :selected-item="selectedItem" :onDelete="store.deleteRawMaterial" type="Matéria-Prima" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRawMaterialStore } from '@/stores/rawmaterial'
import RawMaterialAddModal from './RawMaterialAddModal.vue'
import DeleteModal from "../DeleteModal.vue"

defineProps({
  title: { type: String, default: 'Matérias-Primas' },
  addButtonText: { type: String, default: 'Adicionar Nova Matéria-Prima' },
})

const store = useRawMaterialStore()
const router = useRouter()

const page = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const selectedItem = ref(null)

const items = computed(() => store.state.rawMaterials)

const headers = [
  { title: 'ID', key: 'id', align: 'start', sortable: true },
  { title: 'Nome', key: 'name', align: 'start', sortable: true },
  { title: 'Quantidade em Estoque', key: 'qnt', align: 'start', sortable: true },
  { title: 'Ações', key: 'actions', align: 'end', sortable: false },
]

onMounted(async () => {
  isLoading.value = true
  await store.getAllRawMaterials()
  isLoading.value = false
})

function editRawMaterial(item) {
  router.push(`/admin/raw-materials/edit/${item.id}`)
}

function openDialog() {
  dialog.value = true
}

const openDeleteDialog = (item) => {
  selectedItem.value = item
  deleteDialog.value = true
}
</script>

<style scoped>
.custom-data-table {
  border-radius: 8px;
  overflow: hidden;
}

.custom-data-table :deep(tbody tr:hover) {
  background-color: var(--color-bg-active) !important;
  transform: translateY(-1px);
  transition: 0.2s;
}

.text-text-main {
  color: var(--color-text) !important;
}

.text-text-muted {
  color: var(--color-text-muted) !important;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
}

.action-icon {
  cursor: pointer;
  transition: 0.2s;
  padding: 4px;
}

.action-icon:hover {
  transform: scale(1.1);
}

.action-icon:first-child:hover {
  color: var(--color-primary) !important;
}

.action-icon:last-child:hover {
  color: var(--color-error) !important;
}
</style>
