document.addEventListener('DOMContentLoaded', () => {
  // 1. スクロールによる「お茶の浸透（背景色変化）」
  const bgSections = document.querySelectorAll('section[data-bg]');
  
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // セクションが画面の50%を占めたら、bodyの背景色をそのセクションのdata-bg色に変更
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = entry.target.dataset.bg;
      }
    });
  }, { threshold: 0.5 }); // 画面の半分までスクロールしたら発火

  bgSections.forEach(sec => bgObserver.observe(sec));


  // 2. コンテンツとシルエットのフェードイン・フェードアウト
  const fadeElements = document.querySelectorAll('.fade-in-up, .silhouette');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 画面に入ったら表示
        entry.target.classList.add('is-visible');
      } else {
        // 画面から出たら非表示に戻す（スクロールのたびにフワフワさせるため）
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.1 }); // 要素が10%画面に入ったら発火

  fadeElements.forEach(el => fadeObserver.observe(el));
});

// ========================================================
  // 1. 30秒診断ロジック (縦積み＆スクロール対応版)
  // ========================================================
  const quizForm = document.getElementById('sumitoki-quiz');
  const resultCard = document.getElementById('quiz-result');
  const resetBtn = document.getElementById('quiz-reset');

  const resTitle = document.getElementById('result-title');
  const resDesc = document.getElementById('result-desc');
  const resScent = document.getElementById('result-scent');
  // ↓★これを追加して、リストの1行目を取得
  const resStepPoint = document.getElementById('result-step-point'); 

  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const q1 = quizForm.querySelector('input[name="q1"]:checked')?.value;
    const q2 = quizForm.querySelector('input[name="q2"]:checked')?.value;
    const q3 = quizForm.querySelector('input[name="q3"]:checked');

    if (!q1 || !q2 || !q3) {
      alert('すべての質問に回答してください。');
      return;
    }

    // --- ロジックの反映 ---
    if (q2 === '1') {
      resTitle.textContent = '茶葉ライン・美容水';
      resDesc.innerHTML = 'どうしても動けない夜は、これ1本でおしまい。<br>一日の汚れをスッとリセットし、肌に深呼吸を。';
      // ★追加：1ステップの場合の箇条書き
      resStepPoint.textContent = '限界の夜でも迷わず終わる「1ステップ」'; 
    } else {
      resTitle.textContent = '基本の“深呼吸”2ステップ';
      resDesc.innerHTML = '落として整える＋眠る間に満たすを一気に。<br>迷わず続く、あなただけのルーティン。';
      // ★追加：2ステップの場合の箇条書き
      resStepPoint.textContent = '落として満たす、無駄のない「2ステップ」'; 
    }

    resScent.textContent = q3.parentNode.textContent.trim();

    // 結果を表示
    resultCard.classList.remove('hidden');

    // スマホ操作用に、結果カードの位置までスムーズにスクロールする
    setTimeout(() => {
      const yOffset = -50;
      const elementPosition = resultCard.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + yOffset;
  
      window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
      });
    }, 100);
  });

  resetBtn.addEventListener('click', () => {
    quizForm.reset();
    resultCard.classList.add('hidden');
    window.scrollTo({
      top: quizForm.getBoundingClientRect().top + window.pageYOffset - 50,
      behavior: "smooth"
    });
  });