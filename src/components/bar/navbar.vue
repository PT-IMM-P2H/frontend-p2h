<script setup>
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const isMenuOpen = ref(false);

const handleLogout = () => {
  router.push("/login");
  isMenuOpen.value = false;
};
const hadleprofile = () => {
  router.push({ name: "profile-user" });
  isMenuOpen.value = false;
};
const hadlepriwayat = () => {
  router.push({ name: "riwayat-user" });
  isMenuOpen.value = false;
};
const hadleformp2h = () => {
  router.push({ name: "form-p2h" });
  isMenuOpen.value = false;
};

const hadledashboard = () => {
  router.push({ name: "dashboard" });
  isMenuOpen.value = false;
};

const hadlemonitor= () => {
  router.push({ name: "monitor-kendaraan" });
  isMenuOpen.value = false;
};

const currentRoute = computed(() => router.currentRoute.value.name);

const getButtonClass = (routeName) => {
  const isActive = currentRoute.value === routeName;
  return isActive
    ? "text-sm font-bold transition-colors"
    : "text-sm font-light transition-colors";
};

const getButtonColor = (routeName) => {
  const isActive = currentRoute.value === routeName;
  return isActive ? "#523E95" : "#646464";
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-lg px-6 py-4 flex justify-between items-center"
  >
    <div class="flex items-center gap-3">
      <img src="/image_asset/IMM.svg" alt="Logo" class="h-8 w-auto" />

      <!-- HR vertikal valid -->
      <div class="h-8 w-0.5 bg-[#cacaca] rounded-lg"></div>

      <span
        class="font-['Montserrat'] font-medium text-1xl text-[#523E95] hidden sm:block"
      >
        Pelaksanaan Pemeriksaan Harian
      </span>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-8">
      <!-- viewer monitor kendaraan -->
      <button
        @click="hadlemonitor"
        :class="getButtonClass('monitor-kendaraan')"
        :style="{ color: getButtonColor('monitor-kendaraan') }"
        class="hover:opacity-80 transition-colors"
      >
        Log Kendaraan
      </button>

      <!-- User -->
      <button
        @click="hadleformp2h"
        :class="getButtonClass('form-p2h')"
        :style="{ color: getButtonColor('form-p2h') }"
        class="hover:opacity-80 transition-colors"
      >
        Form P2H
      </button>
      <button
        @click="hadlepriwayat"
        :class="getButtonClass('riwayat-user')"
        :style="{ color: getButtonColor('riwayat-user') }"
        class="hover:opacity-80 transition-colors"
      >
        Riwayat
      </button>
      <button
        @click="hadleprofile"
        :class="getButtonClass('profile-user')"
        :style="{ color: getButtonColor('profile-user') }"
        class="hover:opacity-80 transition-colors"
      >
        Profile
      </button>

      <!-- admin -->
      <button
        @click="hadledashboard"
        :class="getButtonClass('dashboard')"
        :style="{ color: getButtonColor('dashboard') }"
        class="hover:opacity-80 transition-colors"
      >
        Dashboard
      </button>

      <button
        @click="handleLogout"
        class="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
      >
        Logout
      </button>
    </nav>

    <!-- Mobile Hamburger Button -->
    <button
      @click="toggleMenu"
      class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div v-if="!isMenuOpen" class="space-y-1">
        <div class="w-6 h-0.5 bg-[#523E95]"></div>
        <div class="w-6 h-0.5 bg-[#523E95]"></div>
        <div class="w-6 h-0.5 bg-[#523E95]"></div>
      </div>
      <div v-else class="text-2xl text-[#523E95] font-bold">✕</div>
    </button>
  </header>

  <!-- Mobile Menu -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <nav
      v-if="isMenuOpen"
      class="md:hidden fixed top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-40"
    >
      <div class="px-6 py-4 space-y-2">
        <button
          @click="hadleformp2h"
          :class="getButtonClass('form-p2h')"
          :style="{ color: getButtonColor('form-p2h') }"
          class="block w-full text-left py-2 hover:opacity-80 transition-colors"
        >
          Form P2H
        </button>
        <button
          @click="hadlepriwayat"
          :class="getButtonClass('riwayat-user')"
          :style="{ color: getButtonColor('riwayat-user') }"
          class="block w-full text-left py-2 hover:opacity-80 transition-colors"
        >
          Riwayat
        </button>
        <button
          @click="hadleprofile"
          :class="getButtonClass('profile-user')"
          :style="{ color: getButtonColor('profile-user') }"
          class="block w-full text-left py-2 hover:opacity-80 transition-colors"
        >
          Profile
        </button>
        <hr class="border-gray-200" />
        <button
          @click="handleLogout"
          class="block w-full text-left py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  </transition>
</template>
