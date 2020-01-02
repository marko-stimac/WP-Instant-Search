<?php

/**
 * Plugin Name: Instant Search
 * Description: Instant search which triggers on typing in search form input field
 * Version: 1.1.0
 * Author: Marko Štimac
 * Author URI: https://marko-stimac.github.io/
 * Text Domain: instantsearch
 */

namespace ms\InstantSearch;

defined('ABSPATH') || exit;

class InstantSearch
{

	public function __construct()
	{

		add_action('wp_enqueue_scripts', array($this, 'register_scripts'));
		add_filter('rest_prepare_post', array($this, 'add_support_for_featured_image'), 10, 3);
		add_filter('rest_prepare_page', array($this, 'add_support_for_featured_image'), 10, 3);
		add_action('init', array($this, 'load_text_domain'));
	}

	/**
	 * Register scripts and styles
	 */

	public function register_scripts()
	{

		wp_register_style('instant-search', plugins_url('assets/instant-search.css', __FILE__));
		wp_register_script('instant-search', plugins_url('assets/instant-search.js', __FILE__), array('wp-i18n'), false, true);
		wp_localize_script(
			'instant-search',
			'instantSearch',
			[
				'rest' => get_rest_url(null, 'wp/v2/'),
				'msg' => __('No results', 'instantsearch')
			]
		);

		wp_enqueue_style('instant-search');
		wp_enqueue_script('instant-search');
		//wp_set_script_translations('instant-search', 'instantsearch', basename(dirname(__FILE__)) . '/languages/');
	}

	// Loads text domain for translations
	public function load_text_domain()
	{
		load_plugin_textdomain('instantsearch', FALSE, basename(dirname(__FILE__)) . '/languages/');
	}

	// Add support for featured image
	public function add_support_for_featured_image($data, $post, $context)
	{

		$image_size = 'thumbnail';
		$featured_image_id = $data->data['featured_media'];
		$featured_image_url = wp_get_attachment_image_src($featured_image_id, $image_size);

		if ($featured_image_url) {
			$data->data['featured_image_url'] = $featured_image_url[0];
		}

		return $data;
	}
}

new InstantSearch();