<template>
  <v-navigation-drawer v-model="drawer" class="sidebar" :permanent="!isMobile" :rail="rail" rail-width="85"
    :temporary="isMobile" width="300">
    <div class="sidebar-header">
      <div class="logo-section" @click="rail = false">
        <v-avatar class="logo-avatar" color="primary" size="44">
          <span class="logo-text">PD</span>
        </v-avatar>
        <transition name="fade">
          <div v-if="!rail" class="logo-info">
            <h1 class="logo-title">PROJEDATA</h1>
            <span class="logo-subtitle">projedata</span>
          </div>
        </transition>
      </div>
      <v-btn v-if="!isMobile" class="toggle-btn" :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" size="small"
        variant="text" @click="rail = !rail" />
    </div>

    <v-divider class="divider-custom" />

    <div class="nav-section">
      <span v-if="!rail" class="nav-label">Menu Principal</span>
      <v-list class="nav-list" density="compact" nav>
        <v-list-item v-for="item in menuItems" :key="item.route" :active="isActive(item.route)" class="nav-item"
          rounded="lg" :to="item.route">
          <template #prepend>
            <v-icon :class="{ 'icon-active': isActive(item.route) }" :icon="item.icon" />
          </template>
          <v-list-item-title class="nav-item-title">{{ item.title }}</v-list-item-title>
          <template #append>
            <v-chip v-if="item.badge" class="badge-chip" size="x-small">
              {{ item.badge }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <v-divider class="divider-custom" />

    <template #append>
      <div class="sidebar-footer">
        <!-- Footer vazio ou com conteúdo estático -->
      </div>
    </template>
  </v-navigation-drawer>

  <v-app-bar v-if="isMobile" class="mobile-header" flat>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-app-bar-title>
      <div class="d-flex align-center">
        <v-avatar class="logo-avatar mr-2" size="32">
          <span class="logo-text-small">UL</span>
        </v-avatar>
        <span class="mobile-title">Projedata</span>
      </div>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const emit = defineEmits(['toggle-drawer'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})

const drawer = ref(props.modelValue)
const rail = ref(false)
const isMobile = ref(false)

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', route: '/dashboard' },
  { title: 'Matérias Primas', icon: 'mdi-diamond', route: '/rawmaterial' },
  { title: 'Produtos', icon: 'mdi-cube', route: '/products' },
  { title: 'Pedidos', icon: 'mdi-shopping', route: '/orders' },
]

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    drawer.value = false
    rail.value = false
  }
}

const isActive = (itemRoute) => {
  const currentPath = route.path

  if (itemRoute === '/admin') {
    return currentPath === '/admin'
  }

  return currentPath === itemRoute ||
    (currentPath.startsWith(itemRoute + '/') && itemRoute !== '/')
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

watch(() => props.modelValue, (newVal) => {
  drawer.value = newVal
})

watch(drawer, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
:root {
  --color-primary: #0080FF;
  --color-primary-dark: #0066CC;
  --color-primary-darker: #0055AA;
  --color-primary-light: #3399FF;
  --color-primary-lighter: #66B3FF;

  --color-secondary: #FF6B35;
  --color-secondary-dark: #E55A2B;
  --color-secondary-light: #FF8C66;

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

.sidebar {
  height: 100vh !important;
  background: linear-gradient(180deg, var(--color-bg-sidebar) 0%, #FFFFFF 100%) !important;
  border-right: 1px solid var(--color-border) !important;
  box-shadow: 2px 0 8px rgba(0, 128, 255, 0.05);
}

.nav-item.v-list-item--active {
  background-color: var(--color-bg-active) !important;
  border-left: 3px solid var(--color-primary) !important;
}

.v-list-item-title,
.logo-title,
.mobile-title {
  color: var(--color-text) !important;
}

.logo-subtitle,
.nav-label,
.v-list-item--active .v-icon {
  color: var(--color-text-muted) !important;
}

.nav-item.v-list-item--active .v-icon {
  color: var(--color-primary) !important;
}

.logo-avatar {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%) !important;
  box-shadow: 0 4px 12px rgba(0, 128, 255, 0.2);
}

.logo-text,
.logo-text-small {
  color: white !important;
  font-weight: 700;
}

.toggle-btn {
  color: var(--color-text-muted) !important;
}

.toggle-btn:hover {
  color: var(--color-primary) !important;
  background-color: var(--color-bg-hover) !important;
}

.nav-item:hover:not(.v-list-item--active) {
  background-color: var(--color-bg-hover) !important;
}

.divider-custom {
  border-color: var(--color-border) !important;
}

.badge-chip {
  background-color: var(--color-secondary) !important;
  color: white !important;
  font-weight: 700;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 12px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-avatar {
  box-shadow: var(--shadow-md);
}

.logo-text {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.logo-text-small {
  font-size: 12px;
  font-weight: 700;
}

.logo-info {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.logo-subtitle {
  font-size: 11px;
  white-space: nowrap;
}

.divider-custom {
  margin: 8px 16px;
}

.nav-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 12px 4px;
  display: block;
}

.nav-list {
  padding: 0 !important;
}

.nav-item {
  margin: 4px 0;
  padding: 0 12px;
  min-height: 44px;
  transition: var(--transition);
}

.nav-item-title {
  font-size: 14px;
  font-weight: 500;
}

.nav-item.v-list-item--active {
  box-shadow: var(--shadow-sm);
}

.nav-item .v-icon {
  transition: var(--transition);
}

.sidebar-footer {
  padding: 16px;
}

.mobile-header {
  background-color: var(--color-bg-sidebar) !important;
  border-bottom: 1px solid var(--color-border) !important;
  box-shadow: 0 2px 8px rgba(0, 128, 255, 0.05);
}

.mobile-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.v-list-item {
  transition: var(--transition);
}
</style>