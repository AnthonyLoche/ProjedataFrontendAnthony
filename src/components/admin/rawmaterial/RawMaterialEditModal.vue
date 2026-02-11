<template>
  <v-dialog v-model="internalDialog" max-width="500">
    <v-card>
      <!-- Header aprimorado -->
      <v-card-title class="px-6 py-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon 
              icon="mdi-pencil-box" 
              size="28" 
              class="mr-3 text-primary"
            />
            <div>
              <div class="text-h6 font-weight-bold">
                Editar Matéria-Prima
              </div>
              <div class="text-caption text-medium-emphasis">
                Atualize as informações da matéria-prima
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
          <v-text-field
            v-model="form.name"
            label="Nome"
            placeholder="Ex: Farinha de Trigo"
            prepend-inner-icon="mdi-rename-box"
            :rules="[v => !!v || 'Nome é obrigatório']"
            variant="outlined"
            required
          />

          <v-text-field
            v-model.number="form.qnt"
            label="Quantidade"
            placeholder="0"
            type="number"
            prepend-inner-icon="mdi-counter"
            :rules="[v => v >= 0 || 'Quantidade deve ser ≥ 0']"
            variant="outlined"
            required
          />
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
          Atualizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRawMaterialStore } from '@/stores/rawMaterial'

const props = defineProps({
  modelValue: Boolean,
  selectedItem: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
      qnt: 0
    })
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const store = useRawMaterialStore()

const internalDialog = ref(false)
const formRef = ref(null)
const formValid = ref(false)
const isSaving = ref(false)

const form = ref({
  id: 0,
  name: '',
  qnt: 0
})

watch(
  () => props.modelValue,
  (val) => {
    internalDialog.value = val
    if (val && props.selectedItem) {
      form.value = {
        id: props.selectedItem.id,
        name: props.selectedItem.name,
        qnt: props.selectedItem.qnt
      }
    }
  }
)

watch(
  () => props.selectedItem,
  (newItem) => {
    if (newItem && internalDialog.value) {
      form.value = {
        id: newItem.id,
        name: newItem.name,
        qnt: newItem.qnt
      }
    }
  },
  { deep: true }
)

watch(internalDialog, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    resetForm()
  }
})

function close() {
  internalDialog.value = false
}

function resetForm() {
  form.value = {
    id: 0,
    name: '',
    qnt: 0
  }
  formRef.value?.resetValidation()
}

async function save() {
  const valid = await formRef.value.validate()
  if (!valid.valid) return

  isSaving.value = true

  await store.updateRawMaterial(form.value.id, {
    name: form.value.name,
    qnt: form.value.qnt
  })

  isSaving.value = false
  emit('saved')
  close()
}
</script>