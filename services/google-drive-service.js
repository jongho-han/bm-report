/**
 * GoogleDriveService - Upload files to Google Drive using OAuth2
 *
 * Setup: replace GOOGLE_CLIENT_ID with your OAuth2 Web client ID from
 * Google Cloud Console → APIs & Services → Credentials.
 */

// ─── 설정값 ──────────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = '165698117260-lrqikio1ig8lfs06grjin69qbvoutvof.apps.googleusercontent.com';
const TARGET_FOLDER_ID = '1qtgWb8qReCA_LBZg2J_G5xL7oIWKGvc5';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
// ─────────────────────────────────────────────────────────────────────────────

export class GoogleDriveService {
  static #tokenClient = null;
  static #accessToken = null;

  static isConfigured() {
    return GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';
  }

  static init() {
    if (!this.isConfigured()) return;
    if (!window.google?.accounts?.oauth2) {
      console.warn('Google Identity Services not loaded');
      return;
    }
    this.#tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: () => {},
    });
  }

  static async getAccessToken() {
    return new Promise((resolve, reject) => {
      this.#tokenClient.callback = (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        this.#accessToken = response.access_token;
        resolve(response.access_token);
      };

      // 토큰이 이미 있으면 재사용
      if (this.#accessToken) {
        resolve(this.#accessToken);
      } else {
        this.#tokenClient.requestAccessToken({ prompt: 'consent' });
      }
    });
  }

  /**
   * Upload a DOCX blob to the target Drive folder
   * @param {Blob} blob
   * @param {string} fileName - final filename (with .docx)
   * @returns {Promise<{id: string, name: string}>} Drive file metadata
   */
  static async uploadDocx(blob, fileName) {
    if (!this.isConfigured()) throw new Error('Google 클라이언트 ID가 설정되지 않았습니다.');
    if (!this.#tokenClient) this.init();

    const token = await this.getAccessToken();

    const metadata = {
      name: fileName,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      parents: [TARGET_FOLDER_ID],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // 토큰 만료 시 리셋 후 재시도 가능하도록 상태 초기화
      if (res.status === 401) this.#accessToken = null;
      throw new Error(err.error?.message || `업로드 실패 (${res.status})`);
    }

    return res.json();
  }
}

export default GoogleDriveService;
