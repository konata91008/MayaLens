export interface ExtractionResult {
  text: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS', // Represents "All Done" or "Partial Done"
  ERROR = 'ERROR',
}

export type ModelType = 'gemini-2.5-flash' | 'gemini-3-pro-preview';

export type ItemStatus = 'pending' | 'processing' | 'success' | 'error';

export interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
  status: ItemStatus;
  result?: string;
  error?: string;
}

export const LIMITS = {
  MAX_FILE_SIZE: 30 * 1024 * 1024, // 30MB
  MAX_TOTAL_SIZE: 500 * 1024 * 1024, // 500MB
};

export type Language = 'zh-TW' | 'en' | 'ja' | 'ko';