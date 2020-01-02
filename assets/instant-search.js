(function () {

	'use strict';

	// Find all search forms on page, but if multiple forms are found use only the first one, modify if needed
	var input = document.querySelectorAll("input[name='s']:not(#adminbar-search)");
	//console.log(input.length);
	if (input.length > 0) {
		init();
		var form, rect, win, results;
	}

	function init() {
		input = input[0];
		form = input.closest('form');

		// Disable clicking on a form search button
		/* form.querySelector('button, input[type="submit"').addEventListener('click', function(e) {
			e.preventDefault();
		}); */

		// Disable input autocomplete
		input.setAttribute('autocomplete', 'off');

		// Optimize searching with debounce on user input
		input.addEventListener('keyup', debounce(handleKeyPress, 200));

		// Create HTML element for search results and place it under the input
		results = document.createElement('div');
		results.setAttribute('id', 'js-instant-search');
		results.setAttribute('class', 'instant_search');
		results.setAttribute('aria-live', 'polite');
		calculatePosition();
		results.style.display = 'none';
		var inputParent = input.parentNode;
		inputParent.insertBefore(results, input.nextSibling);

		// If user clicks outside search results hide them
		document.addEventListener('click', function (event) {
			var isClickInside = results.contains(event.target);

			if (!isClickInside) {
				results.style.display = 'none';
			}
		});
	}

	// Calculate position for search results to pop up just below input field, modify if needed
	function calculatePosition(event) {
		results.style.top = input.offsetHeight + 'px';
		//results.style.left = rect.left + win.pageXOffset + 'px';
		results.style.left = '0px';
	};
	// On window resize recalculate position
	window.onresize = calculatePosition;

	// Use WP Rest API for search results
	function handleKeyPress() {
		if (!this.value) {
			results.style.display = 'none';
			return;
		}

		form.classList.add('instant_search__loading');

		// Modify search to your needs, this is what comes after /wp-json/wp/v2/
		var searchQuery = 'multiple-post-type?type[]=post&type[]=page&filter[posts_per_page]=5&search=' + this.value;

		fetch(instantSearch.rest + searchQuery)
			.then(function (response) {
				response.json().then(function (posts) {
					// Show search results
					showSearchResults(posts);
					results.style.display = 'block';
					form.classList.remove('instant_search__loading');
				});
			});

	}

	// Results template
	function showSearchResults(posts) {

		if (posts.length !== 0) {

			var content = '';
			posts.forEach(function (post) {
				var img = post.featured_image_url ? `<img class="img-responsive" src="${post.featured_image_url}">` : '';
				content += `<li><a href="${post.link}">${img}${post.title.rendered}</a></li>`;
			});

		} else {

			content = '<li class="instant_search__noresults">' + instantSearch.msg + '</li>';

		}
		results.innerHTML = '<ul>' + content + '</ul>';
	}

	// Debounce taken from Underscore library
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this,
				args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}
})();
