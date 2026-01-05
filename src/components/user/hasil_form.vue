<script setup>
import NavBar from "../bar/navbar.vue";
import Footer from "../bar/footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <!-- Navbar -->
    <NavBar />

    <!-- Content -->
    <main
      class="flex-1 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style="background-image: url(/image_asset/Backgrond.png)"
    >
      <div class="p-3 m-2.5 bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <h1 class="text-2xl font-bold mb-4 text-gray-800 text-center">
          HASIL FORM
        </h1>
        <p class="text-gray-600 text-center">
          Konten form akan muncul di sini.
        </p>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
