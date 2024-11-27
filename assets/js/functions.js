$(document).ready(function() {
  var canScroll = true,
      scrollController = null,
      isScrollingInExperienceContent = false; // Flag to check if we're scrolling inside .experience-content

  // Prevent global scrolling when mouse is inside .experience-content
  var $experienceContent = $('.experience-content');
  
  // Disable tab control while hovering over .experience-content
  $experienceContent.on('mouseenter', function() {
    isScrollingInExperienceContent = true; // User is inside .experience-content, disable tab switching
  }).on('mouseleave', function() {
    isScrollingInExperienceContent = false; // User leaves .experience-content, re-enable tab switching
  });

  // Listen to scroll events (mousewheel, DOMMouseScroll)
  $(this).on('mousewheel DOMMouseScroll', function(e) {
    if (isScrollingInExperienceContent) {
      // If we're scrolling within .experience-content, prevent global scroll
      e.preventDefault(); // Prevent the default scroll behavior entirely

      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

      // Check if we're scrolling up or down inside .experience-content
      if (delta > 50 && canScroll) { // Scroll up
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function() {
          canScroll = true;
        }, 100); // Timeout to avoid continuous scrolling
        
        // Scroll the content inside .experience-content without affecting the main page
        var currentScroll = $experienceContent.scrollTop();
        if (currentScroll > 0) {
          $experienceContent.scrollTop(currentScroll - 50); // Scroll up within .experience-content
        }
      }
      else if (delta < -50 && canScroll) { // Scroll down
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function() {
          canScroll = true;
        }, 100); // Timeout to avoid continuous scrolling

        // Scroll the content inside .experience-content without affecting the main page
        var currentScroll = $experienceContent.scrollTop();
        var maxScroll = $experienceContent[0].scrollHeight - $experienceContent.outerHeight();
        if (currentScroll < maxScroll) {
          $experienceContent.scrollTop(currentScroll + 50); // Scroll down within .experience-content
        }
      }
    } else {
      // If we're NOT inside .experience-content, handle the global scroll behavior
      if (!$('.outer-nav').hasClass('is-vis')) {
        e.preventDefault();

        var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

        if (delta > 50 && canScroll) {
          canScroll = false;
          clearTimeout(scrollController);
          scrollController = setTimeout(function(){
            canScroll = true;
          }, 800);
          updateHelper(1);
        }
        else if (delta < -50 && canScroll) {
          canScroll = false;
          clearTimeout(scrollController);
          scrollController = setTimeout(function(){
            canScroll = true;
          }, 800);
          updateHelper(-1);
        }
      }
    }
  });

  // Reset scrolling state when scrolling stops
  $(document).on('mouseup mouseleave', function() {
    if (isScrollingInExperienceContent) {
      isScrollingInExperienceContent = false;
      $('.experience-content').removeClass('scrolling'); // Optionally remove the class after scroll ends
    }
  });

  // Existing navigation logic
  $('.side-nav li, .outer-nav li').click(function() {
    if (!($(this).hasClass('is-active'))) {
      var $this = $(this),
          curActive = $this.parent().find('.is-active'),
          curPos = $this.parent().children().index(curActive),
          nextPos = $this.parent().children().index($this),
          lastItem = $(this).parent().children().length - 1;

      updateNavs(nextPos);
      updateContent(curPos, nextPos, lastItem);
    }
  });

  // Determine scroll, swipe, and arrow key direction
  function updateHelper(param) {
    var curActive = $('.side-nav').find('.is-active'),
        curPos = $('.side-nav').children().index(curActive),
        lastItem = $('.side-nav').children().length - 1,
        nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
    else if (param.type === "swipedown" || param.keyCode === 38 || param < 0){
      if (curPos !== 0){
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
      else {
        nextPos = lastItem;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
  }

  // Sync side and outer navigation
  function updateNavs(nextPos) {
    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');
  }

  // Update main content area
  function updateContent(curPos, nextPos, lastItem) {
    $('.main-content').children().removeClass('section--is-active');
    $('.main-content').children().eq(nextPos).addClass('section--is-active');
    $('.main-content .section').children().removeClass('section--next section--prev');

    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) {
      $('.main-content .section').children().removeClass('section--next section--prev');
    }
    else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next');
    }
    else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $('.header--cta').addClass('is-active');
    }
    else {
      $('.header--cta').removeClass('is-active');
    }
  }

  // Outer nav logic (no changes needed)
  function outerNav() {
    $('.header--nav-toggle').click(function() {
      $('.perspective').addClass('perspective--modalview');
      setTimeout(function() {
        $('.perspective').addClass('effect-rotate-left--animate');
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis');
    });

    $('.outer-nav--return, .outer-nav li').click(function() {
      $('.perspective').removeClass('effect-rotate-left--animate');
      setTimeout(function() {
        $('.perspective').removeClass('perspective--modalview');
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis');
    });
  }

  // Work slider logic (no changes needed)
  function workSlider() {
    $('.slider--prev, .slider--next').click(function() {
      var $this = $(this),
          curLeft = $('.slider').find('.slider--item-left'),
          curLeftPos = $('.slider').children().index(curLeft),
          curCenter = $('.slider').find('.slider--item-center'),
          curCenterPos = $('.slider').children().index(curCenter),
          curRight = $('.slider').find('.slider--item-right'),
          curRightPos = $('.slider').children().index(curRight),
          totalWorks = $('.slider').children().length,
          $left = $('.slider').children().eq(curLeftPos - 1),
          $right = $('.slider').children().eq(curRightPos + 1);

      if ($this.hasClass('slider--next')) {
        if (curRightPos === totalWorks - 1) {
          $left.addClass('slider--item-center');
          $center.removeClass('slider--item-center').addClass('slider--item-left');
          $right.addClass('slider--item-right');
        } else {
          $left.addClass('slider--item-center');
        }
      }
    });
  }
});
