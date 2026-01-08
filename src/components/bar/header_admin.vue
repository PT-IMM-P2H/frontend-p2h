<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const currentDate = ref('')
const adminName = ref('Naufal Andrian')

const goToProfile = () => {
  router.push('/profil-admin')
}

// Map route paths ke header titles
const routeToHeaderMap = {
  '/form-p2h': 'Formulir P2H',
  '/dashboard': 'Dashboard Pelaksanaan Pemeriksaan Harian',
  '/data-monitor-pt': 'Data Monitor - PT.IMM',
  '/data-monitor-travel': 'Data Monitor - Travel',
  '/data-pengguna-pt': 'Data Pengguna - PT.IMM',
  '/data-pengguna-travel': 'Data Pengguna - Travel',
  '/kelola-pertanyaan': 'Kelola Pertanyaan',
  '/data-perusahaan': 'Master Data - Perusahaan',
  '/data-departemen': 'Master Data - Departemen',
  '/data-posisi': 'Master Data - Posisi',
  '/data-status': 'Master Data - Status Kerja',
  '/unit-kendaraan-pt': 'Unit Kendaraan - PT.IMM',
  '/unit-kendaraan-travel': 'Unit Kendaraan - Travel',
  '/profil-admin': 'Profile Administrator'
}

const headerTitle = computed(() => {
  const currentPath = route.path
  let title = routeToHeaderMap[currentPath]
  
  // Jika route tidak langsung match (misal karena parameter), cek pattern
  if (!title) {
    if (currentPath.match(/^\/edit-data-pengguna-pt\//)) {
      title = 'Edit Data Pengguna - PT.IMM'
    } else if (currentPath.match(/^\/edit-data-pengguna-travel\//)) {
      title = 'Edit Data Pengguna - Travel'
    } else if (currentPath.match(/^\/edit-unit-pt\//)) {
      title = 'Edit Unit Kendaraan - PT.IMM'
    } else if (currentPath.match(/^\/edit-unit-travel\//)) {
      title = 'Edit Unit Kendaraan - Travel'
    } else {
      title = 'Dashboard Pelaksanaan Pemeriksaan Harian' // Default title
    }
  }
  
  return title
})

onMounted(() => {
  // Format tanggal hari ini
  const today = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  currentDate.value = today.toLocaleDateString('id-ID', options)
})
</script>

<template>
  <div class="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
    <!-- Left Section - Title & Date -->
    <div class="flex flex-col">
      <h1 class="text-[20px] font-bold text-[#523E95]">{{ headerTitle }}</h1>
      <p class="text-xs text-gray-500">{{ currentDate }}</p>
    </div>

    <!-- Right Section - Admin Info -->
    <div class="flex items-center gap-4">
      <div class="text-right">
        <p class="text-[15px] font-semibold text-gray-800">{{ adminName }}</p>
        <p class="text-xs text-gray-500">Administrator</p>
      </div>
      <!-- User Circle Icon Button -->
      <button 
        @click="goToProfile"
        class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center hover:bg-indigo-200 transition-colors duration-200 cursor-pointer"
      >
        <UserCircleIcon class="w-10 h-10 text-black hover:text-indigo-600 transition-colors duration-200" />
      </button>
    </div>
  </div>
</template>