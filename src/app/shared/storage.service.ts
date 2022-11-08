import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private ls: SecureLS = new SecureLS({ encodingType: 'aes' });
  private prefix: string = 'bank_';

  clear(): void {
    this.ls.removeAll();
  }

  remove(key: string): void {
    this.ls.remove(this.prefix + key);
  }

  set(key: string, value: any, seconds?: number): void {
    const obj = {
      value,
      expires: seconds ? dayjs().add(seconds, 'second') : null,
    };
    this.ls.set(this.prefix + key, obj);
  }

  get(key: string): any {
    const obj = this.ls.get(this.prefix + key);

    if (!obj.expires) {
      return obj.value;
    }

    return dayjs().isBefore(new Date(obj.expires)) ? obj.value : null;
  }

  isExpired(key: string): boolean {
    const obj = this.ls.get(this.prefix + key);

    if (!obj.expires) {
      return false;
    }

    return !dayjs().isBefore(new Date(obj.expires));
  }
}
