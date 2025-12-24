<script>
import NavBar from '../../navbar.vue'

export default {
  components: {
    NavBar
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<template>
  <div
    class="fixed inset-0 w-full h-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed z-10 font-['Montserrat']"
    :style="{ backgroundImage: 'url(/image_asset/bg-form.jpg)' }"
  >
    <NavBar />

    <!-- Back Button -->
    <button 
        @click="goBack"
        class="absolute top-24 left-6 bg-white hover:bg-gray-100 text-white-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 z-20"
    >
        ← Kembali
    </button>

    <!-- Form Container -->
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4 z-20 mt-16">
        <h1 class="text-2xl font-bold mb-4 text-gray-800 text-center">Form P2H</h1>
        <p class="text-gray-600 text-center">Konten form akan muncul di sini.</p>
    </div>
  </div>
</template>
