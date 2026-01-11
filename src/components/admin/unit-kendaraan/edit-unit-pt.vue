<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Aside from "../../bar/aside.vue";
import HeaderAdmin from "../../bar/header_admin.vue";
import {
  XMarkIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();
const route = useRoute();
const showEditAkun = ref(false);
const isStatusAktif = ref(true);

// Vehicle data fields
const nomorLambung = ref("");
const warnaNomorLambung = ref("");
const nomorPolisi = ref("");
const tipe = ref("");
const merek = ref("");
const user = ref("");
const perusahaan = ref("");
const tglSTNK = ref("");
const tglPajak = ref("");
const kirKuer = ref("");
const noRangka = ref("");
const noMesin = ref("");

const openEditAkun = () => {
  showEditAkun.value = true;
};

const closeEditAkun = () => {
  showEditAkun.value = false;
};

const goBack = () => {
  router.push("/unit-kendaraan-pt");
};

// Load vehicle data dari localStorage berdasarkan ID
onMounted(() => {
  const vehicleData = localStorage.getItem('currentVehicleData');
  if (vehicleData) {
    const vehicle = JSON.parse(vehicleData);
    nomorLambung.value = vehicle.nomorLambung || '';
    warnaNomorLambung.value = vehicle.warnaNomorLambung || '';
    nomorPolisi.value = vehicle.nomorPolisi || '';
    tipe.value = vehicle.tipe || '';
    merek.value = vehicle.merek || '';
    user.value = vehicle.user || '';
    perusahaan.value = vehicle.perusahaan || '';
    tglSTNK.value = vehicle.tglSTNK || '';
    tglPajak.value = vehicle.tglPajak || '';
    kirKuer.value = vehicle.kirKuer || '';
    noRangka.value = vehicle.noRangka || '';
    noMesin.value = vehicle.noMesin || '';
    localStorage.removeItem('currentVehicleData');
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1 overflow-hidden">
      <Aside />

      <div class="flex flex-col flex-1 ml-62 overflow-hidden">
        <HeaderAdmin />

        <!-- Content -->
        <main class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <div
            class="bg-white rounded-lg shadow-md p-1 pl-5 mb-2 -mt-1 shrink-0"
          >
            <h1 class="text-base font-bold text-[#523E95] text-left">PT Indominco Mandiri</h1>
          </div>
          <div
            class="bg-white rounded-lg shadow-md gap-4 p-5 flex-1 flex flex-col overflow-hidden"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <button
                  @click="goBack"
                  class="hover:bg-gray-100 p-1 rounded transition"
                >
                  <ChevronLeftIcon
                    class="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer"
                  />
                </button>
                <h1 class="text-lg font-bold text-black">
                  Detail Unit Kendaraan PT Indominco Mandiri
                </h1>
              </div>
              <button
                @click="openEditAkun"
                class="px-7 py-1 text-xs md:text-sm font-semilight bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-md hover:opacity-90 transition"
              >
                Edit akun
              </button>
            </div>

            <!-- Nomor Lambung, Warna, dan Polisi -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">Nomor Lambung</p>
                <input
                  v-model="nomorLambung"
                  type="text"
                  placeholder="P - 309"
                  disabled
                  class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">Warna Nomor Lambung</p>
                <input
                  v-model="warnaNomorLambung"
                  type="text"
                  placeholder="Kuning"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Nomor Polisi
                </p>
                <input
                  v-model="nomorPolisi"
                  type="text"
                  placeholder="KT 1234 AB"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Tipe, Merek, dan User -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Tipe
                </p>
                <input
                  v-model="tipe"
                  type="text"
                  placeholder="Light Vehicle"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Merek
                </p>
                <input
                  v-model="merek"
                  type="text"
                  placeholder="Toyota Innova"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  User
                </p>
                <input
                  v-model="user"
                  type="text"
                  placeholder="Nama User"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Perusahaan & Tanggal STNK-->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Perusahaan
                </p>
                <input
                  v-model="perusahaan"
                  type="text"
                  placeholder="PT Indominco Mandiri"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Tanggal STNK
                </p>
                <input
                  v-model="tglSTNK"
                  type="text"
                  placeholder="7 Februari 2026"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Tanggal Pajak & KIR/KUER -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Tanggal Pajak
                </p>
                <input
                  v-model="tglPajak"
                  type="text"
                  placeholder="7 Maret 2026"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  KIR / KUER
                </p>
                <input
                  v-model="kirKuer"
                  type="text"
                  placeholder="28 Desember 2028"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
            </div>

            <!-- Nomor Rangka & Nomor Mesin -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Nomor Rangka
                </p>
                <input
                  v-model="noRangka"
                  type="text"
                  placeholder="MK2KSWPNUJJ000338"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
              <div>
                <p class="text-base font-regular text-gray-800 mb-1">
                  Nomor Mesin
                </p>
                <input
                  v-model="noMesin"
                  type="text"
                  placeholder="4N15UCP7140"
                  disabled
                  class="w-full p-2 border text-sm border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                />
              </div>
            </div>


            <!-- Status Kendaraan Aktif -->
            <div
              class="flex justify-between items-center bg-[#EEEEEE] p-3 rounded-md border border-[#C3C3C3] mt-2"
            >
              <p class="text-base font-regular text-gray-600">
                Status Kendaraan Aktif
              </p>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="isStatusAktif"
                  type="checkbox"
                  disabled
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A90CF8] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-200 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c381e4]"
                ></div>
              </label>
            </div>
          </div>

          <!-- Konten Edit akun -->
          <div
            v-if="showEditAkun"
            class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <div
              class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
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

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-base font-medium text-black mb-2 mt-2"
                    >Nomor Lambung</label
                  >
                  <div class="relative">
                    <input
                      v-model="nomorLambung"
                      type="text"
                      placeholder="P - 309"
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
                  >Warna Nomor Lambung</label
                >
                <div class="relative">
                  <input
                    v-model="warnaNomorLambung"
                    type="text"
                    placeholder="Kuning"
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
                  >Nomor Polisi</label
                >
                <div class="relative">
                  <input
                    v-model="nomorPolisi"
                    type="text"
                    placeholder="KT 1234 AB"
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
                  >Tipe</label
                >
                <div class="relative">
                  <input
                    v-model="tipe"
                    type="text"
                    placeholder="Light Vehicle"
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
                  >Merek</label
                >
                <div class="relative">
                  <input
                    v-model="merek"
                    type="text"
                    placeholder="Toyota Innova"
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
                  >User</label
                >
                <div class="relative">
                  <input
                    v-model="user"
                    type="text"
                    placeholder="Nama User"
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
                  >Perusahaan</label
                >
                <div class="relative">
                  <input
                    v-model="perusahaan"
                    type="text"
                    placeholder="PT Indominco Mandiri"
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
                  >Tanggal STNK</label
                >
                <input
                  v-model="tglSTNK"
                  type="text"
                  placeholder="7 Februari 2026"
                  class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                />
              </div>
              <div>
                <label
                  class="block text-base font-medium text-gray-800 mb-2 mt-2"
                  >Tanggal Pajak</label
                >
                <input
                  v-model="tglPajak"
                  type="text"
                  placeholder="7 Maret 2026"
                  class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                />
              </div>
              <div>
                <label
                  class="block text-base font-medium text-gray-800 mb-2 mt-2"
                  >KIR / KUER</label
                >
                <input
                  v-model="kirKuer"
                  type="text"
                  placeholder="28 Desember 2028"
                  class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                />
              </div>
              <div>
                <label
                  class="block text-base font-medium text-gray-800 mb-2 mt-2"
                  >Nomor Rangka</label
                >
                <div class="relative">
                  <input
                    v-model="noRangka"
                    type="text"
                    placeholder="MK2KSWPNUJJ000338"
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
                  >Nomor Mesin</label
                >
                <div class="relative">
                  <input
                    v-model="noMesin"
                    type="text"
                    placeholder="4N15UCP7140"
                    class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                  />
                  <PencilSquareIcon
                    class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                  />
                </div>
              </div>

              <!-- Status Kendaraan Aktif -->
              <div
                class="flex justify-between items-center bg-gray-50 p-4 rounded-md border border-[#C3C3C3] mt-4 col-span-2"
              >
                <p class="text-base font-regular text-gray-800">
                  Status Kendaraan Aktif
                </p>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="isStatusAktif"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A90CF8] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A90CF8]"
                  ></div>
                </label>
              </div>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button
                  class="px-8 md:px-10 py-2 text-sm md:text-base bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular"
                >
                  Simpan
                </button>
                <button
                  @click="closeEditAkun"
                  class="px-6 md:px-6 py-2 text-sm md:text-base border border-gray-300 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-regular"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
