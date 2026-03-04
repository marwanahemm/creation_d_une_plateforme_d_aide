const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    });
    
    function toggleMenu() {
      document.getElementById('burger').classList.toggle('open');
      document.getElementById('navMobile').classList.toggle('open');
    }
    
    document.addEventListener('click', (e) => {
      const burger = document.getElementById('burger');
      const menu = document.getElementById('navMobile');
      if (!burger.contains(e.target) && !menu.contains(e.target)) {
        burger.classList.remove('open');
        menu.classList.remove('open');
      }
    });