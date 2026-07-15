document.addEventListener('DOMContentLoaded', async () => {
  const versionLabel = document.getElementById('version-label');
  const downloadBtn = document.getElementById('download-btn');
  
  try {
    // Fetch latest release from GitHub API
    // Repositório: itimt/lbp-iptv-releases
    const response = await fetch('https://api.github.com/repos/itimt/lbp-iptv-releases/releases');
    
    if (response.ok) {
      const releases = await response.json();
      if (releases.length > 0) {
        const latestRelease = releases[0];
        const version = latestRelease.tag_name; // e.g. "v1.0.13"
        
        // Update label
        if (versionLabel) {
          versionLabel.textContent = `Versão Mais Recente (${version})`;
        }
        
        // Find the .exe asset URL
        if (latestRelease.assets && latestRelease.assets.length > 0) {
          const exeAsset = latestRelease.assets.find(asset => asset.name.endsWith('.exe'));
          if (exeAsset) {
            downloadBtn.href = exeAsset.browser_download_url;
          }
        }
        
        // Sum total downloads
        let totalDownloads = 0;
        releases.forEach(release => {
          if (release.assets) {
            release.assets.forEach(asset => {
              if (asset.name.endsWith('.exe')) {
                totalDownloads += asset.download_count;
              }
            });
          }
        });
        
        const counterDiv = document.getElementById('download-counter');
        const countNumber = document.getElementById('download-count-number');
        if (counterDiv && countNumber && totalDownloads > 0) {
          countNumber.textContent = totalDownloads;
          counterDiv.style.display = 'block';
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar a última versão do GitHub:', error);
    // Keep the fallback HTML link and label if fetch fails
  }
  
  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Donation Modal Logic
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

  // FAQ Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const faqAnswer = btn.nextElementSibling;
      const isActive = faqItem.classList.contains('active');
      
      // Close all
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
      }
    });
  });
});
