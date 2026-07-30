document.addEventListener('DOMContentLoaded', async () => {
  const versionLabel = document.getElementById('version-label');
  const downloadBtn = document.getElementById('download-btn');
  const versionLabelAndroid = document.getElementById('version-label-android');
  const downloadBtnAndroid = document.getElementById('download-btn-android');
  
  const counterWinDiv = document.getElementById('download-counter-win');
  const countWinNumber = document.getElementById('download-count-win-number');
  const counterAndroidDiv = document.getElementById('download-counter-android');
  const countAndroidNumber = document.getElementById('download-count-android-number');
  
  let winDownloads = 0;
  let androidDownloads = 0;
  
  // 1. Fetch Windows release info from GitHub API (itimt/lbp-iptv-releases)
  try {
    const response = await fetch('https://api.github.com/repos/itimt/lbp-iptv-releases/releases', { cache: 'no-store' });
    if (response.ok) {
      const releases = await response.json();
      if (releases.length > 0) {
        const latestRelease = releases[0];
        const version = latestRelease.tag_name;
        
        if (versionLabel) {
          versionLabel.textContent = `Versão Mais Recente (${version})`;
        }
        
        if (latestRelease.assets && latestRelease.assets.length > 0) {
          const exeAsset = latestRelease.assets.find(asset => asset.name.endsWith('.exe'));
          if (exeAsset && downloadBtn) {
            downloadBtn.href = exeAsset.browser_download_url;
          }
        }
        
        // Sum total downloads (Windows)
        releases.forEach(release => {
          if (release.assets) {
            release.assets.forEach(asset => {
              if (asset.name.endsWith('.exe')) {
                winDownloads += asset.download_count || 0;
              }
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Erro ao buscar última versão Windows do GitHub:', error);
  }

  // 2. Fetch Android release info from GitHub API (itimt/update)
  try {
    const androidResponse = await fetch('https://api.github.com/repos/itimt/update/releases', { cache: 'no-store' });
    if (androidResponse.ok) {
      const androidReleases = await androidResponse.json();
      if (androidReleases.length > 0) {
        const latestAndroidRelease = androidReleases[0];
        
        if (versionLabelAndroid) {
          versionLabelAndroid.textContent = `Versão Mais Recente`;
        }
        
        if (latestAndroidRelease.assets && latestAndroidRelease.assets.length > 0) {
          const apkAsset = latestAndroidRelease.assets.find(asset => asset.name.endsWith('.apk'));
          if (apkAsset && downloadBtnAndroid) {
            downloadBtnAndroid.href = apkAsset.browser_download_url;
          }
        }
        
        // Sum total downloads (Android)
        androidReleases.forEach(release => {
          if (release.assets) {
            release.assets.forEach(asset => {
              if (asset.name.endsWith('.apk')) {
                androidDownloads += asset.download_count || 0;
              }
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('Erro ao buscar última versão Android do GitHub:', error);
  }

  // 3. Download Counters & Click Trackers
  const localWinClicks = parseInt(localStorage.getItem('lbp_win_clicks') || '0', 10);
  const localAndroidClicks = parseInt(localStorage.getItem('lbp_android_clicks') || '0', 10);

  let displayWinCount = winDownloads + localWinClicks;
  let displayAndroidCount = androidDownloads + localAndroidClicks;

  const updateCounterUI = () => {
    if (counterWinDiv && countWinNumber) {
      countWinNumber.textContent = displayWinCount.toLocaleString('pt-BR');
      counterWinDiv.style.display = 'inline-flex';
    }
    if (counterAndroidDiv && countAndroidNumber) {
      countAndroidNumber.textContent = displayAndroidCount.toLocaleString('pt-BR');
      counterAndroidDiv.style.display = 'inline-flex';
    }
  };

  updateCounterUI();

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const current = parseInt(localStorage.getItem('lbp_win_clicks') || '0', 10);
      localStorage.setItem('lbp_win_clicks', current + 1);
      displayWinCount++;
      updateCounterUI();
    });
  }

  if (downloadBtnAndroid) {
    downloadBtnAndroid.addEventListener('click', () => {
      const current = parseInt(localStorage.getItem('lbp_android_clicks') || '0', 10);
      localStorage.setItem('lbp_android_clicks', current + 1);
      displayAndroidCount++;
      updateCounterUI();
    });
  }

  // 4. Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetHref = this.getAttribute('href');
      if (targetHref && targetHref !== '#') {
        const targetEl = document.querySelector(targetHref);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 5. Donation Modal Logic
  const btnDonateNav = document.getElementById('btn-donate-nav');
  const donationOverlay = document.getElementById('donation-overlay');
  const btnCloseDonate = document.getElementById('btn-close-donate');

  if (btnDonateNav && donationOverlay && btnCloseDonate) {
    btnDonateNav.addEventListener('click', () => {
      donationOverlay.classList.add('active');
    });
    btnCloseDonate.addEventListener('click', () => {
      donationOverlay.classList.remove('active');
    });
    donationOverlay.addEventListener('click', (e) => {
      if (e.target === donationOverlay) {
        donationOverlay.classList.remove('active');
      }
    });
  }

  // 6. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const faqAnswer = btn.nextElementSibling;
      const isActive = faqItem.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      if (!isActive) {
        faqItem.classList.add('active');
        if (faqAnswer) {
          faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
        }
      }
    });
  });
});
