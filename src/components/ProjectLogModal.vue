<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal-dialog pt-card">
      <div class="modal-header">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </div>
        <div>
          <h3 class="modal-title">{{ editingLog ? 'Edit Catatan Proyek' : 'Catat Proyek DIY Baru' }}</h3>
          <p class="modal-sub">Dokumentasikan progres pengerjaan dan hasil DIY Anda.</p>
        </div>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="form-layout">
          <!-- Judul Proyek -->
          <div class="form-group">
            <label class="form-label">Nama / Judul Proyek DIY</label>
            <input
              v-model="form.projectTitle"
              type="text"
              class="form-input"
              placeholder="Contoh: Ganti Saklar Lampu Ruang Tamu"
              required
            />
          </div>

          <!-- Kategori & Status Row -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select v-model="form.category" class="form-select">
                <option value="KNS">🧱 Konstruksi & Dinding (KNS)</option>
                <option value="LST">⚡ Kelistrikan (LST)</option>
                <option value="SAN">🚰 Sanitasi & Pipa (SAN)</option>
                <option value="KAY">🪵 Perkayuan & Mebel (KAY)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Status Pengerjaan</label>
              <select v-model="form.status" class="form-select">
                <option value="in_progress">Sedang Dikerjakan</option>
                <option value="completed">Selesai Sempurna</option>
                <option value="need_repair">Butuh Perbaikan Ulang</option>
              </select>
            </div>
          </div>

          <!-- Durasi & Biaya Realisasi -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Waktu Pengerjaan (Menit)</label>
              <input
                v-model.number="form.spentMinutes"
                type="number"
                min="5"
                step="5"
                class="form-input"
                placeholder="45"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Total Belanja Bahan (Rp)</label>
              <input
                v-model.number="form.totalCost"
                type="number"
                min="0"
                step="5000"
                class="form-input"
                placeholder="50000"
              />
            </div>
          </div>

          <!-- Dokumentasi Foto Sebelum & Sesudah -->
          <div class="form-row photos-dual-row">
            <!-- Foto Sebelum (Before) -->
            <div class="form-group">
              <label class="form-label">Foto Sebelum (Kondisi Awal)</label>
              <div class="photo-upload-container">
                <div v-if="form.beforePhotoData" class="photo-preview-box">
                  <img :src="form.beforePhotoData" alt="Foto Sebelum" class="photo-preview" />
                  <button type="button" class="remove-photo-btn" @click="form.beforePhotoData = ''">
                    ✕ Hapus
                  </button>
                </div>
                <div v-else class="upload-trigger-box mini-upload" @click="handleTakeBeforePhoto">
                  <span class="upload-icon">📷</span>
                  <span class="upload-text">Unggah Foto Sebelum</span>
                </div>
              </div>
            </div>

            <!-- Foto Sesudah (After) -->
            <div class="form-group">
              <label class="form-label">Foto Hasil Selesai (After)</label>
              <div class="photo-upload-container">
                <div v-if="form.photoData" class="photo-preview-box">
                  <img :src="form.photoData" alt="Foto Selesai" class="photo-preview" />
                  <button type="button" class="remove-photo-btn" @click="form.photoData = ''">
                    ✕ Hapus
                  </button>
                </div>
                <div v-else class="upload-trigger-box mini-upload" @click="handleTakePhoto">
                  <span class="upload-icon">✨</span>
                  <span class="upload-text">Unggah Foto Selesai</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Catatan Pribadi -->
          <div class="form-group">
            <label class="form-label">Catatan & Tips Pribadi</label>
            <textarea
              v-model="form.userNotes"
              rows="3"
              class="form-textarea"
              placeholder="Tulis kendala yang dihadapi, ukuran baut yang pas, atau toko tempat beli bahan murah..."
            ></textarea>
          </div>

          <!-- Rating Kepuasan -->
          <div class="form-group">
            <label class="form-label">Tingkat Kepuasan Hasil:</label>
            <div class="stars-row">
              <span
                v-for="star in 5"
                :key="star"
                :class="['star-btn', { 'active': form.rating >= star }]"
                @click="form.rating = star"
              >
                ★
              </span>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="pt-btn pt-btn-outline" @click="$emit('cancel')">
          Batal
        </button>
        <button type="button" class="pt-btn pt-btn-primary" @click="handleSubmit">
          Simpan Catatan Proyek
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { MyProjectLog, ProjectCategory } from '../types';
import { NativeService } from '../services/native';

const props = defineProps<{
  isOpen: boolean;
  editingLog?: MyProjectLog | null;
  defaultProjectTitle?: string;
  defaultCategory?: ProjectCategory;
}>();

const emit = defineEmits<{
  (e: 'save', log: MyProjectLog): void;
  (e: 'cancel'): void;
}>();

const form = reactive({
  id: '',
  projectId: '',
  projectTitle: '',
  category: 'LST' as ProjectCategory,
  status: 'completed' as 'in_progress' | 'completed' | 'need_repair',
  spentMinutes: 45,
  totalCost: 50000,
  userNotes: '',
  photoData: '',
  beforePhotoData: '',
  rating: 5,
});

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      if (props.editingLog) {
        form.id = props.editingLog.id;
        form.projectId = props.editingLog.projectId;
        form.projectTitle = props.editingLog.projectTitle;
        form.category = props.editingLog.category;
        form.status = props.editingLog.status;
        form.spentMinutes = props.editingLog.spentMinutes;
        form.totalCost = props.editingLog.totalCost;
        form.userNotes = props.editingLog.userNotes;
        form.photoData = props.editingLog.photoData || '';
        form.beforePhotoData = props.editingLog.beforePhotoData || '';
        form.rating = props.editingLog.rating || 5;
      } else {
        form.id = 'log-' + Date.now();
        form.projectId = 'custom';
        form.projectTitle = props.defaultProjectTitle || '';
        form.category = props.defaultCategory || 'LST';
        form.status = 'completed';
        form.spentMinutes = 45;
        form.totalCost = 50000;
        form.userNotes = '';
        form.photoData = '';
        form.beforePhotoData = '';
        form.rating = 5;
      }
    }
  },
  { immediate: true }
);

const handleTakeBeforePhoto = async () => {
  const photo = await NativeService.captureOrPickPhoto();
  if (photo) {
    form.beforePhotoData = photo;
    NativeService.triggerHapticFeedback('success');
  }
};

const handleTakePhoto = async () => {
  const photo = await NativeService.captureOrPickPhoto();
  if (photo) {
    form.photoData = photo;
    NativeService.triggerHapticFeedback('success');
  }
};

const handleSubmit = () => {
  if (!form.projectTitle.trim()) return;

  const log: MyProjectLog = {
    id: form.id || 'log-' + Date.now(),
    projectId: form.projectId || 'custom',
    projectTitle: form.projectTitle.trim(),
    category: form.category,
    status: form.status,
    startDate: props.editingLog?.startDate || new Date().toISOString(),
    completedDate: form.status === 'completed' ? new Date().toISOString() : undefined,
    spentMinutes: form.spentMinutes || 0,
    totalCost: form.totalCost || 0,
    userNotes: form.userNotes.trim(),
    photoData: form.photoData,
    beforePhotoData: form.beforePhotoData,
    rating: form.rating,
    completedSteps: props.editingLog?.completedSteps || [],
  };

  NativeService.triggerHapticFeedback('success');
  emit('save', log);
};
</script>

<style scoped>
.mini-upload {
  padding: 12px !important;
}
.mini-upload .upload-icon {
  font-size: 20px;
}
.mini-upload .upload-text {
  font-size: 11px !important;
}
</style>

