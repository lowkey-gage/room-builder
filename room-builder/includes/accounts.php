<?php
/**
 * Accounts and saved rooms.
 *
 * Visitors get a WordPress subscriber account from the planner. Each saved
 * room is a private plan owned by that user, so a later visit can open it again.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the private plan type. It is not public, so plans never appear as site content.
 */
function room_builder_register_plan_type() {
    register_post_type('rb_plan', array(
        'labels' => array(
            'name' => __('Room plans', 'room-builder'),
            'singular_name' => __('Room plan', 'room-builder'),
        ),
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => false,
        'show_in_rest' => false,
        'show_in_menu' => false,
        'exclude_from_search' => true,
        'has_archive' => false,
        'rewrite' => false,
        'query_var' => false,
        'supports' => array('title', 'editor', 'author'),
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ));
}
add_action('init', 'room_builder_register_plan_type');

/**
 * Data the planner script needs on first paint.
 *
 * @return array<string, mixed>
 */
function room_builder_client_config() {
    $session = room_builder_session_payload();
    $session['restUrl'] = esc_url_raw(rest_url('room-builder/v1/'));
    return $session;
}

/**
 * @return array<string, mixed>
 */
function room_builder_session_payload() {
    $user = wp_get_current_user();
    $logged_in = $user instanceof WP_User && $user->ID > 0;
    $payload = array(
        'loggedIn' => $logged_in,
        'nonce' => wp_create_nonce('wp_rest'),
        'user' => null,
        'plans' => array(),
        'lastPlanId' => 0,
    );

    if (!$logged_in) {
        return $payload;
    }

    $payload['user'] = array(
        'id' => (int) $user->ID,
        'name' => $user->display_name,
        'email' => $user->user_email,
    );
    $payload['plans'] = room_builder_plan_summaries((int) $user->ID);
    $payload['lastPlanId'] = (int) get_user_meta($user->ID, 'room_builder_last_plan', true);
    return $payload;
}

/**
 * Register the planner routes.
 */
function room_builder_register_routes() {
    register_rest_route('room-builder/v1', '/session', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'room_builder_rest_session',
        'permission_callback' => 'room_builder_rest_permission',
    ));

    register_rest_route('room-builder/v1', '/register', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'room_builder_rest_register',
        'permission_callback' => 'room_builder_rest_permission',
    ));

    register_rest_route('room-builder/v1', '/login', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'room_builder_rest_login',
        'permission_callback' => 'room_builder_rest_permission',
    ));

    register_rest_route('room-builder/v1', '/logout', array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'room_builder_rest_logout',
        'permission_callback' => 'room_builder_rest_logged_in',
    ));

    register_rest_route('room-builder/v1', '/plans', array(
        array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'room_builder_rest_plans',
            'permission_callback' => 'room_builder_rest_logged_in',
        ),
        array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'room_builder_rest_create_plan',
            'permission_callback' => 'room_builder_rest_logged_in',
        ),
    ));

    register_rest_route('room-builder/v1', '/plans/(?P<id>\d+)', array(
        array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'room_builder_rest_get_plan',
            'permission_callback' => 'room_builder_rest_logged_in',
        ),
        array(
            'methods' => WP_REST_Server::EDITABLE,
            'callback' => 'room_builder_rest_update_plan',
            'permission_callback' => 'room_builder_rest_logged_in',
        ),
        array(
            'methods' => WP_REST_Server::DELETABLE,
            'callback' => 'room_builder_rest_delete_plan',
            'permission_callback' => 'room_builder_rest_logged_in',
        ),
    ));
}
add_action('rest_api_init', 'room_builder_register_routes');

/**
 * Require a REST nonce so a foreign site cannot submit the form.
 *
 * @return true|WP_Error
 */
function room_builder_rest_permission() {
    $nonce = isset($_SERVER['HTTP_X_WP_NONCE']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_X_WP_NONCE'])) : '';
    if (!wp_verify_nonce($nonce, 'wp_rest')) {
        return new WP_Error(
            'room_builder_nonce',
            __('Refresh the page and try again.', 'room-builder'),
            array('status' => 403)
        );
    }
    return true;
}

/**
 * @return true|WP_Error
 */
function room_builder_rest_logged_in() {
    $allowed = room_builder_rest_permission();
    if (is_wp_error($allowed)) {
        return $allowed;
    }
    if (!is_user_logged_in()) {
        return new WP_Error(
            'room_builder_auth',
            __('Log in to save this room.', 'room-builder'),
            array('status' => 401)
        );
    }
    return true;
}

/**
 * @return WP_REST_Response
 */
function room_builder_rest_session() {
    return rest_ensure_response(room_builder_session_payload());
}

/**
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function room_builder_rest_register($request) {
    if (room_builder_rate_limited()) {
        return room_builder_rate_error();
    }

    if (is_user_logged_in()) {
        return rest_ensure_response(room_builder_session_payload());
    }

    $name = sanitize_text_field((string) $request->get_param('name'));
    $email = sanitize_email((string) $request->get_param('email'));
    $password = (string) $request->get_param('password');

    if ($name === '') {
        return new WP_Error('room_builder_name', __('Enter your name.', 'room-builder'), array('status' => 400));
    }
    if (!is_email($email)) {
        return new WP_Error('room_builder_email', __('Enter a valid email.', 'room-builder'), array('status' => 400));
    }
    if (strlen($password) < 8) {
        return new WP_Error('room_builder_password', __('Use at least 8 characters for the password.', 'room-builder'), array('status' => 400));
    }
    if (email_exists($email)) {
        return new WP_Error(
            'room_builder_exists',
            __('An account with that email already exists. Log in instead.', 'room-builder'),
            array('status' => 409)
        );
    }

    $login = room_builder_username_from_email($email);
    if (is_wp_error($login)) {
        return $login;
    }

    $user_id = wp_insert_user(array(
        'user_login' => $login,
        'user_email' => $email,
        'user_pass' => $password,
        'display_name' => $name,
        'nickname' => $name,
        'role' => 'subscriber',
    ));
    if (is_wp_error($user_id)) {
        return new WP_Error(
            'room_builder_register',
            __('The account could not be created. Try a different email.', 'room-builder'),
            array('status' => 400)
        );
    }

    room_builder_establish_login((int) $user_id);
    return rest_ensure_response(room_builder_session_payload());
}

/**
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function room_builder_rest_login($request) {
    if (room_builder_rate_limited()) {
        return room_builder_rate_error();
    }

    if (is_user_logged_in()) {
        return rest_ensure_response(room_builder_session_payload());
    }

    $login = trim(sanitize_text_field((string) $request->get_param('login')));
    $password = (string) $request->get_param('password');
    if ($login === '' || $password === '') {
        return new WP_Error(
            'room_builder_login',
            __('Enter your email and password.', 'room-builder'),
            array('status' => 400)
        );
    }

    if (is_email($login)) {
        $by_email = get_user_by('email', $login);
        if ($by_email instanceof WP_User) {
            $login = $by_email->user_login;
        }
    }

    $user = wp_authenticate($login, $password);
    if (is_wp_error($user)) {
        return new WP_Error(
            'room_builder_login',
            __('Email or password is incorrect.', 'room-builder'),
            array('status' => 401)
        );
    }

    room_builder_establish_login((int) $user->ID);
    /**
     * Let security plugins notice the sign-in. Cookies were set once above,
     * so this does not go through wp_signon (that would issue a second session).
     */
    do_action('wp_login', $user->user_login, $user);
    return rest_ensure_response(room_builder_session_payload());
}

/**
 * @return WP_REST_Response
 */
function room_builder_rest_logout() {
    wp_logout();
    room_builder_forget_auth_cookies();
    wp_set_current_user(0);
    return rest_ensure_response(room_builder_session_payload());
}

/**
 * @return WP_REST_Response
 */
function room_builder_rest_plans() {
    return rest_ensure_response(array(
        'plans' => room_builder_plan_summaries(get_current_user_id()),
        'lastPlanId' => (int) get_user_meta(get_current_user_id(), 'room_builder_last_plan', true),
    ));
}

/**
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function room_builder_rest_create_plan($request) {
    $user_id = get_current_user_id();
    $existing = room_builder_user_plans($user_id);
    if (count($existing) >= 40) {
        return new WP_Error(
            'room_builder_limit',
            __('Delete a saved room before saving another.', 'room-builder'),
            array('status' => 400)
        );
    }

    $stored = room_builder_prepare_plan($request);
    if (is_wp_error($stored)) {
        return $stored;
    }

    $post_id = wp_insert_post(wp_slash(array(
        'post_type' => 'rb_plan',
        'post_status' => 'publish',
        'post_title' => $stored['title'],
        'post_content' => $stored['json'],
        'post_author' => $user_id,
        'comment_status' => 'closed',
        'ping_status' => 'closed',
    )), true);

    if (is_wp_error($post_id)) {
        return new WP_Error(
            'room_builder_save',
            __('This room could not be saved.', 'room-builder'),
            array('status' => 500)
        );
    }

    room_builder_remember_plan((int) $post_id);
    $post = get_post($post_id);
    return rest_ensure_response(room_builder_plan_response($post, false));
}

/**
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function room_builder_rest_get_plan($request) {
    $post = room_builder_owned_plan((int) $request['id']);
    if (!$post) {
        return room_builder_missing_plan();
    }
    room_builder_remember_plan((int) $post->ID);
    return rest_ensure_response(room_builder_plan_response($post, true));
}

/**
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function room_builder_rest_update_plan($request) {
    $post = room_builder_owned_plan((int) $request['id']);
    if (!$post) {
        return room_builder_missing_plan();
    }

    $stored = room_builder_prepare_plan($request);
    if (is_wp_error($stored)) {
        return $stored;
    }

    $updated = wp_update_post(wp_slash(array(
        'ID' => (int) $post->ID,
        'post_title' => $stored['title'],
        'post_content' => $stored['json'],
    )), true);

    if (is_wp_error($updated)) {
        return new WP_Error(
            'room_builder_save',
            __('This room could not be saved.', 'room-builder'),
            array('status' => 500)
        );
    }

    room_builder_remember_plan((int) $post->ID);
    return rest_ensure_response(room_builder_plan_response(get_post($post->ID), false));
}

/**
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function room_builder_rest_delete_plan($request) {
    $post = room_builder_owned_plan((int) $request['id']);
    if (!$post) {
        return room_builder_missing_plan();
    }

    $user_id = get_current_user_id();
    $deleted = wp_delete_post((int) $post->ID, true);
    if (!$deleted) {
        return new WP_Error(
            'room_builder_delete',
            __('That room could not be deleted.', 'room-builder'),
            array('status' => 500)
        );
    }

    $last_id = (int) get_user_meta($user_id, 'room_builder_last_plan', true);
    if ($last_id === (int) $post->ID) {
        $remaining = room_builder_user_plans($user_id);
        if ($remaining) {
            room_builder_remember_plan((int) $remaining[0]->ID);
        } else {
            delete_user_meta($user_id, 'room_builder_last_plan');
        }
    }

    return rest_ensure_response(array(
        'deleted' => (int) $post->ID,
        'plans' => room_builder_plan_summaries($user_id),
        'lastPlanId' => (int) get_user_meta($user_id, 'room_builder_last_plan', true),
    ));
}

/**
 * Sign the user in and make the new cookie visible for this request's nonce.
 *
 * wp_set_auth_cookie sends the cookie to the browser but does not update
 * $_COOKIE, and the REST nonce includes the session token from that cookie.
 *
 * @param int $user_id User ID.
 */
function room_builder_establish_login($user_id) {
    $captured = '';
    $grab = function ($logged_in_cookie) use (&$captured) {
        $captured = (string) $logged_in_cookie;
    };

    wp_clear_auth_cookie();
    room_builder_forget_auth_cookies();
    wp_set_current_user($user_id);
    add_action('set_logged_in_cookie', $grab, 10, 1);
    wp_set_auth_cookie($user_id, true, is_ssl());
    remove_action('set_logged_in_cookie', $grab, 10);

    if ($captured !== '' && defined('LOGGED_IN_COOKIE')) {
        $_COOKIE[LOGGED_IN_COOKIE] = $captured;
    }
}

/**
 * Drop auth cookies from the current request after logout.
 */
function room_builder_forget_auth_cookies() {
    $names = array('LOGGED_IN_COOKIE', 'AUTH_COOKIE', 'SECURE_AUTH_COOKIE');
    foreach ($names as $constant) {
        if (defined($constant) && isset($_COOKIE[constant($constant)])) {
            unset($_COOKIE[constant($constant)]);
        }
    }
}

/**
 * @param string $email Email address.
 * @return string|WP_Error
 */
function room_builder_username_from_email($email) {
    $base = sanitize_user((string) strstr($email, '@', true), true);
    if ($base === '') {
        $base = 'member';
    }
    $base = substr($base, 0, 40);
    $login = $base;
    $suffix = 1;
    while (username_exists($login)) {
        $suffix += 1;
        if ($suffix > 50) {
            return new WP_Error(
                'room_builder_username',
                __('The account could not be created. Try a different email.', 'room-builder'),
                array('status' => 400)
            );
        }
        $login = substr($base, 0, 40) . $suffix;
    }
    return $login;
}

/**
 * @param int $post_id Plan ID.
 */
function room_builder_remember_plan($post_id) {
    update_user_meta(get_current_user_id(), 'room_builder_last_plan', (int) $post_id);
}

/**
 * @param int $user_id User ID.
 * @return WP_Post[]
 */
function room_builder_user_plans($user_id) {
    $posts = get_posts(array(
        'post_type' => 'rb_plan',
        'post_status' => 'publish',
        'author' => (int) $user_id,
        'posts_per_page' => 40,
        'orderby' => 'modified',
        'order' => 'DESC',
        'no_found_rows' => true,
        'suppress_filters' => true,
    ));
    return is_array($posts) ? $posts : array();
}

/**
 * @param int $user_id User ID.
 * @return array<int, array<string, mixed>>
 */
function room_builder_plan_summaries($user_id) {
    $summaries = array();
    foreach (room_builder_user_plans($user_id) as $post) {
        $summaries[] = room_builder_plan_summary($post);
    }
    return $summaries;
}

/**
 * @param WP_Post $post Plan post.
 * @return array<string, mixed>
 */
function room_builder_plan_summary($post) {
    return array(
        'id' => (int) $post->ID,
        'title' => $post->post_title,
        'modified' => get_post_modified_time('c', true, $post),
    );
}

/**
 * @param WP_Post $post Plan post.
 * @param bool    $with_plan Include the floor plan.
 * @return array<string, mixed>
 */
function room_builder_plan_response($post, $with_plan) {
    $response = room_builder_plan_summary($post);
    $response['plans'] = room_builder_plan_summaries((int) $post->post_author);
    $response['lastPlanId'] = (int) get_user_meta(get_current_user_id(), 'room_builder_last_plan', true);
    if ($with_plan) {
        $decoded = json_decode($post->post_content, true);
        $response['plan'] = is_array($decoded) ? $decoded : array();
    }
    return $response;
}

/**
 * @param int $post_id Plan ID.
 * @return WP_Post|null
 */
function room_builder_owned_plan($post_id) {
    $post = get_post($post_id);
    if (!$post instanceof WP_Post) {
        return null;
    }
    if ($post->post_type !== 'rb_plan' || $post->post_status === 'trash') {
        return null;
    }
    if ((int) $post->post_author !== get_current_user_id()) {
        return null;
    }
    return $post;
}

/**
 * @return WP_Error
 */
function room_builder_missing_plan() {
    return new WP_Error(
        'room_builder_missing',
        __('That room could not be found.', 'room-builder'),
        array('status' => 404)
    );
}

/**
 * @param WP_REST_Request $request Request.
 * @return array{title: string, json: string}|WP_Error
 */
function room_builder_prepare_plan($request) {
    $plan = $request->get_param('plan');
    if (!is_array($plan)) {
        return new WP_Error(
            'room_builder_plan',
            __('This room could not be saved.', 'room-builder'),
            array('status' => 400)
        );
    }

    $clean = room_builder_clean_plan($plan);
    if (is_wp_error($clean)) {
        return $clean;
    }

    $json = wp_json_encode($clean);
    if (!is_string($json) || strlen($json) > 500000) {
        return new WP_Error(
            'room_builder_plan',
            __('This room is too large to save.', 'room-builder'),
            array('status' => 400)
        );
    }

    return array(
        'title' => room_builder_clean_title($request->get_param('title')),
        'json' => $json,
    );
}

/**
 * @param mixed $title Requested name.
 * @return string
 */
function room_builder_clean_title($title) {
    $title = sanitize_text_field((string) $title);
    $title = trim(preg_replace('/\s+/', ' ', $title));
    if ($title === '') {
        $title = __('My room', 'room-builder');
    }
    if (function_exists('mb_substr')) {
        return mb_substr($title, 0, 80);
    }
    return substr($title, 0, 80);
}

/**
 * Keep only the plan fields the builder knows how to draw.
 *
 * @param array<string, mixed> $plan Plan payload.
 * @return array<string, mixed>|WP_Error
 */
function room_builder_clean_plan($plan) {
    $room = room_builder_clean_value(isset($plan['room']) ? $plan['room'] : array(), 0);
    $openings = room_builder_clean_value(isset($plan['openings']) ? $plan['openings'] : array(), 0);
    $items = room_builder_clean_value(isset($plan['items']) ? $plan['items'] : array(), 0);
    return array(
        'room' => is_array($room) ? $room : array(),
        'openings' => is_array($openings) ? $openings : array(),
        'items' => is_array($items) ? $items : array(),
        'catalog' => sanitize_key(isset($plan['catalog']) ? (string) $plan['catalog'] : 'living'),
    );
}

/**
 * @param mixed $value Raw value.
 * @param int   $depth Nesting depth.
 * @return mixed
 */
function room_builder_clean_value($value, $depth) {
    if ($depth > 8) {
        return null;
    }
    if (is_string($value)) {
        $value = wp_check_invalid_utf8($value);
        if (function_exists('mb_substr')) {
            return mb_substr($value, 0, 180);
        }
        return substr($value, 0, 180);
    }
    if (is_int($value)) {
        return $value;
    }
    if (is_float($value)) {
        return is_finite($value) ? $value : 0;
    }
    if (is_bool($value)) {
        return $value;
    }
    if (!is_array($value)) {
        return null;
    }

    $is_list = room_builder_is_list($value);
    $clean = array();
    $count = 0;
    foreach ($value as $key => $item) {
        $count += 1;
        if ($count > 400) {
            break;
        }
        $cleaned = room_builder_clean_value($item, $depth + 1);
        if ($is_list) {
            $clean[] = $cleaned;
            continue;
        }
        $safe_key = preg_replace('/[^A-Za-z0-9_\-]/', '', (string) $key);
        if (!is_string($safe_key) || $safe_key === '' || strlen($safe_key) > 40) {
            continue;
        }
        $clean[$safe_key] = $cleaned;
    }
    return $clean;
}

/**
 * @param array<mixed> $value Array that may be a list.
 * @return bool
 */
function room_builder_is_list($value) {
    $index = 0;
    foreach ($value as $key => $unused) {
        if ($key !== $index) {
            return false;
        }
        $index += 1;
    }
    return true;
}

/**
 * Slow down repeated sign-in attempts from one address.
 *
 * @return bool
 */
function room_builder_rate_limited() {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : 'unknown';
    $key = 'rb_auth_' . md5($ip);
    $count = (int) get_transient($key);
    if ($count >= 20) {
        return true;
    }
    set_transient($key, $count + 1, 15 * MINUTE_IN_SECONDS);
    return false;
}

/**
 * @return WP_Error
 */
function room_builder_rate_error() {
    return new WP_Error(
        'room_builder_rate',
        __('Too many attempts. Wait a few minutes and try again.', 'room-builder'),
        array('status' => 429)
    );
}
