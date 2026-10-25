<?php
/**
 * Plugin Name: Room Builder
 * Description: Start from a room shape, then furnish it from living room, bedroom, dining, and other room tabs.
 * Version: 0.3.0
 * Author: Gage W. Reed
 * License: GPLv2 or later
 * Text Domain: room-builder
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ROOM_BUILDER_VERSION', '0.3.0');
define('ROOM_BUILDER_FILE', __FILE__);
define('ROOM_BUILDER_URL', plugin_dir_url(__FILE__));

/**
 * Register assets without loading them. Pages enqueue them only when the shortcode is present.
 */
function room_builder_register_assets() {
    wp_register_style(
        'room-builder',
        ROOM_BUILDER_URL . 'assets/css/room-builder.css',
        array(),
        ROOM_BUILDER_VERSION
    );

    wp_register_script(
        'room-builder',
        ROOM_BUILDER_URL . 'assets/js/room-builder.js',
        array(),
        ROOM_BUILDER_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', 'room_builder_register_assets');

/**
 * Load the builder assets once.
 */
function room_builder_enqueue_assets() {
    room_builder_register_assets();
    wp_enqueue_style('room-builder');
    wp_enqueue_script('room-builder');
}

/**
 * Put styles in the document head when the shortcode is saved in the post content.
 */
function room_builder_enqueue_for_content() {
    if (!is_singular()) {
        return;
    }

    $post = get_post();
    if ($post instanceof WP_Post && has_shortcode($post->post_content, 'room_builder')) {
        room_builder_enqueue_assets();
    }
}
add_action('wp_enqueue_scripts', 'room_builder_enqueue_for_content');

/**
 * Render the builder shell. The script fills it in on the front end.
 *
 * Assets are enqueued here as well so the shortcode still works when it is
 * printed from a template, widget, or other content that is not the post body.
 *
 * @return string
 */
function room_builder_shortcode() {
    room_builder_enqueue_assets();

    ob_start();
    ?>
    <div class="room-builder" data-room-builder>
        <p class="room-builder__fallback"><?php esc_html_e( 'Loading room builder...', 'room-builder' ); ?></p>
        <noscript>
            <p><?php esc_html_e( 'The room builder needs JavaScript.', 'room-builder' ); ?></p>
        </noscript>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('room_builder', 'room_builder_shortcode');
