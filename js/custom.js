$(function(){
	if(location.origin == 'https://qwazik.github.io'){
	    $('body').append($('<script type="text/javascript" src="https://cdn.rawgit.com/Qwazik/scripts/master/navGit.js"></script>'));
	    $(window).on('load', function(){
	        navGit({
	            'Главная':'index.html',
	            'О нас':'about.html',
	            'Акции':'actions.html',
	            'Каталог':'catalog.html',
	            'Контакты':'contacts.html',
	            'Кабинет':'lk.html',
	            'Оформление':'order.html',
	            'Продукт':'product.html',
	            'Продукты':'products.html',
	            'Корзина':'cart.html'
	        });
	    });
	}
	$('.fancybox').fancybox();
	$('.select').select2();

	// search dropdown
	$('.header-search__input, .mob-search-input > input').each(function(){
		var $this = $(this);
		$this.keyup(function(){
			if($this.val().length){
				$this.siblings('.header-search-drop').fadeIn();
			}else{
				$this.siblings('.header-search-drop').fadeOut();
			}
		});

		$this.blur(function(){
			$this.siblings('.header-search-drop').fadeOut();
		});
	});

	// mob navs
	$('.mob-search-btn').click(function(){
		if($('.mob-navs').is('.mob-navs--search')){
			$('.mob-search').submit();
		}else{
			$('.mob-navs').addClass('mob-navs--search');
		}
	});

	$(document).click(function(e){
		if($('.mob-navs').is('.mob-navs--search') && !$(e.target).closest('.mob-search').length){			$('.mob-navs').removeClass('mob-navs--search');
		}
	});

	// catalog slider
	(function(){
		var mainClass = '.catalog-filter-section';
		$('.catalog-filter-slider').each(function(){
			var that = $(this),
				container = $(this).closest('.catalog-filter-section'),
				min = container.find('.min'),
				max = container.find('.max'),
				slider = noUiSlider.create(that[0], {
					start: [0, 2228],
					connect: true,
					step: 1,
					range: {
						min: 0,
						max: 2228
					}
				});

				slider.on('update', function(values, handle){
					min.val(Number(values[0]).toFixed());
					max.val(Number(values[1]).toFixed());
				});
		});
	}());
	// hover
	(function(){
		$('.js-hover').each(function(){
			var target = $(this).data('target');
			$(this).hover(function(){
				$(target).addClass('active');
			}, function(){
				$(target).removeClass('active');
			});
		});
	}());
	// click
	(function(){
		$('.js-click').each(function(){
			var target = $(this).data('target');
			$(this).click(function(){
				$(target).toggleClass('active');
			});
		});

	}());

	//carousel
	(function(){
		homeSliderInit();
		productCarousels();
		function homeSliderInit(){
			var homeSlider = $('.home-slider');
			homeSlider.width(homeSlider.parent().width());

			var homeOwl = $('.home-slider').owlCarousel({
				items: 1
			});

			$(window).resize(function(){
				destroyCarousel(homeOwl);
				homeSlider.width(homeSlider.parent().width());
				homeOwl = $('.home-slider').owlCarousel({
					items: 1
				});
			})
		}

		function productCarousels(){
			var carousel = $('.product-carousel-list');

			$(carousel).each(function(){
				var _this = $(this),
					navigation = _this.closest('.product-carousel').find('.product-carousel-nav'),
					carousel = initCarousel(_this);

				navigation.children().click(function(){
					if($(this).is('.product-carousel-nav__prev')){
						carousel.trigger('prev.owl.carousel');
					}else{
						carousel.trigger('next.owl.carousel');
					}
				});

				carousel.hover(function(){
					$(carousel).trigger('stop.owl.autoplay');
				}, function(){
					$(carousel).trigger('play.owl.autoplay');
				})
			});

			function initCarousel(selector){
				var column = $(selector).data('items');
				return $(selector).owlCarousel({
					items: column,
					loop: true,

							margin: 20,
					autoplay: true,
					autoplayTimeout: 5000,
					responsive:{
						0:{
							items: 2,
							margin: 12,
						},
						767:{
							items: 3,
							margin: 20,
						},
						992:{
							items: 4
						},
						1250:{
							items: column
						}
					}
				});
			}
		}

		function destroyCarousel(carousel){
			$(carousel).trigger('destroy.owl.carousel').removeClass('owl-loaded');
			$(carousel).find('.owl-stage-outer').children().unwrap();
		}
	}());


	//counter
	(function(){
		var mainClass = '.set-number',
			btnClass = '.set-number__btn';

		$(mainClass).each(function(){
			var that = this,
				input = $(that).find('input'),
				btns = $(that).find(btnClass),
				currentVal = $(that).find('input').val();

			btns.click(function(){
				if($(this).is('.dec')){
					if(currentVal > 1) --currentVal;
				}else{
					++currentVal;
				}
				input.val(currentVal);
			});
		});
	}());

	(function(){
		var ddClass = '.mob-navs-drop',
			overlayClass = '.mob-navs-overlay',
			ddToggler = '.dd-toggler';

		$('.mob-category-title, .mob-nav-title').each(function(){
			var that = $(this);
			$(this).click(function(){
				$(overlayClass).fadeToggle();
				$(that).parent().toggleClass('active');
				$(that).siblings(ddClass).toggleClass('active');
			});
		});

		$(overlayClass).click(closeAll);
		$(ddToggler).click(openDropDown);

		function closeAll(){
			$(overlayClass).fadeOut();
			$('.mob-navs').find('.active').removeClass('active');
		}

		function openDropDown(){
			$(this).toggleClass('active');
			$(this).closest('.mob-navs-drop-item').find(ddClass).stop(true, true).slideToggle('active');
		}
	}());

	//card
	(function(){
		$('.card-preview-thumbs__item').click(function(){
			$('.card-preview-thumbs__item').removeClass('active');
			$(this).addClass('active');
			$('.card-preview-main img').attr('src', $(this).attr('href'));
		});	

		$('.card-preview-thumbs').owlCarousel({
			items: 4,
			margin: 9
		})
	}())
});