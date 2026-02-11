<template>
  <v-dialog v-model="internalDialog" max-width="500">
    <v-card>
      <!-- Header aprimorado -->
      <v-card-title class="px-6 py-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon 
              icon="mdi-package-variant" 
              size="28" 
              class="mr-3 text-primary"
            />
            <div>
              <div class="text-h6 font-weight-bold">
                Nova Matéria-Prima
              </div>
              <div class="text-caption text-medium-emphasis">
                Adicione uma nova matéria-prima ao estoque
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
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRawMaterialStore } from '@/stores/rawmaterial'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'saved'])

const store = useRawMaterialStore()

const internalDialog = ref(false)
const formRef = ref(null)
const formValid = ref(false)
const isSaving = ref(false)

const form = ref({
  name: '',
  qnt: 0
})

watch(
  () => props.modelValue,
  (val) => {
    internalDialog.value = val
  }
)

watch(internalDialog, (val) => {
  emit('update:modelValue', val)
})

function close() {
  internalDialog.value = false
  resetForm()
}

function resetForm() {
  form.value = { name: '', qnt: 0 }
  formRef.value?.resetValidation()
}

async function save() {
  const valid = await formRef.value.validate()
  if (!valid.valid) return

  isSaving.value = true

  await store.createRawMaterial(form.value)

  isSaving.value = false
  emit('saved')
  close()
}
</script>