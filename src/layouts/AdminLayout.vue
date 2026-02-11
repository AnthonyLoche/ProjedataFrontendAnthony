<template>
  <v-app>
    <AsideAdmin v-model="drawer" @logout="handleLogout" />

    <v-main class="main-content">
      <div class="page-container">

        <v-breadcrumbs v-if="breadcrumbs.length > 0" class="breadcrumb" :items="breadcrumbs">
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>


        <header v-if="pageTitle" class="page-header">
          <div class="header-content">
            <div>
              <h1 class="page-title">{{ pageTitle }}</h1>
              <p v-if="pageDescription" class="page-description">{{ pageDescription }}</p>
            </div>
            <div class="header-actions">
              <slot name="header-actions" />
            </div>
          </div>
        </header>


        <main class="page-content">
          <router-view />
        </main>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AsideAdmin } from '@/components'

const route = useRoute()
const router = useRouter()

const drawer = ref(true)

const pageTitle = computed(() => route.meta?.title || '')
const pageDescription = computed(() => route.meta?.description || '')
const breadcrumbs = computed(() => route.meta?.breadcrumbs || [])

// Handlers
const handleLogout = () => {
  router.push('/login')
}
</script>

<style>

:root {
  --color-primary: #0080FF;
  --color-primary-dark: #0066CC;
  --color-primary-darker: #0055AA;
  --color-primary-light: #3399FF;
  --color-primary-lighter: #66B3FF;

  --color-bg-main: #F8FBFF;
  --color-bg-sidebar: #FFFFFF;
  --color-bg-hover: #F0F7FF;
  --color-bg-active: #E1F0FF;
  --color-bg-card: #FFFFFF;

  --color-text: #2C3E50;
  --color-text-muted: #7F8C8D;
  --color-text-light: #95A5A6;

  --color-accent: var(--color-secondary);
  --color-success: #27AE60;
  --color-warning: #F39C12;
  --color-error: #E74C3C;

  --color-border: rgba(0, 128, 255, 0.1);
  --color-border-light: rgba(0, 128, 255, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 128, 255, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 128, 255, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 128, 255, 0.2);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-application {
  background-color: var(--color-bg-main) !important;
}

.main-content {
  background-color: var(--color-bg-main) !important;
  min-height: 100vh;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: none;
}

.breadcrumb {
  padding: 16px 0 !important;
  color: var(--color-text-muted) !important;
}

.page-header {
  margin-bottom: 24px;
  padding-top: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin: 0 0 4px 0;
}

.page-description {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Conteúdo da página */
.page-content {
  padding-bottom: 32px;
}


.v-card {
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm) !important;
  border-radius: var(--radius-md) !important;
  transition: var(--transition);
}

.v-card:hover {
  box-shadow: var(--shadow-md) !important;
}

.v-btn--elevated {
  background-color: var(--color-primary) !important;
  color: white !important;
}

.v-btn--elevated:hover {
  background-color: var(--color-primary-dark) !important;
}

.v-btn--outlined {
  color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
}

.v-btn--outlined:hover {
  background-color: var(--color-bg-hover) !important;
}

.v-table {
  background-color: transparent !important;
}

.v-table th {
  color: var(--color-text) !important;
  font-weight: 600 !important;
}

.v-table td {
  color: var(--color-text) !important;
}

.v-chip {
  font-weight: 500 !important;
}

.v-field {
  background-color: white !important;
}

.v-field:hover {
  border-color: var(--color-primary) !important;
}

.v-field--focused {
  border-color: var(--color-primary) !important;
}

@media (max-width: 768px) {
  .page-container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-description {
    font-size: 13px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .header-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 0 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .breadcrumb {
    padding: 12px 0 !important;
  }
}

.text-primary {
  color: var(--color-primary) !important;
}

.text-secondary {
  color: var(--color-secondary) !important;
}

.text-muted {
  color: var(--color-text-muted) !important;
}

.bg-hover {
  background-color: var(--color-bg-hover) !important;
}

.bg-active {
  background-color: var(--color-bg-active) !important;
}

.page-container::-webkit-scrollbar {
  width: 6px;
}

.page-container::-webkit-scrollbar-track {
  background: var(--color-border-light);
}

.page-container::-webkit-scrollbar-thumb {
  background: var(--color-primary-light);
  border-radius: 3px;
}

.page-container::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}
</style>