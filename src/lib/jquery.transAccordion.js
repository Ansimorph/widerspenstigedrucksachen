//# Bjoern Ganslandt 2011
//#
//# Based on:
//# jQuery - Horizontal Accordion
//# Version 2.00.00 Alpha 1
//#
//# Alexander Graef
//# portalzine@gmail.com
//#
//# Copyright 2007-2009

/*global window */

var jquery = require("jquery");
window.$ = window.jQuery = jquery;

(function ($) {
	$.fn.extend({

		transAccordion: function (options) {
			this.settings = {
				eventTrigger: 'click',
				containerClass: 'container',
				listItemClass: 'listItem',
				contentContainerClass: 'contentContainer',
				contentWrapper: 'contentWrapper',
				contentInnerWrapper: 'contentInnerWrapper',
				handleClass: 'handle',
				handleClassOver: 'handleOver',
				handleClassSelected: 'handleSelected',
				openSpeed: 500,
				openOnLoad: 0,
				fixedWidth: ''
			};

			if (options) {
				$.extend(this.settings, options);
			}

			var settings = this.settings;

			// verschieben
			var rearrange = function (activeLi, settings, container, moveInstantly) {

				var totalWidth = 0;
				var rightMargin = parseInt($('#' + container + 'Handle0').css('marginRight').replace('px', ''), 10);
				var offset;
				var lastOffset;

				//aktives markieren
				$('#' + container + 'Handle' + activeLi).addClass(settings.handleClassSelected);


				$('#' + container + ' > li, .' + container + ' > li').each(function (i) {

					//inaktives demarkieren
					if (i !== activeLi) {
						$('#' + container + 'Handle' + i).removeClass(settings.handleClassSelected);

					}

					if (i === 0 || i === activeLi || i === (activeLi + 1)) {
						//erstes oder aktiv oder naechstes nach dem aktiven
						if (i === 0) {
							offset = lastOffset = 0;
						} else {
							offset = lastOffset;
						}
					} else {
						offset = -1 * ($('#' + container + 'ListItem' + (i - 1)).width() -
							$('#' + container + 'Handle' + (i - 1)).width() - rightMargin - lastOffset);
					}

					if (moveInstantly) {
						$('#' + container + 'ListItem' + i).css({
							'left': offset + 'px'
						});
					} else {
						$('#' + container + 'ListItem' + i).animate({
							'left': offset + 'px'
						}, {
							queue: false,
							duration: settings.openSpeed
						});
					}

					//Container-Breite berechnen
					totalWidth += rightMargin;
					totalWidth += $('#' + container + 'ListItem' + i).width();


					lastOffset = offset;
				});

				//Container-Breite anpassen
				totalWidth += offset;
				if ($(window).width > 767) {
					$('.container').animate({
						'width': totalWidth + 'px'
					}, {
						queue: false,
						duration: settings.openSpeed
					});
				}
			};


			return this.each(function () {

				var container = $(this).attr('id') || $(this).attr('class');
				var handle;

				$(this).wrap('<div class="' + settings.containerClass + '"></div>');

				$('#' + container + ' > li, .' + container + ' > li').each(function (i) {
					// HTML vorbereiten
					$(this).attr('id', container + 'ListItem' + i);
					$(this).attr('class', settings.listItemClass);
					$(this).html('<div class="' + settings.contentContainerClass + '" id="' +
						container + 'Content' + i + '">' +
						'<div class="' + settings.contentWrapper + '">' +
						'<div class="' + settings.contentInnerWrapper + '">' +
						$(this).html() + '</div></div></div>');
					if ($('div', this).hasClass(settings.handleClass)) {
						var html = $('div.' + settings.handleClass, this).attr('id', '' +
							container + 'Handle' + i + '').html();
						$('div.' + settings.handleClass, this).remove();
						handle = '<div class="' + settings.handleClass + '" id="' +
						container + 'Handle' + i + '">' + html + '</div>';
					} else {
						handle = '<div class="' + settings.handleClass + '" id="' +
						container + 'Handle' + i + '"></div>';
					}

					$(this).prepend(handle);


					// Events

					var $activeItem = $('#' + container + 'Handle' + i + ', ' + '#' + container + 'Content' + i);

					$activeItem.bind('mouseover', function () {
						$('#' + container + 'Handle' + i).addClass(settings.handleClassOver);
					});

					$activeItem.bind('mouseout', function () {
						if ($('#' + container + 'Handle' + i).attr('rel') !== 'selected') {
							$('#' + container + 'Handle' + i).removeClass(settings.handleClassOver);
						}
					});

					$activeItem.bind(settings.eventTrigger, function () {
						rearrange(i, settings, container, false);
					});

				});

				// und alles zeigen
				$('#' + container + ',.' + container).show();

				// beim start das erste element aufklappen
				rearrange(settings.openOnLoad, settings, container, false);
			});
		}
	});
})(jQuery);