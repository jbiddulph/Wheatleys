<template>
  <div class="layout">
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
    <MobileCallBar />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-bottom: 5rem;
}

@media (min-width: 900px) {
  main {
    padding-bottom: 0;
  }
}
</style>
