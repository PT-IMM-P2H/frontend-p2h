<script setup>
import Aside from "../bar/aside.vue";
import HeaderAdmin from "../bar/header_admin.vue";
import { UserIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref, nextTick, watch, provide } from "vue";
import Chart from "chart.js/auto";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

let chartInstance = null;

// Variables for date inputs
const a = ref("2025-01");
const u = ref("2026-01");

// Mobile menu state
const isMobileMenuOpen = ref(false);

// Provide mobile menu toggle function
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

provide('toggleMobileMenu', toggleMobileMenu);

// Data dummy untuk box statistik
const statisticsData = {
  totalVehicles: 120,
  totalNormal: 100,
  totalAbnormal: 15,
  totalWarning: 5,
  totalCompletedP2H: 95,
  totalPendingP2H: 25
};

// Variables for vehicle type dropdown
const isVehicleTypeOpen = ref(false);
const selectedVehicleType = ref("");
const vehicleTypes = [
  "Light Vehicle",
  "Electric Vehicle",
  "Double Cabin",
  "Single Cabin",
  "Bus",
  "Ambulance",
];

const vehicleDataByMonth = {
  "Januari": [35, 8, 2],
  "Februari": [40, 10, 2],
  "Maret": [38, 8, 2],
  "April": [45, 12, 4],
  "Mei": [42, 10, 3],
  "Juni": [50, 13, 4],
  "Juli": [55, 14, 3],
  "Agustus": [52, 12, 4],
  "September": [58, 13, 3],
  "Oktober": [62, 14, 3],
  "November": [68, 14, 3],
  "Desember": [75, 15, 2],
};

// Convert monthly data to Chart.js format
const convertMonthlyDataToChartFormat = (monthlyData) => {
  const months = Object.keys(monthlyData);
  const normalData = [];
  const abnormalData = [];
  const warningData = [];

  months.forEach(month => {
    const [normal, abnormal, warning] = monthlyData[month];
    normalData.push(normal);
    abnormalData.push(abnormal);
    warningData.push(warning);
  });

  return {
    labels: months,
    datasets: [
      {
        label: "Normal",
        data: normalData,
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
        label: "Abnormal",
        data: abnormalData,
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
        label: "Warning",
        data: warningData,
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
};

const vehicleData = convertMonthlyDataToChartFormat(vehicleDataByMonth);

// Function untuk menghitung nilai maksimal dari data dan tambahkan 20
const getMaxValue = (data) => {
  let max = 0;
  data.datasets.forEach(dataset => {
    const datasetMax = Math.max(...dataset.data);
    if (datasetMax > max) max = datasetMax;
  });
  return max + 20;
};

const getChartOptions = (data) => {
  const maxValue = getMaxValue(data);
  
  return {
  responsive: true,
  maintainAspectRatio: false,
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
      display: false,
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
      max: maxValue,
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
      options: getChartOptions(vehicleData),
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
      <!-- Aside dengan props untuk mobile control -->
      <div class="hidden lg:block fixed lg:relative w-62 h-screen">
        <Aside :isOpen="true" :onClose="() => {}" />
      </div>
      <!-- Mobile aside overlay -->
      <div class="block lg:hidden">
        <Aside :isOpen="isMobileMenuOpen" :onClose="toggleMobileMenu" />
      </div>

      <div class="flex flex-col flex-1 lg:ml-0">
        <HeaderAdmin />

        <!-- Konten Utama -->
        <main
          class="bg-[#EFEFEF] flex-1 flex items-start justify-center overflow-y-auto p-1 sm:p-1 md:p-2 lg:p-1"
        >
          <div class="w-full p-2">
            <!-- 6 Konten Sejajar -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
              <!-- Box 1 -->
              <div
                class="bg-white rounded-lg shadow-md p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 min-h-1"
              >
                <UserIcon class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black shrink-0 mt-0.5" />
                <div class="flex flex-col flex-1 min-w-0">
                  <p class="text-xs font-regular text-gray-500 truncate">
                    {{ t('dashboard.totalVehicles') }}
                  </p>
                  <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black mt-0.5 sm:mt-1">{{ statisticsData.totalVehicles }}</h3>
                </div>
              </div>

              <!-- Box 2 -->
              <div
                class="bg-white rounded-lg shadow-md p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 min-h-1"
              >
                <UserIcon class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black shrink-0 mt-0.5" />
                <div class="flex flex-col flex-1 min-w-0">
                  <p class="text-xs font-regular text-gray-500 truncate">
                    {{ t('dashboard.totalNormal') }}
                  </p>
                  <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black mt-0.5 sm:mt-1">{{ statisticsData.totalNormal }}</h3>
                </div>
              </div>

              <!-- Box 3 -->
              <div
                class="bg-white rounded-lg shadow-md p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 min-h-1"
              >
                <UserIcon class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black shrink-0 mt-0.5" />
                <div class="flex flex-col flex-1 min-w-0">
                  <p class="text-xs font-regular text-gray-500 truncate">
                    {{ t('dashboard.totalAbnormal') }}
                  </p>
                  <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black mt-0.5 sm:mt-1">{{ statisticsData.totalAbnormal }}</h3>
                </div>
              </div>

              <!-- Box 4 -->
              <div
                class="bg-white rounded-lg shadow-md p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 min-h-1"
              >
                <UserIcon class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black shrink-0 mt-0.5" />
                <div class="flex flex-col flex-1 min-w-0">
                  <p class="text-xs font-regular text-gray-500 truncate">
                    {{ t('dashboard.totalWarning') }}
                  </p>
                  <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black mt-0.5 sm:mt-1">{{ statisticsData.totalWarning }}</h3>
                </div>
              </div>

              <!-- Box 5 -->
              <div
                class="bg-white rounded-lg shadow-md p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 min-h-1"
              >
                <UserIcon class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black shrink-0 mt-0.5" />
                <div class="flex flex-col flex-1 min-w-0">
                  <p class="text-xs font-regular text-gray-500 truncate">
                    {{ t('dashboard.totalCompletedP2H') }}
                  </p>
                  <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black mt-0.5 sm:mt-1">{{ statisticsData.totalCompletedP2H }}</h3>
                </div>
              </div>

              <!-- Box 6 -->
              <div
                class="bg-white rounded-lg shadow-md p-1.5 sm:p-2 flex items-start gap-1.5 sm:gap-2 min-h-1"
              >
                <UserIcon class="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-black shrink-0 mt-0.5" />
                <div class="flex flex-col flex-1 min-w-0">
                  <p class="text-xs font-regular text-gray-500 truncate">
                    {{ t('dashboard.totalPendingP2H') }}
                  </p>
                  <h3 class="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black mt-0.5 sm:mt-1">{{ statisticsData.totalPendingP2H }}</h3>
                </div>
              </div>
            </div>

            <!-- Konten kedua -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-2 mt-2 sm:mt-3 md:mt-4">
              <div class="flex flex-col w-full gap-2 sm:gap-3">
                <!-- Konten Kiri -->
                <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
                  <h2 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                    {{ t('dashboard.filterDay') }}
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div>
                      <label
                        class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                        >{{ t('dashboard.startDate') }}</label
                      >
                      <input
                        v-model="a"
                        type="date"
                        class="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-[#C3C3C3] bg-[#ffffff] text-[#777777] rounded-md cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                        >{{ t('dashboard.endDate') }}</label
                      >
                      <input
                        v-model="u"
                        type="date"
                        class="w-full p-1.5 sm:p-2 text-xs sm:text-sm border border-[#C3C3C3] bg-[#ffffff] text-[#777777] rounded-md cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      class="w-full p-1.5 sm:p-2 bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      {{ t('dashboard.applyFilter') }}
                    </button>
                    <button
                      type="button"
                      class="w-full p-1.5 sm:p-2 bg-gray-300 text-gray-700 text-xs sm:text-sm font-semibold rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                      {{ t('dashboard.resetFilter') }}
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
                      {{ selectedVehicleType || t('dashboard.vehicleType') }}
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
                      {{ t('dashboard.statusVehicleType') }} {{ selectedVehicleType || t('dashboard.vehicleType') }}
                    </h3>
                    <div class="h-80 w-full">
                      <div v-if="!selectedVehicleType" class="h-full flex items-center justify-center">
                        <p class="text-gray-400 text-center font-medium">{{ t('dashboard.selectFilter') }}</p>
                      </div>
                      <canvas v-else id="chart-pie-vehicle-type"></canvas>
                    </div>
                  </div>

                  <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-md font-bold text-gray-800 mb-4">
                      {{ t('dashboard.p2hResults') }}
                    </h3>
                    <div class="h-80 w-full">
                      <canvas id="chart-pie-hasil"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Konten Tahunan -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-bold text-gray-800 mb-2">
                  {{ t('dashboard.p2hAnnualChart') }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >{{ t('dashboard.startPeriod') }}</label
                    >
                    <input
                      v-model="a"
                      type="month"
                      placeholder="Januari 2025"
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#ffffff] text-[#777777] rounded-md cursor-pointer"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >{{ t('dashboard.endPeriod') }}</label
                    >
                    <input
                      v-model="u"
                      type="month"
                      placeholder="Januari 2026"
                      class="w-full p-2 text-sm border border-[#C3C3C3] bg-[#ffffff] text-[#777777] rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                <!-- Grafik tahunan -->
                <div class="mt-5">
                  <div
                    class="w-full bg-linear-to-br h-full from-gray-100 to-gray-50 rounded-lg border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div class="flex items-center justify-between mb-6">
                      <div>
                        <h6 class="text-gray-900 font-bold text-lg">
                          {{ t('dashboard.vehicleStatusMonthly') }}
                        </h6>
                      </div>
                    </div>
                    <div class="w-full h-80 relative">
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
                            >{{ t('dashboard.normal') }}</span
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
                            >{{ t('dashboard.abnormal') }}</span
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
                            >{{ t('dashboard.warning') }}</span
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
