document.addEventListener('DOMContentLoaded', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    checkOrientation();
  });

  const sections = document.querySelectorAll('.section');
  let currentSection = 0;
  let isScrolling = false;

  function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
      sections[currentSection].classList.remove('active');
      sections[index].scrollIntoView({ behavior: 'smooth' });
      sections[index].classList.add('active');
      currentSection = index;
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  }

  window.addEventListener('wheel', (event) => {
    if (isScrolling || document.body.classList.contains('mobile-menu-open')) return;
    isScrolling = true;
    if (event.deltaY > 0) {
      scrollToSection(currentSection + 1);
    } else {
      scrollToSection(currentSection - 1);
    }
  });

  window.addEventListener('touchstart', handleTouchStart, false);        
  window.addEventListener('touchmove', handleTouchMove, false);

  let xDown = null;                                                        
  let yDown = null;

  function handleTouchStart(evt) {
    const firstTouch = (evt.touches || evt.originalEvent.touches)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
  };                                                

  function handleTouchMove(evt) {
    if (!xDown || !yDown || isScrolling || document.body.classList.contains('mobile-menu-open')) {
      return;
    }

    let xUp = evt.touches[0].clientX;                                    
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */ 
      } else {
        /* right swipe */
      }                       
    } else {
      isScrolling = true;
      if (yDiff > 0) {
        /* up swipe */ 
        scrollToSection(currentSection + 1);
      } else { 
        /* down swipe */
        scrollToSection(currentSection - 1);
      }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
  }

  // Set the initial active section
  sections[currentSection].classList.add('active');

  // Scroll on arrow click
  document.getElementById('scroll-btn').addEventListener('click', () => {
    scrollToSection(currentSection + 1);
  });

  // Mobile menu functionality
  const burgerBtn = document.getElementById('burger-btn');
  const navigationList = document.querySelector('.navigation-list');

  burgerBtn.addEventListener('click', () => {
    document.body.classList.toggle('mobile-menu-open');

    if (document.body.classList.contains('mobile-menu-open')) {
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
        disableScroll();
      }, 1000);
    } else {
      document.removeEventListener('click', handleOutsideClick);
      enableScroll();
    }
  });

  function handleOutsideClick(event) {
    if (!navigationList.contains(event.target) && event.target !== burgerBtn) {
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('click', handleOutsideClick);
      enableScroll();
    }
  }

  // Disable scroll
  function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  // Enable scroll
  function enableScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  // Handle anchor clicks
  const menuLinks = document.querySelectorAll('.navigation-list a');

  menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        document.body.classList.remove('mobile-menu-open');
        enableScroll();
        document.removeEventListener('click', handleOutsideClick);
        
        // Smooth scroll to target section
        targetSection.scrollIntoView({ behavior: 'smooth' });

        // Update active class
        sections[currentSection].classList.remove('active');
        targetSection.classList.add('active');
        
        // Update current section index
        currentSection = Array.from(sections).indexOf(targetSection);
      }
    });
  });

  // Check orientation
  function checkOrientation() {
    if (window.innerWidth > window.innerHeight) {
      document.body.classList.add('gorizontal');
    } else {
      document.body.classList.remove('gorizontal');
    }
  }

  // Initial check
  checkOrientation();

  // Add event listener for orientation change
  window.addEventListener('orientationchange', checkOrientation);
});
