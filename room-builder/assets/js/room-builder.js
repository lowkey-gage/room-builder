(function () {
    var STORAGE_KEY = 'roomBuilder.plan.v2';
    var LEGACY_KEY = 'roomBuilder.plan.v1';
    var MIN_ROOM = 6;
    var MIN_SHAPED = 10;
    var MAX_ROOM = 40;
    var DOOR_WIDTH = 3;
    var DOOR_REACH = 1.25;
    var bootCount = 0;

    function piece(id, name, width, depth, color, extra) {
        var item = {
            id: id,
            name: name,
            width: width,
            depth: depth,
            color: color,
            facing: true
        };
        var key;
        if (extra) {
            for (key in extra) {
                if (Object.prototype.hasOwnProperty.call(extra, key)) {
                    item[key] = extra[key];
                }
            }
        }
        return item;
    }

    var flat = { facing: false };
    var round = { facing: false, round: true };
    var rug = { facing: false, kind: 'rug' };
    var bed = { bed: true };

    var ROOMS = [
        {
            id: 'living',
            label: 'Living room',
            pieces: [
                piece('sofa', 'Sofa', 7, 3, '#8d9a84'),
                piece('loveseat', 'Loveseat', 5, 3, '#a3b18a'),
                piece('chair', 'Chair', 3, 3, '#c4a484'),
                piece('sleeper', 'Sleeper sofa', 7, 3, '#6b7f6a'),
                piece('chaise', 'Sofa chaise', 8, 5, '#7f8f78'),
                piece('sectional', 'Sectional', 9, 6.5, '#5f6f5e'),
                piece('coffee-table', 'Coffee table', 4, 2, '#b08968', flat),
                piece('oval-coffee', 'Oval coffee table', 4, 2, '#c4a484', round),
                piece('side-table', 'Side table', 2, 2, '#ddb892', flat),
                piece('console', 'Console table', 5, 1.5, '#a47148', flat),
                piece('bookcase', 'Bookcase', 3, 1, '#7f5539'),
                piece('tv-unit', 'TV unit', 6, 1.5, '#6b4f3a'),
                piece('media-console', 'Media console', 5, 1.5, '#8a6a4f')
            ]
        },
        {
            id: 'bedroom',
            label: 'Bedroom',
            pieces: [
                piece('bed-king', 'King bed', 6.5, 6.5, '#7e93a8', bed),
                piece('bed-queen', 'Queen bed', 5, 6.5, '#8ea4b8', bed),
                piece('bed-full', 'Full bed', 4.5, 6.5, '#9bb0c2', bed),
                piece('bed-twin', 'Twin bed', 3.5, 6.5, '#b7c6d4', bed),
                piece('bench', 'Bench', 4, 1.5, '#c4a484', flat),
                piece('dresser', 'Dresser', 5.5, 1.5, '#8a6a4f'),
                piece('dresser-narrow', 'Narrow dresser', 3, 1.5, '#a47148'),
                piece('wardrobe', 'Wardrobe', 4, 2, '#6b5344'),
                piece('nightstand', 'Nightstand', 2, 1.5, '#6b705c'),
                piece('vanity', 'Vanity', 4, 1.5, '#b08968')
            ]
        },
        {
            id: 'dining',
            label: 'Dining',
            pieces: [
                piece('dining-table', 'Dining table', 6, 3.5, '#c08552', flat),
                piece('dining-square', 'Square table', 4, 4, '#b08968', flat),
                piece('dining-round', 'Round table', 5, 5, '#ddb892', round),
                piece('dining-chair', 'Dining chair', 1.5, 1.5, '#c4a484'),
                piece('bar-stool', 'Bar stool', 1.5, 1.5, '#a47148'),
                piece('dining-bench', 'Dining bench', 5, 1.5, '#8a6a4f', flat),
                piece('buffet', 'Buffet', 6, 1.5, '#7f5539'),
                piece('china-cabinet', 'China cabinet', 3.5, 1.5, '#6b4f3a')
            ]
        },
        {
            id: 'office',
            label: 'Office',
            pieces: [
                piece('desk', 'Desk', 5, 2.5, '#9c6644'),
                piece('l-desk', 'L-shape desk', 6, 5, '#7f5539'),
                piece('office-chair', 'Office chair', 2, 2, '#6b705c'),
                piece('guest-chair', 'Guest chair', 2, 2, '#c4a484'),
                piece('filing-cabinet', 'Filing cabinet', 1.5, 2, '#8a8175'),
                piece('bookshelf', 'Bookshelf', 3, 1, '#6b5344')
            ]
        },
        {
            id: 'bathroom',
            label: 'Bathroom',
            pieces: [
                piece('toilet', 'Toilet', 1.5, 2.5, '#d6dde4'),
                piece('bathtub', 'Bathtub', 5, 2.5, '#c5d0da'),
                piece('shower', 'Shower', 3, 3, '#b7c4d0', flat),
                piece('bath-vanity', 'Vanity', 3, 2, '#b08968'),
                piece('double-vanity', 'Double vanity', 5, 2, '#a47148'),
                piece('linen-closet', 'Linen closet', 2, 2, '#8a8175')
            ]
        },
        {
            id: 'kitchen',
            label: 'Kitchen',
            pieces: [
                piece('fridge', 'Refrigerator', 3, 3, '#c5ced6'),
                piece('range', 'Range', 2.5, 2.5, '#8a8175'),
                piece('dishwasher', 'Dishwasher', 2, 2, '#d6dde4'),
                piece('island', 'Island', 6, 3, '#c08552', flat),
                piece('base-cabinet', 'Base cabinet', 6, 2, '#7f5539')
            ]
        },
        {
            id: 'nursery',
            label: 'Nursery',
            pieces: [
                piece('crib', 'Crib', 3, 5, '#d4b483', bed),
                piece('changing-table', 'Changing table', 3.5, 2, '#ddb892'),
                piece('toy-chest', 'Toy chest', 3, 1.5, '#c4a484', flat),
                piece('play-mat', 'Play mat', 5, 4, '#e6c8a0', rug)
            ]
        },
        {
            id: 'outdoor',
            label: 'Outdoor',
            pieces: [
                piece('outdoor-sectional', 'Outdoor sectional', 8, 6, '#6b7f6a'),
                piece('lounge-chair', 'Lounge chair', 2.5, 5, '#8d9a84'),
                piece('outdoor-table', 'Outdoor table', 5, 3, '#b08968', flat),
                piece('grill', 'Grill', 3, 2, '#5c564c'),
                piece('fire-pit', 'Fire pit', 3, 3, '#8a6a4f', round),
                piece('hot-tub', 'Hot tub', 7, 7, '#7e93a8', round)
            ]
        },
        {
            id: 'accessories',
            label: 'Accessories',
            pieces: [
                piece('rug', 'Rug', 8, 5, '#d4b483', rug),
                piece('small-rug', 'Small rug', 5, 3, '#e6c8a0', rug),
                piece('plant-large', 'Large plant', 2, 2, '#6b7f6a', round),
                piece('plant-small', 'Small plant', 1, 1, '#8d9a84', round),
                piece('floor-lamp', 'Floor lamp', 1, 1, '#c4a484', round),
                piece('fireplace', 'Fireplace', 5, 1.5, '#6b4f3a')
            ]
        }
    ];

    var SHAPES = [
        { id: 'rectangle', label: 'Rectangle', kind: 'rect', width: 12, depth: 14 },
        { id: 'square', label: 'Square', kind: 'rect', width: 12, depth: 12 },
        { id: 'l', label: 'L-shape', kind: 'l', width: 18, depth: 16, cutW: 8, cutD: 8 },
        { id: 'l2', label: 'L-shape 2', kind: 'l2', width: 18, depth: 16, cutW: 8, cutD: 8 },
        { id: 't', label: 'T-shape', kind: 't', width: 18, depth: 16, cutW: 8, cutD: 6 },
        { id: 'studio', label: 'Studio', kind: 'rect', width: 20, depth: 14 }
    ];

    function catalogItem(id) {
        var roomIndex;
        var pieceIndex;
        for (roomIndex = 0; roomIndex < ROOMS.length; roomIndex += 1) {
            for (pieceIndex = 0; pieceIndex < ROOMS[roomIndex].pieces.length; pieceIndex += 1) {
                if (ROOMS[roomIndex].pieces[pieceIndex].id === id) {
                    return ROOMS[roomIndex].pieces[pieceIndex];
                }
            }
        }
        return null;
    }

    function roomTab(id) {
        var index;
        for (index = 0; index < ROOMS.length; index += 1) {
            if (ROOMS[index].id === id) {
                return ROOMS[index];
            }
        }
        return ROOMS[0];
    }

    function shapeTemplate(id) {
        var index;
        for (index = 0; index < SHAPES.length; index += 1) {
            if (SHAPES[index].id === id) {
                return SHAPES[index];
            }
        }
        return SHAPES[0];
    }

    function snap(value) {
        return Math.round(value * 2) / 2;
    }

    function num(value) {
        return String(Math.round(value * 1000) / 1000);
    }

    function formatFeet(value) {
        return String(snap(value));
    }

    function footprint(item) {
        var entry = catalogItem(item.catalogId);
        var swapped = item.rotation === 90 || item.rotation === 270;
        return {
            w: swapped ? entry.depth : entry.width,
            d: swapped ? entry.width : entry.depth
        };
    }

    document.querySelectorAll('[data-room-builder]').forEach(boot);

    function boot(root) {
        bootCount += 1;
        var clipId = 'rb-floor-' + bootCount;
        var state = loadState();
        var nextId = 1;
        var drag = null;
        var ghost = null;
        var widthInput;
        var depthInput;
        var doorButton;
        var stage;
        var svg;
        var hintEl;
        var statusEl;
        var selectionEl;
        var paletteEl;
        var tablistEl;

        adoptIds();

        var app = document.createElement('div');
        app.className = 'room-builder__app';
        root.innerHTML = '';
        root.appendChild(app);
        root.setAttribute('data-ready', 'true');

        buildToolbar();
        buildWorkspace();
        syncShapeButtons();
        syncDoorTool();
        syncSizeInputs();
        renderPalette();
        renderPlan();
        renderSelection();
        setStatus('');

        document.addEventListener('keydown', onKeyDown);

        function loadState() {
            try {
                var raw = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_KEY);
                if (!raw) {
                    return blankState();
                }
                return sanitize(JSON.parse(raw));
            } catch (error) {
                return blankState();
            }
        }

        function blankState() {
            return {
                room: roomFromTemplate(shapeTemplate('rectangle')),
                openings: [],
                items: [],
                catalog: 'living',
                selected: null,
                tool: 'select'
            };
        }

        function roomFromTemplate(template) {
            return {
                shape: template.id,
                kind: template.kind,
                width: template.width,
                depth: template.depth,
                cutW: template.cutW || 0,
                cutD: template.cutD || 0
            };
        }

        function sanitize(data) {
            var next = blankState();
            var width = Number(data && data.room && data.room.width);
            var depth = Number(data && data.room && data.room.depth);
            var kind = data && data.room && data.room.kind;
            if (['rect', 'l', 'l2', 't'].indexOf(kind) === -1) {
                kind = 'rect';
            }
            if (isFinite(width) && isFinite(depth)) {
                next.room.kind = kind;
                next.room.shape = data.room.shape || (kind === 'rect' && width === depth ? 'square' : kind === 'rect' ? 'rectangle' : kind);
                next.room.width = width;
                next.room.depth = depth;
                next.room.cutW = Number(data.room.cutW) || 0;
                next.room.cutD = Number(data.room.cutD) || 0;
                tightenRoom(next.room);
            }
            if (data && roomTab(data.catalog)) {
                next.catalog = roomTab(data.catalog).id;
            }
            if (data && Array.isArray(data.openings)) {
                data.openings.forEach(function (opening) {
                    if (!opening || !opening.wall) {
                        return;
                    }
                    if (!isFinite(Number(opening.offset)) || !isFinite(Number(opening.width))) {
                        return;
                    }
                    next.openings.push({
                        id: String(opening.id || uid('d')),
                        wall: String(opening.wall),
                        offset: Number(opening.offset),
                        width: Number(opening.width)
                    });
                });
            }
            if (data && Array.isArray(data.items)) {
                data.items.forEach(function (item) {
                    if (!item || !catalogItem(item.catalogId)) {
                        return;
                    }
                    var rotation = Number(item.rotation);
                    if ([0, 90, 180, 270].indexOf(rotation) === -1) {
                        rotation = 0;
                    }
                    next.items.push({
                        id: String(item.id || uid('f')),
                        catalogId: item.catalogId,
                        x: Number(item.x) || 0,
                        y: Number(item.y) || 0,
                        rotation: rotation
                    });
                });
            }
            state = next;
            normalizeOpenings();
            normalizeItems();
            return next;
        }

        function persist() {
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    room: state.room,
                    openings: state.openings,
                    items: state.items,
                    catalog: state.catalog
                }));
            } catch (error) {
                setStatus('This browser could not save the plan.');
            }
        }

        function uid(prefix) {
            var id = prefix + String(nextId);
            nextId += 1;
            return id;
        }

        function adoptIds() {
            var max = 0;
            state.items.concat(state.openings).forEach(function (entry) {
                var match = String(entry.id).match(/(\d+)$/);
                if (match) {
                    max = Math.max(max, Number(match[1]));
                }
            });
            nextId = max + 1;
        }

        function findItem(id) {
            var index;
            for (index = 0; index < state.items.length; index += 1) {
                if (state.items[index].id === id) {
                    return state.items[index];
                }
            }
            return null;
        }

        function findOpening(id) {
            var index;
            for (index = 0; index < state.openings.length; index += 1) {
                if (state.openings[index].id === id) {
                    return state.openings[index];
                }
            }
            return null;
        }

        function minRoomSize() {
            return state.room.kind === 'rect' ? MIN_ROOM : MIN_SHAPED;
        }

        function tightenRoom(room) {
            var minSize = room.kind === 'rect' ? MIN_ROOM : MIN_SHAPED;
            room.width = Math.min(MAX_ROOM, Math.max(minSize, snap(room.width)));
            room.depth = Math.min(MAX_ROOM, Math.max(minSize, snap(room.depth)));
            if (room.kind === 'rect') {
                room.cutW = 0;
                room.cutD = 0;
                return;
            }
            var cutW = snap(room.cutW);
            var cutD = snap(room.cutD);
            if (room.kind === 't') {
                cutW = Math.min(Math.max(cutW, 4), room.width - 8);
                cutD = Math.min(Math.max(cutD, 4), room.depth - 4);
            } else {
                cutW = Math.min(Math.max(cutW, 4), room.width - 4);
                cutD = Math.min(Math.max(cutD, 4), room.depth - 4);
            }
            room.cutW = cutW;
            room.cutD = cutD;
        }

        function layout() {
            var room = state.room;
            var width = room.width;
            var depth = room.depth;
            var cutW = room.cutW;
            var cutD = room.cutD;
            var polygon;
            var cutouts = [];
            var shoulder;

            if (room.kind === 'l') {
                polygon = [
                    [0, 0],
                    [width - cutW, 0],
                    [width - cutW, cutD],
                    [width, cutD],
                    [width, depth],
                    [0, depth]
                ];
                cutouts = [{ x: width - cutW, y: 0, w: cutW, h: cutD }];
            } else if (room.kind === 'l2') {
                polygon = [
                    [cutW, 0],
                    [width, 0],
                    [width, depth],
                    [0, depth],
                    [0, cutD],
                    [cutW, cutD]
                ];
                cutouts = [{ x: 0, y: 0, w: cutW, h: cutD }];
            } else if (room.kind === 't') {
                shoulder = (width - cutW) / 2;
                polygon = [
                    [0, 0],
                    [width, 0],
                    [width, cutD],
                    [shoulder + cutW, cutD],
                    [shoulder + cutW, depth],
                    [shoulder, depth],
                    [shoulder, cutD],
                    [0, cutD]
                ];
                cutouts = [
                    { x: 0, y: cutD, w: shoulder, h: depth - cutD },
                    { x: shoulder + cutW, y: cutD, w: shoulder, h: depth - cutD }
                ];
            } else {
                polygon = [[0, 0], [width, 0], [width, depth], [0, depth]];
            }

            var used = {};
            var walls = polygon.map(function (point, index) {
                var next = polygon[(index + 1) % polygon.length];
                var horizontal = Math.abs(point[1] - next[1]) < 0.001;
                var x1 = point[0];
                var y1 = point[1];
                var x2 = next[0];
                var y2 = next[1];
                if (horizontal && x1 > x2) {
                    x1 = next[0];
                    x2 = point[0];
                }
                if (!horizontal && y1 > y2) {
                    y1 = next[1];
                    y2 = point[1];
                }
                var id;
                if (horizontal && Math.abs(y1) < 0.01) {
                    id = 'north';
                } else if (horizontal && Math.abs(y1 - depth) < 0.01) {
                    id = 'south';
                } else if (!horizontal && Math.abs(x1) < 0.01) {
                    id = 'west';
                } else if (!horizontal && Math.abs(x1 - width) < 0.01) {
                    id = 'east';
                } else {
                    id = 'w' + index;
                }
                if (used[id]) {
                    id = id + '-' + index;
                }
                used[id] = true;
                return {
                    id: id,
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    length: horizontal ? x2 - x1 : y2 - y1,
                    horizontal: horizontal
                };
            });

            return {
                polygon: polygon,
                walls: walls,
                cutouts: cutouts
            };
        }

        function findWall(id) {
            var walls = layout().walls;
            var index;
            for (index = 0; index < walls.length; index += 1) {
                if (walls[index].id === id) {
                    return walls[index];
                }
            }
            return null;
        }

        function wallLength(id) {
            var wall = findWall(id);
            return wall ? wall.length : 0;
        }

        function rectHitsCutout(x, y, width, depth, cut) {
            return x < cut.x + cut.w - 0.02 && x + width > cut.x + 0.02 && y < cut.y + cut.h - 0.02 && y + depth > cut.y + 0.02;
        }

        function itemInside(item) {
            var size = footprint(item);
            var plan = layout();
            if (item.x < -0.02 || item.y < -0.02) {
                return false;
            }
            if (item.x + size.w > state.room.width + 0.02 || item.y + size.d > state.room.depth + 0.02) {
                return false;
            }
            return !plan.cutouts.some(function (cut) {
                return rectHitsCutout(item.x, item.y, size.w, size.d, cut);
            });
        }

        function pointInside(x, y) {
            var plan = layout();
            if (x < -0.05 || y < -0.05 || x > state.room.width + 0.05 || y > state.room.depth + 0.05) {
                return false;
            }
            return !plan.cutouts.some(function (cut) {
                return x > cut.x + 0.05 && x < cut.x + cut.w - 0.05 && y > cut.y + 0.05 && y < cut.y + cut.h - 0.05;
            });
        }

        function nudgeInside(item) {
            var startX = item.x;
            var startY = item.y;
            var radius;
            var dx;
            var dy;
            if (itemInside(item)) {
                return true;
            }
            for (radius = 0.5; radius <= 4; radius += 0.5) {
                for (dx = -radius; dx <= radius; dx += 0.5) {
                    for (dy = -radius; dy <= radius; dy += 0.5) {
                        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) {
                            continue;
                        }
                        item.x = snap(startX + dx);
                        item.y = snap(startY + dy);
                        if (itemInside(item)) {
                            return true;
                        }
                    }
                }
            }
            item.x = startX;
            item.y = startY;
            return false;
        }

        function findSpot(item, preferred) {
            var size = footprint(item);
            var y;
            var x;
            if (preferred) {
                item.x = snap(preferred.x);
                item.y = snap(preferred.y);
                if (itemInside(item)) {
                    return true;
                }
            }
            for (y = 0; y <= state.room.depth - size.d + 0.001; y += 1) {
                for (x = 0; x <= state.room.width - size.w + 0.001; x += 1) {
                    item.x = x;
                    item.y = y;
                    if (itemInside(item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function overlapsOpening(wall, offset, width, ignoreId) {
            return state.openings.some(function (opening) {
                if (opening.id === ignoreId || opening.wall !== wall) {
                    return false;
                }
                return offset < opening.offset + opening.width - 0.01 && offset + width > opening.offset + 0.01;
            });
        }

        function normalizeOpenings() {
            var kept = [];
            state.openings.forEach(function (opening) {
                var length = wallLength(opening.wall);
                var width = snap(opening.width);
                if (length < 2 || width < 2) {
                    return;
                }
                width = Math.min(width, length);
                var offset = snap(opening.offset);
                offset = Math.max(0, Math.min(offset, length - width));
                var blocked = kept.some(function (other) {
                    return other.wall === opening.wall && offset < other.offset + other.width - 0.01 && offset + width > other.offset + 0.01;
                });
                if (blocked) {
                    return;
                }
                opening.width = width;
                opening.offset = offset;
                kept.push(opening);
            });
            state.openings = kept;
        }

        function normalizeItems() {
            state.items = state.items.filter(function (item) {
                if (!catalogItem(item.catalogId)) {
                    return false;
                }
                return itemInside(item) || nudgeInside(item);
            });
        }

        function buildToolbar() {
            var shapes = document.createElement('div');
            shapes.className = 'room-builder__shapes';
            var shapeLabel = document.createElement('span');
            shapeLabel.className = 'room-builder__shapes-label';
            shapeLabel.textContent = 'Shape';
            shapes.appendChild(shapeLabel);
            SHAPES.forEach(function (template) {
                var button = makeButton(template.label, 'room-builder__button');
                button.setAttribute('data-shape', template.id);
                button.addEventListener('click', function () {
                    applyShape(template);
                });
                shapes.appendChild(button);
            });
            app.appendChild(shapes);

            var toolbar = document.createElement('div');
            toolbar.className = 'room-builder__toolbar';
            var title = document.createElement('h2');
            title.textContent = 'Room builder';
            toolbar.appendChild(title);

            widthInput = numberField('Width');
            depthInput = numberField('Depth');
            toolbar.appendChild(widthInput.parentNode);
            toolbar.appendChild(depthInput.parentNode);
            widthInput.addEventListener('change', applyRoomFromInputs);
            depthInput.addEventListener('change', applyRoomFromInputs);
            widthInput.addEventListener('keydown', commitOnEnter);
            depthInput.addEventListener('keydown', commitOnEnter);

            doorButton = makeButton('Add door', 'room-builder__button');
            doorButton.setAttribute('aria-pressed', 'false');
            doorButton.addEventListener('click', function () {
                state.tool = state.tool === 'door' ? 'select' : 'door';
                syncDoorTool();
                setStatus(state.tool === 'door' ? 'Click a wall to add a doorway.' : '');
            });
            toolbar.appendChild(doorButton);

            var resetButton = makeButton('Reset', 'room-builder__button');
            resetButton.addEventListener('click', resetPlan);
            toolbar.appendChild(resetButton);
            app.appendChild(toolbar);
        }

        function numberField(labelText) {
            var label = document.createElement('label');
            label.className = 'room-builder__field';
            label.appendChild(document.createTextNode(labelText));
            var input = document.createElement('input');
            input.type = 'number';
            input.min = String(MIN_ROOM);
            input.max = String(MAX_ROOM);
            input.step = '0.5';
            input.inputMode = 'decimal';
            label.appendChild(input);
            label.appendChild(document.createTextNode('ft'));
            return input;
        }

        function buildWorkspace() {
            var workspace = document.createElement('div');
            workspace.className = 'room-builder__workspace';

            stage = document.createElement('div');
            stage.className = 'room-builder__stage';
            stage.tabIndex = 0;
            stage.setAttribute('aria-label', 'Floor plan');
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'room-builder__plan');
            svg.setAttribute('role', 'application');
            svg.setAttribute('aria-label', 'Top-down room plan');
            stage.appendChild(svg);
            workspace.appendChild(stage);

            svg.addEventListener('pointerdown', onPlanPointerDown);
            svg.addEventListener('pointermove', onPlanPointerMove);
            svg.addEventListener('pointerup', onPlanPointerUp);
            svg.addEventListener('pointercancel', onPlanPointerUp);

            var side = document.createElement('aside');
            side.className = 'room-builder__side';
            hintEl = document.createElement('p');
            hintEl.className = 'room-builder__hint';
            hintEl.textContent = 'Pick a room tab, then drag a piece onto the plan or click it to place it.';
            statusEl = document.createElement('p');
            statusEl.className = 'room-builder__status';
            statusEl.hidden = true;
            selectionEl = document.createElement('div');
            selectionEl.className = 'room-builder__selection';

            tablistEl = document.createElement('div');
            tablistEl.className = 'room-builder__tabs';
            tablistEl.setAttribute('role', 'tablist');
            ROOMS.forEach(function (room) {
                var tab = makeButton(room.label, 'room-builder__button room-builder__tab');
                tab.setAttribute('role', 'tab');
                tab.setAttribute('data-room-tab', room.id);
                tab.addEventListener('click', function () {
                    state.catalog = room.id;
                    persist();
                    renderPalette();
                });
                tablistEl.appendChild(tab);
            });

            paletteEl = document.createElement('div');
            paletteEl.className = 'room-builder__palette';
            paletteEl.setAttribute('role', 'tabpanel');

            side.appendChild(hintEl);
            side.appendChild(statusEl);
            side.appendChild(selectionEl);
            side.appendChild(tablistEl);
            side.appendChild(paletteEl);
            workspace.appendChild(side);
            app.appendChild(workspace);
        }

        function renderPalette() {
            var room = roomTab(state.catalog);
            paletteEl.innerHTML = '';
            paletteEl.setAttribute('aria-label', room.label);
            tablistEl.querySelectorAll('[data-room-tab]').forEach(function (tab) {
                var active = tab.getAttribute('data-room-tab') === room.id;
                tab.classList.toggle('is-active', active);
                tab.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            room.pieces.forEach(function (entry) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'room-builder__piece';
                button.setAttribute('data-catalog', entry.id);
                var swatch = document.createElement('span');
                swatch.className = 'room-builder__swatch';
                swatch.style.background = entry.color;
                if (entry.round) {
                    swatch.style.borderRadius = '50%';
                }
                button.appendChild(swatch);
                var copy = document.createElement('span');
                copy.className = 'room-builder__piece-copy';
                var name = document.createElement('span');
                name.className = 'room-builder__piece-name';
                name.textContent = entry.name;
                var size = document.createElement('span');
                size.className = 'room-builder__piece-size';
                size.textContent = formatFeet(entry.width) + ' × ' + formatFeet(entry.depth) + ' ft';
                copy.appendChild(name);
                copy.appendChild(size);
                button.appendChild(copy);
                button.addEventListener('pointerdown', onPalettePointerDown);
                button.addEventListener('pointermove', onPalettePointerMove);
                button.addEventListener('pointerup', onPalettePointerUp);
                button.addEventListener('pointercancel', onPalettePointerUp);
                paletteEl.appendChild(button);
            });
        }

        function makeButton(label, className) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = className;
            button.textContent = label;
            return button;
        }

        function commitOnEnter(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                applyRoomFromInputs();
            }
        }

        function applyRoomFromInputs() {
            var width = parseFloat(widthInput.value);
            var depth = parseFloat(depthInput.value);
            if (!isFinite(width) || !isFinite(depth)) {
                syncSizeInputs();
                return;
            }
            setRoomSize(width, depth);
        }

        function setRoomSize(width, depth) {
            var before = state.items.length;
            var room = state.room;
            var nextWidth = Math.min(MAX_ROOM, Math.max(minRoomSize(), snap(width)));
            var nextDepth = Math.min(MAX_ROOM, Math.max(minRoomSize(), snap(depth)));
            if (room.kind !== 'rect' && room.width > 0 && room.depth > 0) {
                room.cutW *= nextWidth / room.width;
                room.cutD *= nextDepth / room.depth;
            }
            room.width = nextWidth;
            room.depth = nextDepth;
            tightenRoom(room);
            if (room.kind === 'rect') {
                if (!(room.shape === 'studio' && room.width === 20 && room.depth === 14)) {
                    room.shape = room.width === room.depth ? 'square' : 'rectangle';
                }
            }
            normalizeOpenings();
            normalizeItems();
            dropMissingSelection();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPlan();
            renderSelection();
            if (state.items.length < before) {
                setStatus('Some pieces no longer fit and were removed.');
            } else {
                setStatus('');
            }
        }

        function applyShape(template) {
            var before = state.items.length;
            var hadDoors = state.openings.length > 0;
            state.room = roomFromTemplate(template);
            tightenRoom(state.room);
            state.openings = [];
            state.selected = null;
            normalizeItems();
            dropMissingSelection();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPlan();
            renderSelection();
            var messages = [];
            if (hadDoors) {
                messages.push('Doorways were cleared for the new shape.');
            }
            if (state.items.length < before) {
                messages.push('Some pieces no longer fit and were removed.');
            }
            setStatus(messages.join(' '));
        }

        function syncSizeInputs() {
            var minSize = String(minRoomSize());
            widthInput.min = minSize;
            depthInput.min = minSize;
            widthInput.value = String(state.room.width);
            depthInput.value = String(state.room.depth);
        }

        function dropMissingSelection() {
            if (!state.selected) {
                return;
            }
            if (state.selected.type === 'item' && !findItem(state.selected.id)) {
                state.selected = null;
            }
            if (state.selected && state.selected.type === 'opening' && !findOpening(state.selected.id)) {
                state.selected = null;
            }
        }

        function syncShapeButtons() {
            app.querySelectorAll('[data-shape]').forEach(function (button) {
                button.classList.toggle('is-active', button.getAttribute('data-shape') === state.room.shape);
            });
        }

        function syncDoorTool() {
            var active = state.tool === 'door';
            doorButton.classList.toggle('is-active', active);
            doorButton.setAttribute('aria-pressed', active ? 'true' : 'false');
            stage.classList.toggle('is-door-tool', active);
        }

        function setStatus(message) {
            statusEl.hidden = !message;
            statusEl.textContent = message || '';
            hintEl.hidden = !!message;
        }

        function resetPlan() {
            if (!window.confirm('Clear this room plan?')) {
                return;
            }
            state.room = roomFromTemplate(shapeTemplate('rectangle'));
            state.openings = [];
            state.items = [];
            state.selected = null;
            state.tool = 'select';
            syncDoorTool();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPlan();
            renderSelection();
            setStatus('');
        }

        function renderPlan() {
            var room = state.room;
            var plan = layout();
            var padX = 0.9;
            var padTop = 1.35;
            var padBottom = 0.7;
            var viewWidth = room.width + padX * 2;
            var viewHeight = room.depth + padTop + padBottom;
            var points = plan.polygon.map(function (point) {
                return num(point[0]) + ',' + num(point[1]);
            }).join(' ');
            var shapeName = shapeTemplate(room.shape).label;

            svg.setAttribute('viewBox', [-padX, -padTop, viewWidth, viewHeight].join(' '));
            svg.style.aspectRatio = viewWidth + ' / ' + viewHeight;

            var markup = '';
            markup += '<defs><clipPath id="' + clipId + '"><polygon points="' + points + '"></polygon></clipPath></defs>';
            markup += '<polygon class="room-builder__floor" data-kind="floor" points="' + points + '"></polygon>';
            markup += '<g class="room-builder__grid" clip-path="url(#' + clipId + ')" pointer-events="none">' + gridMarkup() + '</g>';
            markup += itemsMarkup(true);
            markup += wallsMarkup(plan.walls);
            markup += itemsMarkup(false);
            markup += openingsMarkup();
            markup += selectionMarkup();
            markup += '<text pointer-events="none" text-anchor="middle" font-size="0.46" x="' + num(room.width / 2) + '" y="-0.5">' + shapeName + ' · ' + formatFeet(room.width) + ' ft × ' + formatFeet(room.depth) + ' ft</text>';
            svg.innerHTML = markup;
        }

        function gridMarkup() {
            var lines = '';
            var x;
            var y;
            for (x = 1; x < state.room.width; x += 1) {
                lines += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + num(state.room.depth) + '"></line>';
            }
            for (y = 1; y < state.room.depth; y += 1) {
                lines += '<line x1="0" y1="' + y + '" x2="' + num(state.room.width) + '" y2="' + y + '"></line>';
            }
            return lines;
        }

        function wallsMarkup(walls) {
            var lines = [];
            walls.forEach(function (wall) {
                var gaps = state.openings.filter(function (opening) {
                    return opening.wall === wall.id;
                }).map(function (opening) {
                    return { start: opening.offset, end: opening.offset + opening.width };
                }).sort(function (a, b) {
                    return a.start - b.start;
                });
                var cursor = 0;
                var parts = [];
                gaps.forEach(function (gap) {
                    if (gap.start > cursor) {
                        parts.push([cursor, gap.start]);
                    }
                    cursor = Math.max(cursor, gap.end);
                });
                if (cursor < wall.length) {
                    parts.push([cursor, wall.length]);
                }
                var dx = wall.length ? (wall.x2 - wall.x1) / wall.length : 0;
                var dy = wall.length ? (wall.y2 - wall.y1) / wall.length : 0;
                parts.forEach(function (part) {
                    var start = part[0];
                    var end = part[1];
                    if (start <= 0) {
                        start = -0.08;
                    }
                    if (end >= wall.length) {
                        end = wall.length + 0.08;
                    }
                    lines.push([
                        wall.x1 + dx * start,
                        wall.y1 + dy * start,
                        wall.x1 + dx * end,
                        wall.y1 + dy * end
                    ]);
                });
            });
            return '<g class="room-builder__wall" pointer-events="none">' + lines.map(function (line) {
                return '<line x1="' + num(line[0]) + '" y1="' + num(line[1]) + '" x2="' + num(line[2]) + '" y2="' + num(line[3]) + '"></line>';
            }).join('') + '</g>';
        }

        function itemsMarkup(rugs) {
            return state.items.filter(function (item) {
                var entry = catalogItem(item.catalogId);
                var isRug = entry.kind === 'rug';
                return rugs ? isRug : !isRug;
            }).map(function (item) {
                var entry = catalogItem(item.catalogId);
                var size = footprint(item);
                var selected = state.selected && state.selected.type === 'item' && state.selected.id === item.id;
                var markup = '<g data-kind="item" data-id="' + item.id + '">';
                markup += '<title>' + entry.name + '</title>';
                if (entry.round) {
                    markup += '<ellipse cx="' + num(item.x + size.w / 2) + '" cy="' + num(item.y + size.d / 2) + '" rx="' + num(size.w / 2) + '" ry="' + num(size.d / 2) + '" fill="' + entry.color + '" stroke="' + (selected ? '#9a3412' : 'rgba(44,42,38,0.28)') + '" stroke-width="' + (selected ? '0.08' : '0.03') + '"></ellipse>';
                } else {
                    markup += '<rect x="' + num(item.x) + '" y="' + num(item.y) + '" width="' + num(size.w) + '" height="' + num(size.d) + '" rx="0.08" fill="' + entry.color + '"' + (entry.kind === 'rug' ? ' fill-opacity="0.9"' : '') + ' stroke="' + (selected ? '#9a3412' : 'rgba(44,42,38,0.28)') + '" stroke-width="' + (selected ? '0.08' : '0.03') + '"></rect>';
                }
                if (entry.facing) {
                    var back = backLine(item, size.w, size.d, entry.bed);
                    markup += '<line class="room-builder__back" pointer-events="none" stroke-width="' + (entry.bed ? '0.42' : '0.14') + '" x1="' + num(back[0]) + '" y1="' + num(back[1]) + '" x2="' + num(back[2]) + '" y2="' + num(back[3]) + '"></line>';
                }
                markup += '</g>';
                return markup;
            }).join('');
        }

        function backLine(item, width, depth, isBed) {
            var x = item.x;
            var y = item.y;
            var inset = isBed ? 0.22 : 0.12;
            if (item.rotation === 90) {
                return [x + width - inset, y + 0.15, x + width - inset, y + depth - 0.15];
            }
            if (item.rotation === 180) {
                return [x + 0.15, y + depth - inset, x + width - 0.15, y + depth - inset];
            }
            if (item.rotation === 270) {
                return [x + inset, y + 0.15, x + inset, y + depth - 0.15];
            }
            return [x + 0.15, y + inset, x + width - 0.15, y + inset];
        }

        function inwardNormal(wall) {
            var midX = (wall.x1 + wall.x2) / 2;
            var midY = (wall.y1 + wall.y2) / 2;
            var dx = wall.length ? (wall.x2 - wall.x1) / wall.length : 1;
            var dy = wall.length ? (wall.y2 - wall.y1) / wall.length : 0;
            var nx = -dy;
            var ny = dx;
            if (pointInside(midX + nx * 0.4, midY + ny * 0.4)) {
                return { x: nx, y: ny };
            }
            return { x: -nx, y: -ny };
        }

        function openingsMarkup() {
            return state.openings.map(function (opening) {
                var wall = findWall(opening.wall);
                var graphic = wall && doorGraphic(opening, wall);
                if (!wall || !graphic) {
                    return '';
                }
                var normal = inwardNormal(wall);
                var hit = openingHit(opening, wall, normal);
                var selected = state.selected && state.selected.type === 'opening' && state.selected.id === opening.id;
                var cursor = wall.horizontal ? 'ew-resize' : 'ns-resize';
                return '<g data-kind="opening" data-id="' + opening.id + '" style="cursor:' + cursor + '">' +
                    '<rect x="' + num(hit.x) + '" y="' + num(hit.y) + '" width="' + num(hit.w) + '" height="' + num(hit.h) + '" fill="transparent"></rect>' +
                    '<path class="room-builder__door' + (selected ? ' is-selected' : '') + '" pointer-events="none" d="' + graphic.leaf + '"></path>' +
                    '<path class="room-builder__door' + (selected ? ' is-selected' : '') + '" pointer-events="none" d="' + graphic.arc + '"></path>' +
                    '</g>';
            }).join('');
        }

        function openingHit(opening, wall, normal) {
            var reach = 1.15;
            var outside = 0.25;
            if (wall.horizontal) {
                return {
                    x: wall.x1 + opening.offset,
                    y: normal.y > 0 ? wall.y1 - outside : wall.y1 - reach + outside,
                    w: opening.width,
                    h: reach
                };
            }
            return {
                x: normal.x > 0 ? wall.x1 - outside : wall.x1 - reach + outside,
                y: wall.y1 + opening.offset,
                w: reach,
                h: opening.width
            };
        }

        function doorGraphic(opening, wall) {
            var alongX = wall.horizontal ? 1 : 0;
            var alongY = wall.horizontal ? 0 : 1;
            var normal = inwardNormal(wall);
            var hingeX = wall.x1 + alongX * opening.offset;
            var hingeY = wall.y1 + alongY * opening.offset;
            var closedX = hingeX + alongX * opening.width;
            var closedY = hingeY + alongY * opening.width;
            var openX = hingeX + normal.x * opening.width;
            var openY = hingeY + normal.y * opening.width;
            var cross = alongX * normal.y - alongY * normal.x;
            var sweep = cross > 0 ? 1 : 0;
            return {
                leaf: 'M ' + num(hingeX) + ' ' + num(hingeY) + ' L ' + num(openX) + ' ' + num(openY),
                arc: 'M ' + num(closedX) + ' ' + num(closedY) + ' A ' + num(opening.width) + ' ' + num(opening.width) + ' 0 0 ' + sweep + ' ' + num(openX) + ' ' + num(openY)
            };
        }

        function selectionMarkup() {
            if (!state.selected || state.selected.type !== 'item') {
                return '';
            }
            var item = findItem(state.selected.id);
            if (!item) {
                return '';
            }
            var size = footprint(item);
            return '<rect pointer-events="none" fill="none" stroke="#9a3412" stroke-width="0.05" stroke-dasharray="0.16 0.1" x="' + num(item.x - 0.1) + '" y="' + num(item.y - 0.1) + '" width="' + num(size.w + 0.2) + '" height="' + num(size.d + 0.2) + '"></rect>';
        }

        function renderSelection() {
            selectionEl.innerHTML = '';
            if (!state.selected) {
                return;
            }
            if (state.selected.type === 'item') {
                var item = findItem(state.selected.id);
                var entry = item && catalogItem(item.catalogId);
                if (!item || !entry) {
                    state.selected = null;
                    return;
                }
                var size = footprint(item);
                var label = document.createElement('p');
                label.textContent = entry.name + ' · ' + formatFeet(size.w) + ' × ' + formatFeet(size.d) + ' ft';
                selectionEl.appendChild(label);
                selectionEl.appendChild(actionButton('Rotate', rotateSelected));
                selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
                return;
            }
            var opening = findOpening(state.selected.id);
            if (!opening || !findWall(opening.wall)) {
                state.selected = null;
                return;
            }
            var doorLabel = document.createElement('p');
            doorLabel.textContent = 'Doorway';
            var widthLabel = document.createElement('label');
            widthLabel.className = 'room-builder__field';
            widthLabel.appendChild(document.createTextNode('Width'));
            var widthControl = document.createElement('input');
            widthControl.type = 'number';
            widthControl.min = '2';
            widthControl.max = String(wallLength(opening.wall));
            widthControl.step = '0.5';
            widthControl.value = String(opening.width);
            widthLabel.appendChild(widthControl);
            widthLabel.appendChild(document.createTextNode('ft'));
            widthControl.addEventListener('change', function () {
                updateDoorWidth(opening.id, widthControl);
            });
            selectionEl.appendChild(doorLabel);
            selectionEl.appendChild(widthLabel);
            selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
        }

        function actionButton(label, handler, danger) {
            var button = makeButton(label, 'room-builder__button' + (danger ? ' room-builder__button--danger' : ''));
            button.addEventListener('click', handler);
            return button;
        }

        function updateDoorWidth(id, input) {
            var opening = findOpening(id);
            if (!opening) {
                return;
            }
            var length = wallLength(opening.wall);
            var width = snap(parseFloat(input.value));
            if (!isFinite(width)) {
                input.value = String(opening.width);
                return;
            }
            width = Math.max(2, Math.min(width, length));
            var offset = opening.offset;
            if (offset + width > length) {
                offset = snap(length - width);
            }
            if (overlapsOpening(opening.wall, offset, width, opening.id)) {
                input.value = String(opening.width);
                setStatus('That width overlaps another doorway.');
                return;
            }
            opening.width = width;
            opening.offset = offset;
            input.value = String(width);
            persist();
            renderPlan();
            setStatus('');
        }

        function rotateSelected() {
            var item = state.selected && state.selected.type === 'item' ? findItem(state.selected.id) : null;
            if (!item) {
                return;
            }
            var previousRotation = item.rotation;
            var previousX = item.x;
            var previousY = item.y;
            item.rotation = (item.rotation + 90) % 360;
            if (!itemInside(item) && !nudgeInside(item)) {
                item.rotation = previousRotation;
                item.x = previousX;
                item.y = previousY;
                setStatus(catalogItem(item.catalogId).name + ' does not fit that way.');
                return;
            }
            if (previousX !== item.x || previousY !== item.y) {
                setStatus('Rotated and shifted so it stays inside the room.');
            } else {
                setStatus('');
            }
            persist();
            renderPlan();
            renderSelection();
        }

        function deleteSelected() {
            if (!state.selected) {
                return;
            }
            if (state.selected.type === 'item') {
                state.items = state.items.filter(function (item) {
                    return item.id !== state.selected.id;
                });
            } else {
                state.openings = state.openings.filter(function (opening) {
                    return opening.id !== state.selected.id;
                });
            }
            state.selected = null;
            persist();
            renderPlan();
            renderSelection();
            setStatus('');
        }

        function placeItem(catalogId, topLeft) {
            var entry = catalogItem(catalogId);
            var item = {
                id: uid('f'),
                catalogId: catalogId,
                x: 0,
                y: 0,
                rotation: 0
            };
            var size = footprint(item);
            var preferred = topLeft || {
                x: (state.room.width - size.w) / 2,
                y: (state.room.depth - size.d) / 2
            };
            if (!findSpot(item, preferred)) {
                setStatus(entry.name + ' does not fit in this room.');
                return;
            }
            state.items.push(item);
            state.selected = { type: 'item', id: item.id };
            persist();
            renderPlan();
            renderSelection();
            setStatus('');
        }

        function project(wall, x, y) {
            return wall.horizontal ? x - wall.x1 : y - wall.y1;
        }

        function nearestWall(x, y) {
            var best = null;
            layout().walls.forEach(function (wall) {
                var offset = project(wall, x, y);
                var clamped = Math.max(0, Math.min(wall.length, offset));
                var pointX = wall.horizontal ? wall.x1 + clamped : wall.x1;
                var pointY = wall.horizontal ? wall.y1 : wall.y1 + clamped;
                var dist = Math.hypot(x - pointX, y - pointY);
                if (!best || dist < best.dist) {
                    best = {
                        wall: wall.id,
                        dist: dist,
                        offset: clamped,
                        length: wall.length
                    };
                }
            });
            if (!best || best.dist > DOOR_REACH) {
                return null;
            }
            return best;
        }

        function placeDoor(feet) {
            var hit = nearestWall(feet.x, feet.y);
            if (!hit) {
                setStatus('Click a wall to add a doorway.');
                return;
            }
            if (DOOR_WIDTH > hit.length) {
                setStatus('This wall is too short for a doorway.');
                return;
            }
            var offset = snap(hit.offset - DOOR_WIDTH / 2);
            offset = Math.max(0, Math.min(offset, hit.length - DOOR_WIDTH));
            if (overlapsOpening(hit.wall, offset, DOOR_WIDTH, null)) {
                setStatus('A doorway is already on that part of the wall.');
                return;
            }
            var opening = {
                id: uid('d'),
                wall: hit.wall,
                offset: offset,
                width: DOOR_WIDTH
            };
            state.openings.push(opening);
            state.selected = { type: 'opening', id: opening.id };
            persist();
            renderPlan();
            renderSelection();
            setStatus('Doorway added. Drag it along the wall, or change its width.');
        }

        function hitTarget(node) {
            var element = node;
            while (element && element !== svg) {
                if (element.getAttribute && element.getAttribute('data-kind')) {
                    return element;
                }
                element = element.parentNode;
            }
            return null;
        }

        function capturePointer(event) {
            try {
                svg.setPointerCapture(event.pointerId);
            } catch (error) {
                return;
            }
        }

        function clientToFeet(clientX, clientY) {
            var matrix = svg.getScreenCTM();
            if (!matrix) {
                return { x: 0, y: 0 };
            }
            var point = svg.createSVGPoint();
            point.x = clientX;
            point.y = clientY;
            var local = point.matrixTransform(matrix.inverse());
            return { x: local.x, y: local.y };
        }

        function onPlanPointerDown(event) {
            if (event.button !== 0) {
                return;
            }
            stage.focus();
            var target = hitTarget(event.target);
            var kind = target ? target.getAttribute('data-kind') : '';
            var id = target ? target.getAttribute('data-id') : '';
            var feet = clientToFeet(event.clientX, event.clientY);

            if (kind === 'item') {
                var item = findItem(id);
                if (!item) {
                    return;
                }
                state.selected = { type: 'item', id: id };
                renderSelection();
                renderPlan();
                drag = {
                    kind: 'item',
                    id: id,
                    pointerId: event.pointerId,
                    originX: item.x,
                    originY: item.y,
                    start: feet,
                    lastX: item.x,
                    lastY: item.y
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            if (kind === 'opening') {
                var opening = findOpening(id);
                var wall = opening && findWall(opening.wall);
                if (!opening || !wall) {
                    return;
                }
                state.selected = { type: 'opening', id: id };
                renderSelection();
                renderPlan();
                drag = {
                    kind: 'opening',
                    id: id,
                    pointerId: event.pointerId,
                    grab: project(wall, feet.x, feet.y) - opening.offset
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            if (state.tool === 'door') {
                drag = {
                    kind: 'place-door',
                    pointerId: event.pointerId,
                    startX: event.clientX,
                    startY: event.clientY
                };
                capturePointer(event);
                return;
            }

            state.selected = null;
            renderSelection();
            renderPlan();
        }

        function onPlanPointerMove(event) {
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            if (drag.kind === 'item') {
                var item = findItem(drag.id);
                var feet = clientToFeet(event.clientX, event.clientY);
                if (!item) {
                    return;
                }
                var nextX = snap(drag.originX + (feet.x - drag.start.x));
                var nextY = snap(drag.originY + (feet.y - drag.start.y));
                item.x = nextX;
                item.y = nextY;
                if (!itemInside(item)) {
                    item.x = drag.lastX;
                    item.y = drag.lastY;
                } else {
                    drag.lastX = item.x;
                    drag.lastY = item.y;
                }
                renderPlan();
                return;
            }
            if (drag.kind === 'opening') {
                var opening = findOpening(drag.id);
                var wall = opening && findWall(opening.wall);
                if (!opening || !wall) {
                    return;
                }
                var point = clientToFeet(event.clientX, event.clientY);
                var desired = snap(project(wall, point.x, point.y) - drag.grab);
                desired = Math.max(0, Math.min(desired, wall.length - opening.width));
                if (!overlapsOpening(opening.wall, desired, opening.width, opening.id)) {
                    opening.offset = desired;
                    renderPlan();
                }
            }
        }

        function onPlanPointerUp(event) {
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            var current = drag;
            drag = null;
            if (current.kind === 'place-door') {
                var moved = Math.abs(event.clientX - current.startX) > 5 || Math.abs(event.clientY - current.startY) > 5;
                if (!moved) {
                    placeDoor(clientToFeet(event.clientX, event.clientY));
                }
                return;
            }
            if (current.kind === 'item' || current.kind === 'opening') {
                persist();
            }
        }

        function onPalettePointerDown(event) {
            if (event.button !== 0) {
                return;
            }
            drag = {
                kind: 'palette',
                catalogId: event.currentTarget.getAttribute('data-catalog'),
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                moved: false
            };
            try {
                event.currentTarget.setPointerCapture(event.pointerId);
            } catch (error) {
                return;
            }
            event.preventDefault();
        }

        function onPalettePointerMove(event) {
            if (!drag || drag.kind !== 'palette' || drag.pointerId !== event.pointerId) {
                return;
            }
            if (Math.abs(event.clientX - drag.startX) > 5 || Math.abs(event.clientY - drag.startY) > 5) {
                drag.moved = true;
                ensureGhost(catalogItem(drag.catalogId).name, event.clientX, event.clientY);
            }
        }

        function onPalettePointerUp(event) {
            if (!drag || drag.kind !== 'palette' || drag.pointerId !== event.pointerId) {
                return;
            }
            var current = drag;
            drag = null;
            removeGhost();
            if (!current.moved) {
                placeItem(current.catalogId, null);
                return;
            }
            var bounds = stage.getBoundingClientRect();
            var overPlan = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
            if (!overPlan) {
                return;
            }
            var feet = clientToFeet(event.clientX, event.clientY);
            var size = footprint({ catalogId: current.catalogId, rotation: 0 });
            placeItem(current.catalogId, {
                x: feet.x - size.w / 2,
                y: feet.y - size.d / 2
            });
        }

        function ensureGhost(name, clientX, clientY) {
            if (!ghost) {
                ghost = document.createElement('div');
                ghost.className = 'room-builder__ghost';
                ghost.textContent = name;
                document.body.appendChild(ghost);
            }
            ghost.style.left = clientX + 'px';
            ghost.style.top = clientY + 'px';
        }

        function removeGhost() {
            if (ghost && ghost.parentNode) {
                ghost.parentNode.removeChild(ghost);
            }
            ghost = null;
        }

        function onKeyDown(event) {
            if (!root.contains(event.target)) {
                return;
            }
            var tag = event.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
                return;
            }
            if (event.key === 'Escape' && state.tool === 'door') {
                state.tool = 'select';
                syncDoorTool();
                setStatus('');
                event.preventDefault();
                return;
            }
            if ((event.key === 'Delete' || event.key === 'Backspace') && state.selected) {
                deleteSelected();
                event.preventDefault();
            }
        }
    }
})();
