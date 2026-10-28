<?php
/**
 * Plugin Name: Room Builder
 * Description: Start from a room shape, then furnish it from living room, bedroom, dining, and other room tabs. Use the [room_builder] shortcode to keep it in the page, or assign the "Room Builder — full screen" page template.
 * Version: 0.9.0
 * Author: Gage W. Reed
 * License: GPLv2 or later
 * Text Domain: room-builder
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ROOM_BUILDER_VERSION', '0.9.0');
define('ROOM_BUILDER_FULLSCREEN_TEMPLATE', 'room-builder-fullscreen.php');
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
 * Whether this request is a page using the full-screen template.
 *
 * @return bool
 */
function room_builder_is_fullscreen_page() {
    return is_page() && get_page_template_slug() === ROOM_BUILDER_FULLSCREEN_TEMPLATE;
}

/**
 * Offer the full-screen template in the page editor's template dropdown.
 *
 * @param string[] $templates Template slug => label.
 * @return string[]
 */
function room_builder_register_page_template($templates) {
    $templates[ROOM_BUILDER_FULLSCREEN_TEMPLATE] = __('Room Builder — full screen', 'room-builder');
    return $templates;
}
add_filter('theme_page_templates', 'room_builder_register_page_template');

/**
 * Load the plugin template instead of the theme template.
 *
 * @param string $template Absolute path of the template WordPress selected.
 * @return string
 */
function room_builder_load_page_template($template) {
    if (!room_builder_is_fullscreen_page()) {
        return $template;
    }

    add_filter('show_admin_bar', '__return_false');
    show_admin_bar(false);
    room_builder_enqueue_assets();

    $file = plugin_dir_path(ROOM_BUILDER_FILE) . 'templates/fullscreen.php';
    return file_exists($file) ? $file : $template;
}
add_filter('template_include', 'room_builder_load_page_template');

/**
 * Read the shortcode layout. Anything other than fullscreen stays in the page.
 *
 * @param array<string, string> $atts Shortcode attributes.
 * @return string block|fullscreen
 */
function room_builder_layout($atts) {
    $layout = isset($atts['layout']) ? strtolower(trim((string) $atts['layout'])) : 'block';
    return $layout === 'fullscreen' ? 'fullscreen' : 'block';
}

/**
 * Render the builder shell. The script fills it in on the front end.
 *
 * Assets are enqueued here as well so the shortcode still works when it is
 * printed from a template, widget, or other content that is not the post body.
 *
 * [room_builder] stays in the content column.
 * [room_builder layout="fullscreen"] covers the viewport on that page.
 *
 * @param array<string, string>|string $atts Shortcode attributes.
 * @return string
 */
function room_builder_shortcode($atts = array()) {
    if (!is_array($atts)) {
        $atts = array();
    }

    $layout = room_builder_layout($atts);
    room_builder_enqueue_assets();

    $class = 'room-builder';
    if ($layout === 'fullscreen') {
        $class .= ' room-builder--fullscreen';
    }

    ob_start();
    ?>
    <div class="<?php echo esc_attr($class); ?>" data-room-builder data-layout="<?php echo esc_attr($layout); ?>">
        <p class="room-builder__fallback"><?php esc_html_e('Loading room builder...', 'room-builder'); ?></p>
        <noscript>
            <p><?php esc_html_e('The room builder needs JavaScript.', 'room-builder'); ?></p>
        </noscript>
    </div>
    <?php
    if ($layout === 'fullscreen') {
        // Move the builder onto the document root. Block themes wrap the
        // shortcode in a column that traps position:fixed, which leaves the
        // planner sitting between the theme header and footer.
        echo '<script>(function(){var node=document.currentScript&&document.currentScript.previousElementSibling;while(node&&!node.hasAttribute("data-room-builder")){node=node.previousElementSibling;}if(!node){return;}document.documentElement.appendChild(node);document.documentElement.classList.add("room-builder-fullscreen");})();</script>';
    }

    return ob_get_clean();
}
add_shortcode('room_builder', 'room_builder_shortcode');
