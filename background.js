chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (tab.url && tab.url.includes('youtube.com')) {
        await chrome.scripting.executeScript({
          target: { tabId: activeInfo.tabId },
          function: handleYouTubeVideo,
          args: ['playVideo']
        });
      }
  
      const tabs = await chrome.tabs.query({active: false});
      for (let tab of tabs) {
        if (tab.url && tab.url.includes('youtube.com')) {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: handleYouTubeVideo,
            args: ['pauseVideo']
          }).catch(() => {}); // Ignore errors for inactive tabs
        }
      }
    } catch (error) {
      console.error("Error executing script:", error);
    }
  });
  
  function handleYouTubeVideo(action) {
    const youtubeVideo = document.querySelector('video.html5-main-video');
    if (youtubeVideo) {
      if (action === "pauseVideo" && !youtubeVideo.paused) {
        youtubeVideo.pause();
      } else if (action === "playVideo" && youtubeVideo.paused) {
        youtubeVideo.play();
      }
    }
  }