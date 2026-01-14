<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import NavBar from "../bar/header-user.vue";
import Footer from "../bar/footer.vue";
import { 
  InformationCircleIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon 
} from "@heroicons/vue/24/solid";
import { api } from "../../services/api";

const router = useRouter();

// --- STATE MANAGEMENT ---
const searchInput = ref("");
const vehicleData = ref(null);
const p2hStatus = ref(null); 
const isAuthenticated = ref(false); 
const questions = ref([]);
const answers = ref({});
const loading = ref(false);
const isSubmitting = ref(false);

// State Metadata (Shift & Durasi)
const selectedShift = ref("");
const selectedDuration = ref("");
const currentShiftInfo = ref(null); // Info shift dari backend
const shiftWarning = ref(""); // Peringatan jika pilih shift salah

// --- LOGIKA BUSINESS ---

const checkAuthentication = () => {
  const token = localStorage.getItem('access_token');
  isAuthenticated.value = !!token;
};

const fetchCurrentShift = async () => {
  try {
    const response = await api.get('/p2h/current-shift');
    currentShiftInfo.value = response.data.payload;
    // Auto-select shift sesuai waktu sekarang
    selectedShift.value = currentShiftInfo.value.current_shift.toString();
  } catch (error) {
    console.error('❌ Gagal mendapatkan info shift:', error);
  }
};

const validateShiftTime = () => {
  if (!currentShiftInfo.value || !selectedShift.value) return true;
  
  const selected = selectedShift.value;
  const currentShiftNum = currentShiftInfo.value.current_shift;
  
  // Non-shift dan long shift punya aturan validasi berbeda
  if (selected === 'non-shift') {
    // Non-shift hanya bisa diisi saat Shift 1 (07:00-15:00)
    if (currentShiftNum !== 1) {
      shiftWarning.value = `⚠️ Non Shift hanya bisa diisi pada jam 06:30 - 15:00. Waktu sekarang: ${currentShiftInfo.value.shift_info.name}.`;
      return false;
    }
  } else if (selected === 'long-shift-1') {
    // Long Shift 1 bisa diisi dari jam 06:30 sampai 00:00 (Shift 1 dan Shift 2)
    if (currentShiftNum === 3) {
      shiftWarning.value = `⚠️ Long Shift 1 hanya bisa diisi pada jam 06:30 - 00:00. Waktu sekarang: ${currentShiftInfo.value.shift_info.name}.`;
      return false;
    }
  } else if (selected === 'long-shift-2') {
    // Long Shift 2 bisa diisi dari jam 23:30 sampai 07:00 (Shift 3)
    if (currentShiftNum !== 3) {
      shiftWarning.value = `⚠️ Long Shift 2 hanya bisa diisi pada jam 23:30 - 07:00. Waktu sekarang: ${currentShiftInfo.value.shift_info.name}.`;
      return false;
    }
  } else {
    // Regular shift validation
    const selectedShiftNum = parseInt(selected);
    if (selectedShiftNum !== currentShiftNum) {
      const currentInfo = currentShiftInfo.value.shift_info;
      shiftWarning.value = `⚠️ Waktu sekarang adalah ${currentInfo.name} (${currentInfo.time_range}). Anda hanya bisa mengisi P2H untuk shift tersebut.`;
      return false;
    }
  }
  
  shiftWarning.value = "";
  return true;
};

const normalizeVehicleNumber = (str) => {
  // Hapus titik, dash, spasi dan ubah ke uppercase
  // Mendukung format: P.309, p309, p-309, P 309, dll
  return str
    .trim() // Hapus spasi di awal dan akhir
    .replace(/[\s\-\.]/g, '') // Hapus semua spasi, dash, dan titik
    .toUpperCase(); // Ubah ke huruf besar
};

const validateVehicleInput = (input) => {
  // Normalisasi terlebih dahulu
  const normalized = normalizeVehicleNumber(input);
  
  // Cek apakah input kosong setelah normalisasi
  if (!normalized) {
    alert("Harap masukkan nomor lambung terlebih dahulu!");
    return false;
  }
  
  // Cek format dasar (minimal 2 karakter)
  if (normalized.length < 2) {
    alert("Nomor lambung minimal 2 karakter (contoh: P309)");
    return false;
  }
  
  return true;
};

const handleLoginRedirect = () => {
  alert("Kendaraan belum di-P2H. Silakan login terlebih dahulu untuk mengisi form P2H.");
  router.push('/login');
};

const handleSearchVehicle = async () => {
  const input = searchInput.value;
  
  // Validasi input
  if (!validateVehicleInput(input)) {
    return;
  }
  
  checkAuthentication();
  
  try {
    loading.value = true;
    const normalizedSearch = normalizeVehicleNumber(input);
    const response = await api.get(`/vehicles/lambung/${normalizedSearch}`);
    
    vehicleData.value = response.data.payload.vehicle;
    p2hStatus.value = {
      color: response.data.payload.color_code,
      completed: response.data.payload.p2h_completed_today,
      status: response.data.payload.status_p2h,
      canSubmit: response.data.payload.can_submit_p2h,
      message: response.data.payload.message,
      currentShift: response.data.payload.current_shift,
      shiftsCompleted: response.data.payload.shifts_completed
    };
    
    // Cek apakah shift SAAT INI sudah diisi
    const currentShiftDone = p2hStatus.value.shiftsCompleted.includes(p2hStatus.value.currentShift);
    
    // Jika shift saat ini sudah diisi, jangan tampilkan form
    if (currentShiftDone || !p2hStatus.value.canSubmit) {
      questions.value = [];
      return;
    }
    
    if (isAuthenticated.value) {
      await fetchChecklist(vehicleData.value.vehicle_type);
    } else {
      questions.value = []; 
    }
    
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Nomor lambung tidak ditemukan";
    alert(errorMsg);
    vehicleData.value = null;
    p2hStatus.value = null;
    questions.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchChecklist = async (vehicleType) => {
  try {
    const response = await api.get('/p2h/checklist-items');
    const allQuestions = response.data.payload;
    
    questions.value = allQuestions.filter(q => q.vehicle_tags && q.vehicle_tags.includes(vehicleType));
    
    questions.value = questions.value.map(q => ({
      ...q,
      pertanyaan: q.item_name,
      // Parse options: format "Text yang ditampilkan|Status"
      parsedOptions: q.options.map(opt => {
        if (opt.includes('|')) {
          const [displayText, status] = opt.split('|');
          return { displayText: displayText.trim(), status: status.trim() };
        }
        // Fallback jika tidak ada separator
        return { displayText: opt, status: 'Normal' };
      })
    }));
    
    questions.value.forEach((q) => {
      answers.value[q.id] = { status: "Normal", keterangan: "" };
    });
    
  } catch (error) {
    console.error("❌ Gagal memuat checklist", error);
  }
};

const handleSubmitReport = async () => {
  if (!vehicleData.value) return;

  // Validasi Shift Time Real-time
  if (!validateShiftTime()) {
    alert(shiftWarning.value);
    return;
  }

  // Validasi Dropdown Mandatory (untuk informasi user, tapi tidak dikirim ke backend)
  if (!selectedShift.value || !selectedDuration.value) {
    alert("Harap pilih Shift dan Durasi Pemakaian terlebih dahulu!");
    return;
  }

  // Validasi Checklist
  for (const qId in answers.value) {
    const ans = answers.value[qId];
    if ((ans.status === 'Abnormal' || ans.status === 'Warning') && !ans.keterangan.trim()) {
      alert(`Harap isi keterangan untuk item yang bermasalah!`);
      return;
    }
  }

  try {
    isSubmitting.value = true;
    
    // Backend auto-detect shift berdasarkan waktu submit
    // shift_number dan duration hanya untuk informasi user, tidak dikirim
    const payload = {
      vehicle_id: vehicleData.value.id,
      details: Object.keys(answers.value).map(id => ({
        checklist_item_id: id,
        status: answers.value[id].status.toLowerCase(), // Convert ke lowercase untuk backend
        keterangan: answers.value[id].keterangan
      }))
    };

    console.log('📤 Payload yang dikirim:', JSON.stringify(payload, null, 2));
    const response = await api.post("/p2h/submit", payload);
    alert(response.data.message || "Laporan P2H Berhasil Dikirim!");
    router.push("/"); 
    
  } catch (error) {
    console.error('❌ Submit error:', error.response?.data);
    alert("Error: " + (error.response?.data?.detail || "Gagal mengirim laporan"));
  } finally {
    isSubmitting.value = false;
  }
};

const groupedQuestions = computed(() => {
  return questions.value.reduce((acc, obj) => {
    const key = obj.section_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(obj);
    return acc;
  }, {});
});

// Helper styling untuk Radio Button sesuai Status
const getOptionClass = (id, opt) => {
  const currentStatus = answers.value[id]?.status;
  if (currentStatus !== opt) return 'bg-zinc-50 border-zinc-200 opacity-60';
  
  if (opt === 'Normal') return 'bg-green-100 border-green-400 ring-1 ring-green-400 opacity-100';
  if (opt === 'Abnormal') return 'bg-yellow-100 border-yellow-400 ring-1 ring-yellow-400 opacity-100';
  if (opt === 'Warning') return 'bg-red-100 border-red-400 ring-1 ring-red-400 opacity-100';
  return 'bg-zinc-50 border-zinc-200';
};

onMounted(() => {
  checkAuthentication();
  fetchCurrentShift(); // Fetch shift info saat component dimount
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat'] bg-zinc-50">
    <NavBar />

    <main 
      class="flex-1 flex flex-col items-center gap-3 sm:gap-4 bg-zinc-100 px-3 sm:px-4 pt-16 sm:pt-20 pb-30 sm:pb-30 bg-cover bg-fixed bg-center"
      style="background-image: url('/image_asset/BG_2.png')"
    >
      <div class="w-full max-w-4xl flex flex-col gap-3 sm:gap-4">
        
        <div class="p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-zinc-200">
          <h1 class="text-xl sm:text-2xl font-bold mb-1 text-black leading-tight">Selamat datang</h1>
          <p class="text-zinc-800 text-xs sm:text-sm leading-relaxed">
            Mohon mengisi informasi keadaan kendaraan hari ini sebelum anda bekerja atau sebelum memakai kendaraan di area PT Indominco Mandiri.
          </p>
        </div>

        <div class="p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-zinc-200 space-y-2">
          <h2 class="text-lg sm:text-xl font-bold text-zinc-800">Informasi kondisi kerusakan pada kendaraan pada keterangan dibawah :</h2>
          <div class="flex items-start gap-2 sm:gap-3 mb-3 p-2 sm:p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <InformationCircleIcon class="h-4 w-4 text-red-600 shrink-0 mt-0.5"/>
            <p class="text-red-700 font-medium text-[10px] sm:text-xs leading-relaxed">
              Jika memilih status <span class="font-bold">Abnormal</span> atau <span class="font-bold">Warning</span>, pengguna wajib mengisi keterangan kerusakan sebagai informasi tambahan.
            </p>
          </div>
          <div class="space-y-3 sm:space-y-4 pt-2">
            <div>
              <span class="px-3 sm:px-4 py-1 sm:py-1.5 bg-green-200 text-green-900 rounded-full text-xs sm:text-sm font-black ">NORMAL</span>
              <p class="text-gray-800 text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium italic">Bagian kendaraan dalam kondisi baik dan berfungsi normal tanpa ditemukan kerusakan.</p>
            </div>
            <div>
              <span class="px-3 sm:px-4 py-1 sm:py-1.5 bg-yellow-200 text-yellow-900 rounded-full text-xs sm:text-sm font-black tracking-wide">ABNORMAL</span>
              <p class="text-gray-800 text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium italic">Bagian kendaraan terdapat kerusakan ringan, namun masih dapat digunakan dan perlu dilakukan pemeriksaan atau perbaikan di bengkel.</p>
            </div>
            <div>
              <span class="px-3 sm:px-4 py-1 sm:py-1.5 bg-red-200 text-red-900 rounded-full text-xs sm:text-sm font-black tracking-wide">WARNING</span>
              <p class="text-gray-800 text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium italic">Bagian kendaraan mengalami kerusakan serius, tidak dapat digunakan dan harus segera dibawa ke bengkel untuk penanganan lebih lanjut.</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 font-bold">
          <!-- Info Waktu Real-Time -->
          <div v-if="currentShiftInfo" class="p-3 sm:p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl">
            <div class="flex items-start sm:items-center gap-2 text-blue-900">
              <InformationCircleIcon class="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 sm:mt-0"/>
              <p class="text-xs sm:text-sm font-bold">
                Waktu Sekarang: <span class="font-black">{{ currentShiftInfo.current_time }}</span> - 
                {{ currentShiftInfo.shift_info.name }} ({{ currentShiftInfo.shift_info.time_range }})
              </p>
            </div>
            <p class="text-[10px] sm:text-xs ml-2 text-blue-700 mt-1 font-semibold">
              Toleransi pengisian: 30 menit sebelum shift (mulai {{ currentShiftInfo.shift_info.tolerance_start }})
            </p>
          </div>

          <!-- Warning jika pilih shift yang salah -->
          <div v-if="shiftWarning" class="p-3 sm:p-4 bg-red-50 border-2 border-red-400 rounded-2xl">
            <div class="flex items-start sm:items-center gap-2 text-red-900">
              <ExclamationTriangleIcon class="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 sm:mt-0"/>
              <p class="text-xs sm:text-sm font-bold">{{ shiftWarning }}</p>
            </div>
          </div>

          <div class="p-4 bg-white rounded-2xl shadow-sm border border-zinc-200">
            <label class="block text-xs sm:text-sm mb-2 text-zinc-900 font-semibold">Apakah anda kerja Shift / Non-Shift</label>
            <div class="relative">
              <select v-model="selectedShift" @change="validateShiftTime" class="w-full p-2 sm:p-2.5 bg-white border-2 border-zinc-300 rounded-lg appearance-none outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm font-semibold text-zinc-900 cursor-pointer hover:border-purple-400 transition-colors">
                <option value="" disabled class="text-zinc-500">Pilih Shift</option>
                <option value="1" class="text-zinc-900">Shift 1 (07:00 - 15:00)</option>
                <option value="2" class="text-zinc-900">Shift 2 (15:00 - 23:00)</option>
                <option value="3" class="text-zinc-900">Shift 3 (23:00 - 07:00)</option>
                <option value="non-shift" class="text-zinc-900">Non Shift (07:00 - 15:00)</option>
                <option value="long-shift-1" class="text-zinc-900">Long Shift 1 (07:00 - 00:00)</option>
                <option value="long-shift-2" class="text-zinc-900">Long Shift 2 (00:00 - 07:00)</option>
              </select>
              <ChevronDownIcon class="h-4 w-4 sm:h-5 sm:w-5 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none"/>
            </div>
          </div>
          <div class="p-4 bg-white rounded-2xl shadow-sm border border-zinc-200">
            <label class="block text-xs sm:text-sm mb-2 text-zinc-900 font-semibold">Rencana durasi pemakaian kendaraan</label>
            <div class="relative">
              <select v-model="selectedDuration" class="w-full p-2 sm:p-2.5 bg-white border-2 border-zinc-300 rounded-lg appearance-none outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm font-semibold text-zinc-900 cursor-pointer hover:border-purple-400 transition-colors">
                <option value="" disabled selected class="text-zinc-500">Pilih Durasi</option>
                <option value="<8h" class="text-zinc-900">&lt;8 Jam</option>
                <option value="8h" class="text-zinc-900">8 Jam</option>
                <option value=">8h" class="text-zinc-900">&gt;8 Jam</option>
              </select>
              <ChevronDownIcon class="h-4 w-4 sm:h-5 sm:w-5 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none"/>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-zinc-200 space-y-4 sm:space-y-5">
          <div>
            <h2 class="text-base sm:text-lg font-black text-zinc-900 mb-2">Jenis Kendaraan</h2>
            <div class="h-1 bg-purple-600 rounded-full"></div>
          </div>
          <div class="flex gap-1 sm:gap-2 flex-col sm:flex-row">
            <input 
              v-model="searchInput" 
              @keyup.enter="handleSearchVehicle"
              :disabled="loading"
              placeholder="Masukkan nomor lambung (P.309)" 
              class="flex-1 p-2 sm:p-2.5 bg-white border-2 border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-semibold text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 disabled:bg-zinc-100 disabled:opacity-50" 
            />
            <button 
              @click="handleSearchVehicle" 
              :disabled="loading"
              class="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-lg font-bold text-sm sm:text-sm flex items-center justify-center sm:justify-start gap-2 transition-all shadow-md active:scale-95 disabled:bg-zinc-400 disabled:shadow-none"
            >
              {{ loading ? '...' : 'Cari' }} <MagnifyingGlassIcon class="h-3 w-3 sm:h-4 sm:w-4"/>
            </button>
          </div>

          <div v-if="vehicleData" 
               :class="['p-4 sm:p-6 rounded-2xl border-2 transition-all', 
               p2hStatus?.color === 'green' ? 'bg-green-50 border-green-400' : 
               p2hStatus?.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' : 
               'bg-red-50 border-red-400']">
            <div class="space-y-1 sm:space-y-1.5">
              <p class="text-xs sm:text-sm font-semibold" :class="p2hStatus?.color === 'green' ? 'text-green-900' : p2hStatus?.color === 'yellow' ? 'text-yellow-900' : 'text-red-900'">
                Nomor lambung : <span class="font-normal text-zinc-700">{{ vehicleData.no_lambung }}</span>
              </p>
              <p class="text-xs sm:text-sm font-semibold" :class="p2hStatus?.color === 'green' ? 'text-green-900' : p2hStatus?.color === 'yellow' ? 'text-yellow-900' : 'text-red-900'">
                Warna nomor lambung : <span class="font-normal text-zinc-700">{{ vehicleData.warna_no_lambung || '-' }}</span>
              </p>
              <p class="text-xs sm:text-sm font-semibold" :class="p2hStatus?.color === 'green' ? 'text-green-900' : p2hStatus?.color === 'yellow' ? 'text-yellow-900' : 'text-red-900'">
                Merek Kendaraan : <span class="font-normal text-zinc-700">{{ vehicleData.merk }}</span>
              </p>
              <p class="text-xs sm:text-sm font-semibold" :class="p2hStatus?.color === 'green' ? 'text-green-900' : p2hStatus?.color === 'yellow' ? 'text-yellow-900' : 'text-red-900'">
                Tipe Kendaraan : <span class="font-normal text-zinc-700">{{ vehicleData.vehicle_type }}</span>
              </p>
              <p class="text-xs sm:text-sm font-semibold" :class="p2hStatus?.color === 'green' ? 'text-green-900' : p2hStatus?.color === 'yellow' ? 'text-yellow-900' : 'text-red-900'">
                Plat Kendaraan : <span class="font-normal text-zinc-700">{{ vehicleData.plat_nomor }}</span>
              </p>
              <div class="mt-2 sm:mt-2.5 pt-2 sm:pt-2.5 border-t-2" :class="p2hStatus?.color === 'green' ? 'border-green-200' : p2hStatus?.color === 'yellow' ? 'border-yellow-200' : 'border-red-200'">
                <p class="text-[10px] sm:text-xs font-bold" :class="p2hStatus?.color === 'green' ? 'text-green-900' : p2hStatus?.color === 'yellow' ? 'text-yellow-900' : 'text-red-900'">
                  Status P2H: <span class="font-semibold">{{ p2hStatus?.message || p2hStatus?.status }}</span>
                </p>
                <p v-if="p2hStatus?.shiftsCompleted && p2hStatus.shiftsCompleted.length > 0" class="text-[9px] sm:text-[11px] mt-1" :class="p2hStatus?.color === 'green' ? 'text-green-700' : p2hStatus?.color === 'yellow' ? 'text-yellow-700' : 'text-red-700'">
                  Shift yang sudah di-P2H: Shift {{ p2hStatus.shiftsCompleted.join(', Shift ') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Konten Data pertanyaan -->
        <section v-if="p2hStatus?.color !== 'green' && isAuthenticated && questions.length > 0" class="space-y-4 sm:space-y-6 w-full">
          <div v-for="(items, section) in groupedQuestions" :key="section" class="p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-zinc-200 space-y-2 sm:space-y-3">
            <h3 class="text-base sm:text-lg font-black text-zinc-900 border-b-2 border-zinc-100 pb-2 sm:pb-3">{{ vehicleData?.vehicle_type || section }}</h3>
            
            <div v-for="q in items" :key="q.id" class="space-y-2 sm:space-y-2.5">
              <p class="font-bold text-zinc-800 text-sm sm:text-lg">{{ q.pertanyaan }}</p>
              
              <div class="grid grid-cols-1 gap-2 sm:gap-2">
                <label 
                  v-for="opt in q.parsedOptions" :key="opt.status"
                  :class="['flex items-center p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-200', getOptionClass(q.id, opt.status)]"
                >
                  <input type="radio" v-model="answers[q.id].status" :value="opt.status" class="hidden" />
                  
                  <div :class="['w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center mr-2 sm:mr-3 transition-colors shrink-0', 
                    answers[q.id].status === opt.status ? 'border-purple-600 bg-white' : 'border-zinc-400']">
                    <div v-if="answers[q.id].status === opt.status" class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-purple-600 rounded-full animate-pulse"></div>
                  </div>
                  
                  <span class="font-medium text-xs sm:text-sm text-zinc-900">{{ opt.displayText }}</span>
                </label>
              </div>

              <div v-if="answers[q.id].status !== 'Normal'" class="mt-2 sm:mt-3 space-y-1.5">
                <textarea 
                  v-model="answers[q.id].keterangan" 
                  placeholder="Keterangan kerusakan" 
                  class="w-full p-2 sm:p-3 bg-white border-2 border-zinc-300 rounded-lg text-xs sm:text-sm font-regular text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none"
                  rows="2"
                ></textarea>
                <div class="flex items-center gap-1 text-[9px] sm:text-[10px] text-red-500 font-bold italic">
                  <ExclamationTriangleIcon class="h-3 w-3"/> HARAP ISI KETERANGAN KERUSAKAN
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mb-2">
            <button 
              @click="handleSubmitReport" 
              :disabled="isSubmitting"
              class="px-10 sm:px-10 py-2.5 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all active:scale-95 disabled:bg-zinc-400 disabled:shadow-sm flex items-center justify-center w-auto sm:w-auto"
            >
              {{ isSubmitting ? 'MENGIRIM...' : 'Kirim' }}
            </button>
          </div>
        </section>

      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Transisi halus untuk elemen form */
label {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

select {
  cursor: pointer;
}

/* Responsivitas untuk mobile */
@media (max-width: 640px) {
  /* Ensure proper readability on small screens */
  main {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  /* Adjust spacing between sections */
  .flex-col {
    gap: 0.75rem;
  }
}

/* Tablet dan lebih besar */
@media (min-width: 641px) {
  main {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Touch-friendly button sizes */
@media (max-width: 768px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
  
  input, select, textarea {
    min-height: 44px;
  }
}
</style>