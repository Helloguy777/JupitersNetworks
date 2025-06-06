//gtag//
document.head.appendChild(Object.assign(document.createElement('script'), { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-FG22JV74V5' })).onload = () => { window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-FG22JV74V5'); };

//if some variables arent set, set their defaults. ('proxy-transport' isn't here as that actually doesnt handle it, its handled in /pages/proxy.html)
if (!localStorage.getItem('particles-enabled')){
  localStorage.setItem('particles-enabled',true);
}

function loadCloak(){
  if (localStorage.getItem('custom-title')){
    document.querySelectorAll('title').forEach((title)=>{title.remove()}); //Removes all titles
    
    //title
    let customTitle = document.createElement('title');
    customTitle.textContent = localStorage.getItem('custom-title');

    document.head.appendChild(customTitle);
  }

  if (localStorage.getItem('custom-favicon')){
    let customFavicon = document.createElement('link');
    customFavicon.rel = 'icon';
    customFavicon.href = localStorage.getItem('custom-favicon');
      
    document.head.appendChild(customFavicon);
  } else{
    let customFavicon = document.createElement('link');
    customFavicon.rel = 'icon';
    customFavicon.href = 'logo.ico'
      
    document.head.appendChild(customFavicon);
  }
}

function loadTheme(){
  let theme = document.createElement('style');

  // load theme
  if (!localStorage.getItem('theme')){
    theme.innerHTML = `
    :root {
      /* Font settings */
      --font-family: sans-serif;
      --font-color: rgb(255, 255, 255); /* White */

      /* Custom */
      --sidebar-size: 50px;
      --sidebar-icon-color: rgb(255,255,255);

      /* Background colors */
      --primary-light: rgb(225, 160, 255); /* Light purple */
      --primary-mid: rgb(180, 100, 230);   /* Medium purple */
      --primary-dark: rgb(130, 70, 190);   /* Dark purple */
      --accent-color: rgb(100, 70, 130);   /* Muted purple accent */
      --accent-color-dark: rgb(85, 60, 110); /* Darker purple accent */

      --background-dark: rgb(11, 5, 15); /* Deep purple-black */
      --background-light: rgb(27, 13, 41); /* Soft purple-gray */
    }
    `
  } else{
    theme.innerHTML = localStorage.getItem('theme');
  }
  document.head.append(theme);
}

function loadPlugins(){
  if (localStorage.getItem('plugin-list')){
    if (!String(window.location).includes('/pages/')){
      let pluginList = JSON.parse(localStorage.getItem('plugin-list'));

      pluginList.forEach((plugin) => {
        if (plugin.enabled){
          eval(atob(plugin.js))
        }
      });
    }
  }
}

function loadMetaTags() {
  const metaTitle = document.createElement('meta');
  metaTitle.setAttribute('name', 'title');
  metaTitle.setAttribute('content', 'Universal Unblocker v3');
  document.head.appendChild(metaTitle);

  const metaDescription = document.createElement('meta');
  metaDescription.setAttribute('name', 'description');
  metaDescription.setAttribute('content', 'The best place to play unblocked games!');
  document.head.appendChild(metaDescription);

  const metaKeywords = document.createElement('meta');
  metaKeywords.setAttribute('name', 'keywords');
  metaKeywords.setAttribute('content', 'unblocked,games,minecraft,roblox,fortnite,unblocked-games,unblocked games,unbl0ck3d,unbl0cked,interstellar,doge unblocker,titanium network,proxy,pr0xy,game');
  document.head.appendChild(metaKeywords);

  const metaRobots = document.createElement('meta');
  metaRobots.setAttribute('name', 'robots');
  metaRobots.setAttribute('content', 'index, follow');
  document.head.appendChild(metaRobots);

  const metaCharset = document.createElement('meta');
  metaCharset.setAttribute('charset', 'UTF-8');
  document.head.appendChild(metaCharset);

  const metaLanguage = document.createElement('meta');
  metaLanguage.setAttribute('name', 'language');
  metaLanguage.setAttribute('content', 'English');
  document.head.appendChild(metaLanguage);

  const ogTitle = document.createElement('meta');
  ogTitle.setAttribute('property', 'og:title');
  ogTitle.setAttribute('content', 'Universal Unblocker v3');
  document.head.appendChild(ogTitle);

  const ogDescription = document.createElement('meta');
  ogDescription.setAttribute('property', 'og:description');
  ogDescription.setAttribute('content', 'The best place to play unblocked games!');
  document.head.appendChild(ogDescription);

  const ogImage = document.createElement('meta');
  ogImage.setAttribute('property', 'og:image');
  ogImage.setAttribute('content', window.location.origin + "/logo.png");
  document.head.appendChild(ogImage);
}

async function loadSideBar(){
  if (!window.location.pathname.includes('pages')){
    try{
      await fetch("/pages/sidebar.html")
        .then((response)=>response.text())
        .then((text)=>{

          let sidebar = document.getElementById('sidebar');

          sidebar.innerHTML = text;

          //Set background colors [This is the easiest way I could find while still having the dynamic sidebar (syncd along all pages)]
          switch(window.location.pathname){
            case "/": case "/index.html": case "":
              document.getElementById('home').style.backgroundColor = "var(--accent-color)";
              break;
            case "/g": case "/g.html":
              document.getElementById('games').style.backgroundColor = "var(--accent-color)";
              break;
            case "/m": case "/m.html":
              document.getElementById('methods').style.backgroundColor = "var(--accent-color)";
              break;
            case "/p": case "/p.html":
              document.getElementById('search').style.backgroundColor = "var(--accent-color)";
              break;
            case "/s": case "/s.html":
              document.getElementById('settings').style.backgroundColor = "var(--accent-color)";
              break;
            case "/a": case "/a.html":
              document.getElementById('apps').style.backgroundColor = "var(--accent-color)";
              break;
            case "/l": case "/l.html":
              document.getElementById('links').style.backgroundColor = "var(--accent-color)";
              break;
          }

          if (!window.location.pathname.slice(1).includes('/')){
            if (localStorage.getItem('custom-img')){
              if (localStorage.getItem('custom-img').includes('https://')){document.getElementById('logo').src = localStorage.getItem('custom-img')
              } else{
                document.getElementById('logo').src = `/images/logo/${localStorage.getItem('custom-img')}.png`
              }
            } else{
              document.getElementById('logo').src = `/images/logo/logo.png`
            }
          }
        })
    } catch(e){
      console.error(e)
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadCloak();
  loadTheme();
  if (document.getElementById('sidebar')){loadSideBar();};
  loadPlugins();
  loadMetaTags();
});