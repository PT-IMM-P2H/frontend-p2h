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
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";
import {PencilIcon, CalendarIcon} from "@heroicons/vue/24/solid";

const router = useRouter();

const selectedRowIds = ref([]);
const selectAllChecked = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const tambahPengguna = ref(false);
const showFilter = ref(false);
const sortOrder = ref("asc");
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

const opentambahPengguna = () => {
  tambahPengguna.value = true;
};

const closeTambahPengguna = () => {
  tambahPengguna.value = false;
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
    namaLengkap: "Budi Santoso",
    noHandphone: "081234567890",
    email:"budi@gmail.com",
    namaPerusahaan: "PT Indominco Mandiri",
    departemen: "Operasional",
    posisi: "Supervisor",
    status: "Karyawan",
    role: "User",
  },
  {
    id: 2,
    namaLengkap: "Siti Nurhaliza",
    noHandphone: "082345678901",
    email:"siti@gmail.com",
    namaPerusahaan: "PT Indominco Mandiri",
    departemen: "Transport",
    posisi: "Manager",
    status: "Karyawan",
    role: "User",
  },
]);

const selectRow = (rowId) => {
  const index = selectedRowIds.value.indexOf(rowId);
  if (index > -1) {
    // Hapus ID jika sudah ada
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
        normalizeString(row.namaLengkap).includes(query) ||
        normalizeString(row.noHandphone).includes(query) ||
        normalizeString(row.departemen).includes(query) ||
        normalizeString(row.posisi).includes(query)
      );
    });
  }

  // Filter berdasarkan filter yang diterapkan
  if (appliedFilterData.value.departemen) {
    filtered = filtered.filter(
      (row) => row.departemen === appliedFilterData.value.departemen
    );
  }
  if (appliedFilterData.value.posisi) {
    filtered = filtered.filter(
      (row) => row.posisi === appliedFilterData.value.posisi
    );
  }
  if (appliedFilterData.value.status) {
    filtered = filtered.filter(
      (row) => row.status === appliedFilterData.value.status
    );
  }
  if (appliedFilterData.value.namaPerusahaan) {
    filtered = filtered.filter(
      (row) => row.namaPerusahaan === appliedFilterData.value.namaPerusahaan
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

const sortByName = () => {
  if (sortOrder.value === "asc") {
    sortOrder.value = "desc";
    tableData.value = [...tableData.value].sort((a, b) =>
      b.namaLengkap.localeCompare(a.namaLengkap)
    );
  } else {
    sortOrder.value = "asc";
    tableData.value = [...tableData.value].sort((a, b) =>
      a.namaLengkap.localeCompare(b.namaLengkap)
    );
  }
  currentPage.value = 1;
};

const editPengguna = (rowId) => {
  const userData = tableData.value.find(row => row.id === rowId);
  if (userData) {
    localStorage.setItem('currentUserData', JSON.stringify(userData));
  }
  router.push({
    name: 'EditDataPenggunaPT',
    params: { id: rowId }
  });
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
          <!-- Judul -->
          <div
            class="bg-white rounded-lg shadow-md p-1 pl-5 mb-2 -mt-1 shrink-0"
          >
            <h1 class="text-base font-bold text-[#523E95] text-left">
              PT Indominco Mandiri
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
                  @click="opentambahPengguna"
                  class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-white bg-[#6444C6] hover:bg-[#5c3db8] transition text-sm"
                >
                  <UserPlusIcon class="w-5 h-5" />
                  <span>Tambah Pengguna</span>
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
                    placeholder="Cari nama..."
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
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-32 cursor-pointer hover:bg-gray-100 transition"
                        @click="sortByName"
                      >
                        <div class="flex items-center gap-2">
                          <span>Nama Lengkap</span>
                          <ArrowDownIcon
                            v-if="sortOrder === 'asc'"
                            class="w-4 h-4"
                          />
                          <ArrowUpIcon v-else class="w-4 h-4" />
                        </div>
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-24"
                      >
                        No. Handphone
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        Email
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        Nama Perusahaan
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-28"
                      >
                        Departemen
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20"
                      >
                        Posisi
                      </th>
                      <th
                        class="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap min-w-20"
                      >
                        Status
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
                        class="px-4 py-3 text-gray-800 whitespace-nowrap min-w-32 text-xs"
                      >
                        {{ row.namaLengkap }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-24"
                      >
                        {{ row.noHandphone }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.email }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.namaPerusahaan }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-28"
                      >
                        {{ row.departemen }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-20"
                      >
                        {{ row.posisi }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-20"
                      >
                        {{ row.status }}
                      </td>
                      <td
                        class="px-4 py-3 text-gray-800 text-xs whitespace-nowrap min-w-16"
                      >
                        <button
                          @click="editPengguna(row.id)"
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
              v-if="tambahPengguna"
              class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-6 md:p-8"
              >
                <div
                  class="flex justify-between items-center mb-1 pb-3 border-b border-gray-200"
                >
                  <h2 class="text-lg md:text-xl font-semibold text-gray-900">
                    Tambah Pengguna
                  </h2>
                  <button
                    @click="closeTambahPengguna"
                    class="shrink-0 p-1 hover:bg-gray-100 rounded-md transition"
                  >
                    <XMarkIcon
                      class="w-6 h-6 text-gray-600 hover:text-gray-900"
                    />
                  </button>
                </div>

                <!-- Row 1: Nama Lengkap dan Nomor Telepon -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Nama Lengkap</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="Masukkan nama"
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
                      >Nomor Telepon</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="081xxxxxxxx"
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm"
                      />
                      <PencilIcon
                        class="absolute right-3 top-2.5 w-4 h-4 text-[#b2b2b2]"
                      />
                    </div>
                  </div>
                </div>

                <!-- Row 2: Email dan Nama Perusahaan -->
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Email</label
                    >
                    <div class="relative">
                      <input
                        type="text"
                        placeholder="email@example.com"
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
                      >Nama Perusahaan</label
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
                </div>

                <!-- Row 3: Departemen dan Posisi -->
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Departemen</label
                    >
                    <div class="relative">
                      <select
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm appearance-none"
                      >
                        <option value="">Pilih departemen</option>
                      </select>
                      <ChevronDownIcon
                        class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Posisi</label
                    >
                    <div class="relative">
                      <select
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm appearance-none"
                      >
                        <option value="">Pilih posisi</option>
                      </select>
                      <ChevronDownIcon
                        class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <!-- Row 4: Status Pekerjaan dan Tanggal Lahir -->
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Status Pekerjaan</label
                    >
                    <div class="relative">
                      <select
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm appearance-none"
                      >
                        <option value="">Pilih status pekerjaan</option>
                      </select>
                      <ChevronDownIcon
                        class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      class="block text-base font-medium text-gray-800 mb-1 mt-1"
                      >Tanggal Lahir</label
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
                      >Role</label
                    >
                    <div class="relative">
                      <select
                        class="w-full p-2 pr-10 border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] text-sm appearance-none"
                      >
                        <option value="">Pilih role</option>
                      </select>
                      <ChevronDownIcon
                        class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
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
                    @click="closeTambahPengguna"
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

                <!-- Perusahaan -->
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

                <!-- Departemen -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Departemen</label
                  >
                  <div class="relative">
                    <select
                      v-model="filterData.departemen"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] appearance-none"
                    >
                      <option value="">Pilih Departemen</option>
                    </select>
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                    />
                  </div>
                </div>

                <!-- Posisi Kerja -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Posisi Kerja</label
                  >
                  <div class="relative">
                    <select
                      v-model="filterData.posisi"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] appearance-none"
                    >
                      <option value="">Pilih Posisi Kerja</option>
                    </select>
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                    />
                  </div>
                </div>

                <!-- Status Kerja -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-800 mb-2 mt-2"
                    >Status Kerja</label
                  >
                  <div class="relative">
                    <select
                      v-model="filterData.status"
                      class="w-full p-2 pr-10 text-sm border border-[#C3C3C3] bg-white text-gray-700 rounded-md focus:outline-none focus:border-[#A90CF8] appearance-none"
                    >
                      <option value="">Pilih Status Kerja</option>
                    </select>
                    <ChevronDownIcon
                      class="absolute right-3 top-2.5 w-5 h-5 text-[#949494] pointer-events-none"
                    />
                  </div>
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
