/**
 * お問い合わせフォーム用JavaScript
 * モダンなバリデーション、アニメーション、送信処理
 * 
 * 機能:
 * - リアルタイムバリデーション
 * - スムーズなアニメーション
 * - ローディング状態の表示
 * - 送信完了モーダル
 * 
 * 依存関係:
 * - config.js（設定ファイル）
 */

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitButton = null;
    this.isSubmitting = false;
    
    if (this.form) {
      this.init();
    }
  }

  /**
   * フォームの初期化
   */
  init() {
    console.log('✓ Contact form initialized');
    
    // 送信ボタンを取得
    this.submitButton = this.form.querySelector('button[type="submit"]');
    
    // イベントリスナーを設定
    this.setupEventListeners();
    
    // フィールドアニメーション
    this.animateFields();
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // フォーム送信イベント
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // 各フィールドのリアルタイムバリデーション
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // フォーカス時
      input.addEventListener('focus', (e) => this.handleFocus(e));
      
      // フォーカス解除時
      input.addEventListener('blur', (e) => this.handleBlur(e));
      
      // 入力時
      input.addEventListener('input', (e) => this.handleInput(e));
    });

    // チェックボックスの変更時
    const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.updateSubmitButton());
    });
  }

  /**
   * フィールドアニメーション
   */
  animateFields() {
    const fields = this.form.querySelectorAll('.input, .input-e, .input-11, .input-13, .input-15, .input-25, .radios, .checkbox');
    
    fields.forEach((field, index) => {
      setTimeout(() => {
        field.style.opacity = '1';
        field.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }

  /**
   * フォーカス時の処理
   */
  handleFocus(e) {
    const field = e.target.closest('.input, .input-e, .input-11, .input-13, .input-15, .input-25');
    if (field) {
      field.classList.add('focused');
    }
  }

  /**
   * フォーカス解除時の処理（バリデーション）
   */
  handleBlur(e) {
    const field = e.target.closest('.input, .input-e, .input-11, .input-13, .input-15, .input-25');
    if (field) {
      field.classList.remove('focused');
    }

    // バリデーション実行
    this.validateField(e.target);
  }

  /**
   * 入力時の処理
   */
  handleInput(e) {
    const input = e.target;
    
    // エラーメッセージをクリア
    this.clearFieldError(input);
    
    // リアルタイムバリデーション（軽量）
    if (input.value.length > 0) {
      this.validateField(input, true);
    }

    // 送信ボタンの状態を更新
    this.updateSubmitButton();
  }

  /**
   * フィールドのバリデーション
   */
  validateField(input, isRealtime = false) {
    const name = input.name;
    const value = input.value.trim();
    const type = input.type;
    const config = SITE_CONFIG.contactForm.validation;

    let isValid = true;
    let errorMessage = '';

    // 必須チェック
    if (input.hasAttribute('required') && !value) {
      if (!isRealtime) {
        isValid = false;
        errorMessage = 'この項目は必須です';
      }
    }

    // メールアドレスの形式チェック
    if (type === 'email' && value && config.email.pattern) {
      if (!config.email.pattern.test(value)) {
        isValid = false;
        errorMessage = '正しいメールアドレスを入力してください';
      }
    }

    // 電話番号の形式チェック
    if (name === 'phone' && value && config.phone.pattern) {
      if (!config.phone.pattern.test(value)) {
        isValid = false;
        errorMessage = '正しい電話番号を入力してください（例: 090-1234-5678）';
      }
    }

    // お問い合わせ内容の文字数チェック
    if (name === 'message' && value) {
      if (value.length < config.message.minLength) {
        isValid = false;
        errorMessage = `${config.message.minLength}文字以上で入力してください`;
      } else if (value.length > config.message.maxLength) {
        isValid = false;
        errorMessage = `${config.message.maxLength}文字以内で入力してください`;
      }
    }

    // エラー表示
    if (!isValid) {
      this.showFieldError(input, errorMessage);
    } else {
      this.clearFieldError(input);
    }

    return isValid;
  }

  /**
   * フィールドのエラー表示
   */
  showFieldError(input, message) {
    const parent = input.closest('.input, .input-e, .input-11, .input-13, .input-15, .input-25');
    if (!parent) return;

    // 既存のエラーメッセージを削除
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // エラースタイルを適用
    input.style.borderColor = '#EF4444';
    input.style.background = '#FEF2F2';

    // エラーメッセージを追加
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
      color: #EF4444;
      font-size: 12px;
      margin-top: 4px;
      animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;
    parent.appendChild(errorDiv);
  }

  /**
   * フィールドのエラークリア
   */
  clearFieldError(input) {
    const parent = input.closest('.input, .input-e, .input-11, .input-13, .input-15, .input-25');
    if (!parent) return;

    // エラースタイルを解除
    input.style.borderColor = '#E5E7EB';
    input.style.background = 'white';

    // エラーメッセージを削除
    const errorMessage = parent.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
   * 全フィールドのバリデーション
   */
  validateAllFields() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
    let allValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        allValid = false;
      }
    });

    // プライバシーポリシー同意チェック
    const termsCheckbox = this.form.querySelector('#terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      allValid = false;
      this.showNotification('プライバシーポリシーへの同意が必要です', 'error');
    }

    return allValid;
  }

  /**
   * 送信ボタンの状態更新
   */
  updateSubmitButton() {
    if (!this.submitButton) return;

    const requiredInputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
    const termsCheckbox = this.form.querySelector('#terms');
    
    let allFilled = true;
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        allFilled = false;
      }
    });

    if (termsCheckbox && !termsCheckbox.checked) {
      allFilled = false;
    }

    if (allFilled) {
      this.submitButton.style.opacity = '1';
      this.submitButton.style.cursor = 'pointer';
    } else {
      this.submitButton.style.opacity = '0.6';
      this.submitButton.style.cursor = 'not-allowed';
    }
  }

  /**
   * フォーム送信処理
   */
  async handleSubmit(e) {
    e.preventDefault();

    // 二重送信防止
    if (this.isSubmitting) {
      console.log('⚠️ Already submitting...');
      return;
    }

    // バリデーション
    if (!this.validateAllFields()) {
      this.showNotification('入力内容をご確認ください', 'error');
      return;
    }

    this.isSubmitting = true;

    // ローディング状態を表示
    this.showLoadingState();

    try {
      // フォームデータを取得
      const formData = this.getFormData();

      console.log('📤 Submitting form data:', formData);

      // ここで実際の送信処理を実装
      // 例: fetch APIを使用してバックエンドに送信
      // const response = await this.sendFormData(formData);

      // EmailJSで送信
      if (SITE_CONFIG.emailJS.enabled) {
        await this.sendViaEmailJS(formData);
      } else {
        // デモ用: 2秒待機
        await this.simulateSubmit(formData);
      }

      // 成功メッセージを表示
      this.showSuccessModal();

      // フォームをリセット
      this.form.reset();

    } catch (error) {
      console.error('❌ Form submission error:', error);
      this.showNotification('送信に失敗しました。時間をおいて再度お試しください。', 'error');
    } finally {
      this.hideLoadingState();
      this.isSubmitting = false;
    }
  }

  /**
   * フォームデータを取得
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      // サービス選択（複数）の処理
      if (key === 'service[]') {
        if (!data.services) {
          data.services = [];
        }
        data.services.push(value);
      } else {
        data[key] = value;
      }
    }

    // タイムスタンプを追加
    data.timestamp = new Date().toISOString();

    return data;
  }

/**
   * EmailJSを使用してフォームを送信
   */
  async sendViaEmailJS(formData) {
    // EmailJS設定の確認
    if (!SITE_CONFIG.emailJS.enabled) {
      throw new Error('EmailJS is not enabled in config.js');
    }

    const { publicKey, serviceId, templateId } = SITE_CONFIG.emailJS;

    // EmailJSの初期化
    emailjs.init(publicKey);

    // サービス選択を文字列に変換
    const services = formData.services ? formData.services.join(', ') : 'なし';

    // EmailJSに送信するテンプレートパラメータ
    const templateParams = {
      name: `${formData.lastName || ''} ${formData.firstName || ''}`.trim(),
      lastName: formData.lastName || '',
      firstName: formData.firstName || '',
      email: formData.email || '',
      phone: formData.phone || '未入力',
      topic: formData.topic || '',
      service: services,
      message: formData.message || '',
      send_date: new Date().toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    console.log('📧 Sending email via EmailJS...', templateParams);

    try {
      // EmailJSでメール送信
      const response = await emailjs.send(serviceId, templateId, templateParams);
      
      console.log('✅ Email sent successfully!', response);
      return response;
      
    } catch (error) {
      console.error('❌ EmailJS error:', error);
      throw new Error('メール送信に失敗しました: ' + error.text);
    }
  }

  /**
   * 送信シミュレーション（デモ用）
   * ※EmailJS有効時は使用されません
   */
  simulateSubmit(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Form data submitted successfully:', formData);
        resolve();
      }, 2000);
    });
  }

  /**
   * ローディング状態を表示
   */
  showLoadingState() {
    if (!this.submitButton) return;

    this.submitButton.disabled = true;
    this.submitButton.style.opacity = '0.6';
    this.submitButton.style.cursor = 'not-allowed';

    const originalText = this.submitButton.innerHTML;
    this.submitButton.setAttribute('data-original-text', originalText);

    this.submitButton.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 8px;">
        <svg style="animation: spin 1s linear infinite;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
        </svg>
        送信中...
      </span>
    `;
  }

  /**
   * ローディング状態を解除
   */
  hideLoadingState() {
    if (!this.submitButton) return;

    this.submitButton.disabled = false;
    this.submitButton.style.opacity = '1';
    this.submitButton.style.cursor = 'pointer';

    const originalText = this.submitButton.getAttribute('data-original-text');
    if (originalText) {
      this.submitButton.innerHTML = originalText;
    }
  }

  /**
   * 成功モーダルを表示
   */
  showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
      <div style="background: white; border-radius: 16px; padding: 40px; max-width: 480px; width: 90%; text-align: center; animation: scaleIn 0.3s ease;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" style="margin: 0 auto 20px;">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <h2 style="margin: 0 0 12px 0; color: #1F2937; font-size: 24px; font-weight: 600;">
          送信完了
        </h2>
        <p style="margin: 0 0 24px 0; color: #6B7280; font-size: 15px; line-height: 1.6;">
          お問い合わせありがとうございます。<br>
          担当者より2営業日以内にご連絡いたします。
        </p>
        <button onclick="this.closest('.success-modal').remove()" style="padding: 12px 32px; background: #10B981; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
          閉じる
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // 3秒後に自動的に閉じる
    setTimeout(() => {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }, 3000);
  }

  /**
   * 通知メッセージを表示
   */
  showNotification(message, type = 'info') {
    const colors = {
      success: { bg: '#10B981', text: 'white' },
      error: { bg: '#EF4444', text: 'white' },
      info: { bg: '#3B82F6', text: 'white' }
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type].bg};
      color: ${colors[type].text};
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideDown 0.3s ease;
      max-width: 400px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// CSSアニメーションを追加
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .input, .input-e, .input-11, .input-13, .input-15, .input-25, .radios, .checkbox {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }
`;
document.head.appendChild(style);

// ページ読み込み完了後にフォームを初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
  });
} else {
  new ContactForm();
}