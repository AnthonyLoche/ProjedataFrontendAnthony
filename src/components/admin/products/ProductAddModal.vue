<template>
  <v-dialog v-model="internalDialog" max-width="600">
    <v-card>
      <!-- Header aprimorado -->
      <v-card-title class="px-6 py-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon 
              icon="mdi-cube-outline" 
              size="28" 
              class="mr-3 text-primary"
            />
            <div>
              <div class="text-h6 font-weight-bold">
                Novo Produto
              </div>
              <div class="text-caption text-medium-emphasis">
                Adicione um novo produto ao catálogo
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
        <v-form ref="formRef" v-model="formValid">
          <!-- Nome do Produto -->
          <v-text-field
            v-model="form.name"
            label="Nome do Produto"
            placeholder="Ex: Bolo de Chocolate"
            prepend-inner-icon="mdi-rename-box"
            :rules="[v => !!v || 'Nome é obrigatório']"
            variant="outlined"
            required
            class="mb-4"
          />

          <!-- Valor -->
          <v-text-field
            v-model.number="form.value"
            label="Valor (R$)"
            placeholder="0.00"
            type="number"
            step="0.01"
            prepend-inner-icon="mdi-currency-usd"
            :rules="[v => v >= 0 || 'Valor deve ser ≥ 0']"
            variant="outlined"
            required
            class="mb-4"
          />

          <!-- Matérias-Primas -->
          <div class="mb-3">
            <div class="d-flex align-center justify-space-between mb-3">
              <label class="text-subtitle-2 font-weight-bold">
                Matérias-Primas
              </label>
              <v-btn
                size="small"
                color="primary"
                prepend-icon="mdi-plus"
                variant="tonal"
                @click="addRawMaterial"
              >
                Adicionar
              </v-btn>
            </div>

            <!-- Lista de Matérias-Primas -->
            <v-card
              v-if="form.rawMaterials.length === 0"
              variant="tonal"
              class="pa-4 text-center"
            >
              <v-icon icon="mdi-package-variant-closed" size="48" color="grey-lighten-1" class="mb-2" />
              <p class="text-caption text-medium-emphasis mb-0">
                Nenhuma matéria-prima adicionada
              </p>
            </v-card>

            <v-list v-else class="pa-0">
              <v-list-item
                v-for="(material, index) in form.rawMaterials"
                :key="index"
                class="px-0 mb-2"
              >
                <v-card variant="outlined" class="pa-3">
                  <v-row dense align="center">
                    <v-col cols="6">
                      <v-select
                        v-model="material.idRawMaterial"
                        :items="availableRawMaterials"
                        item-title="name"
                        item-value="id"
                        label="Matéria-Prima"
                        variant="outlined"
                        density="compact"
                        hide-details
                        @update:model-value="updateRawMaterialName(index)"
                      />
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        v-model.number="material.qnt"
                        label="Quantidade"
                        type="number"
                        variant="outlined"
                        density="compact"
                        hide-details
                        min="0"
                      />
                    </v-col>
                    <v-col cols="1" class="d-flex justify-end">
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeRawMaterial(index)"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-list-item>
            </v-list>
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-spacer />
        
        <v-btn 
          variant="tonal" 
          @click="close"
          prepend-icon="mdi-cancel"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          prepend-icon="mdi-content-save"
          :loading="isSaving"
          @click="save"
          variant="elevated"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useRawMaterialStore } from '@/stores/rawmaterial'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'saved'])

const productStore = useProductStore()
const rawMaterialStore = useRawMaterialStore()

const internalDialog = ref(false)
const formRef = ref(null)
const formValid = ref(false)
const isSaving = ref(false)
const availableRawMaterials = ref([])

const form = ref({
  name: '',
  value: 0,
  rawMaterials: []
})

watch(
  () => props.modelValue,
  (val) => {
    internalDialog.value = val
    if (val) {
      loadRawMaterials()
    }
  }
)

watch(internalDialog, (val) => {
  emit('update:modelValue', val)
})

onMounted(() => {
  loadRawMaterials()
})

async function loadRawMaterials() {
  await rawMaterialStore.getAllRawMaterials()
  availableRawMaterials.value = rawMaterialStore.state.rawMaterials
}

function addRawMaterial() {
  form.value.rawMaterials.push({
    idRawMaterial: null,
    rawMaterialName: '',
    qnt: 0
  })
}

function removeRawMaterial(index) {
  form.value.rawMaterials.splice(index, 1)
}

function updateRawMaterialName(index) {
  const material = form.value.rawMaterials[index]
  const selected = availableRawMaterials.value.find(
    rm => rm.id === material.idRawMaterial
  )
  if (selected) {
    material.rawMaterialName = selected.name
  }
}

function close() {
  internalDialog.value = false
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    value: 0,
    rawMaterials: []
  }
  formRef.value?.resetValidation()
}

async function save() {
  const valid = await formRef.value.validate()
  if (!valid.valid) return

  // Validar se todas as matérias-primas têm ID e quantidade
  const hasInvalidMaterials = form.value.rawMaterials.some(
    m => !m.idRawMaterial || m.qnt <= 0
  )

  if (hasInvalidMaterials) {
    alert('Por favor, preencha todas as matérias-primas corretamente')
    return
  }

  isSaving.value = true

  await productStore.createProduct(form.value)

  isSaving.value = false
  emit('saved')
  close()
}
</script>

<style scoped>
.v-list {
  background: transparent;
}
</style>