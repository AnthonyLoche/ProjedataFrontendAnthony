<template>
    <v-dialog v-model="internalDialog" max-width="500">
        <v-card>
            <!-- Header de alerta -->
            <v-card-title class="px-6 py-4 bg-error-subtle">
                <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-avatar color="error" size="40" class="mr-3">
                            <v-icon icon="mdi-alert-circle" color="white" />
                        </v-avatar>
                        <div>
                            <div class="text-h6 font-weight-bold">
                                Confirmar Exclusão
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                Esta ação é irreversível
                            </div>
                        </div>
                    </div>

                    <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
                </div>
            </v-card-title>

            <v-divider />

            <v-card-text class="px-6 py-5">
                <p class="text-body-1 mb-2">
                    Atenção: Esta ação não pode ser desfeita

                </p>
                <p class="text-body-1 mb-2">
                    Tem certeza que deseja deletar {{ type }}:
                </p>


                <div class="pa-3 rounded bg-error-lighten text-center">
                    <v-icon icon="mdi-package-variant-closed" size="24" class="mb-2" color="error" />
                    <div class="text-h6 font-weight-bold text-error">
                        {{ selectedItem?.name }}
                    </div>
                </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="px-6 py-4">
                <v-spacer />

                <v-btn variant="tonal" @click="close" prepend-icon="mdi-cancel">
                    Cancelar
                </v-btn>

                <v-btn color="error" prepend-icon="mdi-delete" :loading="isSaving" @click="deleteRawMaterial"
                    variant="elevated">
                    Deletar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    selectedItem: Object,
    onDelete: {
        type: Function,
        default: null
    },
    type: {
        type: String,
    }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const internalDialog = ref(false)
const isSaving = ref(false)

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
}

const deleteRawMaterial = async () => {
    if (!props.selectedItem) return

    isSaving.value = true
    console.log(props.onDelete)
    await props.onDelete(props.selectedItem.id)
    close()
    isSaving.value = false
    emit('saved')
}
</script>

<style scoped>
.bg-error-subtle {
    background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-error), 0.05) 100%);
}

.bg-error-lighten {
    background-color: rgba(var(--v-theme-error), 0.08);
    border: 1px solid rgba(var(--v-theme-error), 0.2);
}
</style>