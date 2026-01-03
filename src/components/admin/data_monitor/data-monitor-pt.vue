<script setup>
import Aside from "../../bar/aside.vue";
import HeaderAdmin from "../../bar/header_admin.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1">
      <Aside />

      <div class="flex flex-col flex-1">
        <HeaderAdmin />

        <!-- Content -->
        <main
          class="flex-1 flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style="background-image: url(/image_asset/Backgrond.png)"
        >
          <div class="p-3 m-2.5 bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <h1 class="text-2xl font-bold mb-4 text-gray-800 text-center">
              Data Monitor PT.IMM
            </h1>
            <p class="text-gray-600 text-center">
              Konten data monitor PT.IMM akan muncul di sini.
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
