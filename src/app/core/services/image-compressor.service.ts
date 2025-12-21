import { inject, Injectable } from '@angular/core';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root',
})
export class ImageCompressorService {
  private readonly imageCompress = inject(NgxImageCompressService);

  async compressImage(file: File): Promise<File> {
    const base64 = await this.fileToDataUrl(file);
    
    const result: DataUrl = await this.imageCompress.compressFile(base64, -1, 50, 75);

    return this.dataUrlToFile(result, file.name);
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  private async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: 'image/jpeg' });
  }
}
