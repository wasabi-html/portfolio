document.addEventListener('DOMContentLoaded', () => {
  const applyBtn = document.getElementById('apply-btn');
  const toast = document.getElementById('copy-toast');

  // ------------------------
  // 反映機能
  // ------------------------
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.input-group input');

      inputs.forEach(input => {
        const targetClass = input.dataset.target;
        let value = input.value.trim();
        const targets = document.querySelectorAll('.' + targetClass);

        if (!targets.length) return;

        if (value === '') {
          targets.forEach(target => {
            target.innerHTML = '';
          });
          return;
        }

        if (targetClass === 'p-discount') {
          value = value.replace(/[^0-9]/g, '');
          targets.forEach(target => {
            target.textContent = value;
          });
        } else if (targetClass === 'p-price') {
          const num = value.replace(/,/g, '');

          if (!isNaN(num) && num !== '') {
            const formatted = Number(num).toLocaleString();
            const htmlValue = formatted.replace(/,/g, '<span>,</span>');

            targets.forEach(target => {
              target.innerHTML = htmlValue;
            });
          } else {
            targets.forEach(target => {
              target.innerHTML = '';
            });
          }
        } else {
          targets.forEach(target => {
            target.textContent = value;
          });
        }
      });
    });
  }

  // ------------------------
  // コピー機能
  // ------------------------
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const currentBtn = e.currentTarget;
    const targetId = currentBtn.dataset.copyTarget;
    const codeElement = document.getElementById(targetId);

    if (!codeElement) return;

    const codeText = codeElement.textContent.trim();
    if (!codeText) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(codeText);
      } else {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = codeText;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.opacity = '0';
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, tempTextArea.value.length);
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
      }

      const originalText = currentBtn.textContent;
      currentBtn.textContent = 'コピーしました！';
      currentBtn.classList.add('active');

      if (toast) {
        toast.classList.add('show');
      }

      setTimeout(() => {
        currentBtn.textContent = originalText;
        currentBtn.classList.remove('active');

        if (toast) {
          toast.classList.remove('show');
        }
      }, 2000);
    } catch (error) {
      alert('コピーに失敗しました');
      console.error(error);
    }
  });
});
  // ------------------------
  // タブ切り替えサンプル
  // ------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        button.classList.add('active');

        const targetId = button.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // ------------------------
  // ダミーチャットbot 連動処理
  // ------------------------
  const cartButtons = document.querySelectorAll('.js-open-chat');
  const chatWindow = document.getElementById('dummy-chatbot');
  const chatCloseBtn = document.getElementById('close-chat');
  const chatSelectedItem = document.getElementById('chat-selected-item');
  const chatItemSelect = document.getElementById('chat-item-select');

  // カートボタンがクリックされた時の処理
  if (cartButtons.length > 0 && chatWindow) {
    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // ボタンに設定した商品名(data-product)を取得
        const productName = e.target.getAttribute('data-product');
        
        // チャット内のテキストを更新
        if (chatSelectedItem) {
          chatSelectedItem.textContent = productName;
        }
        
        // チャット内のセレクトボックスを連動させる
        if (chatItemSelect) {
          chatItemSelect.value = productName;
        }

        // チャットUIを下からスライドイン
        chatWindow.classList.add('is-active');
      });
    });
  }

  // ×ボタンでチャットを閉じる処理
  if (chatCloseBtn && chatWindow) {
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('is-active');
    });
  }

  // ------------------------
  // 共通動画モーダルの制御
  // ------------------------
  const videoOpenBtns = document.querySelectorAll('.js-video-open');
  const globalVideoModal = document.getElementById('js-global-video-modal');
  const globalVideoOverlay = document.getElementById('js-global-video-overlay');
  const globalVideoClose = document.getElementById('js-global-video-close');
  const globalVideoPlayer = document.getElementById('js-global-video-player');

  if (globalVideoModal && globalVideoPlayer) {
      videoOpenBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              // クリックされたサムネイルから、動画のパス（data-video-src）を取得
              const videoSrc = this.getAttribute('data-video-src');
              if (!videoSrc) return;

              // 動画プレーヤーにパスをセットして、モーダルを開いて再生
              globalVideoPlayer.src = videoSrc;
              globalVideoModal.classList.add('is-active');
              globalVideoPlayer.play();
          });
      });

      // 閉じる処理
      const closeVideoModal = () => {
          globalVideoModal.classList.remove('is-active');
          globalVideoPlayer.pause();
          globalVideoPlayer.src = ""; // 次のために動画ソースを空にしてリセット
      };

      if(globalVideoClose) globalVideoClose.addEventListener('click', closeVideoModal);
      if(globalVideoOverlay) globalVideoOverlay.addEventListener('click', closeVideoModal);
  }

  // ------------------------
  // 画像モーダルの制御
  // ------------------------
  const artZoomLinks = document.querySelectorAll('.art-zoom-link');
  const artViewerOverlay = document.getElementById('js-art-viewer-overlay');
  const artViewerImg = document.getElementById('art-viewer-img');
  const artViewerClose = document.getElementById('js-art-viewer-close');

  if (artViewerOverlay && artViewerImg) {
      artZoomLinks.forEach(link => {
          link.addEventListener('click', function(e) {
              e.preventDefault(); 
              const imageSrc = this.getAttribute('href'); 
              artViewerImg.setAttribute('src', imageSrc); 
              artViewerOverlay.style.display = 'flex';
          });
      });

      // 閉じる処理
      const closeArtModal = () => {
          artViewerOverlay.style.display = 'none';
          artViewerImg.setAttribute('src', ''); // 画像をリセット
      };

      if(artViewerClose) artViewerClose.addEventListener('click', closeArtModal);
      
      // 黒い背景部分をクリックした時も閉じる
      artViewerOverlay.addEventListener('click', function(e) {
          if (e.target === this) { 
              closeArtModal();
          }
      });
  }

  // ------------------------
  // YouTube動画モーダルの制御
  // ------------------------
  const ytOpenBtns = document.querySelectorAll('.js-youtube-open');
  const ytModal = document.getElementById('js-youtube-modal');
  const ytOverlay = document.getElementById('js-youtube-overlay');
  const ytClose = document.getElementById('js-youtube-close');
  const ytPlayer = document.getElementById('js-youtube-player');

  if (ytModal && ytPlayer) {
      ytOpenBtns.forEach(btn => {
          btn.addEventListener('click', function() {
              const ytId = this.getAttribute('data-youtube-id');
              if (!ytId) return;

              // YouTubeのURLをセット（autoplay=1 を付けて自動再生させる）
              ytPlayer.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
              ytModal.classList.add('is-active');
          });
      });

      // 閉じる処理
      const closeYtModal = () => {
          ytModal.classList.remove('is-active');
          // srcを空にして動画の再生（音声）を完全に止める
          ytPlayer.src = ""; 
      };

      if(ytClose) ytClose.addEventListener('click', closeYtModal);
      if(ytOverlay) ytOverlay.addEventListener('click', closeYtModal);
  }

  // ------------------------
  // TOPへ戻るボタンの制御
  // ------------------------
  const pageTopBtn = document.getElementById('js-page-top');

  if (pageTopBtn) {
      // スクロール時にボタンの表示/非表示をフワッと切り替え
      window.addEventListener('scroll', () => {
          if (window.pageYOffset > 300) { // 300px下にスクロールしたら表示
              pageTopBtn.classList.add('is-show');
          } else {
              pageTopBtn.classList.remove('is-show');
          }
      });

      // クリックで一番上へスムーススクロール
      pageTopBtn.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }
});