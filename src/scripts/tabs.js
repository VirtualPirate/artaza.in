(() => {
  const tablist = document.querySelector('.work-tabs');
  const tabs = [...tablist.querySelectorAll('a')];
  const panels = tabs.map(tab => document.querySelector(tab.hash));

  tablist.setAttribute('role', 'tablist');
  document.documentElement.classList.add('tabs-ready');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].tabIndex = 0;
  });

  function showTab() {
    const active = tabs.find(tab => tab.hash === location.hash) || tabs[0];
    tabs.forEach((tab, index) => {
      const selected = tab === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index].hidden = !selected;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
      event.preventDefault();
      if (location.hash !== tab.hash) history.pushState(null, '', tab.hash);
      showTab();
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  });

  window.addEventListener('popstate', showTab);
  window.addEventListener('hashchange', showTab);
  showTab();
})();
