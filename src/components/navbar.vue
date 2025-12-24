<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  router.push('/')
}
</script>

<template>
    <header class="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
            <img src="/image_asset/IMM.svg" alt="Logo" class="h-8 w-auto">
            <hr class="w-px h-full bg-gray-400"/>
            <span class="font-montserrat font-semibold text-1xl text-gray-800 position-bottom">
                Pelaksanaan Pemeriksaan Harian
            </span>
        </div>
        
        <nav class="flex items-center gap-6">
            <button @click="handleLogout" class="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                Logout
            </button>
        </nav>
    </header>
</template>