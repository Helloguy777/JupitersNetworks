<script>
  let uvLoaded = false;
  window.addEventListener("uv-ready", () => {
    uvLoaded = true;
    console.log("[UV] Готово!");
  });

  setTimeout(() => {
    if (!uvLoaded) {
      location.href = "/public/404.html"; 
    }
  }, 5000);
</script>
