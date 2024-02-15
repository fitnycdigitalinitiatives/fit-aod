$(document).ready(function () {
  //Dropdown fix
  $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
      $('.dropdown-submenu .show').removeClass("show");
    });


    return false;
  });
  // Item browse and search
  if ($('body').hasClass('resource browse') || $('body').hasClass('resource search')) {
    // Infinite scroll/load more
    // check if results have more than one page
    if ($('.pagination .next').length) {
      var status = $(`
        <div class="page-load-status">
          <div class="row justify-content-center mt-3 mt-sm-5">
            <div class="col-auto">
              <div class="spinner-border infinite-scroll-request" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        `);
      status.hide();
      var loadButton = `
      <div class="row justify-content-center mt-3 mt-sm-5">
        <div class="col-auto">
          <button id="load-button" class="cta--button cta--pink" type="button" aria-controls="browse-grid" aria-label="Load more results">
              Load More +
          </button>
        </div>
      </div>
      `;
      $('.pagination-row').after(loadButton).after(status);
      $('#browse-grid').attr('aria-live', 'polite')
      let nextURL;
      let appendElement = '.grid-item-container';
      let currentItemCount;

      function updateNextURL(doc) {
        if ($(doc).find('.next').length) {
          nextURL = $(doc).find('.next').attr('href');
          if (!nextURL.includes('&scroll_request=true')) {
            nextURL = nextURL + '&scroll_request=true';
          }
        } else {
          nextURL = null;
        }
      }

      function getLinkData(doc) {
        if ($(doc).find('script[type="application/ld+json"]').length) {
          var newLinkData = $(doc).find('script[type="application/ld+json"]');
          $('script[type="application/ld+json"]').last().after(newLinkData);
        }
      }

      function updateFocus() {
        var firstLoadedElement = $(appendElement)[currentItemCount];
        $(firstLoadedElement).find('a.card-img').focus();
        getItemCount();
      }

      function getItemCount() {
        currentItemCount = $(appendElement).length
      }
      // get initial nextURL
      updateNextURL(document);
      getItemCount();
      let $container = $('#grid').infiniteScroll({
        // options
        // use function to set custom URLs
        path: function () {
          return nextURL;
        },
        checkLastPage: '.next',
        append: appendElement,
        scrollThreshold: false,
        button: '#load-button',
        hideNav: '.pagination-row',
        status: '.page-load-status',
        history: false,
      });
      // update nextURL on page load
      $container.on('load.infiniteScroll', function (event, body, path, response) {
        history.replaceState(null, null, path.replace('&scroll_request=true', ''));
        updateNextURL(body);
        getLinkData(body);
      });
      $container.on('append.infiniteScroll', function () {
        updateFocus();
      });
    }

    $("#sort-dropdown .dropdown-item").click(function () {
      let queryParams = new URLSearchParams(window.location.search);
      if ($(this).data("sort_by")) {
        queryParams.set("sort_by", $(this).data("sort_by"));
      }
      if ($(this).data("sort_order")) {
        queryParams.set("sort_order", $(this).data("sort_order"));
      }
      if ($(this).data("sort")) {
        queryParams.set("sort", $(this).data("sort"));
      }
      queryParams.set("page", 1);
      window.location.search = queryParams.toString();
    });
  }
  //Media viewer
  if ($('body').hasClass('show')) {
    new Splide('.splide', {
      type: 'slide',
      focus: 0,
      omitEnd: true,
      autoWidth: true,
      height: '65px',
      gap: '0.5rem',
      pagination: false,
      breakpoints: {
        767: {
          height: '50px',
        },
      }
    }).mount();
    $('#media-slider-container .splide .splide__slide button').click(function () {
      if (!$(this).hasClass("selected")) {
        $('#media-slider-container .splide .splide__slide button').removeClass('selected').attr('aria-selected', 'false');
        $(this).addClass('selected').attr('aria-selected', 'true');
        var activeTab = $(this).data('target');
        $('#mediaTabContent .tab-pane').removeClass('show active');
        $(activeTab).addClass('show active');
      }
    });
    if (window.matchMedia('(min-width: 768px)').matches) {
      //tooltips
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })
    }
    // Pause video when changing tabs
    $('#media-slider-container .splide .splide__slide button').click(function () {
      var selectedTab = $(this).data('target');
      $('#mediaTabContent .tab-pane:not(' + selectedTab + ') .youtube').each(function () {
        $(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      });
      $('#mediaTabContent .tab-pane:not(' + selectedTab + ') .vimeo').each(function () {
        $(this)[0].contentWindow.postMessage('{"method":"pause"}', '*');
      });
      $('#mediaTabContent .tab-pane:not(' + selectedTab + ') .vjs-tech').each(function () {
        $(this).get(0).pause();
      });
    });
    //clipboard
    $('.clip-button').each(function (index) {
      new ClipboardJS(this);
    });
    //toasts
    if ($('#embargo').length) {
      var embargo = $('#embargo');
      toast = new bootstrap.Toast(embargo);
      toast.show();
    }
  }
  //advanced search item set dropdown
  $('#advanced-search-modal #item-sets option:contains("Select item set…")').text('Select collection…');

});