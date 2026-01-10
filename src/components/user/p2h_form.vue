<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import NavBar from "../bar/header-user.vue";
import Footer from "../bar/footer.vue";
import { 
  InformationCircleIcon, 
  MagnifyingGlassIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from "@heroicons/vue/24/solid";
import { api } from "../../services/api";

const router = useRouter();

// --- STATE MANAGEMENT ---
const searchInput = ref("");
const vehicleData = ref(null);
const questions = ref([]);
const answers = ref({});
const loading = ref(false);
const isSubmitting = ref(false);

// State untuk metadata laporan (Sesuai dropdown di UI Anda)
const selectedShift = ref("");

// --- LOGIKA BUSINESS ---

// 1. Mencari Kendaraan berdasarkan Nomor Lambung
const handleSearchVehicle = async () => {
  if (!searchInput.value) return;
  
  try {
    loading.value = true;
    const response = await api.get(`/vehicles/lambung/${searchInput.value}`);
    vehicleData.value = response.data.payload;
    
    // Setelah unit ditemukan, otomatis ambil checklist-nya
    await fetchChecklist(vehicleData.value.jenis_kendaraan);
  } catch (error) {
    alert(error.response?.data?.detail || "Nomor lambung tidak ditemukan");
    vehicleData.value = null;
    questions.value = [];
  } finally {
    loading.value = false;
  }
};

// 2. Mengambil Daftar Pertanyaan Checklist
const fetchChecklist = async (vehicleType) => {
  try {
    const response = await api.get('/p2h/checklist-items');
    
    // Filter pertanyaan berdasarkan vehicle_tags yang cocok dengan jenis kendaraan
    const allQuestions = response.data.payload;
    questions.value = allQuestions.filter(q => 
      q.vehicle_tags.includes(vehicleType)
    );
    
    // Parse options format "jawaban|pilihan" dan inisialisasi jawaban
    questions.value = questions.value.map(q => ({
      ...q,
      pertanyaan: q.item_name, // Map item_name ke pertanyaan untuk kompatibilitas template
      options: q.options.map(opt => {
        const [jawaban, pilihan] = opt.includes('|') ? opt.split('|') : [opt, 'Normal'];
        return { jawaban, pilihan };
      })
    }));
    
    // Inisialisasi jawaban default: "Normal"
    questions.value.forEach((q) => {
      answers.value[q.id] = { status: "Normal", keterangan: "" };
    });
  } catch (error) {
    console.error("Gagal memuat checklist", error);
    alert("Gagal memuat checklist: " + (error.response?.data?.detail || error.message));
  }
};

// 3. Mengirim Laporan P2H (Submit)
const handleSubmitReport = async () => {
  if (!vehicleData.value) return;

  // Validasi: Pastikan keterangan diisi jika status Abnormal/Warning
  for (const qId in answers.value) {
    const ans = answers.value[qId];
    if ((ans.status === 'Abnormal' || ans.status === 'Warning') && !ans.keterangan.trim()) {
      alert(`Harap isi keterangan untuk item yang bermasalah!`);
      return;
    }
  }

  try {
    isSubmitting.value = true;
    
    const payload = {
      vehicle_id: vehicleData.value.id,
      shift_number: selectedShift.value, 
      details: Object.keys(answers.value).map(id => ({
        checklist_item_id: id,
        status: answers.value[id].status,
        keterangan: answers.value[id].keterangan
      }))
    };

    const response = await api.post("/p2h/submit", payload);
    alert(response.data.message || "Laporan P2H Berhasil Dikirim!");
    router.push("/"); 
    
  } catch (error) {
    alert("Error: " + (error.response?.data?.detail || "Gagal mengirim laporan"));
  } finally {
    isSubmitting.value = false;
  }
};

// Mengelompokkan item berdasarkan Section
const groupedQuestions = computed(() => {
  return questions.value.reduce((acc, obj) => {
    const key = obj.section_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(obj);
    return acc;
  }, {});
});

// Removed auto-load to prevent 401 error on page load
// User must click "Cari" button to search for vehicle
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat'] bg-gray-50">
    <NavBar />

    <main
      class="flex-1 flex items-start md:items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed px-4 pt-24 md:pt-20 pb-40 md:pb-32 overflow-y-auto"
      style="background-image: url(/image_asset/Backgrond.png)"
    >
      <div class="flex flex-col w-full max-w-5xl gap-4">
        
        <div class="p-8 md:p-10 bg-white rounded-lg shadow-md w-full mx-auto">
          <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Selamat datang
          </h1>
          <p class="text-gray-700 font-regular text-base leading-relaxed">
            Mohon mengisi informasi keadaan kendaraan hari ini sebelum anda bekerja atau sebelum memakai kendaraan di area PT Indominco Mandiri.
          </p>
        </div>

        <div class="p-8 md:p-10 bg-white rounded-lg shadow-md w-full mx-auto">
          <h2 class="text-2xl font-bold mb-4 text-gray-900">
            Informasi Kondisi Kerusakan Kendaraan
          </h2>
          
          <div class="flex items-start gap-3 mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <InformationCircleIcon class="h-5 w-5 text-red-600 shrink-0 mt-0.5"/>
            <p class="text-red-700 font-medium text-sm leading-relaxed">
              Jika memilih status <span class="font-bold">Abnormal</span> atau <span class="font-bold">Warning</span>, pengguna wajib mengisi keterangan kerusakan sebagai informasi tambahan.
            </p>
          </div>
          
          <div class="flex flex-col gap-1">
            <div>
              <div class="inline-block px-4 py-2 text-base font-bold rounded-full mb-3" style="background-color: #A7E8BF; color: #1A5C3F;">
                Normal
              </div>
              <p class="text-gray-700 font-regular text-base leading-relaxed">
                Bagian kendaraan dalam kondisi baik dan berfungsi normal tanpa ditemukan kerusakan.
              </p>
            </div>
            
            <div class="mt-4">
              <div class="inline-block px-4 py-2 text-base font-bold rounded-full mb-3" style="background-color: #F7E19C; color: #8B6F47;">
                Abnormal
              </div>
              <p class="text-gray-700 font-regular text-base leading-relaxed">
                Bagian kendaraan terdapat kerusakan ringan, namun masih dapat digunakan dan perlu dilakukan pemeriksaan atau perbaikan di bengkel.
              </p>
            </div>
            
            <div class="mt-4">
              <div class="inline-block px-4 py-2 text-base font-bold rounded-full mb-3" style="background-color: #FFA0A0; color: #8B3A3A;">
                Warning
              </div>
              <p class="text-gray-700 font-regular text-base leading-relaxed">
                Bagian kendaraan mengalami kerusakan serius, tidak dapat digunakan dan harus segera dibawa ke bengkel untuk penanganan lebih lanjut.
              </p>
            </div>
          </div>
        </div>

        <div class="p-8 md:p-10 bg-white rounded-lg shadow-md w-full mx-auto">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 border-b-4 border-purple-500 inline-block pb-1">Jenis Kendaraan</h2>
          
          <div class="flex gap-2 mb-6 mt-4">
            <input
              id="search_lambung"
              name="search_lambung"
              v-model="searchInput"
              @keyup.enter="handleSearchVehicle"
              placeholder="Masukkan nomor lambung (P.309)" 
              class="flex-1 p-4 border-2 border-gray-100 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-purple-500 transition-all outline-none"
            />
            <button 
              @click="handleSearchVehicle"
              :disabled="loading"
              class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <MagnifyingGlassIcon v-if="!loading" class="h-5 w-5"/>
              {{ loading ? '...' : 'Cari' }}
            </button>
          </div>

          <div v-if="vehicleData" class="p-6 bg-green-50 border border-green-200 rounded-xl space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-green-900">
              <p><strong>Nomor lambung :</strong> {{ vehicleData.no_lambung }}</p>
              <p><strong>Merek Kendaraan :</strong> {{ vehicleData.merk }}</p>
              <p><strong>Tipe Kendaraan :</strong> {{ vehicleData.jenis_kendaraan }}</p>
              <p><strong>Plat Kendaraan :</strong> {{ vehicleData.no_polisi }}</p>
            </div>
          </div>
        </div>

        <section v-if="questions.length > 0" class="flex flex-col gap-4">
          <div v-for="(items, section) in groupedQuestions" :key="section" class="p-8 md:p-10 bg-white rounded-xl shadow-md">
            <h3 class="text-lg font-black text-purple-700 uppercase tracking-wider mb-6 pb-2 border-b-2 border-gray-100 flex items-center gap-2">
              <CheckCircleIcon class="h-6 w-6 text-purple-600"/>
              {{ section }}
            </h3>
            
            <div class="flex flex-col gap-8">
              <div v-for="q in items" :key="q.id" class="group">
                <p class="text-gray-900 font-bold text-lg mb-4 group-hover:text-purple-600 transition-colors">
                  {{ q.pertanyaan }}
                </p>
                
                <div class="flex flex-wrap gap-6 mb-4">
                  <label 
                    v-for="opt in ['Normal', 'Abnormal', 'Warning']" 
                    :key="opt"
                    :for="`status_${q.id}_${opt}`"
                    class="flex items-center gap-3 cursor-pointer p-3 border-2 rounded-xl transition-all"
                    :class="answers[q.id].status === opt ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-100' : 'border-gray-100'"
                  >
                    <input
                      :id="`status_${q.id}_${opt}`"
                      :name="`status_${q.id}`"
                      type="radio" 
                      :value="opt" 
                      v-model="answers[q.id].status"
                      class="w-5 h-5 accent-purple-600"
                    />
                    <span class="font-bold text-gray-700">{{ opt }}</span>
                  </label>
                </div>

                <div v-if="answers[q.id].status !== 'Normal' && answers[q.id].status !== 'Baik'">
                  <textarea
                    :id="`keterangan_${q.id}`"
                    :name="`keterangan_${q.id}`"
                    v-model="answers[q.id].keterangan"
                    placeholder="Jelaskan detail kerusakan di sini..."
                    class="w-full p-4 border-2 border-red-100 rounded-xl bg-red-50 focus:border-red-400 outline-none text-sm font-medium"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="pb-10">
            <button 
              @click="handleSubmitReport"
              :disabled="isSubmitting"
              class="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xl rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <ExclamationTriangleIcon v-if="!isSubmitting" class="h-6 w-6"/>
              {{ isSubmitting ? 'MENGIRIM...' : 'KIRIM LAPORAN P2H' }}
            </button>
          </div>
        </section>

      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Transisi halus saat keterangan muncul */
.slide-enter-active { transition: all 0.3s ease-out; }
.slide-enter-from { opacity: 0; transform: translateY(-10px); }

input[type="radio"] {
  cursor: pointer;
}
</style>
