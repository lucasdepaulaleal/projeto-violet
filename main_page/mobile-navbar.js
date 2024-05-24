let stars = document.getElementById('stars')
        let moon = document.getElementById('moon')
        let montains_behind = document.getElementById('montains_behind')
        let text = document.getElementById('text')
        let montains_front = document.getElementById('montains_front')
        let header = document.querySelector('header')

        window.addEventListener('scroll', function(){
            let value = window.scrollY;
            stars.style.left = value * 0.2 + 'px';
            moon.style.top = value * 0.9 + 'px';
            montains_behind.style.top = value * 0.3 + 'px';
            montains_front.style.top = value * 0.1 + 'px';
            text.style.marginRight = value * 3 + 'px';
            text.style.marginTop = value * 1 + 'px';
            btn.style.marginTop = value * 1.5 + 'px';
            header.style.top = value * 0.2 + 'px';
        })
        
class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
      this.mobileMenu = document.querySelector(mobileMenu);
      this.navList = document.querySelector(navList);
      this.navLinks = document.querySelectorAll(navLinks);
      this.activeClass = "active";
  
      this.handleClick = this.handleClick.bind(this);
    }
  
    animateLinks() {
      this.navLinks.forEach((link, index) => {
        link.style.animation
          ? (link.style.animation = "")
          : (link.style.animation = `navLinkFade 0.5s ease forwards ${
              index / 7 + 0.3
            }s`);
      });
    }
  
    handleClick() {
      this.navList.classList.toggle(this.activeClass);
      this.mobileMenu.classList.toggle(this.activeClass);
      this.animateLinks();
    }
  
    addClickEvent() {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
  
    init() {
      if (this.mobileMenu) {
        this.addClickEvent();
      }
      return this;
    }
  }
  
  const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li",
  );
  mobileNavbar.init();