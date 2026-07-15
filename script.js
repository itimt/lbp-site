document.addEventListener('DOMContentLoaded', async () => {
  const versionLabel = document.getElementById('version-label');
  const downloadBtn = document.getElementById('download-btn');
  
  try {
    // Fetch latest release from GitHub API
    // Repositório: itimt/lbp-iptv-releases
    const response = await fetch('https://api.github.com/repos/itimt/lbp-iptv-releases/releases/latest');
    
    if (response.ok) {
      const data = await response.json();
      const version = data.tag_name; // e.g. "v1.0.13"
      
      // Update label
      if (versionLabel) {
        versionLabel.textContent = `Versão Mais Recente (${version})`;
      }
      
      // Find the .exe asset URL
      if (data.assets && data.assets.length > 0) {
        const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
        if (exeAsset) {
          downloadBtn.href = exeAsset.browser_download_url;
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
});
