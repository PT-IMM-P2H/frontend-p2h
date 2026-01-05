<script setup>
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header_admin.vue";
import { UserIcon } from "@heroicons/vue/24/outline";

</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1">
      <Aside />

      <div class="flex flex-col flex-1">
        <HeaderAdmin />

        <!-- Content -->
        <main
          class="bg-[#EFEFEF] flex-1 flex items-start justify-center overflow-y-auto p-3"
        >
          <div class="w-full">
            <!-- 6 Kotak Sejajar -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
              <!-- Box 1 -->
              <div class="bg-white rounded-lg shadow-md p-4 flex items-start gap-2 min-h-1">
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-semibold text-gray-500">Total unit kendaraan</p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>
              
              <!-- Box 2 -->
              <div class="bg-white rounded-lg shadow-md p-4 flex items-start gap-2 min-h-1">
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-semibold text-gray-500">Total status normal</p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>

              <!-- Box 3 -->
              <div class="bg-white rounded-lg shadow-md p-4 flex items-start gap-2 min-h-1">
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-semibold text-gray-500">Total status abnromal</p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>
              
              <!-- Box 4 -->
              <div class="bg-white rounded-lg shadow-md p-4 flex items-start gap-2 min-h-1">
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-semibold text-gray-500">Total status warning</p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>
              
              <!-- Box 5 -->
              <div class="bg-white rounded-lg shadow-md p-4 flex items-start gap-2 min-h-1">
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-semibold text-gray-500">Total unit sudah P2H</p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>
              
              <!-- Box 6 -->
              <div class="bg-white rounded-lg shadow-md p-4 flex items-start gap-2 min-h-1">
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-semibold text-gray-500">Total unit belum P2H</p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
