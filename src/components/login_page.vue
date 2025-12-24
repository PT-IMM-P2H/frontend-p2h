<script>
import './login.css'
import { PhoneIcon , EyeIcon, EyeSlashIcon} from '@heroicons/vue/24/outline'

export default {
  components: {
    PhoneIcon,
    EyeIcon,
    EyeSlashIcon
  },
  data() {
    return {
      showPassword: false,
      showForgotPasswordModal: false
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    openForgotPasswordModal() {
      this.showForgotPasswordModal = true
    },
    closeForgotPasswordModal() {
      this.showForgotPasswordModal = false
    },
    handleSignIn() {
      this.$router.push('/form-p2h')
    }
  },

}
</script>

<template>
    <div class="login-container">
        <div class="form-box">
            <div class="form-content">
                <img src="/Image Asset/IMM.svg" alt="IMM Logo" class="logo">
                <p>Welcome to Pelaksanaan Pemeriksaan Harian</p>
                <div class="form-group">
                    <input type="tel" placeholder="Nomor Handphone" class="form-input">
                </div>
                
                <div class="form-group password-group">
                    <input 
                        :type="showPassword ? 'text' : 'password'" 
                        placeholder="Password" 
                        class="form-input"
                    >
                    <button 
                        type="button" 
                        class="toggle-password-btn"
                        @click="togglePasswordVisibility"
                    >
                        <EyeIcon v-if="showPassword" class="icon-eye" />
                        <EyeSlashIcon v-else class="icon-eye" />
                    </button>
                </div>
                
                <div class="form-footer">
                    <a href="#" class="forgot-password" @click.prevent="openForgotPasswordModal">
                      Lupa Password?
                    </a>
                </div>
                
                <button class="sign-in-btn" @click="handleSignIn">
                  Sign In
                </button>
            </div>
        </div>

        <!-- Forgot Password Modal -->
        <div v-if="showForgotPasswordModal" class="modal-overlay">
            <div class="modal-box">
                <h3>Silahkan hubungi OH OnCall IMM agar kami dapat memberikan informasi lebih lanjut tentang password anda.</h3>
                <p class="flex items-center gap-2">
                  <PhoneIcon class="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>OH OnCall (Klinik 30) : 0812-5511-185</span>
                </p>
                <p class="flex items-center gap-2">
                  <PhoneIcon class="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>OH OnCall (Klinik Port) : 0812-5511-183</span>
                </p>
                <p class="flex items-center gap-2">
                  <PhoneIcon class="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>Abustan : 0852-4717-8478</span>
                </p>
                <button class="modal-close-btn" @click="closeForgotPasswordModal">Close</button>
            </div>
        </div>
    </div>
    
</template>