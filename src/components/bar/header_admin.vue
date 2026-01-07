<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const currentDate = ref('')
const adminName = ref('Naufal Andrian')

const goToProfile = () => {
  router.push('/profil-admin')
}

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
      <h1 class="text-[20px] font-bold text-[#523E95]">Dashboard Pelaksanaan Pemeriksaan Harian</h1>
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