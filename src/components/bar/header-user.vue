<script setup>
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { ChevronDownIcon, CheckIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const isMenuOpen = ref(false);
const selectedLanguage = ref('id');
const isLanguageDropdownOpen = ref(false);

const languages = [
  { code: 'id', label: 'Indonesia', flag: '/image_asset/b_indonesia.png' },
  { code: 'en', label: 'English', flag: '/image_asset/b_amerika.png' }
]

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

const hadlehasilP2H = () => {
  router.push({ name: "hasil-form" });
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

const toggleLanguageDropdown = () => {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value;
};

const handleLanguageSelect = (languageCode) => {
  selectedLanguage.value = languageCode;
  isLanguageDropdownOpen.value = false;
  // TODO: Emit language change event or update global language state
};
</script>

<template>
  <header
    class="fixed top-0 left-0 w-full z-50 bg-white/50 backdrop-blur-lg shadow-md px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
    <div class="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
      <img src="/image_asset/2_Ptimm.png" alt="Logo" class="h-7 md:h-8 w-auto shrink-0" />

      <!-- HR vertikal valid -->
      <div class="h-6 md:h-8 w-0.5 bg-[#cacaca] rounded-lg shrink-0"></div>

      <span
        class="font-['Montserrat'] font-semibold text-md md:text-md text-[#523E95] truncate">
        Pelaksanaan Pemeriksaan Harian
      </span>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex items-center gap-4 xl:gap-6 ml-auto">
      <!-- Language Dropdown -->
      <div class="relative">
        <button 
          @click="toggleLanguageDropdown"
          class="flex items-center gap-2 hover:opacity-70 transition-all duration-200"
        >
          <img :src="languages.find(l => l.code === selectedLanguage).flag" :alt="languages.find(l => l.code === selectedLanguage).label" class="w-7 h-7 rounded-full" />
          <ChevronDownIcon 
            :class="[
              'w-4 h-4 transition-transform duration-300 text-[#523E95]',
              isLanguageDropdownOpen ? 'rotate-180' : ''
            ]"
          />
        </button>

        <!-- Language Dropdown Menu -->
        <div
          v-if="isLanguageDropdownOpen"
          class="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="handleLanguageSelect(lang.code)"
            :class="[
              'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-all duration-200',
              selectedLanguage === lang.code
                ? 'bg-blue-50 text-blue-600 font-semibold border-l-2 border-l-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <img :src="lang.flag" :alt="lang.label" class="w-5 h-5 rounded-full" />
            <span>{{ lang.label }}</span>
            <CheckIcon
              v-if="selectedLanguage === lang.code"
              class="ml-auto w-4 h-4 text-blue-600"
            />
          </button>
        </div>
      </div>
      
      <!-- viewer monitor kendaraan -->
      <button
        @click="hadlemonitor"
        :class="getButtonClass('monitor-kendaraan')"
        :style="{ color: getButtonColor('monitor-kendaraan') }"
        class="text-xs lg:text-sm hover:opacity-70 transition-all duration-200 whitespace-nowrap"
      >
        Log Kendaraan
      </button>

      <!-- User -->
      <button
        @click="hadleformp2h"
        :class="getButtonClass('form-p2h')"
        :style="{ color: getButtonColor('form-p2h') }"
        class="text-xs lg:text-sm hover:opacity-70 transition-all duration-200 whitespace-nowrap"
      >
        Form P2H
      </button>
      <button
        @click="hadlehasilP2H"
        :class="getButtonClass('hasil-form')"
        :style="{ color: getButtonColor('hasil-form') }"
        class="text-xs lg:text-sm hover:opacity-70 transition-all duration-200 whitespace-nowrap"
      >
        Hasil P2H
      </button>
      <button
        @click="hadlepriwayat"
        :class="getButtonClass('riwayat-user')"
        :style="{ color: getButtonColor('riwayat-user') }"
        class="text-xs lg:text-sm hover:opacity-70 transition-all duration-200 whitespace-nowrap"
      >
        Riwayat
      </button>
      <button
        @click="hadleprofile"
        :class="getButtonClass('profile-user')"
        :style="{ color: getButtonColor('profile-user') }"
        class="text-xs lg:text-sm hover:opacity-70 transition-all duration-200 whitespace-nowrap"
      >
        Profile
      </button>

      <!-- admin -->
      <button
        @click="hadledashboard"
        :class="getButtonClass('dashboard')"
        :style="{ color: getButtonColor('dashboard') }"
        class="text-xs lg:text-sm hover:opacity-70 transition-all duration-200 whitespace-nowrap"
      >
        Dashboard
      </button>

      <div class="h-5 w-px bg-gray-300"></div>

      <button
        @click="handleLogout"
        class="text-xs lg:text-sm font-medium text-red-500 hover:text-red-700 transition-all duration-200 whitespace-nowrap"
      >
        Logout
      </button>
    </nav>

    <!-- Mobile Hamburger Button -->
    <button
      @click="toggleMenu"
      class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-auto"
    >
      <div v-if="!isMenuOpen" class="space-y-1.5">
        <div class="w-5 h-0.5 bg-[#523E95] transition-all duration-300"></div>
        <div class="w-5 h-0.5 bg-[#523E95] transition-all duration-300"></div>
        <div class="w-5 h-0.5 bg-[#523E95] transition-all duration-300"></div>
      </div>
      <div v-else class="text-xl text-[#523E95] font-bold">✕</div>
    </button>
  </header>

  <!-- Mobile Menu -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 -translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-1"
  >
    <nav
      v-if="isMenuOpen"
      class="lg:hidden fixed top-16 left-0 w-full bg-white/95 backdrop-blur-lg shadow-md z-40 border-b border-gray-200"
    >
      <div class="px-4 py-3 space-y-1">
        <!-- Language Selector Mobile -->
        <div class="relative mb-3 pb-3 border-b border-gray-200">
          <button 
            @click="toggleLanguageDropdown"
            class="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-gray-50 rounded-md transition-colors duration-200"
          >
            <img :src="languages.find(l => l.code === selectedLanguage).flag" :alt="languages.find(l => l.code === selectedLanguage).label" class="w-5 h-5 rounded-full" />
            <span class="text-gray-700">{{ languages.find(l => l.code === selectedLanguage).label }}</span>
            <ChevronDownIcon 
              :class="[
                'w-4 h-4 ml-auto transition-transform duration-300 text-[#523E95]',
                isLanguageDropdownOpen ? 'rotate-180' : ''
              ]"
            />
          </button>

          <!-- Language Dropdown Menu Mobile -->
          <div
            v-if="isLanguageDropdownOpen"
            class="absolute top-full mt-1 left-0 right-0 mx-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="handleLanguageSelect(lang.code)"
              :class="[
                'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-all duration-200',
                selectedLanguage === lang.code
                  ? 'bg-blue-50 text-blue-600 font-semibold border-l-2 border-l-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <img :src="lang.flag" :alt="lang.label" class="w-4 h-4 rounded-full" />
              <span>{{ lang.label }}</span>
              <CheckIcon
                v-if="selectedLanguage === lang.code"
                class="ml-auto w-4 h-4 text-blue-600"
              />
            </button>
          </div>
        </div>
        
        <button
          @click="hadleformp2h"
          :class="getButtonClass('form-p2h')"
          :style="{ color: getButtonColor('form-p2h') }"
          class="block w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Form P2H
        </button>
        <button
          @click="hadlehasilP2H"
          :class="getButtonClass('hasil-form')"
          :style="{ color: getButtonColor('hasil-form') }"
          class="block w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Hasil P2H
        </button>
        <button
          @click="hadlepriwayat"
          :class="getButtonClass('riwayat-user')"
          :style="{ color: getButtonColor('riwayat-user') }"
          class="block w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Riwayat
        </button>
        <button
          @click="hadleprofile"
          :class="getButtonClass('profile-user')"
          :style="{ color: getButtonColor('profile-user') }"
          class="block w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Profile
        </button>
        <button
          @click="hadlemonitor"
          :class="getButtonClass('monitor-kendaraan')"
          :style="{ color: getButtonColor('monitor-kendaraan') }"
          class="block w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Log Kendaraan
        </button>
        <button
          @click="hadledashboard"
          :class="getButtonClass('dashboard')"
          :style="{ color: getButtonColor('dashboard') }"
          class="block w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Dashboard
        </button>
        <hr class="border-gray-200 my-2" />
        <button
          @click="handleLogout"
          class="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  </transition>
</template>
