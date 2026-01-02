<script>
import NavBar from '../../bar/navbar.vue'

export default {
  components: {
    NavBar
  },
}

</script>

<template>
  <div
    class="fixed inset-0 w-full h-full flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed z-10 font-['Montserrat']"
    :style="{ backgroundImage: 'url(image_asset/Backgrond.png)' }"
  >
    <NavBar />


    <!-- Form Container -->
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4 z-20 mt-16">
        <h1 class="text-2xl font-bold mb-4 text-gray-800 text-center">Form P2H</h1>
        <p class="text-gray-600 text-center">Konten form akan muncul di sini.</p>
    </div>
  </div>
</template>
