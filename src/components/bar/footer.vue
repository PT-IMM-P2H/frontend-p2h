<script setup>
import { PhoneIcon } from "@heroicons/vue/24/outline";

const handleWaLink = () => {
  window.open("https://wa.me/6282254442400", "_blank");
};
</script>

<template>
  <footer class="bg-white shadow-lg font-['Montserrat']">
    <!-- Main Footer Content -->
    <div class="px-2 py-2 md:px-6 md:py-4">
      <div
        class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-4"
      >
        <!-- Left Side: Logo and Text -->
        <div class="flex items-center gap-3 justify-center md:justify-start">
          <img src="/image_asset/IMM.svg" alt="IMM Logo" class="w-20 h-auto" />
          <div class="h-8 w-0.5 bg-[#cacaca] rounded-lg"></div>
          <div>
            <p
              class="text-md font-semibold text-[#523E95] m-0 text-center md:text-left"
            >
              Pelaksanaan pemeriksaan harian
            </p>
          </div>
        </div>

        <!-- Right Side: Phone Icon with Contact -->
        <div
          class="flex items-center gap-2 md:gap-3 justify-center md:justify-end"
        >
          <PhoneIcon class="w-4 md:w-5 h-4 md:h-5 text-[#3b82f6] shrink-0" />
          <p class="text-xs md:text-sm font-semilight text-[#000000] m-0">
            Rizal Rahmadani
          </p>
          <a
            href="#"
            @click.prevent="handleWaLink"
            class="text-xs md:text-sm text-[#646cff] font-medium hover:underline m-0"
          >
            0822-5444-2400
          </a>
        </div>
      </div>
    </div>

    <!-- Divider Line -->
    <div class="border-t border-[#e5e7eb]"></div>

    <!-- Copyright Section -->
    <div class="px-2 py-2 md:px-6 md:py-3">
      <div class="flex items-center justify-between gap-3">
        <!-- Left Side: Company Logo -->
        <img
          src="/image_asset/IMM.svg"
          alt="IMM Logo"
          class="w-8 md:w-10 h-auto"
        />

        <!-- Center/Right: Copyright Text -->
        <p class="text-right text-xs font-light text-[#646464] m-0 flex-1">
          © PT. Indominco Mandiri. All right reserved
        </p>
      </div>
    </div>
  </footer>
</template>
