<script setup>
import { ref } from "vue";
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header_admin.vue";
import {
  DocumentPlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import { PencilIcon, ChevronDownIcon } from "@heroicons/vue/24/solid";

const tambahPertanyaan = ref(false);
const editPertanyaan = ref(false);
const editingPertanyaan = ref(null);
const selectedRows = ref([]);

const formPertanyaan = ref("");

const formJawabanList = ref([
  {
    id: 1,
    jawaban: "",
    pilihan: "",
  },
]);

const pertanyaanList = ref([
  {
    id: 1,
    pertanyaan: "Apakah anda bekerja shift / non-shift?",
    vehicleTypes: {
      lightVehicle: true,
      electricVehicle: true,
      doubleCabin: false,
      singleCabin: false,
      bus: false,
      ambulance: false,
      fireTruck: false,
      komando: false,
      truckSampah: false,
    },
    jawabanList: [
      {
        id: 1,
        jawaban: "Shift 1",
        pilihan: "shift1",
      },
      {
        id: 2,
        jawaban: "Shift 2",
        pilihan: "shift2",
      },
    ],
  },
  {
    id: 2,
    pertanyaan: "Jokowi penjahat negri",
    vehicleTypes: {
      lightVehicle: false,
      electricVehicle: false,
      doubleCabin: false,
      singleCabin: false,
      bus: false,
      ambulance: false,
      fireTruck: false,
      komando: false,
      truckSampah: false,
    },
    jawabanList: [
      {
        id: 1,
        jawaban: "Setiap 2 jam kerja",
        pilihan: "Sesuai jadwal yang ditentukan",
      },
    ],
  },
]);

const openEditPertanyaan = (pertanyaan) => {
  editingPertanyaan.value = JSON.parse(JSON.stringify(pertanyaan));
  editPertanyaan.value = true;
  formPertanyaan.value = pertanyaan.pertanyaan;
  formJawabanList.value = JSON.parse(JSON.stringify(pertanyaan.jawabanList));
  vehicleTypes.value = JSON.parse(JSON.stringify(pertanyaan.vehicleTypes));
};

const closeEditPertanyaan = () => {
  editPertanyaan.value = false;
  editingPertanyaan.value = null;
  formPertanyaan.value = "";
  formJawabanList.value = [
    {
      id: 1,
      jawaban: "",
      pilihan: "",
    },
  ];
  vehicleTypes.value = vehicleList.reduce((acc, vehicle) => {
    acc[vehicle.id] = false;
    return acc;
  }, {});
};

const simpanEditPertanyaan = () => {
  if (editingPertanyaan.value && formPertanyaan.value.trim()) {
    const jawabanList = formJawabanList.value.filter(
      (form) => form.jawaban && form.pilihan
    );

    if (jawabanList.length > 0) {
      const index = pertanyaanList.value.findIndex(
        (p) => p.id === editingPertanyaan.value.id
      );
      if (index !== -1) {
        pertanyaanList.value[index] = {
          id: editingPertanyaan.value.id,
          pertanyaan: formPertanyaan.value,
          vehicleTypes: JSON.parse(JSON.stringify(vehicleTypes.value)),
          jawabanList: jawabanList.map((form, idx) => ({
            id: idx + 1,
            jawaban: form.jawaban,
            pilihan: form.pilihan,
          })),
        };
        closeEditPertanyaan();
      }
    }
  }
};

const opentambahPertanyaan = () => {
  tambahPertanyaan.value = true;
};

const closetambahPertanyaan = () => {
  tambahPertanyaan.value = false;
  formPertanyaan.value = "";
  formJawabanList.value = [
    {
      id: 1,
      jawaban: "",
      pilihan: "",
    },
  ];
  vehicleTypes.value = vehicleList.reduce((acc, vehicle) => {
    acc[vehicle.id] = false;
    return acc;
  }, {});
};

const vehicleList = [
  { id: "lightVehicle", label: "Light vehicle" },
  { id: "electricVehicle", label: "Electric vehicle" },
  { id: "doubleCabin", label: "Double cabin" },
  { id: "singleCabin", label: "Single cabin" },
  { id: "bus", label: "Bus" },
  { id: "ambulance", label: "Ambulance" },
  { id: "fireTruck", label: "Fire truck" },
  { id: "komando", label: "Komando" },
  { id: "truckSampah", label: "Truk sampah" },
];

const vehicleTypes = ref(
  vehicleList.reduce((acc, vehicle) => {
    acc[vehicle.id] = false;
    return acc;
  }, {})
);

const hapusPertanyaan = () => {
  if (selectedRows.value.length > 0) {
    // Logika hapus data
    selectedRows.value = [];
  }
};

const tambahKontainerPertanyaan = () => {
  const newId = Math.max(...formJawabanList.value.map((p) => p.id), 0) + 1;
  formJawabanList.value.push({
    id: newId,
    jawaban: "",
    pilihan: "",
  });
};

const simpanPertanyaan = () => {
  if (formPertanyaan.value.trim()) {
    const jawabanList = formJawabanList.value.filter(
      (form) => form.jawaban && form.pilihan
    );

    if (jawabanList.length > 0) {
      const newPertanyaan = {
        id: Math.max(...pertanyaanList.value.map((p) => p.id), 0) + 1,
        pertanyaan: formPertanyaan.value,
        vehicleTypes: JSON.parse(JSON.stringify(vehicleTypes.value)),
        jawabanList: jawabanList.map((form, index) => ({
          id: index + 1,
          jawaban: form.jawaban,
          pilihan: form.pilihan,
        })),
      };
      pertanyaanList.value.push(newPertanyaan);
      closetambahPertanyaan();
    }
  }
};
</script>

<template>
  <!-- ROOT -->
  <div class="h-screen flex flex-col font-['Montserrat'] overflow-hidden">
    <div class="flex flex-1 min-h-0 overflow-hidden">
      <Aside />

      <!-- CONTENT -->
      <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
        <HeaderAdmin class="shrink-0" />

        <!-- Content -->
        <main
          class="bg-[#EFEFEF] flex-1 flex flex-col p-3 min-h-0 overflow-hidden"
        >
          <div
            class="bg-white rounded-lg shadow-md p-5 flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <!-- Header konten -->
            <div
              class="flex items-center gap-3 border-b shrink-0 justify-between"
            >
              <div class="flex items-center gap-3">
                <button
                  @click="opentambahPertanyaan"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-white bg-[#6444C6] hover:bg-[#5c3db8] transition text-sm"
                >
                  <DocumentPlusIcon class="w-5 h-5" />
                  <span>Tambah Pertanyaan</span>
                </button>
              </div>
            </div>

            <!-- ===== SCROLL DIMULAI DI SINI ===== -->
            <div
              class="flex-1 flex flex-col w-full bg-gray-50 rounded-lg border border-gray-200 min-h-0 overflow-hidden mt-4"
            >
              <div
                class="flex-1 flex flex-col w-full gap-4 overflow-y-auto p-4 min-h-0"
              >
                <!-- KONTEN TIDAK DIUBAH -->
                <div
                  v-for="pertanyaan in pertanyaanList"
                  :key="pertanyaan.id"
                  class="flex flex-col w-full bg-white rounded-lg border border-gray-200 shrink-0"
                >
                  <div class="flex justify-end items-center gap-3 px-4 pt-4">
                    <button
                      @click="openEditPertanyaan(pertanyaan)"
                      class="px-4 md:px-8 py-2 text-sm bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition"
                    >
                      Edit
                    </button>
                  </div>

                  <div class="px-4 pb-4">
                    <div>
                      <label
                        class="block text-lg font-bold text-black mb-2 mt-4"
                        >Tipe kendaraan</label
                      >
                      <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
                        <div
                          v-for="vehicle in vehicleList"
                          :key="vehicle.id"
                          class="flex items-center gap-2 p-2 border rounded-xl transition cursor-not-allowed"
                          :class="
                            pertanyaan.vehicleTypes[vehicle.id]
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-[#a9a9a9] bg-gray-100'
                          "
                        >
                          <div class="relative w-5 h-5">
                            <input
                              disabled
                              type="checkbox"
                              :checked="pertanyaan.vehicleTypes[vehicle.id]"
                              :id="vehicle.id"
                              class="w-5 h-5 cursor-not-allowed rounded-md border-2 appearance-none bg-gray-100 border-gray-400 checked:bg-blue-500 checked:border-blue-500"
                              style="
                                appearance: none;
                                -webkit-appearance: none;
                                -moz-appearance: none;
                              "
                            />
                            <CheckIcon
                              v-if="pertanyaan.vehicleTypes[vehicle.id]"
                              class="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                            />
                          </div>
                          <label
                            :for="vehicle.id"
                            class="text-sm text-gray-400 cursor-pointer"
                          >
                            {{ vehicle.label }}
                          </label>
                        </div>
                      </div>
                    </div>

                    <h1 class="mt-4 text-lg font-bold text-black mb-4">
                      Pertanyaan
                    </h1>

                    <input
                      type="text"
                      :placeholder="pertanyaan.pertanyaan"
                      disabled
                      class="cursor-not-allowed w-full p-2 border border-[#C3C3C3] bg-gray-100 text-gray-700 rounded-md text-sm mb-4"
                    />

                    <label class="block text-base font-bold text-gray-800 mb-2">
                      Jawaban
                    </label>

                    <div class="space-y-3">
                      <div
                        v-for="(jawab, index) in pertanyaan.jawabanList"
                        :key="jawab.id"
                        class="grid grid-cols-2 gap-4"
                      >
                        <div class="relative">
                          <input
                            type="text"
                            :placeholder="jawab.jawaban"
                            disabled
                            class="cursor-not-allowed w-full p-2 border border-[#C3C3C3] bg-gray-100 text-gray-800 rounded-md text-sm"
                          />
                          <PencilIcon
                            class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                          />
                        </div>

                        <div class="relative">
                          <input
                            type="text"
                            :placeholder="jawab.pilihan"
                            disabled
                            class="cursor-not-allowed w-full p-2 border border-[#C3C3C3] bg-gray-100 text-gray-700 rounded-md text-sm"
                          />
                          <ChevronDownIcon
                            class="absolute right-3 top-2.5 w-5 h-5 text-[#b2b2b2]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Konten tambah pertanyaan -->
            <div
              v-if="tambahPertanyaan"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-4 pb-3 border-b border-gray-300"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Tambah Pertanyaan
                  </h2>
                  <button
                    @click="closetambahPertanyaan"
                    class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <XMarkIcon
                      class="w-6 h-6 text-gray-600 hover:text-gray-900"
                    />
                  </button>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Tipe kendaraan</label
                  >
                  <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div
                      v-for="vehicle in vehicleList"
                      :key="vehicle.id"
                      class="flex items-center gap-2 p-2 border rounded-xl transition cursor-pointer"
                      :class="
                        vehicleTypes[vehicle.id]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-[#a9a9a9] bg-white'
                      "
                    >
                      <div class="relative w-5 h-5">
                        <input
                          type="checkbox"
                          v-model="vehicleTypes[vehicle.id]"
                          :id="vehicle.id"
                          class="w-5 h-5 cursor-pointer rounded-md border-2 appearance-none bg-white border-gray-600 checked:bg-blue-500 checked:border-blue-500"
                          style="
                            appearance: none;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                          "
                        />
                        <CheckIcon
                          v-if="vehicleTypes[vehicle.id]"
                          class="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                        />
                      </div>
                      <label
                        :for="vehicle.id"
                        class="text-sm text-gray-700 cursor-pointer"
                      >
                        {{ vehicle.label }}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Pertanyaan</label
                  >
                  <div class="relative mb-6">
                    <input
                      type="text"
                      v-model="formPertanyaan"
                      placeholder="Masukkan pertanyaan"
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>

                  <label class="block text-base font-medium text-black mb-2"
                    >Kolom Jawaban</label
                  >
                  <div class="space-y-1">
                    <div
                      v-for="(form, index) in formJawabanList"
                      :key="form.id"
                      class="p-2 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <!-- Header dengan nomor -->
                      <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold text-gray-700">
                          Jawaban {{ index + 1 }}
                        </h3>
                        <button
                          v-if="formJawabanList.length > 1"
                          @click="formJawabanList.splice(index, 1)"
                          class="text-red-600 hover:text-red-800 transition"
                        >
                          <TrashIcon class="w-5 h-5" />
                        </button>
                      </div>

                      <!-- Input Jawaban -->
                      <div class="grid grid-cols-2 gap-4">
                        <div class="relative">
                          <input
                            type="text"
                            v-model="form.jawaban"
                            placeholder="Jawaban"
                            class="w-full p-2 border border-[#C3C3C3] bg-white text-gray-700 rounded-md text-sm"
                          />
                          <PencilIcon
                            class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                          />
                        </div>

                        <div class="relative">
                          <select
                            v-model="form.pilihan"
                            class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md text-sm focus:outline-none focus:border-[#A90CF8] appearance-none"
                          >
                            <option value="">Pilih jawaban</option>
                          </select>
                          <ChevronDownIcon
                            class="absolute right-3 top-2.5 w-5 h-5 text-[#b2b2b2] pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-center mt-6">
                  <button
                    @click="tambahKontainerPertanyaan"
                    class="flex items-center gap-2 px-20 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition font-regular"
                  >
                    <PlusIcon class="w-5 h-5" />
                    Tambah pertanyaan lain
                  </button>
                </div>

                <!-- Button -->
                <div class="flex justify-end gap-3 mt-6">
                  <button
                    @click="simpanPertanyaan"
                    class="px-8 md:px-10 py-2 text-sm md:text-base bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular"
                  >
                    Simpan
                  </button>
                  <button
                    @click="closetambahPertanyaan"
                    class="px-6 md:px-6 py-2 text-sm md:text-base border border-gray-300 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-regular"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>

            <!-- Konten Edit pertanyaan -->
            <div
              v-if="editPertanyaan"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-4 pb-3 border-b border-gray-300"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Edit Pertanyaan
                  </h2>
                  <button
                    @click="closeEditPertanyaan"
                    class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <XMarkIcon
                      class="w-6 h-6 text-gray-600 hover:text-gray-900"
                    />
                  </button>
                </div>

                <div class="flex justify-center mt-6">
                  <button
                    @click="hapusKolomPertanyaan"
                    class="flex items-center gap-2 px-20 py-2 text-sm border border-red-300 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition font-regular"
                  >
                    <TrashIcon class="w-5 h-5" />
                    Hapus Kolom Pertanyaan
                  </button>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Tipe kendaraan</label
                  >
                  <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div
                      v-for="vehicle in vehicleList"
                      :key="vehicle.id"
                      class="flex items-center gap-2 p-2 border rounded-xl transition cursor-pointer"
                      :class="
                        vehicleTypes[vehicle.id]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-[#a9a9a9] bg-white'
                      "
                    >
                      <div class="relative w-5 h-5">
                        <input
                          type="checkbox"
                          v-model="vehicleTypes[vehicle.id]"
                          :id="vehicle.id"
                          class="w-5 h-5 cursor-pointer rounded-md border-2 appearance-none bg-white border-gray-600 checked:bg-blue-500 checked:border-blue-500"
                          style="
                            appearance: none;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                          "
                        />
                        <CheckIcon
                          v-if="vehicleTypes[vehicle.id]"
                          class="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                        />
                      </div>
                      <label
                        :for="vehicle.id"
                        class="text-sm text-gray-700 cursor-pointer"
                      >
                        {{ vehicle.label }}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-base font-medium text-black mb-2 mt-4"
                    >Pertanyaan</label
                  >
                  <div class="relative mb-6">
                    <input
                      type="text"
                      v-model="formPertanyaan"
                      placeholder="Masukkan pertanyaan"
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-sm focus:outline-none focus:border-[#A90CF8]"
                    />
                    <PencilIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#C3C3C3]"
                    />
                  </div>

                  <label class="block text-base font-medium text-black mb-2"
                    >Kolom Jawaban</label
                  >
                  <div class="space-y-1">
                    <div
                      v-for="(form, index) in formJawabanList"
                      :key="form.id"
                      class="p-2 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <!-- Header dengan nomor -->
                      <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold text-gray-700">
                          Jawaban {{ index + 1 }}
                        </h3>
                        <button
                          v-if="formJawabanList.length > 1"
                          @click="formJawabanList.splice(index, 1)"
                          class="text-red-600 hover:text-red-800 transition"
                        >
                          <TrashIcon class="w-5 h-5" />
                        </button>
                      </div>

                      <!-- Input Jawaban -->
                      <div class="grid grid-cols-2 gap-4">
                        <div class="relative">
                          <input
                            type="text"
                            v-model="form.jawaban"
                            placeholder="Jawaban"
                            class="w-full p-2 border border-[#C3C3C3] bg-white text-gray-700 rounded-md text-sm"
                          />
                          <PencilIcon
                            class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                          />
                        </div>

                        <div class="relative">
                          <select
                            v-model="form.pilihan"
                            class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md text-sm focus:outline-none focus:border-[#A90CF8] appearance-none"
                          >
                            <option value="">Pilih jawaban</option>
                          </select>
                          <ChevronDownIcon
                            class="absolute right-3 top-2.5 w-5 h-5 text-[#b2b2b2] pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-center mt-6">
                  <button
                    @click="tambahKontainerPertanyaan"
                    class="flex items-center gap-2 px-20 py-2 text-sm border border-blue-300 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition font-regular"
                  >
                    <PlusIcon class="w-5 h-5" />
                    Tambah jawaban lain
                  </button>
                </div>

                <!-- Button -->
                <div class="flex justify-end gap-3 mt-6">
                  <button
                    @click="simpanEditPertanyaan"
                    class="px-8 md:px-10 py-2 text-sm md:text-base bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular"
                  >
                    Simpan
                  </button>
                  <button
                    @click="closeEditPertanyaan"
                    class="px-6 md:px-6 py-2 text-sm md:text-base border border-gray-300 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-regular"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
