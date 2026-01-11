<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Aside from "../../bar/aside.vue";
import HeaderAdmin from "../../bar/header_admin.vue";
import {
  MagnifyingGlassIcon,
  Bars3BottomLeftIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  UserPlusIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";
import { PencilIcon, CalendarIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const selectedRowIds = ref([]);
const selectAllChecked = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const tambahUnitKendaraan = ref(false);
const showFilter = ref(false);
const filterData = ref({
  departemen: "",
  posisi: "",
  status: "",
  namaPerusahaan: "",
});
const appliedFilterData = ref({
  departemen: "",
  posisi: "",
  status: "",
  namaPerusahaan: "",
});

const opentambahUnitKendaraan = () => {
  tambahUnitKendaraan.value = true;
};

const closeTambahUnitKendaraan = () => {
  tambahUnitKendaraan.value = false;
};

const openFilter = () => {
  showFilter.value = true;
};

const closeFilter = () => {
  showFilter.value = false;
};

const applyFilter = () => {
  appliedFilterData.value = { ...filterData.value };
  currentPage.value = 1;
  closeFilter();
};

const tableData = ref([
  {
    id: 1,
    nomorPolisi: "KT 1234 AB",
    tipe: "Light Vehicle",
    merek: "Toyota Innova reborn 2.4G",
    user: "Era Tjahya Saputra",
    perusahaan: "PT Indominco Mandiri",
    tglSTNK: "7 Februari 2026",
    tglPajak: "7 Maret 2026",
    kirKuer: "28 Desember 2028",
    noRangka: "MK2KSWPNUJJ000338",
    noMesin: "4N15UCP7140",
  },
  {
    id: 2,
    nomorPolisi: "KT 1235 AB",
    tipe: "Light Vehicle",
    merek: "Isuzu",
    user: "Era Tjahya Saputra",
    perusahaan: "PT Indominco Mandiri",
    tglSTNK: "7 Maret 2026",
    tglPajak: "7 Februari 2026",
    kirKuer: "28 Januari 2026",
    noRangka: "MK2KSWPNUJJ000338",
    noMesin: "4N15UCP7140",
  },
  {
    id: 3,
    nomorPolisi: "KT 1235 AB",
    tipe: "Light Vehicle",
    merek: "Toyota Innova reborn 2.4G",
    user: "Era Tjahya Saputra",
    perusahaan: "PT Indominco Mandiri",
    tglSTNK: "28 Desember 2025",
    tglPajak: "15 Mei 2026",
    kirKuer: "7 Februari 2026",
    noRangka: "MK2KSWPNUJJ000338",
    noMesin: "4N15UCP7140",
  },
]);

const selectRow = (rowId) => {
  const index = selectedRowIds.value.indexOf(rowId);
  if (index > -1) {
    selectedRowIds.value.splice(index, 1);
  } else {
    // Tambah ID jika belum ada
    selectedRowIds.value.push(rowId);
  }
  // Update selectAllChecked
  selectAllChecked.value =
    selectedRowIds.value.length === tableData.value.length;
};

const toggleSelectAll = () => {
  selectAllChecked.value = !selectAllChecked.value;
  if (selectAllChecked.value) {
    // Pilih semua
    selectedRowIds.value = tableData.value.map((row) => row.id);
  } else {
    // Kosongkan semua
    selectedRowIds.value = [];
  }
};

const isRowSelected = (rowId) => {
  return selectedRowIds.value.includes(rowId);
};

// Helper function untuk normalize string (hapus whitespace dan karakter khusus)
const normalizeString = (str) => {
  return str.toLowerCase().replace(/[\s\-./]/g, "");
};

// Filter data berdasarkan search query dan filter yang diterapkan
const filteredTableData = computed(() => {
  let filtered = tableData.value;

  // Filter berdasarkan search query
  if (searchQuery.value.trim()) {
    const query = normalizeString(searchQuery.value);
    filtered = filtered.filter((row) => {
      return (
        normalizeString(row.nomorPolisi).includes(query) ||
        normalizeString(row.tipe).includes(query) ||
        normalizeString(row.merek).includes(query) ||
        normalizeString(row.user).includes(query) ||
        normalizeString(row.perusahaan).includes(query)
      );
    });
  }

  // Filter berdasarkan filter yang diterapkan
  if (appliedFilterData.value.departemen) {
    filtered = filtered.filter(
      (row) => row.tipe === appliedFilterData.value.departemen
    );
  }
  if (appliedFilterData.value.posisi) {
    filtered = filtered.filter(
      (row) => row.merek === appliedFilterData.value.posisi
    );
  }
  if (appliedFilterData.value.namaPerusahaan) {
    filtered = filtered.filter(
      (row) => row.perusahaan === appliedFilterData.value.namaPerusahaan
    );
  }

  return filtered;
});

// Pagination computed
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTableData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTableData.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endIndex = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredTableData.value.length
  );
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const editKendaraan = (rowId) => {
  const vehicle = tableData.value.find(v => v.id === rowId);
  if (vehicle) {
    localStorage.setItem('currentVehicleData', JSON.stringify(vehicle));
    router.push(`/edit-unit-travel/${rowId}`);
  }
};

const getDateStyle = (dateString) => {
  // Parse tanggal format "DD Bulan YYYY"
  const bulanMap = {
    Januari: 0,
    Februari: 1,
    Maret: 2,
    April: 3,
    Mei: 4,
    Juni: 5,
    Juli: 6,
    Agustus: 7,
    September: 8,
    Oktober: 9,
    November: 10,
    Desember: 11,
  };

  const parts = dateString.split(" ");
  const day = parseInt(parts[0]);
  const month = bulanMap[parts[1]];
  const year = parseInt(parts[2]);

  const targetDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Hitung selisih bulan
  const monthDiff =
    (targetDate.getFullYear() - today.getFullYear()) * 12 +
    (targetDate.getMonth() - today.getMonth());

  if (monthDiff === 1) {
    return { bg: "#FFE5E5", text: "#C41E3A" }; // Merah
  } else if (monthDiff === 2) {
    return { bg: "#FFF3CD", text: "#856404" }; // Kuning
  } else {
    return { bg: "#E2E3E5", text: "#383D41" }; // Abu-abu
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1 overflow-hidden">
      <Aside />

      <div class="flex flex-col flex-1 ml-62 overflow-hidden">
        <HeaderAdmin />

        <!-- Content -->
        <main class="bg-[#EFEFEF] flex-1 flex flex-col p-3 overflow-hidden">
          <!-- Judul -->
          <div
            class="bg-white rounded-lg shadow-md p-1 pl-5 mb-2 -mt-1 shrink-0"
          >
            <h1 class="text-base font-bold text-[#523E95] text-left">
              Travel
            </h1>
          </div>
          <div
            class="bg-white rounded-lg shadow-md p-5 flex-1 flex flex-col overflow-hidden"
          >
            <!-- Toolbar -->
            <div
              class="flex items-center gap-3 pb-4 border-b shrink-0 flex-none justify-between"
            >
              <!-- Left Section -->
              <div class="flex items-center gap-3">
                <!-- Tambah pengguna Button -->
                <button
                  @click="opentambahUnitKendaraan"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-white bg-[#6444C6] hover:bg-[#5c3db8] transition text-sm"
                >
                  <UserPlusIcon class="w-5 h-5" />
                  <span>Tambah Unit Kendaraan</span>
                </button>

                <!-- Upload button -->
                <button
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  <CloudArrowUpIcon class="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>

              <!-- Right Section -->
              <div class="flex items-center gap-3">
                <!-- Search Input with Icon Inside -->
                <div class="relative flex min-w-50">
                  <MagnifyingGlassIcon
                    class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    v-model="searchQuery"
                    @input="currentPage = 1"
                    type="text"
                    placeholder="Cari..."
                    class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- Filter Button -->
                <button
                  @click="openFilter"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  <Bars3BottomLeftIcon class="w-4 h-4" />
                  <span>Filter</span>
                </button>

                <!-- Export Button -->
                <button
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  <ArrowUpTrayIcon class="w-4 h-4" />
                  <span>Export</span>
                </button>

                <!-- Template Button -->
                <button
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  <ArrowDownTrayIcon class="w-4 h-4" />
                  <span>Template</span>
                </button>

                <!-- Delete Button -->
                <button
                  :disabled="selectedRowIds.length === 0"
                  class="flex items-center gap-2 px-3 py-2 rounded-md transition text-sm"
                  :class="
                    selectedRowIds.length > 0
                      ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                  "
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Table Container with Horizontal Scroll -->
            <div
              class="flex-1 flex flex-col gap-4 bg-gray-50 p-1 rounded-lg border border-gray-200 overflow-hidden"
            >
              <div
                class="overflow-x-auto overflow-y-auto rounded-lg border bg-white max-h-105"
              >
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="border-b-2 border-gray-400 bg-gray-50">
                      <th
                        class="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-12"
                      >
                        <div class="relative w-5 h-5">
                          <input
                            type="checkbox"
                            :checked="selectAllChecked"
                            @change="toggleSelectAll"
                            class="w-5 h-5 cursor-pointer rounded-md border-2 appearance-none bg-white border-gray-600 checked:bg-blue-500 checked:border-blue-500"
                            style="
                              appearance: none;
                              -webkit-appearance: none;
                              -moz-appearance: none;
                            "
                            title="Pilih semua / Batal pilih semua"
                          />
                          <!-- Check Icon -->
                          <CheckIcon
                            v-if="selectAllChecked"
                            class="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                          />
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        Nomor Polisi
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20"
                      >
                        Tipe
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20"
                      >
                        Merek
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        User
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        Perusahaan
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        Tgl. STNK
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        Tgl. Pajak
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        No. Rangka
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        No. Mesin
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-16"
                      >
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in paginatedData"
                      :key="row.id"
                      class="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                      :class="{ 'bg-blue-50': isRowSelected(row.id) }"
                    >
                      <td class="px-4 py-3 whitespace-nowrap min-w-12">
                        <div class="relative w-5 h-5">
                          <input
                            type="checkbox"
                            :checked="isRowSelected(row.id)"
                            @change="selectRow(row.id)"
                            @click.stop
                            class="w-5 h-5 cursor-pointer rounded-md border-2 appearance-none bg-white border-gray-600 checked:bg-blue-500 checked:border-blue-500"
                            style="
                              appearance: none;
                              -webkit-appearance: none;
                              -moz-appearance: none;
                            "
                          />
                          <!-- Check Icon -->
                          <CheckIcon
                            v-if="isRowSelected(row.id)"
                            class="absolute inset-0 m-auto w-4 h-4 text-white pointer-events-none"
                          />
                        </div>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.nomorPolisi }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-20"
                      >
                        {{ row.tipe }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-20"
                      >
                        {{ row.merek }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.user }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.perusahaan }}
                      </td>
                      <td class="px-4 py-3 text-xs whitespace-nowrap min-w-28">
                        <span
                          class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          :style="{
                            backgroundColor: getDateStyle(row.tglSTNK).bg,
                            color: getDateStyle(row.tglSTNK).text,
                          }"
                        >
                          {{ row.tglSTNK }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-xs whitespace-nowrap min-w-28">
                        <span
                          class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          :style="{
                            backgroundColor: getDateStyle(row.tglPajak).bg,
                            color: getDateStyle(row.tglPajak).text,
                          }"
                        >
                          {{ row.tglPajak }}
                        </span>
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.noRangka }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.noMesin }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-16"
                      >
                        <button
                          @click="editKendaraan(row.id)"
                          class="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <PencilSquareIcon
                            class="w-4.5 h-4.5 text-black hover:text-blue-800"
                          />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div
                class="flex flex-col md:flex-row justify-between md:justify-end items-center gap-3 md:gap-4 pt-3 md:pt-4 border-t border-gray-200"
              >
                <span
                  class="text-xs md:text-sm text-gray-700 font-medium order-2 md:order-1"
                >
                  {{ startIndex }} - {{ endIndex }} of
                  {{ filteredTableData.length }}
                </span>
                <div class="flex gap-2 order-1 md:order-2">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    &lt;
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            <!-- Konten Tambah pengguna -->
            <div
              v-if="tambahUnitKendaraan"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-2 pb-3 border-b border-gray-200"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Tambah Unit Kendaraan Travel
                  </h2>
                  <button
                    @click="closeTambahUnitKendaraan"
                    class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <XMarkIcon
                      class="w-6 h-6 text-gray-600 hover:text-gray-900"
                    />
                  </button>
                </div>

                <!-- Row -->
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Nomor Polisi</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Masukkan nomor polisi"
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                      />
                      <PencilIcon
                        class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Merek</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Masukkan merek kendaraan"
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                      />
                      <PencilIcon
                        class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Tipe</label
                    >
                    <div class="relative">
                      <select
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm appearance-none"
                      >
                        <option value="">Pilih tipe kendaraan</option>
                      </select>
                      <ChevronDownIcon
                        class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >User</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Masukkan nama user"
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                      />
                      <PencilIcon
                        class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Perusahaan</label
                    >
                    <div class="relative">
                      <select
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm appearance-none"
                      >
                        <option value="">Pilih nama perusahaan</option>
                      </select>
                      <ChevronDownIcon
                        class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Tanggal STNK</label
                    >
                    <input
                      type="date"
                      class="w-full p-2 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Tanggal Pajak</label
                    >
                    <input
                      type="date"
                      class="w-full p-2 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >KIR / KUER</label
                    >
                    <input
                      type="date"
                      class="w-full p-2 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Nomor Rangka</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Masukkan nomor rangka"
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                      />
                      <PencilIcon
                        class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Nomor Mesin</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Masukkan nomor mesin"
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                      />
                      <PencilIcon
                        class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                  <button
                    class="px-6 md:px-6 py-2 text-sm md:text-base bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular"
                  >
                    Tambah Pengguna
                  </button>
                  <button
                    @click="closeTambahUnitKendaraan"
                    class="px-6 md:px-6 py-2 text-sm md:text-base border border-gray-300 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-regular"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>

            <!-- Filter Pengguna -->
            <div
              v-if="showFilter"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white rounded-lg w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-1 pb-3 border-b border-gray-200"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Filter Data
                  </h2>
                  <button
                    @click="closeFilter"
                    class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <XMarkIcon
                      class="w-6 h-6 text-gray-600 hover:text-gray-900"
                    />
                  </button>
                </div>

                <!-- Nama Perusahaan -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Nama Perusahaan</label
                  >
                  <div class="relative">
                    <select
                      v-model="filterData.namaPerusahaan"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] appearance-none"
                    >
                      <option value="">Pilih Perusahaan</option>
                    </select>
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                    />
                  </div>
                </div>

                <!-- Tipe -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Tipe Kendaraan</label
                  >
                  <div class="relative">
                    <select
                      v-model="filterData.departemen"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] appearance-none"
                    >
                      <option value="">Pilih Tipe</option>
                    </select>
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                    />
                  </div>
                </div>

                <!-- Merek -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Merek</label
                  >
                  <div class="relative">
                    <select
                      v-model="filterData.posisi"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] appearance-none"
                    >
                      <option value="">Pilih Merek</option>
                    </select>
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                    />
                  </div>
                </div>

                <!-- Tanggal STNK -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Tanggal STNK</label
                  >
                  <input
                    type="date"
                    class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8]"
                  />
                </div>

                <!-- Tanggal Pajak -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Tanggal Pajak</label
                  >
                  <input
                    type="date"
                    class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8]"
                  />
                </div>

                <!-- Tanggal KIR / KUER -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Tanggal KIR / KUER</label
                  >
                  <input
                    type="date"
                    class="w-full p-2 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8]"
                  />
                </div>

                <div class="flex justify-center gap-3 mt-6">
                  <button
                    @click="closeFilter"
                    class="px-6 md:px-6 py-2 text-sm md:text-base border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-regular"
                  >
                    Batal
                  </button>
                  <button
                    @click="applyFilter"
                    class="px-6 md:px-6 py-2 text-sm md:text-base bg-linear-to-r from-[#A90CF8] to-[#9600E1] text-white rounded-xl hover:opacity-90 transition font-regular"
                  >
                    Terapkan
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
