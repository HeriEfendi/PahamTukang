<template>
  <ion-app>
    <ion-router-outlet id="main-content" />

    <!-- Bottom Navigation Bar -->
    <BottomNavBar />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import BottomNavBar from '@/components/BottomNavBar.vue';
</script>

<style></style>

