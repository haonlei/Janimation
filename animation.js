
// Copyright start
// © Code by T.RICKS
// You have the license to use this code in your projects but not redistribute it to others

// Find all text with .tricks class and break each letter into a span
var tricksWord = document.getElementsByClassName("tricks");
  for (var i = 0; i < tricksWord.length; i++) {

  var wordWrap = tricksWord.item(i);
  wordWrap.innerHTML = wordWrap.innerHTML.replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span class="tricksword">$2</span>');

}

var tricksLetter = document.getElementsByClassName("tricksword");
for (var i = 0; i < tricksLetter.length; i++) {

   var letterWrap = tricksLetter.item(i);
   letterWrap.innerHTML = letterWrap.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

}
// Copyright end

// Slide In Animation
var slideIn = anime.timeline({
  loop: false,
  autoplay: false,
});

slideIn
  .add({
    targets: '.slide-in .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 2250,
    delay: (el, i) => 150 * (i+1)
 }).add({
    targets: '.slide-in',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });
  

// Slide Up Animation
var slideUp = anime.timeline({
  loop: false,
  autoplay: false,
});

slideUp
    .add({
    targets: '.slide-up .letter',
    translateY: ["1.1em", 0],
    opacity: [0,1],
    translateZ: 0,
    duration: 750,
    delay: (el, i) => 50 * i
  }).add({
    targets: '.slide-up',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });
  
  
// Fade Up Animation
var fadeUp = anime.timeline({
  loop: false,
  autoplay: false,
});

fadeUp 
  .add({
    targets: '.fade-up .letter',
    translateY: [100,0],
    translateZ: 0,
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 1400,
    delay: (el, i) => 300 + 30 * i
  }).add({
    targets: '.fade-up .letter',
    translateY: [0,-100],
    opacity: [1,0],
    easing: "easeInExpo",
    duration: 1200,
    delay: (el, i) => 100 + 30 * i
  });
  
// Play your animation with these
fadeUp.play();
slideUp.play();
slideIn.play();
rotateIn.play();
popIn.play();

// Wait before playing animation
setTimeout(() => {  
	// Put the play below this line
}, 800);

// Play animaton when something is clicked
$( ".your-button-class" ).click(function() {
	// Put the play below this line
});

// Play animaton when hovered in
$( ".your-button-class" ).mouseenter(function() {
		// Put the play below this line
});

// Play animation when scrolled into view
$('.#heading-container').on('inview', function(event, isInView) {
  if (isInView) {
		// Put the play below this line
  } else {
  }
});


{
    // body element
    const body = document.body;

    // helper functions
    const MathUtils = {
        // linear interpolation
        lerp: (a, b, n) => (1 - n) * a + n * b,
        // distance between two points
        distance: (x1,y1,x2,y2) => Math.hypot(x2-x1, y2-y1)
    }

    // get the mouse position
    const getMousePos = (ev) => {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        }
        else if (ev.clientX || ev.clientY) 	{
            posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
            posy = ev.clientY + body.scrollTop + docEl.scrollTop;
        }
        return {x: posx, y: posy};
    }

    // mousePos: current mouse position
    // cacheMousePos: previous mouse position
    // lastMousePos: last last recorded mouse position (at the time the last image was shown)
    let mousePos = lastMousePos = cacheMousePos = {x: 0, y: 0};
    
    // update the mouse position
    window.addEventListener('mousemove', ev => mousePos = getMousePos(ev));
    
    // gets the distance from the current mouse position to the last recorded mouse position
    const getMouseDistance = () => MathUtils.distance(mousePos.x,mousePos.y,lastMousePos.x,lastMousePos.y);

    class Image {
        constructor(el) {
            this.DOM = {el: el};
            // image deafult styles
            this.defaultStyle = {
                scale: 1,
                x: 0,
                y: 0,
                opacity: 0
            };
            // get sizes/position
            this.getRect();
            // init/bind events
            this.initEvents();
        }
        initEvents() {
            // on resize get updated sizes/position
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // reset styles
            TweenMax.set(this.DOM.el, this.defaultStyle);
            // get sizes/position
            this.getRect();
        }
        getRect() {
            this.rect = this.DOM.el.getBoundingClientRect();
        }
        isActive() {
            // check if image is animating or if it's visible
            return TweenMax.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
        }
    }

    class ImageTrail {
        constructor() {
            // images container
            this.DOM = {content: document.querySelector('.content')};
            // array of Image objs, one per image element
            this.images = [];
            [...this.DOM.content.querySelectorAll('img')].forEach(img => this.images.push(new Image(img)));
            // total number of images
            this.imagesTotal = this.images.length;
            // upcoming image index
            this.imgPosition = 0;
            // zIndex value to apply to the upcoming image
            this.zIndexVal = 1;
            // mouse distance required to show the next image
            this.threshold = 100;
            // render the images
            requestAnimationFrame(() => this.render());
        }
        render() {
            // get distance between the current mouse position and the position of the previous image
            let distance = getMouseDistance();
            // cache previous mouse position
            cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
            cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

            // if the mouse moved more than [this.threshold] then show the next image
            if ( distance > this.threshold ) {
                this.showNextImage();

                ++this.zIndexVal;
                this.imgPosition = this.imgPosition < this.imagesTotal-1 ? this.imgPosition+1 : 0;
                
                lastMousePos = mousePos;
            }

            // check when mousemove stops and all images are inactive (not visible and not animating)
            let isIdle = true;
            for (let img of this.images) {
                if ( img.isActive() ) {
                    isIdle = false;
                    break;
                }
            }
            // reset z-index initial value
            if ( isIdle && this.zIndexVal !== 1 ) {
                this.zIndexVal = 1;
            }

            // loop..
            requestAnimationFrame(() => this.render());
        }
        showNextImage() {
            // show image at position [this.imgPosition]
            const img = this.images[this.imgPosition];
            // kill any tween on the image
            TweenMax.killTweensOf(img.DOM.el);

            new TimelineMax()
            // show the image
            .set(img.DOM.el, {
                startAt: {opacity: 0, scale: 1},
                opacity: 1,
                scale: 1,
                zIndex: this.zIndexVal,
                x: cacheMousePos.x - img.rect.width/2,
                y: cacheMousePos.y - img.rect.height/2
            }, 0)
            // animate position
            .to(img.DOM.el, 0.9, {
                ease: Expo.easeOut,
                x: mousePos.x - img.rect.width/2,
                y: mousePos.y - img.rect.height/2
            }, 0)
            // then make it disappear
            .to(img.DOM.el, 1, {
                ease: Power1.easeOut,
                opacity: 0
            }, 0.4)
            // scale down the image
            .to(img.DOM.el, 1, {
                ease: Quint.easeOut,
                scale: 0.2
            }, 0.4);
        }
    }

    // Preload images
    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('.content__img'), resolve);
        });
    };
    
    // And then..
    preloadImages().then(() => {
        // Remove the loader
        document.body.classList.remove('loading');
        new ImageTrail();
    });
}

    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 30,
      freeMode: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });


    charset="utf-8"
    luxy.init();



  $('.c-nav-menu-btn-icon').on('click', function(){
    $('body').toggleClass('no-scroll');
  });




document.addEventListener( 'DOMContentLoaded', function() {

$(".slider-component").each(function (index) {
  const swiper = new Swiper($(this).find(".swiper")[0], {
    speed: 750,
    loop: true,
    autoHeight: false,
    centeredSlides: false,
    followFinger: true,
    slidesPerView: "auto",
  /*  autoplay: {
      delay: 1500,
      disableOnInteraction: false
    },
    */
    disableOnInteraction: false,
    mousewheel: {
      forceToAxis: true
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
    breakpoints: {
      // mobile landscape
      480: {
        slidesPerView: "auto"
      },
      // tablet
      768: {
        slidesPerView: "auto"
      },
      // desktop
      992: {
        slidesPerView: "auto"
      }
    },
    pagination: {
      el: $(this).find(".swiper-bullet-wrapper")[0],
      bulletActiveClass: "is-active",
      bulletClass: "swiper-bullet",
      bulletElement: "button",
      clickable: true
    },
    navigation: {
      nextEl: $(this).find(".swiper-next")[0],
      prevEl: $(this).find(".swiper-prev")[0],
      disabledClass: "is-disabled"
    },
    scrollbar: {
      el: $(this).find(".swiper-drag-wrapper")[0],
      draggable: true,
      dragClass: "swiper-drag",
      snapOnRelease: true
    },
    slideActiveClass: "is-active",
    slideDuplicateActiveClass: "is-active"
  });
  //
});


  });