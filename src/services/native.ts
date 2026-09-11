import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export class NativeService {
  /**
   * Cek apakah berjalan di perangkat native (Android/iOS)
   */
  static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Memberikan getaran haptic saat aksi berhasil / selesai langkah
   */
  static async triggerHapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning'): Promise<void> {
    try {
      if (this.isNative()) {
        if (type === 'light') {
          await Haptics.impact({ style: ImpactStyle.Light });
        } else if (type === 'heavy') {
          await Haptics.impact({ style: ImpactStyle.Heavy });
        } else if (type === 'success') {
          await Haptics.notification({ type: NotificationType.Success });
        } else if (type === 'warning') {
          await Haptics.notification({ type: NotificationType.Warning });
        } else {
          await Haptics.impact({ style: ImpactStyle.Medium });
        }
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        // Fallback Web Vibration API
        if (type === 'light') navigator.vibrate(20);
        else if (type === 'heavy') navigator.vibrate([60, 40, 60]);
        else if (type === 'success') navigator.vibrate([30, 50, 40]);
        else navigator.vibrate(40);
      }
    } catch {
      // Abaikan jika tidak didukung di perangkat pengguna
    }
  }

  /**
   * Mengambil foto dari kamera perangkat atau galeri lokal (menghasilkan base64 data URL)
   */
  static async captureOrPickPhoto(): Promise<string | null> {
    try {
      if (this.isNative()) {
        const image = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt, // Memberi pilihan kamera atau galeri foto
        });
        return image.dataUrl || null;
      } else {
        // Web Fallback: File Input
        return await this.pickFileFromWeb();
      }
    } catch (err) {
      console.warn('Gagal mengambil foto atau pengguna membatalkan:', err);
      return null;
    }
  }

  /**
   * Fallback web file picker untuk unggah foto
   */
  private static pickFileFromWeb(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';

      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      };

      document.body.appendChild(input);
      input.click();
      setTimeout(() => document.body.removeChild(input), 1000);
    });
  }

  /**
   * Ekspor data backup ke file lokal (mendukung Android Filesystem & Web Download)
   */
  static async exportBackupFile(jsonString: string, filename: string): Promise<string> {
    if (this.isNative()) {
      try {
        const result = await Filesystem.writeFile({
          path: filename,
          data: jsonString,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });
        return `Tersimpan di Dokumen: ${result.uri}`;
      } catch (err) {
        console.error('Filesystem write error:', err);
      }
    }

    // Web Fallback: Trigger Browser Download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);

    return `Berkas ${filename} berhasil diunduh ke penyimpanan lokal.`;
  }
}
