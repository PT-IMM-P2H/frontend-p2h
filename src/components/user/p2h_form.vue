<script setup>
import NavBar from "../bar/header-user.vue";
import Footer from "../bar/footer.vue";
import { InformationCircleIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="min-h-screen flex flex-col font-['Montserrat']">
    <!-- Navbar -->
    <NavBar />

    <!-- Content -->
    <main
      class="flex-1 flex items-start md:items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed px-4 pt-24 md:pt-20 pb-40 md:pb-32 overflow-y-auto"
      style="background-image: url(/image_asset/Backgrond.png)"
    >
      <div class="flex flex-col w-full max-w-5xl gap-4">
        <!-- Konten Welcome -->
        <div class="p-8 md:p-10 bg-white rounded-lg shadow-md w-full mx-auto">
          <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Selamat datang
          </h1>
          <p class="text-gray-700 font-regular text-base leading-relaxed">
            Mohon mengisi informasi keadaan kendaraan hari ini sebelum anda bekerja atau sebelum memakai kendaraan di area PT Indominco Mandiri.
          </p>
        </div>
        <!-- Konten Informasi Kondisi Kerusakan -->
        <div class="p-8 md:p-10 bg-white rounded-lg shadow-md w-full mx-auto">
          <h2 class="text-2xl font-bold mb-4 text-gray-900">
            Informasi Kondisi Kerusakan Kendaraan
          </h2>
          
          <!-- Alert Box -->
          <div class="flex items-start gap-3 mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <InformationCircleIcon class="h-5 w-5 text-red-600 shrink-0 mt-0.5"/>
            <p class="text-red-700 font-medium text-sm leading-relaxed">
              Jika memilih status <span class="font-bold">Abnormal</span> atau <span class="font-bold">Warning</span>, pengguna wajib mengisi keterangan kerusakan sebagai informasi tambahan.
            </p>
          </div>
          
          <!-- Status Cards -->
          <div class="flex flex-col gap-1">
            <!-- Normal -->
            <div>
              <div class="inline-block px-4 py-2 text-base font-bold rounded-full mb-3" style="background-color: #A7E8BF; color: #1A5C3F;">
                Normal
              </div>
              <p class="text-gray-700 font-regular text-base leading-relaxed">
                Bagian kendaraan dalam kondisi baik dan berfungsi normal tanpa ditemukan kerusakan.
              </p>
            </div>
            
            <!-- Abnormal -->
            <div>
              <div class="inline-block px-4 py-2 text-base font-bold rounded-full mb-3" style="background-color: #F7E19C; color: #8B6F47;">
                Abnormal
              </div>
              <p class="text-gray-700 font-regular text-base leading-relaxed">
                Bagian kendaraan terdapat kerusakan ringan, namun masih dapat digunakan dan perlu dilakukan pemeriksaan atau perbaikan di bengkel.
              </p>
            </div>
            
            <!-- Warning -->
            <div>
              <div class="inline-block px-4 py-2 text-base font-bold rounded-full mb-3" style="background-color: #FFA0A0; color: #8B3A3A;">
                Warning
              </div>
              <p class="text-gray-700 font-regular text-base leading-relaxed">
                Bagian kendaraan mengalami kerusakan serius, tidak dapat digunakan dan harus segera dibawa ke bengkel untuk penanganan lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
