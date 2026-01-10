<script setup>
import { ref, computed } from "vue";
import NavBar from "../bar/header-user.vue";
import Footer from "../bar/footer.vue";
import {
  MagnifyingGlassIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
} from "@heroicons/vue/24/solid";

const nomorLambung = ref("");
const hasilPencarian = ref([]);
const selectedKendaraan = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const sortOrder = ref("desc");

// Data dummy kendaraan
const dataKendaraan = [
  { 
    id: 1, 
    nomor: "P - 309", 
    warnaLambung: "Hijau",
    merek: "Toyota Innova reborn 2.4G",
    tipe: "Light Vehicle",
    platKendaraan: "KT 1234 IMM",
    status: "sudah" 
  },
  { 
    id: 2, 
    nomor: "P - 308", 
    warnaLambung: "Merah",
    merek: "Honda City",
    tipe: "Light Vehicle",
    platKendaraan: "KT 5678 NNM",
    status: "sudah" 
  },
  { 
    id: 3, 
    nomor: "P - 307", 
    warnaLambung: "Biru",
    merek: "Isuzu Panther",
    tipe: "Double Cabin",
    platKendaraan: "KT 9012 OOM",
    status: "belum" 
  },
  { 
    id: 4, 
    nomor: "P - 306", 
    warnaLambung: "Kuning",
    merek: "Daihatsu Xenia",
    tipe: "Light Vehicle",
    platKendaraan: "KT 3456 PPM",
    status: "belum" 
  },
  { 
    id: 5, 
    nomor: "P - 305", 
    warnaLambung: "Putih",
    merek: "Hino Bus",
    tipe: "Bus",
    platKendaraan: "KT 7890 QQM",
    status: "sudah" 
  },
];

// Data dummy riwayat
const riwayatData = ref([
  {
    tanggal: "2024-01-09",
    nomor: "P - 309",
    warnaLambung: "Hijau",
    merek: "Toyota Innova reborn 2.4G",
    tipe: "Light Vehicle",
    platKendaraan: "KT 1234 IMM",
    hasil: "Normal",
    status: "sudah",
  },
  {
    tanggal: "2024-01-08",
    nomor: "P - 308",
    warnaLambung: "Merah",
    merek: "Honda City",
    tipe: "Light Vehicle",
    platKendaraan: "KT 5678 NNM",
    hasil: "Abnormal",
    status: "sudah",
  },
  {
    tanggal: "2024-01-07",
    nomor: "P - 307",
    warnaLambung: "Biru",
    merek: "Isuzu Panther",
    tipe: "Double Cabin",
    platKendaraan: "KT 9012 OOM",
    hasil: "Normal",
    status: "belum",
  },
  {
    tanggal: "2024-01-06",
    nomor: "P - 306",
    warnaLambung: "Kuning",
    merek: "Daihatsu Xenia",
    tipe: "Light Vehicle",
    platKendaraan: "KT 3456 PPM",
    hasil: "Warning",
    status: "belum",
  },
  {
    tanggal: "2024-01-05",
    nomor: "P - 305",
    warnaLambung: "Putih",
    merek: "Hino Bus",
    tipe: "Bus",
    platKendaraan: "KT 7890 QQM",
    hasil: "Abnormal",
    status: "sudah",
  },
  {
    tanggal: "2024-01-04",
    nomor: "P - 304",
    warnaLambung: "Hitam",
    merek: "Suzuki Vitara",
    tipe: "Light Vehicle",
    platKendaraan: "KT 1111 RRM",
    hasil: "Normal",
    status: "sudah",
  },
]);

const handleCariKendaraan = () => {
  if (nomorLambung.value.trim()) {
    // Normalisasi input: hapus spasi dan titik, jadikan lowercase
    const normalizedInput = nomorLambung.value
      .toLowerCase()
      .replace(/[\s.-]/g, "");

    hasilPencarian.value = dataKendaraan.filter((kendaraan) => {
      // Normalisasi nomor kendaraan: hapus spasi dan titik, jadikan lowercase
      const normalizedNomor = kendaraan.nomor
        .toLowerCase()
        .replace(/[\s.-]/g, "");

      return normalizedNomor.includes(normalizedInput);
    });
  } else {
    hasilPencarian.value = [];
  }
};

const handleSelectKendaraan = (kendaraan) => {
  selectedKendaraan.value = kendaraan;
};

// Sort function
const sortByDate = () => {
  sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
  riwayatData.value.sort((a, b) => {
    const dateA = new Date(a.tanggal);
    const dateB = new Date(b.tanggal);
    return sortOrder.value === "desc" ? dateB - dateA : dateA - dateB;
  });
};

// Get hasil style
const getHasilStyle = (hasil) => {
  const styles = {
    Normal: { bg: "#A7E8BF", text: "#1A5C3F" },
    Abnormal: { bg: "#F7E19C", text: "#8B6F47" },
    Warning: { bg: "#FFA0A0", text: "#8B3A3A" },
  };
  return styles[hasil] || styles["Normal"];
};

// Pagination computed
const totalPages = computed(() =>
  Math.ceil(riwayatData.value.length / itemsPerPage.value)
);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return riwayatData.value.slice(start, end);
});

const startIndex = computed(
  () => (currentPage.value - 1) * itemsPerPage.value + 1
);
const endIndex = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, riwayatData.value.length)
);

// Pagination functions
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <!-- Navbar -->
    <NavBar />

    <!-- Content -->
    <main
      class="flex-1 flex flex-col bg-cover bg-center bg-no-repeat px-2 md:px-2 pt-24 md:pt-8 pb-40 md:pb-20 overflow-y-auto"
      style="background-image: url(/image_asset/BG_2.png)"
    >
      <div class="flex flex-col items-center gap-4 w-full">
        <!-- Konten Utama -->
        <div
          class="mt-15 w-300 h-auto flex flex-col bg-white rounded-xl shadow-lg max-w-full md:max-w-5xl p-3 md:p-7"
        >
          <h1 class="text-2xl font-bold mb-2 text-gray-800 text-left">
            Jenis kendaraan
          </h1>
          <hr class="border-t-3 border-[#9600E1] rounded-lg mb-4" />
          <div class="flex flex-col gap-4">
            <div class="flex gap-3 items-center">
              <div class="relative flex-1">
                <input
                  v-model="nomorLambung"
                  type="text"
                  placeholder="Nomor Lambung Kendaraan"
                  @input="handleCariKendaraan"
                  @keyup.enter="handleCariKendaraan"
                  class="w-full px-3.75 py-3 pr-10 border border-[#a1a1a1] bg-gray-100 rounded-lg text-[14px] text-[#333] transition-colors duration-300 focus:outline-none focus:border-[#646cff] focus:ring-3 focus:ring-[#646cff]/10"
                />
                <MagnifyingGlassIcon
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
                />
              </div>
              <button
                @click="handleCariKendaraan"
                class="px-13 py-3 bg-[#9600E1] text-white rounded-lg text-base font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#8507c5] whitespace-nowrap active:bg-[#3a276b]"
              >
                Cari
              </button>
            </div>
          </div>

          <!-- HASIL PENCARIAN DATA -->
          <div
            v-if="hasilPencarian.length > 0"
            class="flex flex-col gap-4 mt-4"
          >
            <div
              v-for="kendaraan in hasilPencarian.filter(
                (k) => k.status === 'sudah'
              )"
              :key="kendaraan.id"
              class="w-auto h-auto flex flex-col border-2 border-[#2DA642] bg-[#C5FFCF] rounded-xl shadow-lg max-w-full md:max-w-5xl p-4 md:p-4 gap-2"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Nomor lambung : <span class="font-semibold">{{ kendaraan.nomor }}</span></p>
                  <p class="text-sm text-gray-700">Warna nomor lambung : <span class="font-semibold">{{ kendaraan.warnaLambung }}</span></p>
                  <p class="text-sm text-gray-700">Merek Kendaraan : <span class="font-semibold">{{ kendaraan.merek }}</span></p>
                  <p class="text-sm text-gray-700">Tipe Kendaraan : <span class="font-semibold">{{ kendaraan.tipe }}</span></p>
                  <p class="text-sm text-gray-700">Plat Kendaraan : <span class="font-semibold">{{ kendaraan.platKendaraan }}</span></p>
                </div>
                <button
                  @click="handleSelectKendaraan(kendaraan)"
                  class="px-4 py-10 bg-[#2eb745] text-white rounded-lg text-xs md:text-sm font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#24a635] whitespace-nowrap ml-3"
                >
                  SELECT
                </button>
              </div>
            </div>
            <div
              v-for="kendaraan in hasilPencarian.filter(
                (k) => k.status === 'belum'
              )"
              :key="kendaraan.id"
              class="w-auto h-auto flex flex-col border-2 border-[#A62D2D] bg-[#FFC5C5] rounded-xl shadow-lg max-w-full md:max-w-5xl p-4 md:p-4 gap-2"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Nomor lambung : <span class="font-semibold">{{ kendaraan.nomor }}</span></p>
                  <p class="text-sm text-gray-700">Warna nomor lambung : <span class="font-semibold">{{ kendaraan.warnaLambung }}</span></p>
                  <p class="text-sm text-gray-700">Merek Kendaraan : <span class="font-semibold">{{ kendaraan.merek }}</span></p>
                  <p class="text-sm text-gray-700">Tipe Kendaraan : <span class="font-semibold">{{ kendaraan.tipe }}</span></p>
                  <p class="text-sm text-gray-700">Plat Kendaraan : <span class="font-semibold">{{ kendaraan.platKendaraan }}</span></p>
                </div>
                <button
                  @click="handleSelectKendaraan(kendaraan)"
                  class="px-4 py-10 bg-[#A62D2D] text-white rounded-lg text-xs md:text-sm font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#8b2424] whitespace-nowrap ml-3"
                >
                  SELECT
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hasil Sudah P2H -->
        <div
          v-if="selectedKendaraan && selectedKendaraan.status === 'sudah'"
          class="w-300 h-auto flex flex-col border-2 border-[#2DA642] bg-[#C5FFCF] rounded-xl shadow-lg max-w-full md:max-w-5xl p-3 md:p-3"
        >
          <p class="font-bold text-black">
            SUDAH DI LAKUKAN PELAKSANAAN PEMERIKSAAN HARIAN
          </p>
        </div>

        <!-- Hasil Belum P2H -->
        <div v-if="selectedKendaraan && selectedKendaraan.status === 'belum'">
          <div
            class="w-300 h-auto flex flex-col border-2 border-[#A62D2D] bg-[#FFC5C5] rounded-xl shadow-lg max-w-full md:max-w-5xl p-3 md:p-3"
          >
            <p class="font-bold text-black">
              BELUM DI LAKUKAN PELAKSANAAN PEMERIKSAAN HARIAN
            </p>
          </div>
          <!-- Button FORM P2H -->
          <div class="w-300 mt-4 flex justify-end max-w-full md:max-w-5xl">
            <button
              class="px-10 py-3 bg-[#9600E1] text-white rounded-xl text-[14px] font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#8507c5] whitespace-nowrap"
            >
              FORM P2H
            </button>
          </div>
        </div>

        <!-- Hidden Riwayat Kendaraan -->
        <div
          class="w-300 h-auto flex flex-col bg-white rounded-xl shadow-lg max-w-full md:max-w-5xl p-3 md:p-7 mb-15"
        >
          <h1
            class="flex justify-start text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4"
          >
            Riwayat
          </h1>

          <!-- Table -->
          <div
            class="overflow-x-auto -mx-3 md:mx-0 md:rounded-lg border-b md:border flex-1 mb-3 md:mb-4"
          >
            <table class="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr class="border-b-2 border-gray-400">
                  <th
                    class="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition whitespace-nowrap text-xs md:text-sm"
                    @click="sortByDate"
                  >
                    <div class="flex items-center gap-1 md:gap-2">
                      <span>Tanggal</span>
                      <ArrowLongDownIcon
                        v-if="sortOrder === 'desc'"
                        class="w-3 h-3 md:w-4 md:h-4"
                      />
                      <ArrowLongUpIcon v-else class="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </th>
                  <th
                    class="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap text-xs md:text-sm"
                  >
                    No. Lambung
                  </th>
                  <th
                    class="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap text-xs md:text-sm"
                  >
                    Warna Lambung
                  </th>
                  <th
                    class="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap text-xs md:text-sm"
                  >
                    Tipe
                  </th>
                  <th
                    class="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap text-xs md:text-sm"
                  >
                    Merek
                  </th>
                  <th
                    class="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap text-xs md:text-sm"
                  >
                    Plat Kendaraan
                  </th>
                  <th
                    class="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap text-xs md:text-sm"
                  >
                    Hasil
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in paginatedData"
                  :key="index"
                  class="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td
                    class="px-2 md:px-4 py-2 md:py-3 text-gray-800 whitespace-nowrap text-xs md:text-sm"
                  >
                    {{ item.tanggal }}
                  </td>
                  <td
                    class="px-2 md:px-4 py-2 md:py-3 text-gray-800 whitespace-nowrap text-xs md:text-sm"
                  >
                    {{ item.nomor }}
                  </td>
                  <td
                    class="px-2 md:px-4 py-2 md:py-3 text-gray-800 whitespace-nowrap text-xs md:text-sm"
                  >
                    {{ item.warnaLambung }}
                  </td>
                  <td
                    class="px-2 md:px-4 py-2 md:py-3 text-gray-800 whitespace-nowrap text-xs md:text-sm"
                  >
                    {{ item.tipe }}
                  </td>
                  <td
                    class="px-2 md:px-4 py-2 md:py-3 text-gray-800 whitespace-nowrap text-xs md:text-sm"
                  >
                    {{ item.merek }}
                  </td>
                  <td
                    class="px-2 md:px-4 py-2 md:py-3 text-gray-800 whitespace-nowrap text-xs md:text-sm"
                  >
                    {{ item.platKendaraan }}
                  </td>
                  <td
                    class="px-2 md:px-4 py-2 md:py-3 text-gray-800 whitespace-nowrap text-xs md:text-sm"
                  >
                    <span
                      class="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold"
                      :style="{
                        backgroundColor: getHasilStyle(item.hasil).bg,
                        color: getHasilStyle(item.hasil).text,
                      }"
                    >
                      {{ item.hasil }}
                    </span>
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
              {{ startIndex }} - {{ endIndex }} of {{ riwayatData.length }}
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
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>