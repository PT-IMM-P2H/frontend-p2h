<script setup>
import Aside from "../../bar/aside.vue";
import HeaderAdmin from "../../bar/header_admin.vue";
import { MagnifyingGlassIcon, Bars3BottomLeftIcon, ArrowUpTrayIcon, TrashIcon } from "@heroicons/vue/24/outline";

</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1">
      <Aside />

      <div class="flex flex-col flex-1">
        <HeaderAdmin />

        <!-- Content -->
        <main
          class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-y-auto">
          
          <!-- Judul -->
          <div class="bg-white rounded-lg shadow-md p-1 pl-5 mb-4">
            <h1 class="text-lg font-bold text-[#523E95] text-left">
              PT Indominco Mandiri
            </h1>
          </div>
          <div class="bg-white rounded-lg shadow-md p-5 flex-1">
            <MagnifyingGlassIcon class="w-6 h-6 text-gray-600 mb-4"/>
            <Bars3BottomLeftIcon class="w-6 h-6 text-gray-600 mb-4"/>
            <ArrowUpTrayIcon class="w-6 h-6 text-gray-600 mb-4"/>
            <TrashIcon class="w-6 h-6 text-red-600 mb-4"/>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
