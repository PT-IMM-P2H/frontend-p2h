<script setup>
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header_admin.vue";
import { UserIcon, ArrowUpIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref, nextTick, watch } from "vue";
import Chart from "chart.js/auto";

let chartInstance = null;

// Variables for date inputs
const a = ref("1 Januari 2025");
const u = ref("1 Januari 2026");

// Variables for vehicle type dropdown
const isVehicleTypeOpen = ref(false);
const selectedVehicleType = ref("");
const vehicleTypes = [
  "Light Vehicle",
  "Electric Vehicle"
];

const vehicleData = {
  labels: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  datasets: [
    {
      label: "Normal (Hijau)",
      data: [35, 40, 38, 45, 42, 50, 55, 52, 58, 62, 68, 75],
      borderColor: "#10B981",
      backgroundColor: "rgba(16, 185, 129, 0.08)",
      borderWidth: 3,
      tension: 0.5,
      fill: true,
      pointBackgroundColor: "#10B981",
      pointBorderColor: "#fff",
      pointBorderWidth: 1,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      segment: {
        borderDash: [],
      },
    },
    {
      label: "Abnormal (Kuning)",
      data: [8, 10, 8, 12, 10, 13, 14, 12, 13, 14, 14, 15],
      borderColor: "#F59E0B",
      backgroundColor: "rgba(245, 158, 11, 0.08)",
      borderWidth: 3,
      tension: 0.5,
      fill: true,
      pointBackgroundColor: "#F59E0B",
      pointBorderColor: "#fff",
      pointBorderWidth: 1,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      segment: {
        borderDash: [],
      },
    },
    {
      label: "Warning (Merah)",
      data: [2, 2, 2, 4, 3, 4, 3, 4, 3, 3, 3, 2],
      borderColor: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      borderWidth: 3,
      tension: 0.5,
      fill: true,
      pointBackgroundColor: "#EF4444",
      pointBorderColor: "#fff",
      pointBorderWidth: 1,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 3,
      segment: {
        borderDash: [],
      },
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 2000,
    easing: "easeInOutQuart",
    delay: (context) => {
      let delay = 0;
      if (context.type === "data") {
        delay = context.dataIndex * 50 + context.datasetIndex * 100;
      }
      return delay;
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 5,
        font: {
          size: 13,
          weight: "600",
          family: "'Montserrat', sans-serif",
        },
        color: "#374151",
      },
    },
    filler: {
      propagate: true,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      padding: 14,
      titleFont: {
        size: 14,
        weight: "600",
      },
      bodyFont: {
        size: 13,
      },
      borderColor: "#3B82F6",
      borderWidth: 1,
      displayColors: true,
      padding: {
        top: 12,
        left: 14,
        right: 14,
        bottom: 12,
      },
      caretSize: 8,
      caretPadding: 12,
      cornerRadius: 6,
      callbacks: {
        label: function (context) {
          return " Kendaraan: " + context.parsed.y;
        },
        afterLabel: function (context) {
          const data = context.parsed.y;
          const previous =
            context.dataIndex > 0
              ? context.chart.data.datasets[0].data[context.dataIndex - 1]
              : data;
          const change = data - previous;
          const changeText =
            change > 0
              ? `↑ +${change}`
              : change < 0
              ? `↓ ${change}`
              : "→ Stabil";
          return changeText;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
        font: {
          size: 12,
          weight: "500",
        },
        color: "#6B7280",
        padding: 8,
      },
      grid: {
        color: "rgba(200, 200, 200, 10)",
        drawBorder: false,
        lineWidth: 1,
      },
      border: {
        display: false,
      },
    },
    x: {
      ticks: {
        font: {
          size: 12,
          weight: "500",
        },
        color: "#6B7280",
        padding: 8,
      },
      grid: {
        display: false,
        drawBorder: false,
      },
      border: {
        display: false,
      },
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
};

let pieChartInstance = null;
let vehicleTypeChartInstance = null;

const vehicleTypeChartData = {
  "Light Vehicle": {
    labels: ["Normal", "Abnormal", "Warning"],
    datasets: [{
      data: [100, 8, 2],
      backgroundColor: [
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(239, 68, 68, 0.7)",
      ],
      borderColor: [
        "rgba(16, 185, 129, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)",
      ],
      borderWidth: 2,
    }]
  },
  "Electric Vehicle": {
    labels: ["Normal", "Abnormal", "Warning"],
    datasets: [{
      data: [38, 10, 5],
      backgroundColor: [
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(239, 68, 68, 0.7)",
      ],
      borderColor: [
        "rgba(16, 185, 129, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)",
      ],
      borderWidth: 2,
    }]
  }
};

const pieChartData = {
  labels: ["Normal", "Abnormal", "Warning"],
  datasets: [
    {
      data: [15, 3, 1],
      backgroundColor: [
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(239, 68, 68, 0.7)",
      ],
      borderColor: [
        "rgba(16, 185, 129, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(239, 68, 68, 1)",
      ],
      borderWidth: 2,
    },
  ],
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 12,
          weight: "500",
        },
        padding: 20,
        color: "#374151",
        generateLabels: (chart) => {
          const data = chart.data;
          const dataset = data.datasets[0];
          const total = dataset.data.reduce((a, b) => a + b, 0);

          return data.labels.map((label, index) => {
            const value = dataset.data[index];
            const percentage = ((value / total) * 100).toFixed(1);
            return {
              text: `: ${label} ${percentage}%`,
              fillStyle: dataset.backgroundColor[index],
              strokeStyle: dataset.borderColor[index],
              borderWidth: 2,
              hidden: false,
              index: index,
              pointStyle: "circle",
            };
          });
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      padding: 12,
      titleFont: {
        size: 13,
        weight: "600",
      },
      bodyFont: {
        size: 12,
      },
      borderColor: "#10B981",
      borderWidth: 1,
      cornerRadius: 6,
      callbacks: {
        label: function (context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const value = context.parsed;
          const percentage = ((value / total) * 100).toFixed(1);
          return context.label + ": " + value + " unit (" + percentage + "%)";
        },
      },
    },
  },
};

const initChart = async () => {
  // Tunggu DOM ready
  await nextTick();

  const canvas = document.getElementById("chart-vehicles");
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // Create new chart
  try {
    chartInstance = new Chart(canvas, {
      type: "line",
      data: vehicleData,
      options: chartOptions,
    });
  } catch (error) {
    console.error("Error creating chart:", error);
  }
};

const initPieChart = async () => {
  // Tunggu DOM ready
  await nextTick();

  const pieCanvas = document.getElementById("chart-pie-hasil");
  if (!pieCanvas) {
    console.error("Pie chart canvas element not found");
    return;
  }

  // Destroy existing pie chart if it exists
  if (pieChartInstance) {
    pieChartInstance.destroy();
    pieChartInstance = null;
  }

  // Create new pie chart
  try {
    pieChartInstance = new Chart(pieCanvas, {
      type: "pie",
      data: pieChartData,
      options: pieChartOptions,
    });
  } catch (error) {
    console.error("Error creating pie chart:", error);
  }
};

const initVehicleTypeChart = async () => {
  // Destroy existing chart if it exists
  if (vehicleTypeChartInstance) {
    vehicleTypeChartInstance.destroy();
    vehicleTypeChartInstance = null;
  }

  // Jika belum dipilih, jangan buat chart
  if (!selectedVehicleType.value) {
    return;
  }

  // Tunggu DOM ready
  await nextTick();

  const vehicleTypeCanvas = document.getElementById("chart-pie-vehicle-type");
  if (!vehicleTypeCanvas) {
    console.error("Vehicle type chart canvas element not found");
    return;
  }

  // Get data berdasarkan selectedVehicleType
  const chartData = vehicleTypeChartData[selectedVehicleType.value];

  // Create new chart
  try {
    vehicleTypeChartInstance = new Chart(vehicleTypeCanvas, {
      type: "pie",
      data: chartData,
      options: pieChartOptions,
    });
  } catch (error) {
    console.error("Error creating vehicle type chart:", error);
  }
};

// Watch selectedVehicleType untuk update chart
watch(selectedVehicleType, () => {
  initVehicleTypeChart();
});

onMounted(() => {
  initChart();
  initPieChart();
  initVehicleTypeChart();
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <div class="flex flex-1">
      <Aside />

      <div class="flex flex-col flex-1 ml-62">
        <HeaderAdmin />

        <!-- Konten Utama -->
        <main
          class="bg-[#EFEFEF] flex-1 flex items-start justify-center overflow-y-auto p-3"
        >
          <div class="w-full">
            <!-- 6 Konten Sejajar -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
              <!-- Box 1 -->
              <div
                class="bg-white rounded-lg shadow-md p-2 flex items-start gap-2 min-h-1"
              >
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-regular text-gray-500">
                    Total unit kendaraan
                  </p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>

              <!-- Box 2 -->
              <div
                class="bg-white rounded-lg shadow-md p-2 flex items-start gap-2 min-h-1"
              >
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-regular text-gray-500">
                    Total status normal
                  </p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>

              <!-- Box 3 -->
              <div
                class="bg-white rounded-lg shadow-md p-2 flex items-start gap-2 min-h-1"
              >
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-regular text-gray-500">
                    Total status abnromal
                  </p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>

              <!-- Box 4 -->
              <div
                class="bg-white rounded-lg shadow-md p-2 flex items-start gap-2 min-h-1"
              >
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-regular text-gray-500">
                    Total status warning
                  </p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>

              <!-- Box 5 -->
              <div
                class="bg-white rounded-lg shadow-md p-2 flex items-start gap-2 min-h-1"
              >
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-regular text-gray-500">
                    Total unit sudah P2H
                  </p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>

              <!-- Box 6 -->
              <div
                class="bg-white rounded-lg shadow-md p-2 flex items-start gap-2 min-h-1"
              >
                <UserIcon class="w-8 h-8 text-black shrink-0 mt-1" />
                <div class="flex flex-col flex-1">
                  <p class="text-xs font-regular text-gray-500">
                    Total unit belum P2H
                  </p>
                  <h3 class="text-md font-bold text-black mt-1">Total</h3>
                </div>
              </div>
            </div>

            <!-- Konten kedua -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div class="flex flex-col w-full max-w-5xl gap-2">
                <!-- Konten Kiri -->
                <div class="bg-white rounded-lg shadow-md p-6">
                  <h2 class="text-lg font-bold text-gray-800 mb-4">
                    Filter hari
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Tanggal Mulai</label
                      >
                      <input
                        v-model="a"
                        type="date"
                        class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#ffffff] text-[#777777] rounded-md cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Tanggal Akhir</label
                      >
                      <input
                        v-model="u"
                        type="date"
                        class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#ffffff] text-[#777777] rounded-md cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      class="w-full p-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Terapkan Filter
                    </button>
                    <button
                      type="button"
                      class="w-full p-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>

                <!-- Tipe kendaraan -->
                <div class="w-full relative">
                  <button 
                    @click="isVehicleTypeOpen = !isVehicleTypeOpen"
                    class="w-full bg-white rounded-lg shadow-md p-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <p class="text-sm font-semibold text-gray-800">
                      {{ selectedVehicleType || "Tipe Kendaraan" }}
                    </p>
                    <ChevronDownIcon 
                      :class="['w-5 h-5 text-gray-800 transition-transform duration-200', isVehicleTypeOpen && 'rotate-180']" 
                    />
                  </button>

                  <!-- Dropdown Menu -->
                  <div 
                    v-if="isVehicleTypeOpen"
                    class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  >
                    <button
                      v-for="type in vehicleTypes"
                      :key="type"
                      @click="selectedVehicleType = type; isVehicleTypeOpen = false"
                      class="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors duration-150 text-sm font-medium text-gray-800 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {{ type }}
                    </button>
                  </div>
                </div>

                <!-- Konten Kiri kedua -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-md font-bold text-gray-800 mb-4">
                      Status {{ selectedVehicleType || 'Tipe Kendaraan' }}
                    </h3>
                    <div class="h-74 w-full">
                      <div v-if="!selectedVehicleType" class="h-full flex items-center justify-center">
                        <p class="text-gray-400 text-center font-medium">Pilih filter untuk menampilkan</p>
                      </div>
                      <canvas v-else id="chart-pie-vehicle-type"></canvas>
                    </div>
                  </div>

                  <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-md font-bold text-gray-800 mb-4">
                      Hasil P2H
                    </h3>
                    <div class="h-74 w-full">
                      <canvas id="chart-pie-hasil"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Konten Tahunan -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-bold text-gray-800 mb-2">
                  Grafik P2H Tahunan
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Periode Awal</label
                    >
                    <input
                      v-model="a"
                      type="text"
                      placeholder="1 Januari 2025"
                      disabled
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Periode Akhir</label
                    >
                    <input
                      v-model="u"
                      type="text"
                      placeholder="1 Januari 2026"
                      disabled
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#EEEEEE] text-[#777777] rounded-md cursor-not-allowed"
                    />
                  </div>
                </div>

                <!-- Grafik tahunan -->
                <div class="mt-4">
                  <div
                    class="w-full bg-linear-to-br from-gray-100 to-gray-50 rounded-lg border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div class="flex items-center justify-between mb-6">
                      <div>
                        <h6 class="text-gray-900 font-bold text-lg">
                          Status Kendaraan Per Bulan
                        </h6>
                        <p class="text-sm text-gray-600 leading-normal mt-1">
                          <ArrowUpIcon
                            class="inline w-4 h-4 text-lime-500 mr-1"
                          />
                          <span class="font-semibold text-gray-800"
                            >12% lebih tinggi</span
                          >
                          <span class="text-gray-500"> dari tahun lalu</span>
                        </p>
                      </div>
                    </div>
                    <div class="w-full h-70 relative">
                      <canvas id="chart-vehicles"></canvas>
                    </div>
                    <div
                      class="flex gap-1 pt-6 border-t border-gray-200 justify-center"
                    >
                      <div class="text-center">
                        <div
                          class="flex items-center justify-center gap-2 mb-2"
                        >
                          <div class="w-3 h-3 rounded-full bg-green-500"></div>
                          <span class="text-xs mr-3 font-semibold text-gray-600"
                            >Normal</span
                          >
                        </div>
                        <p class="text-xl font-bold text-green-600">75</p>
                      </div>
                      <div class="text-center">
                        <div
                          class="flex items-center justify-center gap-2 mb-2"
                        >
                          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span class="text-xs mr-3 font-semibold text-gray-600"
                            >Abnormal</span
                          >
                        </div>
                        <p class="text-xl font-bold text-yellow-600">15</p>
                      </div>
                      <div class="text-center">
                        <div
                          class="flex items-center justify-center gap-2 mb-2"
                        >
                          <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          <span class="text-xs font-semibold text-gray-600"
                            >Warning</span
                          >
                        </div>
                        <p class="text-xl font-bold text-red-600">2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
