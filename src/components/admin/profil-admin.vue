<script setup>
import { ref } from "vue";
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header_admin.vue";
import {
  XMarkIcon,
  PencilSquareIcon,
  ChevronRightIcon,
  CalendarIcon
} from "@heroicons/vue/24/solid";

const showEditAkun = ref(false);

const openEditAkun = () => {
  showEditAkun.value = true;
};

const closeEditAkun = () => {
  showEditAkun.value = false;
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1 overflow-hidden">
      <Aside />

      <div class="flex flex-col flex-1 overflow-hidden">
        <HeaderAdmin />

        <!-- Content -->
        <main class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <div
            class="bg-white rounded-lg shadow-md gap-4 p-5 flex-1 flex flex-col overflow-hidden"
          >
            <div class="flex justify-end">
              <button
                @click="openEditAkun"
                class="px-7 py-1 text-xs md:text-sm font-semilight bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-md hover:opacity-90 transition"
              >
                Edit akun
              </button>
            </div>

            <!-- Nama dan Email -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">Nama</p>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">Email</p>
                <input
                  type="text"
                  placeholder="email@example.com"
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
                />
              </div>
            </div>

            <!-- Nomor Telepon dan Tanggal Lahir -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Nomor Telepon
                </p>
                <input
                  type="text"
                  placeholder="081xxxxxxxx"
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Tanggal Lahir
                </p>
                <input
                  type="text"
                  placeholder="hh/bb/tttt"
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
                />
              </div>
            </div>

            <!-- Perusahaan -->
            <div>
              <p class="text-base font-regular text-gray-800 mb-1">
                Perusahaan
              </p>
              <input
                type="text"
                placeholder="Perusahaan"
                class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
              />
            </div>

            <!-- Departemen -->
            <div>
              <p class="text-base font-regular text-gray-800 mb-1">
                Departemen
              </p>
              <input
                type="text"
                placeholder="Departemen"
                class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
              />
            </div>

            <!-- Status Karyawan -->
            <div>
              <p class="text-base font-regular text-gray-800 mb-1">
                Status karyawan
              </p>
              <input
                type="text"
                placeholder="Status karyawan"
                class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
              />
            </div>

            <!-- Posisi Kerja -->
            <div>
              <p class="text-base font-regular text-gray-800 mb-1">
                Posisi kerja
              </p>
              <input
                type="text"
                placeholder="Posisi kerja"
                class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md"
              />
            </div>
          </div>

          <!-- Konten Edit akun -->
          <div
            v-if="showEditAkun"
            class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <div
              class="bg-white rounded-lg w-full max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
            >
              <div
                class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200"
              >
                <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                  Edit Profil
                </h2>
                <button
                  @click="closeEditAkun"
                  class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                >
                  <XMarkIcon
                    class="w-6 h-6 text-gray-600 hover:text-gray-900"
                  />
                </button>
              </div>

              <div>
                <label class="block text-base font-medium text-black mb-2 mt-4"
                  >Nama Lengkap</label
                >
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Masukkan nama"
                    class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                  />
                  <PencilSquareIcon
                    class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                  />
                </div>
              </div>
              <div>
                <label
                  class="block text-base font-medium text-gray-800 mb-2 mt-2"
                  >Nomor Handphone</label
                >
                <div class="relative">
                  <input
                    type="text"
                    placeholder="081xxxxxxxx"
                    class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                  />
                  <PencilSquareIcon
                    class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                  />
                </div>
              </div>
              <div>
                <label
                  class="block text-base font-medium text-gray-800 mb-2 mt-2"
                  >Email</label
                >
                <div class="relative">
                  <input
                    type="text"
                    placeholder="email@example.com"
                    class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                  />
                  <PencilSquareIcon
                    class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                  />
                </div>
              </div>
              <div>
                <label
                  class="block text-base font-medium text-gray-800 mb-2 mt-2"
                  >Tanggal Lahir</label
                >
                <div class="relative">
                  <input
                    type="text"
                    placeholder="hh/bb/tttt"
                    class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                  />
                  <CalendarIcon
                    class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                  />
                </div>
              </div>
              

              <div class="flex justify-center mt-6">
                <button
                  class="px-8 md:px-10 py-2 text-sm md:text-base bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
