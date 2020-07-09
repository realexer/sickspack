<script>

  export let page = null;
  export let gtag_id = null;

  $: {
    if (typeof gtag !== "undefined"){
      gtag("config", gtag_id, {
        page_path: $page.path
      });
    }
  }
</script>