<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronRightIcon, DocumentIcon, Square3Stack3DIcon, EyeIcon, UsersIcon, QuestionMarkCircleIcon, Cog6ToothIcon, UserIcon, BuildingOfficeIcon, MapIcon, BriefcaseIcon, RectangleStackIcon, TruckIcon,InboxStackIcon, ArrowRightStartOnRectangleIcon} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('dashboard')
const expandedMenu = ref(new Set())

const menuItems = [
  { id: 'form', label: 'Formulir P2H', icon: DocumentIcon },
  { id: 'dashboard', label: 'Dashboard', icon: Square3Stack3DIcon },
  { 
    id: 'monitor', 
    label: 'Data Monitor',
    icon: EyeIcon,
    children: [
      { id: 'monitor-imm', label: 'PT.IMM', icon: BuildingOfficeIcon },
      { id: 'monitor-travel', label: 'Travel', icon: MapIcon }
    ]
  },
  { 
    id: 'users', 
    label: 'Data Pengguna',
    icon: UsersIcon,
    children: [
      { id: 'users-imm', label: 'PT.IMM', icon: BuildingOfficeIcon },
      { id: 'users-travel', label: 'Travel', icon: MapIcon }
    ]
  },
  { id: 'questions', label: 'Kelola Pertanyaan', icon: QuestionMarkCircleIcon },
  { 
    id: 'masterdata', 
    label: 'Master Data',
    icon: Cog6ToothIcon,
    children: [
      { id: 'masterdata-company', label: 'Perusahaan', icon: BuildingOfficeIcon },
      { id: 'masterdata-department', label: 'Departemen', icon: InboxStackIcon },
      { id: 'masterdata-position', label: 'Posisi', icon: BriefcaseIcon },
      { id: 'masterdata-status', label: 'Status Kerja', icon: RectangleStackIcon },
      { 
        id: 'masterdata-vehicle', 
        label: 'Unit Kendaraan',
        icon: TruckIcon,
        children: [
          { id: 'masterdata-vehicle-imm', label: 'PT.IMM', icon: BuildingOfficeIcon },
          { id: 'masterdata-vehicle-travel', label: 'Travel', icon: MapIcon }
        ]
      }
    ]
  },
  { id: 'profile', label: 'Profile', icon: UserIcon }
]

const handleMenuClick = (menuId, hasChildren = false) => {
  activeMenu.value = menuId
  
  // Jika menu memiliki children, toggle expand state
  if (hasChildren) {
    if (expandedMenu.value.has(menuId)) {
      expandedMenu.value.delete(menuId)
    } else {
      expandedMenu.value.add(menuId)
    }
    return
  }
  
  // Navigasi berdasarkan menu id
  const routes = {
    form: '/form-p2h',
    dashboard: '/dashboard',
    'monitor-imm': '/data-monitor-pt',
    'monitor-travel': '/data-monitor-travel',
    'users-imm': '/data-pengguna-pt',
    'users-travel': '/data-pengguna-travel',
    questions: '/kelola-pertanyaan',
    'masterdata-company': '/data-perusahaan',
    'masterdata-department': '/data-departemen',
    'masterdata-position': '/data-posisi',
    'masterdata-status': '/data-status',
    'masterdata-vehicle-imm': '/unit-kendaraan-pt',
    'masterdata-vehicle-travel': '/unit-kendaraan-travel',
    profile: '/profil-admin'
  }
  if (routes[menuId]) {
    router.push(routes[menuId])
  }
}

const handleLogout = () => {
  router.push('/login')
}

// Map route paths ke menu ids
const routeToMenuMap = {
  '/form-p2h': 'form',
  '/dashboard': 'dashboard',
  '/data-monitor-pt': 'monitor-imm',
  '/data-monitor-travel': 'monitor-travel',
  '/data-pengguna-pt': 'users-imm',
  '/data-pengguna-travel': 'users-travel',
  '/edit-data-pengguna-pt/:id': 'users-imm',
  '/edit-data-pengguna-travel/:id': 'users-travel',
  '/kelola-pertanyaan': 'questions',
  '/data-perusahaan': 'masterdata-company',
  '/data-departemen': 'masterdata-department',
  '/data-posisi': 'masterdata-position',
  '/data-status': 'masterdata-status',
  '/unit-kendaraan-pt': 'masterdata-vehicle-imm',
  '/unit-kendaraan-travel': 'masterdata-vehicle-travel',
  '/edit-unit-pt/:id': 'masterdata-vehicle-imm',
  '/edit-unit-travel/:id': 'masterdata-vehicle-travel',
  '/profil-admin': 'profile'
}

// Function untuk update activeMenu berdasarkan current route
const updateActiveMenuFromRoute = () => {
  const currentPath = route.path
  let menuId = routeToMenuMap[currentPath]
  
  // Jika route tidak langsung match (misal karena parameter), cek pattern
  if (!menuId) {
    if (currentPath.match(/^\/edit-data-pengguna-pt\//)) {
      menuId = 'users-imm'
    } else if (currentPath.match(/^\/edit-data-pengguna-travel\//)) {
      menuId = 'users-travel'
    } else if (currentPath.match(/^\/edit-unit-pt\//)) {
      menuId = 'masterdata-vehicle-imm'
    } else if (currentPath.match(/^\/edit-unit-travel\//)) {
      menuId = 'masterdata-vehicle-travel'
    }
  }
  
  if (menuId) {
    activeMenu.value = menuId
    
    if (menuId.includes('-')) {
      const parts = menuId.split('-')
      const parentId = parts[0] // 'users', 'monitor', 'masterdata', dll
      expandedMenu.value.add(parentId)
      
      // Untuk nested items yang lebih dalam (masterdata-vehicle-imm, masterdata-vehicle-travel)
      if (parts.length > 2) {
        const parentParentId = parts.slice(0, 2).join('-') // 'masterdata-vehicle'
        expandedMenu.value.add(parentParentId)
      }
    }
  }
}

// Update menu saat component mount
onMounted(() => {
  updateActiveMenuFromRoute()
})

// Update menu saat route berubah
watch(() => route.path, () => {
  updateActiveMenuFromRoute()
})
</script>

<template>
  <aside class="w-62 h-screen bg-white flex flex-col shadow-lg overflow-y-auto border-r border-gray-200 fixed left-0 top-0">
    <!-- Logo Section -->
    <div class="px-5 py-3 border-b border-gray-300 text-center">
      <img src="/image_asset/IMM.svg" alt="Logo P2H" class="h-12 w-auto mx-auto" />
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 flex flex-col gap-2 py-5">
      <template v-for="item in menuItems" :key="item.id">
        <!-- Main Menu Item -->
        <button
          :class="[
            'flex items-center gap-4 px-5 py-3 text-sm font-medium transition-all duration-300 text-left',
            activeMenu === item.id
              ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 pl-4'
              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600 hover:pl-7'
          ]"
          @click="handleMenuClick(item.id, !!item.children)"
        >
          <component 
            v-if="item.icon" 
            :is="item.icon" 
            :class="[
              'w-5 h-5 shrink-0',
              activeMenu === item.id ? 'text-indigo-600' : 'text-gray-600'
            ]"
          />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Chevron Icon for items with children -->
          <ChevronRightIcon 
            v-if="item.children"
            :class="[
              'w-5 h-5 transition-transform duration-300',
              expandedMenu.has(item.id) ? 'rotate-90' : ''
            ]"
          />
        </button>

        <!-- Children Menu Items -->
        <template v-if="item.children && expandedMenu.has(item.id)">
          <template v-for="child in item.children" :key="child.id">
            <!-- Child Button -->
            <button
              :class="[
                'flex items-center gap-4 px-2 py-2 text-sm font-medium transition-all duration-300 text-left ml-8 border-l-2 border-transparent',
                activeMenu === child.id
                  ? 'bg-indigo-50 text-indigo-600 border-l-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
              ]"
              @click="handleMenuClick(child.id, !!child.children)"
            >
              <component 
                v-if="child.icon" 
                :is="child.icon" 
                :class="[
                  'w-4 h-4 shrink-0',
                  activeMenu === child.id ? 'text-indigo-600' : 'text-gray-500'
                ]"
              />
              <span class="flex-1">{{ child.label }}</span>
              <!-- Chevron Icon for child items with children -->
              <ChevronRightIcon 
                v-if="child.children"
                :class="[
                  'w-4 h-4 transition-transform duration-300',
                  expandedMenu.has(child.id) ? 'rotate-90' : ''
                ]"
              />
            </button>

            <!-- Grandchild Menu Items -->
            <template v-if="child.children && expandedMenu.has(child.id)">
              <button
                v-for="grandchild in child.children"
                :key="grandchild.id"
                :class="[
                  'flex items-center gap-4 px-2 py-2 text-sm font-medium transition-all duration-300 text-left ml-12 border-l-2 border-transparent',
                  activeMenu === grandchild.id
                    ? 'bg-indigo-50 text-indigo-600 border-l-indigo-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                ]"
                @click="handleMenuClick(grandchild.id)"
              >
                <component 
                  v-if="grandchild.icon" 
                  :is="grandchild.icon" 
                  :class="[
                    'w-4 h-4 shrink-0',
                    activeMenu === grandchild.id ? 'text-indigo-600' : 'text-gray-500'
                  ]"
                />
                <span class="flex-1">{{ grandchild.label }}</span>
              </button>
            </template>
          </template>
        </template>
      </template>
    </nav>

    <!-- Divider -->
    <div class="h-px bg-gray-500 mx-5 my-4"></div>

    <!-- Logout Button -->
    <div class="px-5 pb-5">
      <button 
        @click="handleLogout"
        class="w-full flex items-center gap-4 px-5 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-300 hover:-translate-x-0.5"
      >
        <ArrowRightStartOnRectangleIcon class="w-5 h-5 text-red-600" />
        <span class="flex-1 text-left">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Custom Scrollbar */
aside::-webkit-scrollbar {
  width: 8px;
}

aside::-webkit-scrollbar-track {
  background: #EDEDED;
  border-radius: 10px;
}

aside::-webkit-scrollbar-thumb {
  background: #757575;
  border-radius: 10px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #555555;
}
</style>