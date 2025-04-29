// Naslouchá kliknutí na ikonu rozšíření
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: triggerFullscreen // Spustíme aktualizovanou funkci
    });
  } else {
    console.error("Nelze získat ID aktivní karty.");
  }
});

// ================================================================
// TATO FUNKCE BUDE VLOŽENA A SPUŠTĚNA PŘÍMO V KONTEXTU WEBOVÉ STRÁNKY
// ================================================================
function triggerFullscreen() {
  console.log("Pokouším se najít video element pro fullscreen...");

  let targetElement = null;

  // Priorita 1: Najít <video> tag uvnitř specifického kontejneru Kaltura
  // Toto je nejlepší cíl, pokud existuje a je přístupný
  const kalturaContainer = document.getElementById('__8s39c'); // ID hlavního kontejneru z obrázku
  if (kalturaContainer) {
      console.log("Nalezen kontejner Kaltura (__8s39c). Hledám <video> uvnitř...");
      targetElement = kalturaContainer.querySelector('video');
      if (targetElement) {
          console.log("Nalezen <video> element uvnitř kontejneru Kaltura:", targetElement);
      } else {
          console.log("<video> element uvnitř kontejneru Kaltura nenalezen.");
      }
  } else {
      console.log("Kontejner Kaltura (__8s39c) nenalezen.");
  }


  // Priorita 2: Pokud <video> uvnitř kontejneru není, zkusit přímo ID video přehrávače z obrázku
  // Může to být DIV, který obaluje video, ale fullscreen by měl fungovat i na něm.
  if (!targetElement) {
    console.log("Zkouším najít element podle ID '__8s39c-video'...");
    targetElement = document.getElementById('__8s39c-video');
    if (targetElement) {
        console.log("Nalezen element '__8s39c-video'.", targetElement);
    } else {
         console.log("Element '__8s39c-video' nenalezen.");
    }
  }

  // Priorita 3: Pokud ani to ne, zkusit obecněji najít video podle třídy z obrázku
  if (!targetElement) {
      console.log("Zkouším najít <video> uvnitř '.playkit-video-player'...");
      const videoPlayerDiv = document.querySelector('.playkit-video-player');
      if (videoPlayerDiv) {
          targetElement = videoPlayerDiv.querySelector('video');
          if(targetElement) {
               console.log("Nalezen <video> element uvnitř '.playkit-video-player'.", targetElement);
          } else {
               console.log("<video> element nenalezen uvnitř '.playkit-video-player', zkusím samotný div '.playkit-video-player'.");
               targetElement = videoPlayerDiv; // Zkusíme samotný kontejner
          }
      } else {
          console.log("Element s třídou '.playkit-video-player' nenalezen.");
      }
  }

  // Priorita 4: Jako poslední možnost zkusit hlavní kontejner z obrázku
  if (!targetElement) {
      console.log("Jako poslední možnost zkouším kontejner '__8s39c' samotný...");
      // kalturaContainer byl hledán už v Prioritě 1
      targetElement = kalturaContainer; // Znovu použijeme proměnnou z Priority 1
       if (targetElement) {
        console.log("Používám kontejner '__8s39c'.", targetElement);
       } else {
        console.log("Ani kontejner '__8s39c' nebyl nalezen.");
       }
  }


  // --- Akce ---
  if (targetElement) {
    // Zkontrolujeme, zda už nejsme ve fullscreenu s tímto elementem
    if (document.fullscreenElement === targetElement) {
      console.log("Element je již ve fullscreenu, pokouším se ukončit...");
      document.exitFullscreen()
        .then(() => console.log("Fullscreen úspěšně ukončen."))
        .catch(err => {
            console.error(`Chyba při pokusu o ukončení fullscreenu: ${err.message}`, err);
            alert(`Nepodařilo se ukončit fullscreen: ${err.message}`);
        });
    } else {
      console.log("Pokouším se spustit fullscreen pro element:", targetElement);
      targetElement.requestFullscreen()
        .then(() => {
          console.log('Element by měl být ve fullscreenu.');
        })
        .catch(err => {
          console.error(`Chyba při pokusu o fullscreen: ${err.message}`, err);
          // Zkusíme zobrazit alert, pokud je to možné
          try { alert(`Nepodařilo se spustit fullscreen: ${err.message}`); } catch(e) {}
        });
    }
  } else {
    console.warn('Nepodařilo se najít žádný vhodný element (video nebo kontejner) pro fullscreen.');
    try { alert('Požadovaný video přehrávač nebyl na této stránce nalezen nebo identifikován.'); } catch(e) {}
  }
}
