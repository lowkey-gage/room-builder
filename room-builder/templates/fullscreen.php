<?php
/**
 * Full-screen room builder document.
 *
 * Assigned from the page template dropdown. The theme header and footer are
 * left out so the builder is the whole page.
 */

if (!defined('ABSPATH')) {
    exit;
}

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="room-builder-fullscreen">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <?php wp_head(); ?>
</head>
<body <?php body_class('room-builder-screen'); ?>>
<?php wp_body_open(); ?>
<?php echo room_builder_shortcode(array('layout' => 'fullscreen')); ?>
<?php wp_footer(); ?>
</body>
</html>
