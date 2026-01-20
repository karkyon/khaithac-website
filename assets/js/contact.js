/**
 * 問い合わせフォーム用JavaScript
 * リアルタイムバリデーション、アニメーション、EmailJS統合
 */

class ContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.submitButton = null;
    this.isSubmitting = false;
    
    if (this.form) {
      this.init();
    }
  }

  /**
   * フォームを初期化
   */
  init() {
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.setupValidation();
    this.setupFormSubmit();
    this.setupAnimations();
    this.loadEmailJS();
  }

  /**
   * EmailJS SDKを読み込み
   */
  loadEmailJS() {
    // EmailJSを使用する場合はコメントを解除
    /*
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      emailjs.init(SITE_CONFIG.emailJS.publicKey);
    };
    document.head.appendChild(script);
    */
  }

  /**
   * リアルタイムバリデーションをセットアップ
   */
  setupValidation() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // フォーカス時のアニメーション
      input.addEventListener('focus', (e) => {
        this.handleFocus(e.target);
      });

      // ブラー時のバリデーション
      input.addEventListener('blur', (e) => {
        this.validateField(e.target);
        this.handleBlur(e.target);
      });

      // 入力時のリアルタイムバリデーション
      input.addEventListener('input', (e) => {
        if (e.target.classList.contains('error')) {
          this.validateField(e.target);
        }
      });
    });
  }

  /**
   * フォーカス時の処理
   */
  handleFocus(field) {
    const formGroup = field.closest('.input, .input-e, .input-11, .input-13, .input-15, .input-25');
    if (formGroup) {
      formGroup.classList.add('focused');
    }
  }

  /**
   * ブラー時の処理
   */
  handleBlur(field) {
    const formGroup = field.closest('.input, .input-e, .input-11, .input-13, .input-15, .input-25');
    if (formGroup) {
      formGroup.classList.remove('focused');
    }
  }

  /**
   * フィールドのバリデーション
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // 必須チェック
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'この項目は必須です';
    }

    // メールアドレスチェック
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = '有効なメールアドレスを入力してください';
      }
    }

    // 電話番号チェック（日本の形式）
    if (field.type === 'tel' && value) {
      const telRegex = /^[0-9\-]+$/;
      if (!telRegex.test(value)) {
        isValid = false;
        errorMessage = '有効な電話番号を入力してください（数字とハイフンのみ）';
      }
    }

    // 最小文字数チェック
    if (field.minLength && value.length > 0 && value.length < field.minLength) {
      isValid = false;
      errorMessage = `${field.minLength}文字以上入力してください`;
    }

    // エラー表示を更新
    this.showFieldError(field, isValid, errorMessage);

    return isValid;
  }

  /**
   * フィールドのエラー表示
   */
  showFieldError(field, isValid, errorMessage) {
    const formGroup = field.closest('.input, .input-e, .input-11, .input-13, .input-15, .input-25');
    
    if (!formGroup) return;

    // 既存のエラーメッセージを削除
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    if (!isValid) {
      field.classList.add('error');
      formGroup.classList.add('has-error');
      
      // エラーメッセージを追加
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = errorMessage;
      errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
        animation: slideDown 0.3s ease;
      `;
      formGroup.appendChild(errorDiv);
    } else {
      field.classList.remove('error');
      formGroup.classList.remove('has-error');
    }
  }

  /**
   * フォーム全体のバリデーション
   */
  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    // チェックボックスのバリデーション
    const checkbox = this.form.querySelector('input[type="checkbox"][required]');
    if (checkbox && !checkbox.checked) {
      isValid = false;
      this.showCheckboxError(checkbox);
    }

    return isValid;
  }

  /**
   * チェックボックスのエラー表示
   */
  showCheckboxError(checkbox) {
    const checkboxContainer = checkbox.closest('.checkbox');
    if (checkboxContainer && !checkboxContainer.querySelector('.error-message')) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = '利用規約に同意してください';
      errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
      `;
      checkboxContainer.appendChild(errorDiv);
    }
  }

  /**
   * フォーム送信をセットアップ
   */
  setupFormSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 二重送信防止
      if (this.isSubmitting) return;

      // バリデーション実行
      if (!this.validateForm()) {
        this.showNotification('入力内容に誤りがあります', 'error');
        // 最初のエラーフィールドにスクロール
        const firstError = this.form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // 送信処理
      await this.submitForm();
    });
  }

  /**
   * フォームを送信
   */
  async submitForm() {
    this.isSubmitting = true;
    this.setSubmitButtonState(true);

    try {
      // フォームデータを取得
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // EmailJSを使用する場合
      /*
      await emailjs.send(
        SITE_CONFIG.emailJS.serviceId,
        SITE_CONFIG.emailJS.templateId,
        data
      );
      */

      // デモ用：2秒待機
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 成功メッセージ
      this.showSuccessMessage();
      this.form.reset();
      
    } catch (error) {
      console.error('送信エラー:', error);
      this.showNotification('送信に失敗しました。しばらくしてから再度お試しください。', 'error');
    } finally {
      this.isSubmitting = false;
      this.setSubmitButtonState(false);
    }
  }

  /**
   * 送信ボタンの状態を設定
   */
  setSubmitButtonState(isLoading) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = `
        <svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="30 10" />
        </svg>
        送信中...
      `;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.textContent = '送信する';
    }
  }

  /**
   * 成功メッセージを表示
   */
  showSuccessMessage() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="#10B981"/>
            <path d="M20 32L28 40L44 24" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>送信完了</h2>
        <p>お問い合わせありがとうございます。<br>担当者より折り返しご連絡いたします。</p>
        <button class="modal-close-btn">閉じる</button>
      </div>
    `;

    document.body.appendChild(modal);

    // アニメーション用にちょっと待つ
    setTimeout(() => modal.classList.add('show'), 10);

    // 閉じるボタン
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });

    // オーバーレイクリックで閉じる
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });
  }

  /**
   * 通知を表示
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * アニメーションをセットアップ
   */
  setupAnimations() {
    // Intersection Observerでフェードインアニメーション
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // フォーム要素を監視
    const formGroups = this.form.querySelectorAll('.input, .input-e, .input-11, .input-13, .input-15, .input-25, .radios, .checkbox');
    formGroups.forEach(group => {
      observer.observe(group);
    });
  }
}

// ページ読み込み時にフォームを初期化
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm('contact-form');
});

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});