<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronRightIcon, DocumentIcon, Square3Stack3DIcon, EyeIcon, UsersIcon, QuestionMarkCircleIcon, Cog6ToothIcon, UserIcon, BuildingOfficeIcon, MapIcon, BriefcaseIcon, RectangleStackIcon, TruckIcon,InboxStackIcon, ArrowRightStartOnRectangleIcon, XMarkIcon, Bars3Icon, ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  onClose: {
    type: Function,
    default: () => {}
  }
})

const router = useRouter()
const route = useRoute()
const activeMenu = ref('dashboard')
const expandedMenu = ref(new Set())
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const selectedLanguage = ref('id')
const isLanguageDropdownOpen = ref(false)

const languages = [
  { code: 'id', label: 'Indonesia', flag: '/image_asset/b_indonesia.png' },
  { code: 'en', label: 'English', flag: '/image_asset/b_amerika.png' }
]

// Monitor window resize
const handleWindowResize = () => {
  windowWidth.value = window.innerWidth
  // Auto close mobile menu when resizing to larger screen
  if (windowWidth.value >= 1024) {
    props.onClose()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
})

// Close mobile menu when route changes
watch(() => route.path, () => {
  props.onClose()
})

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

const handleLanguageSelect = (languageCode) => {
  selectedLanguage.value = languageCode
  isLanguageDropdownOpen.value = false
  // TODO: Emit language change event or update global language state
}

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
}
</script>

<template>
  <!-- Mobile Menu Backdrop -->
  <div 
    v-if="isOpen && windowWidth < 1024"
    @click="onClose"
    class="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
  ></div>

  <aside 
    :class="[
      'fixed lg:fixed left-0 top-0 h-screen bg-white flex flex-col shadow-lg overflow-y-auto border-r border-gray-200 transition-all duration-300 z-40',
      'w-56 sm:w-60 lg:w-62 lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo Section -->
    <div class="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-300 text-center flex items-center justify-between">
      <img src="/image_asset/IMM.svg" alt="Logo P2H" class="h-10 sm:h-12 w-auto mx-auto" />
      <!-- Close button for mobile -->
      <button
        v-if="windowWidth < 1024"
        @click="onClose"
        class="lg:hidden absolute right-2 sm:right-4 top-2 sm:top-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <XMarkIcon class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      </button>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 flex flex-col gap-1 sm:gap-2 py-3 sm:py-5">
      <template v-for="item in menuItems" :key="item.id">
        <!-- Main Menu Item -->
        <button
          :class="[
            'flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 text-left',
            activeMenu === item.id
              ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 pl-3 sm:pl-4'
              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
          ]"
          @click="handleMenuClick(item.id, !!item.children)"
        >
          <component 
            v-if="item.icon" 
            :is="item.icon" 
            :class="[
              'w-4 h-4 sm:w-5 sm:h-5 shrink-0',
              activeMenu === item.id ? 'text-indigo-600' : 'text-gray-600'
            ]"
          />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Chevron Icon for items with children -->
          <ChevronRightIcon 
            v-if="item.children"
            :class="[
              'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300',
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
                'flex items-center gap-3 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 text-left ml-6 sm:ml-8 border-l-2 border-transparent',
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
                  'w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0',
                  activeMenu === child.id ? 'text-indigo-600' : 'text-gray-500'
                ]"
              />
              <span class="flex-1">{{ child.label }}</span>
              <!-- Chevron Icon for child items with children -->
              <ChevronRightIcon 
                v-if="child.children"
                :class="[
                  'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300',
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
                  'flex items-center gap-3 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 text-left ml-10 sm:ml-12 border-l-2 border-transparent',
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
                    'w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0',
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

    <!-- Language Dropdown -->
    <div class="px-3 sm:px-5 pb-3 sm:pb-2 relative">
      <button 
        @click="toggleLanguageDropdown"
        class="w-full flex items-center gap-2 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-full font-semibold text-xs sm:text-sm hover:bg-blue-100 hover:border-blue-300 transition-all duration-300"
      >
        <img :src="languages.find(l => l.code === selectedLanguage).flag" :alt="languages.find(l => l.code === selectedLanguage).label" class="w-5 h-5 sm:w-6 sm:h-6 rounded" />
        <span class="flex-1 text-left">{{ languages.find(l => l.code === selectedLanguage).label }}</span>
        <ChevronDownIcon 
          :class="[
            'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300',
            isLanguageDropdownOpen ? 'rotate-180' : ''
          ]"
        />
      </button>

      <!-- Language Dropdown Menu -->
      <div
        v-if="isLanguageDropdownOpen"
        class="absolute bottom-full mb-1 sm:mb-2 left-3 sm:left-5 right-3 sm:right-5 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="handleLanguageSelect(lang.code)"
          :class="[
            'w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-left transition-all duration-200',
            selectedLanguage === lang.code
              ? 'bg-blue-50 text-blue-600 font-semibold border-l-2 border-l-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
        >
          <img :src="lang.flag" :alt="lang.label" class="w-5 h-5 sm:w-6 sm:h-6 rounded" />
          <span>{{ lang.label }}</span>
          <CheckIcon
            v-if="selectedLanguage === lang.code"
            class="ml-auto w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
          />
        </button>
      </div>
    </div>

    <!-- Logout Button -->
    <div class="px-3 sm:px-5 pb-3 sm:pb-5">
      <button 
        @click="handleLogout"
        class="w-full flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-300 hover:-translate-x-0.5"
      >
        <ArrowRightStartOnRectangleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
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