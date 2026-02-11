<template>
  <v-row class="mb-6">
    <v-col
      v-for="metric in metrics"
      :key="metric.title"
      cols="12"
      sm="6"
      lg="3"
    >
      <v-card class="pa-4 elevation-1" flat rounded="lg">
        <div class="d-flex align-center">
          <v-icon
            class="mr-4"
            :color="metric.color"
            size="36"
          >
            {{ metric.icon }}
          </v-icon>

          <div>
            <p class="text-caption text-text-muted">
              {{ metric.title }}
            </p>
            <h2 class="text-h5 font-weight-bold text-text-main">
              {{ metric.value }}
            </h2>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  metrics: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<style scoped>
.text-text-muted {
  color: var(--color-text-muted) !important;
}

.text-text-main {
  color: var(--color-text) !important;
}
</style>
