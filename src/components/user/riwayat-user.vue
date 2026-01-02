<script setup>
import NavBar from "../bar/navbar.vue";
</script>

<template>
  <div
    class="min-h-screen w-full flex flex-col bg-cover bg-center bg-no-repeat bg-fixed font-['Montserrat']"
    :style="{ backgroundImage: 'url(/image_asset/Backgrond.png)' }"
  >
    <NavBar />    
  </div>
</template>
