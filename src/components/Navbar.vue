<template>
  <div class="navbar-container">
    <v-app-bar dark class="my-app-bar">
      <div class="d-flex align-center justify-space-between w-100">
        <a href="/homepage" class="logo-link d-none d-md-flex">
          <img src="/img/Logo Old World Realms.png" alt="Logo" class="logo">
        </a>

        <div class="desktop-nav d-none d-md-flex">
          <v-btn text to="/homepage" router>Accueil</v-btn>
          <v-btn text to="/allbattlereports" router>Mes Rapports de Batailles</v-btn>
          <v-btn text to="/createabattlereport" router>Créer un Rapport de Bataille</v-btn>
        </div>

        <div class="desktop-actions d-none d-md-flex align-center">
          <v-btn icon text to="/myaccount" router>
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </div>

        <div class="mobile-actions d-flex d-md-none align-center justify-center">
          <v-btn icon @click.stop="toggleMobileMenu">
            <v-icon>{{ showMobileMenu ? 'mdi-close' : 'mdi-menu' }}</v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <div v-if="showMobileMenu" class="mobile-menu-external">
      <div class="mobile-logo-container">
        <a href="/homepage" class="mobile-logo-link" @click="closeMobileMenu">
          <img src="/img/Logo Old World Realms.png" alt="Logo" class="mobile-logo">
        </a>
      </div>
      
      <div class="mobile-nav-list">
        <div class="mobile-nav-item" @click="navigateAndClose('/homepage')">
          <span>Accueil</span>
        </div>
        <div class="mobile-nav-item" @click="navigateAndClose('/allbattlereports')">
          <span>Mes Rapports de Batailles</span>
        </div>
        <div class="mobile-nav-item" @click="navigateAndClose('/createabattlereport')">
          <span>Créer un Rapport de Bataille</span>
        </div>
        <div class="mobile-nav-item" @click="navigateAndClose('/myaccount')">
          <span>Mon Compte</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  console.log('Menu mobile toggled:', showMobileMenu.value);
  console.log('Menu element should be:', showMobileMenu.value ? 'visible' : 'hidden');
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const navigateAndClose = (path: string) => {
  router.push(path);
  closeMobileMenu();
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const mobileMenu = document.querySelector('.mobile-menu-external');
  const hamburgerBtn = document.querySelector('.mobile-actions');
  
  if (showMobileMenu.value && 
      mobileMenu && 
      hamburgerBtn && 
      !mobileMenu.contains(target) && 
      !hamburgerBtn.contains(target)) {
    showMobileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.navbar-container {
  position: relative;
  z-index: 1000;
}

.my-app-bar {
  margin-top: 16px;
  border-radius: 16px;
  height: 64px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  left: 50% !important;
  transform: translateX(-50%) !important;
  max-width: 80%;
  background-color: #332018 !important;
  color: white !important;
  opacity : 0.9 !important;
  position: relative;
  z-index: 1000;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo {
  height: 80px;
  width: auto;
  object-fit: contain;
}

.desktop-nav {
  gap: 8px;
}

.desktop-actions {
  gap: 8px;
}

.mobile-actions {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu-external {
  position: fixed !important;
  top: 80px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 80% !important;
  max-width: 80% !important;
  background-color: #332018 !important;
  border-radius: 0 0 16px 16px !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
  z-index: 9999 !important;
  animation: slideDown 0.3s ease-out !important;
}

.mobile-logo-container {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(184, 160, 130, 0.3);
}

.mobile-logo-link {
  display: inline-block;
  text-decoration: none;
}

.mobile-logo {
  height: 40px;
  width: auto;
}

.mobile-search-external {
  position: fixed !important;
  top: 80px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 80% !important;
  max-width: 80% !important;
  background-color: #332018 !important;
  border-radius: 0 0 16px 16px !important;
  padding: 16px !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
  z-index: 9999 !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.mobile-nav-list {
  background-color: transparent !important;
  padding: 8px 0 !important;
  display: block !important;
}

.mobile-nav-item {
  color: #EBDEC2 !important;
  min-height: 48px !important;
  padding: 12px 24px !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;
  border-bottom: 1px solid rgba(235, 222, 194, 0.1) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.mobile-nav-item:hover {
  background-color: rgba(235, 222, 194, 0.2) !important;
}

.mobile-nav-item:last-child {
  border-bottom: none !important;
  border-radius: 0 0 16px 16px !important;
}

.mobile-nav-item span {
  color: #EBDEC2 !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  text-align: center !important;
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: scaleX(0);
  opacity: 0;
}

@media (max-width: 1100px) {
  .my-app-bar {
    max-width: 95%;
    margin-top: 8px;
  }
  
  .mobile-menu-external {
    top: 72px !important;
    max-width: 95% !important;
    width: 95% !important;
  }
  
  .logo {
    height: 60px;
  }
}

@media (max-width: 600px) {
  .my-app-bar {
    max-width: 98%;
    margin-top: 40px;
    height: 60px;
  }
  
  .mobile-menu-external {
    top: 100px !important;
    max-width: 98% !important;
    width: 98% !important;
  }
  
  .logo {
    height: 50px;
  }
}

@media (max-width: 480px) {
  .my-app-bar {
    border-radius: 12px;
    height: 56px;
    margin-top: 45px;
  }
  
  .mobile-menu-external {
    top: 101px !important;
    border-radius: 0 0 12px 12px !important;
  }
  
  .logo {
    height: 45px;
  }
}

@media (max-width: 430px) and (min-height: 800px) {
  .my-app-bar {
    margin-top: 50px;
  }
  
  .mobile-menu-external {
    top: 106px !important;
  }
}
</style>
