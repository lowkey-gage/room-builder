(function () {
    var STORAGE_KEY = 'roomBuilder.plan.v2';
    var LEGACY_KEY = 'roomBuilder.plan.v1';
    var MIN_ROOM = 6;
    var MIN_SHAPED = 10;
    var MIN_WALL = 1;
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
                piece('accent-chair', 'Accent chair', 2.5, 2.5, '#b08968', { symbol: 'chair' }),
                piece('recliner', 'Recliner', 3, 3.5, '#6b705c', { symbol: 'recliner' }),
                piece('rocking-chair', 'Rocking chair', 2.5, 3, '#a47148', { symbol: 'rocker' }),
                piece('sleeper', 'Sleeper sofa', 7, 3, '#6b7f6a'),
                piece('chaise', 'Sofa chaise', 8, 5, '#7f8f78'),
                piece('sectional', 'Sectional', 9, 6.5, '#5f6f5e'),
                piece('ottoman', 'Ottoman', 3, 2, '#c4a484', { symbol: 'ottoman', facing: false }),
                piece('pouf', 'Pouf', 2, 2, '#ddb892', { symbol: 'pouf', facing: false }),
                piece('bean-bag', 'Bean bag', 3, 3, '#8d9a84', { symbol: 'bean', facing: false }),
                piece('papasan', 'Papasan', 4, 4, '#c4a484', { symbol: 'bean', facing: false }),
                piece('coffee-table', 'Coffee table', 4, 2, '#b08968', flat),
                piece('oval-coffee', 'Oval coffee table', 4, 2, '#c4a484', round),
                piece('nesting-tables', 'Nesting tables', 2.5, 1.5, '#ddb892', { symbol: 'nest', facing: false }),
                piece('side-table', 'Side table', 2, 2, '#ddb892', flat),
                piece('console', 'Console table', 5, 1.5, '#a47148', flat),
                piece('sideboard', 'Sideboard', 6, 1.5, '#7f5539', { symbol: 'doors' }),
                piece('display-cabinet', 'Display cabinet', 3, 1.5, '#6b4f3a', { symbol: 'doors' }),
                piece('bookcase', 'Bookcase', 3, 1, '#7f5539'),
                piece('television', 'Television', 4, 1, '#4a5560', { symbol: 'tv' }),
                piece('tv-unit', 'TV unit', 6, 1.5, '#6b4f3a'),
                piece('media-console', 'Media console', 5, 1.5, '#8a6a4f')
            ]
        },
        {
            id: 'bedroom',
            label: 'Bedroom',
            pieces: [
                piece('bed-cal-king', 'Cal-king bed', 6, 7, '#6d8499', { symbol: 'bed', bed: true }),
                piece('bed-king', 'King bed', 6.5, 6.5, '#7e93a8', bed),
                piece('bed-queen', 'Queen bed', 5, 6.5, '#8ea4b8', bed),
                piece('bed-full', 'Full bed', 4.5, 6.5, '#9bb0c2', bed),
                piece('bed-twin', 'Twin bed', 3.5, 6.5, '#b7c6d4', bed),
                piece('bunk-bed', 'Bunk bed', 3.5, 6.5, '#8ea4b8', { symbol: 'bunk' }),
                piece('daybed', 'Daybed', 3.5, 6.5, '#9bb0c2', { symbol: 'daybed' }),
                piece('bench', 'Bench', 4, 1.5, '#c4a484', flat),
                piece('dresser', 'Dresser', 5.5, 1.5, '#8a6a4f'),
                piece('dresser-narrow', 'Narrow dresser', 3, 1.5, '#a47148'),
                piece('chest', 'Chest of drawers', 3.5, 2, '#7f5539', { symbol: 'drawers' }),
                piece('blanket-chest', 'Blanket chest', 4, 2, '#a47148', { symbol: 'chest', facing: false }),
                piece('wardrobe', 'Wardrobe', 4, 2, '#6b5344'),
                piece('jewelry-cabinet', 'Jewelry cabinet', 1.5, 1.5, '#b08968', { symbol: 'doors' }),
                piece('nightstand', 'Nightstand', 2, 1.5, '#6b705c'),
                piece('vanity', 'Vanity', 4, 1.5, '#b08968'),
                piece('vanity-stool', 'Vanity stool', 1.5, 1.5, '#c4a484', { symbol: 'stool', facing: false }),
                piece('floor-mirror', 'Floor mirror', 2, 1, '#c5ced6', { symbol: 'mirror' }),
                piece('hamper', 'Hamper', 1.5, 1.5, '#c4a484', { symbol: 'hamper', facing: false })
            ]
        },
        {
            id: 'dining',
            label: 'Dining',
            pieces: [
                piece('dining-table', 'Dining table', 6, 3.5, '#c08552', flat),
                piece('dining-long', 'Long dining table', 8, 3.5, '#a47148', { symbol: 'table', facing: false }),
                piece('dining-square', 'Square table', 4, 4, '#b08968', flat),
                piece('dining-round', 'Round table', 5, 5, '#ddb892', round),
                piece('high-top', 'High-top table', 3.5, 3.5, '#c4a484', { symbol: 'table-round', facing: false }),
                piece('counter-table', 'Counter table', 5, 2.5, '#b08968', { symbol: 'table', facing: false }),
                piece('dining-chair', 'Dining chair', 1.5, 1.5, '#c4a484'),
                piece('bar-stool', 'Bar stool', 1.5, 1.5, '#a47148'),
                piece('dining-bench', 'Dining bench', 5, 1.5, '#8a6a4f', flat),
                piece('banquette', 'Banquette', 6, 2, '#6b5344', { symbol: 'bench', facing: false }),
                piece('buffet', 'Buffet', 6, 1.5, '#7f5539'),
                piece('bar-cabinet', 'Bar cabinet', 4, 1.5, '#8a6a4f', { symbol: 'doors' }),
                piece('wine-cabinet', 'Wine cabinet', 2, 2, '#6b4f3a', { symbol: 'doors' }),
                piece('bar-cart', 'Bar cart', 2.5, 1.5, '#c08552', { symbol: 'shelves' }),
                piece('china-cabinet', 'China cabinet', 3.5, 1.5, '#6b4f3a')
            ]
        },
        {
            id: 'office',
            label: 'Office',
            pieces: [
                piece('desk', 'Desk', 5, 2.5, '#9c6644'),
                piece('standing-desk', 'Standing desk', 4.5, 2.5, '#a47148', { symbol: 'desk' }),
                piece('executive-desk', 'Executive desk', 6.5, 3, '#7f5539', { symbol: 'desk' }),
                piece('l-desk', 'L-shape desk', 6, 5, '#7f5539'),
                piece('conference-table', 'Conference table', 8, 4, '#b08968', { symbol: 'table', facing: false }),
                piece('office-chair', 'Office chair', 2, 2, '#6b705c'),
                piece('guest-chair', 'Guest chair', 2, 2, '#c4a484'),
                piece('filing-cabinet', 'Filing cabinet', 1.5, 2, '#8a8175'),
                piece('bookshelf', 'Bookshelf', 3, 1, '#6b5344'),
                piece('bookcase-wide', 'Wide bookcase', 6, 1, '#7f5539', { symbol: 'shelves' }),
                piece('credenza', 'Credenza', 6, 2, '#6b5344', { symbol: 'doors' }),
                piece('whiteboard', 'Whiteboard', 6, 1, '#e7eef3', { symbol: 'board' }),
                piece('printer', 'Printer', 2, 2, '#d6dde4', { symbol: 'printer' })
            ]
        },
        {
            id: 'bathroom',
            label: 'Bathroom',
            pieces: [
                piece('toilet', 'Toilet', 1.5, 2.5, '#d6dde4'),
                piece('bidet', 'Bidet', 1.5, 2.5, '#e4eaef', { symbol: 'toilet' }),
                piece('bathtub', 'Bathtub', 5, 2.5, '#c5d0da'),
                piece('corner-tub', 'Corner tub', 5, 5, '#b7c6d4', { symbol: 'bath' }),
                piece('shower', 'Shower', 3, 3, '#b7c4d0', flat),
                piece('corner-shower', 'Corner shower', 3.5, 3.5, '#c5d0da', { symbol: 'shower', facing: false }),
                piece('bath-vanity', 'Vanity', 3, 2, '#b08968'),
                piece('double-vanity', 'Double vanity', 5, 2, '#a47148'),
                piece('pedestal-sink', 'Pedestal sink', 2, 1.5, '#d6dde4', { symbol: 'pedestal' }),
                piece('linen-closet', 'Linen closet', 2, 2, '#8a8175'),
                piece('towel-cabinet', 'Towel cabinet', 2, 1.5, '#a47148', { symbol: 'doors' }),
                piece('bath-scale', 'Bath scale', 1.5, 1.5, '#e7eef3', { symbol: 'box', facing: false })
            ]
        },
        {
            id: 'kitchen',
            label: 'Kitchen',
            pieces: [
                piece('fridge', 'Refrigerator', 3, 3, '#c5ced6'),
                piece('chest-freezer', 'Chest freezer', 5, 2.5, '#d6dde4', { symbol: 'chest', facing: false }),
                piece('wine-cooler', 'Wine cooler', 2, 2, '#b7c6d4', { symbol: 'fridge' }),
                piece('range', 'Range', 2.5, 2.5, '#8a8175'),
                piece('cooktop', 'Cooktop', 3, 2, '#5c564c', { symbol: 'range' }),
                piece('wall-oven', 'Wall oven', 2.5, 2.5, '#8a8175', { symbol: 'oven' }),
                piece('microwave', 'Microwave', 2, 1.5, '#c5ced6', { symbol: 'microwave' }),
                piece('dishwasher', 'Dishwasher', 2, 2, '#d6dde4'),
                piece('sink-base', 'Sink base', 3, 2, '#7f5539', { symbol: 'sink' }),
                piece('double-sink', 'Double sink', 5, 2, '#6b5344', { symbol: 'sink2' }),
                piece('island', 'Island', 6, 3, '#c08552', flat),
                piece('peninsula', 'Peninsula', 7, 3, '#b08968', { symbol: 'island', facing: false }),
                piece('prep-table', 'Prep table', 4, 2, '#ddb892', { symbol: 'table', facing: false }),
                piece('base-cabinet', 'Base cabinet', 6, 2, '#7f5539'),
                piece('wall-cabinet', 'Wall cabinet', 4, 1, '#8a6a4f', { symbol: 'doors' }),
                piece('pantry', 'Pantry', 3, 2, '#6b4f3a', { symbol: 'doors' }),
                piece('trash-cabinet', 'Trash cabinet', 1.5, 2, '#a47148', { symbol: 'doors' }),
                piece('utility-cart', 'Utility cart', 2.5, 1.5, '#c08552', { symbol: 'shelves' }),
                piece('trash-can', 'Trash can', 1.5, 1.5, '#8a8175', { symbol: 'hamper', facing: false }),
                piece('recycling-bin', 'Recycling bin', 1.5, 1.5, '#7e93a8', { symbol: 'box', facing: false })
            ]
        },
        {
            id: 'nursery',
            label: 'Nursery',
            pieces: [
                piece('crib', 'Crib', 3, 5, '#d4b483', bed),
                piece('bassinet', 'Bassinet', 2, 3.5, '#e6c8a0', { symbol: 'crib' }),
                piece('toddler-bed', 'Toddler bed', 3, 5, '#b7c6d4', { symbol: 'bed', bed: true }),
                piece('changing-table', 'Changing table', 3.5, 2, '#ddb892'),
                piece('nursery-dresser', 'Nursery dresser', 3.5, 1.5, '#c4a484', { symbol: 'drawers' }),
                piece('glider', 'Glider', 2.5, 3, '#8d9a84', { symbol: 'rocker' }),
                piece('high-chair', 'High chair', 1.5, 2, '#ddb892', { symbol: 'highchair' }),
                piece('kids-table', 'Kids table', 3, 3, '#e6c8a0', { symbol: 'table', facing: false }),
                piece('kids-chair', 'Kids chair', 1.5, 1.5, '#c4a484', { symbol: 'side-chair' }),
                piece('toy-chest', 'Toy chest', 3, 1.5, '#c4a484', flat),
                piece('toy-shelf', 'Toy shelf', 3, 1, '#a47148', { symbol: 'shelves' }),
                piece('play-mat', 'Play mat', 5, 4, '#e6c8a0', rug)
            ]
        },
        {
            id: 'outdoor',
            label: 'Outdoor',
            pieces: [
                piece('outdoor-sectional', 'Outdoor sectional', 8, 6, '#6b7f6a'),
                piece('outdoor-sofa', 'Outdoor sofa', 6.5, 3, '#8d9a84', { symbol: 'sofa' }),
                piece('lounge-chair', 'Lounge chair', 2.5, 5, '#8d9a84'),
                piece('patio-chair', 'Patio chair', 2.5, 2.5, '#a3b18a', { symbol: 'chair' }),
                piece('adirondack', 'Adirondack', 2.5, 3, '#6b7f6a', { symbol: 'chair' }),
                piece('outdoor-bench', 'Outdoor bench', 5, 1.5, '#7f5539', { symbol: 'bench', facing: false }),
                piece('porch-swing', 'Porch swing', 5, 2.5, '#8a6a4f', { symbol: 'bench', facing: false }),
                piece('outdoor-table', 'Outdoor table', 5, 3, '#b08968', flat),
                piece('umbrella-table', 'Umbrella table', 4, 4, '#ddb892', { symbol: 'table-round', facing: false }),
                piece('picnic-table', 'Picnic table', 5, 6, '#a47148', { symbol: 'picnic', facing: false }),
                piece('grill', 'Grill', 3, 2, '#5c564c'),
                piece('smoker', 'Smoker', 2, 3, '#3a3f44', { symbol: 'grill' }),
                piece('cooler', 'Cooler', 2.5, 1.5, '#7e93a8', { symbol: 'chest', facing: false }),
                piece('planter', 'Planter', 4, 1.5, '#6b5344', { symbol: 'planter', facing: false }),
                piece('fire-pit', 'Fire pit', 3, 3, '#8a6a4f', round),
                piece('hot-tub', 'Hot tub', 7, 7, '#7e93a8', round),
                piece('hammock', 'Hammock', 3, 7, '#c4a484', { symbol: 'hammock', facing: false }),
                piece('outdoor-rug', 'Outdoor rug', 8, 6, '#6b7f6a', { symbol: 'rug', kind: 'rug', facing: false })
            ]
        },
        {
            id: 'accessories',
            label: 'Accessories',
            pieces: [
                piece('rug', 'Rug', 8, 5, '#d4b483', rug),
                piece('small-rug', 'Small rug', 5, 3, '#e6c8a0', rug),
                piece('runner', 'Runner', 8, 2.5, '#c4a484', { symbol: 'rug', kind: 'rug', facing: false }),
                piece('round-rug', 'Round rug', 6, 6, '#d4b483', { symbol: 'rug-round', kind: 'rug', facing: false }),
                piece('plant-large', 'Large plant', 2, 2, '#6b7f6a', round),
                piece('plant-small', 'Small plant', 1, 1, '#8d9a84', round),
                piece('floor-lamp', 'Floor lamp', 1, 1, '#c4a484', round),
                piece('table-lamp', 'Table lamp', 1, 1, '#ddb892', { symbol: 'lamp', facing: false }),
                piece('arc-lamp', 'Arc lamp', 3, 3, '#c4a484', { symbol: 'lamp', facing: false }),
                piece('fireplace', 'Fireplace', 5, 1.5, '#6b4f3a'),
                piece('wood-stove', 'Wood stove', 2, 2, '#3a3f44', { symbol: 'stove' }),
                piece('radiator', 'Radiator', 4, 1, '#c5ced6', { symbol: 'radiator' }),
                piece('room-divider', 'Room divider', 5, 1, '#e6c8a0', { symbol: 'divider' }),
                piece('entry-bench', 'Entry bench', 4, 1.5, '#b08968', { symbol: 'bench', facing: false }),
                piece('coat-rack', 'Coat rack', 1.5, 1.5, '#7f5539', { symbol: 'coat', facing: false }),
                piece('shoe-cabinet', 'Shoe cabinet', 3, 1, '#8a6a4f', { symbol: 'drawers' }),
                piece('shoe-rack', 'Shoe rack', 3, 1, '#a47148', { symbol: 'shelves' }),
                piece('entry-mirror', 'Entry mirror', 3, 1, '#d6dde4', { symbol: 'mirror' }),
                piece('aquarium', 'Aquarium', 4, 1.5, '#1f4e5f', { symbol: 'aquarium' }),
                piece('dog-bed', 'Dog bed', 3, 2, '#c4a484', { symbol: 'dogbed', facing: false }),
                piece('dog-crate', 'Dog crate', 3, 2, '#8a8175', { symbol: 'crate' }),
                piece('cat-tree', 'Cat tree', 2, 2, '#a47148', { symbol: 'cat', facing: false }),
                piece('litter-box', 'Litter box', 1.5, 2, '#e6c8a0', { symbol: 'box', facing: false }),
                piece('basket', 'Basket', 1.5, 1.5, '#ddb892', { symbol: 'hamper', facing: false }),
                piece('trunk', 'Trunk', 3, 1.5, '#6b5344', { symbol: 'chest', facing: false })
            ]
        },
        {
            id: 'laundry',
            label: 'Laundry',
            pieces: [
                piece('washer', 'Washer', 2.5, 2.5, '#d6dde4', { symbol: 'washer' }),
                piece('dryer', 'Dryer', 2.5, 2.5, '#e7eef3', { symbol: 'dryer' }),
                piece('stacked-laundry', 'Stacked washer', 2.5, 2.5, '#c5ced6', { symbol: 'washer' }),
                piece('laundry-sink', 'Laundry sink', 2.5, 2, '#b08968', { symbol: 'sink' }),
                piece('folding-table', 'Folding table', 5, 2, '#ddb892', { symbol: 'table', facing: false }),
                piece('ironing-board', 'Ironing board', 1.5, 5, '#e6c8a0', { symbol: 'iron' }),
                piece('utility-cabinet', 'Utility cabinet', 3, 2, '#8a6a4f', { symbol: 'doors' }),
                piece('laundry-hamper', 'Laundry hamper', 2, 1.5, '#c4a484', { symbol: 'hamper', facing: false })
            ]
        },
        {
            id: 'fitness',
            label: 'Fitness',
            pieces: [
                piece('treadmill', 'Treadmill', 3, 6, '#5c564c', { symbol: 'treadmill' }),
                piece('exercise-bike', 'Exercise bike', 2, 3.5, '#3a3f44', { symbol: 'bike' }),
                piece('elliptical', 'Elliptical', 2.5, 5, '#8a8175', { symbol: 'bike' }),
                piece('rower', 'Rowing machine', 2, 8, '#6b5344', { symbol: 'rower' }),
                piece('weight-bench', 'Weight bench', 2.5, 5, '#2a3138', { symbol: 'weights' }),
                piece('yoga-mat', 'Yoga mat', 2, 6, '#6b7f6a', { symbol: 'rug', kind: 'rug', facing: false }),
                piece('dumbbell-rack', 'Dumbbell rack', 3, 1.5, '#5c564c', { symbol: 'shelves' })
            ]
        },
        {
            id: 'games',
            label: 'Games',
            pieces: [
                piece('pool-table', 'Pool table', 5, 9, '#2f6b45', { symbol: 'pool', facing: false }),
                piece('ping-pong', 'Ping-pong', 5, 9, '#3d6f8a', { symbol: 'pingpong', facing: false }),
                piece('foosball', 'Foosball', 4, 6, '#c08552', { symbol: 'foosball', facing: false }),
                piece('upright-piano', 'Upright piano', 5, 2, '#2a2420', { symbol: 'piano' }),
                piece('grand-piano', 'Grand piano', 5, 6.5, '#2a2420', { symbol: 'grand' }),
                piece('keyboard', 'Keyboard', 4.5, 1.5, '#3a3f44', { symbol: 'keyboard' }),
                piece('easel', 'Easel', 2, 2, '#ddb892', { symbol: 'easel' })
            ]
        }
    ];

    var SHAPES = [
        { id: 'rectangle', label: 'Rectangle', kind: 'rect', width: 12, depth: 14 },
        { id: 'square', label: 'Square', kind: 'rect', width: 12, depth: 12 },
        { id: 'l', label: 'L-shape', kind: 'l', width: 18, depth: 16, cutW: 8, cutD: 8 },
        { id: 'l2', label: 'L-shape 2', kind: 'l2', width: 18, depth: 16, cutW: 8, cutD: 8 },
        { id: 't', label: 'T-shape', kind: 't', width: 18, depth: 16, cutW: 8, cutD: 6 },
        { id: 'studio', label: 'Studio', kind: 'rect', width: 20, depth: 14 },
        { id: 'custom', label: 'Custom', kind: 'custom' }
    ];

    var WALL_PIECES = [2, 6];

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

    function normalizeRotation(value) {
        var rotation = Math.round(Number(value));
        if (!isFinite(rotation)) {
            return 0;
        }
        return ((rotation % 360) + 360) % 360;
    }

    function footprint(item) {
        var entry = catalogItem(item.catalogId);
        var rad = ((Number(item.rotation) || 0) * Math.PI) / 180;
        var cosine = Math.abs(Math.cos(rad));
        var sine = Math.abs(Math.sin(rad));
        return {
            w: entry.width * cosine + entry.depth * sine,
            d: entry.width * sine + entry.depth * cosine
        };
    }

    function rotateHandlePoint(item) {
        var size = footprint(item);
        var cx = item.x + size.w / 2;
        var cy = item.y + size.d / 2;
        var rad = ((Number(item.rotation) || 0) * Math.PI) / 180;
        var reach = Math.sqrt(size.w * size.w + size.d * size.d) / 2 + 0.55;
        return {
            x: cx + Math.sin(rad) * reach,
            y: cy - Math.cos(rad) * reach
        };
    }

    function itemTransform(item, entry) {
        var size = footprint(item);
        var cx = item.x + size.w / 2;
        var cy = item.y + size.d / 2;
        return 'translate(' + num(cx) + ' ' + num(cy) + ') rotate(' + (item.rotation || 0) + ') translate(' + num(-entry.width / 2) + ' ' + num(-entry.depth / 2) + ')';
    }

    function tint(hex, amount) {
        var h = String(hex || '#b7a99a').replace('#', '');
        var target = amount > 0 ? 255 : 0;
        var mix = Math.abs(amount);
        var channels = [0, 2, 4].map(function (start) {
            var value = parseInt(h.substr(start, 2), 16);
            return Math.max(0, Math.min(255, Math.round(value + (target - value) * mix)));
        });
        return 'rgb(' + channels.join(',') + ')';
    }

    function furnRect(x, y, w, h, fill, rx) {
        if (w < 0.04 || h < 0.04) {
            return '';
        }
        return '<rect pointer-events="none" x="' + num(x) + '" y="' + num(y) + '" width="' + num(w) + '" height="' + num(h) + '" rx="' + num(rx || 0) + '" fill="' + fill + '"></rect>';
    }

    function furnOval(cx, cy, rx, ry, fill) {
        if (rx < 0.03 || ry < 0.03) {
            return '';
        }
        return '<ellipse pointer-events="none" cx="' + num(cx) + '" cy="' + num(cy) + '" rx="' + num(rx) + '" ry="' + num(ry) + '" fill="' + fill + '"></ellipse>';
    }

    function furnBody(w, d, fill, stroke, sw, round) {
        if (round) {
            return '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(Math.max(w / 2 - 0.02, 0.05)) + '" ry="' + num(Math.max(d / 2 - 0.02, 0.05)) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        }
        return '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" rx="0.08" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
    }

    function symbolFor(entry) {
        var id = entry.id;
        if (entry.symbol) {
            return entry.symbol;
        }
        if (entry.kind === 'rug') {
            return 'rug';
        }
        if (id === 'crib') {
            return 'crib';
        }
        if (entry.bed) {
            return 'bed';
        }
        if (id === 'floor-lamp') {
            return 'lamp';
        }
        if (id.indexOf('plant') === 0) {
            return 'plant';
        }
        if (id === 'fire-pit') {
            return 'fire';
        }
        if (id === 'hot-tub') {
            return 'hottub';
        }
        if (id === 'oval-coffee' || id === 'dining-round') {
            return 'table-round';
        }
        if (id === 'sectional' || id === 'outdoor-sectional') {
            return 'sectional';
        }
        if (id === 'chaise') {
            return 'chaise';
        }
        if (id === 'lounge-chair') {
            return 'lounge';
        }
        if (id === 'sofa' || id === 'loveseat' || id === 'sleeper' || id === 'chair') {
            return id === 'chair' ? 'chair' : 'sofa';
        }
        if (id === 'bench' || id === 'dining-bench') {
            return 'bench';
        }
        if (id === 'coffee-table' || id === 'side-table' || id === 'console' || id === 'dining-table' || id === 'dining-square' || id === 'outdoor-table') {
            return 'table';
        }
        if (id === 'bookcase' || id === 'bookshelf') {
            return 'shelves';
        }
        if (id === 'china-cabinet') {
            return 'doors';
        }
        if (id === 'tv-unit' || id === 'media-console') {
            return 'tv';
        }
        if (id === 'dresser' || id === 'dresser-narrow' || id === 'nightstand' || id === 'filing-cabinet' || id === 'toy-chest') {
            return 'drawers';
        }
        if (id === 'wardrobe' || id === 'linen-closet' || id === 'buffet' || id === 'base-cabinet') {
            return 'doors';
        }
        if (id === 'dining-chair' || id === 'guest-chair') {
            return 'side-chair';
        }
        if (id === 'bar-stool') {
            return 'stool';
        }
        if (id === 'office-chair') {
            return 'office-chair';
        }
        if (id === 'desk' || id === 'vanity') {
            return 'desk';
        }
        if (id === 'l-desk') {
            return 'ldesk';
        }
        if (id === 'toilet') {
            return 'toilet';
        }
        if (id === 'bathtub') {
            return 'bath';
        }
        if (id === 'shower') {
            return 'shower';
        }
        if (id === 'bath-vanity') {
            return 'sink';
        }
        if (id === 'double-vanity') {
            return 'sink2';
        }
        if (id === 'fridge') {
            return 'fridge';
        }
        if (id === 'range') {
            return 'range';
        }
        if (id === 'dishwasher') {
            return 'dishwasher';
        }
        if (id === 'island') {
            return 'island';
        }
        if (id === 'changing-table') {
            return 'changing';
        }
        if (id === 'grill') {
            return 'grill';
        }
        if (id === 'fireplace') {
            return 'fireplace';
        }
        return 'plain';
    }

    function artSofa(w, d, color, stroke, sw, seats) {
        var back = Math.min(0.7, d * 0.28);
        var arm = Math.min(0.5, w * 0.14);
        var gap = 0.08;
        var count = seats || (w >= 6.5 ? 3 : 2);
        var seatW = (w - arm * 2 - gap * (count + 1)) / count;
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.06, 0.06, w - 0.12, back, tint(color, -0.22), 0.04);
        markup += furnRect(0.06, back, arm, d - back - 0.06, tint(color, -0.12), 0.04);
        markup += furnRect(w - arm - 0.06, back, arm, d - back - 0.06, tint(color, -0.12), 0.04);
        var index;
        for (index = 0; index < count; index += 1) {
            markup += furnRect(arm + gap + index * (seatW + gap), back + gap, seatW, d - back - gap * 2, tint(color, 0.2), 0.06);
        }
        markup += '</g>';
        return markup;
    }

    function artChair(w, d, color, stroke, sw) {
        return artSofa(w, d, color, stroke, sw, 1);
    }

    function artLounge(w, d, color, stroke, sw) {
        var back = Math.min(0.8, d * 0.22);
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.08, 0.08, w - 0.16, back, tint(color, -0.22), 0.06);
        markup += furnRect(0.16, back + 0.1, w - 0.32, d - back - 0.24, tint(color, 0.18), 0.08);
        markup += '</g>';
        return markup;
    }

    function artRun(w, d, color, stroke, sw, side) {
        var seat = Math.min(2.6, d * 0.46);
        var arm = Math.min(2.4, w * 0.38);
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        if (side === 'right') {
            markup += furnRect(0, 0, w, seat, color, 0.08);
            markup += furnRect(w - arm, 0, arm, d, color, 0.08);
            markup += furnRect(0.1, 0.08, w - arm, Math.min(0.55, seat * 0.35), tint(color, -0.22), 0.04);
            markup += furnRect(w - arm + 0.08, 0.08, arm - 0.18, Math.min(0.55, d * 0.16), tint(color, -0.22), 0.04);
        } else {
            markup += furnRect(0, 0, w, seat, color, 0.08);
            markup += furnRect(0, 0, arm, d, color, 0.08);
            markup += furnRect(arm, 0.08, w - arm - 0.1, Math.min(0.55, seat * 0.35), tint(color, -0.22), 0.04);
            markup += furnRect(0.08, 0.08, arm - 0.16, Math.min(0.55, d * 0.16), tint(color, -0.22), 0.04);
        }
        markup += '</g>';
        markup += '<rect x="0" y="0" width="' + num(w) + '" height="' + num(seat) + '" rx="0.08" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += '<rect x="' + num(side === 'right' ? w - arm : 0) + '" y="0" width="' + num(arm) + '" height="' + num(d) + '" rx="0.08" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artTable(w, d, color, stroke, sw, round) {
        var inset = Math.min(0.18, w * 0.08, d * 0.08);
        var leg = Math.min(0.22, w * 0.12, d * 0.12);
        var markup = furnBody(w, d, round ? 'transparent' : tint(color, -0.08), round ? 'none' : stroke, round ? 0 : sw, false);
        markup += '<g pointer-events="none">';
        if (round) {
            markup += furnOval(w / 2, d / 2, w / 2 - 0.02, d / 2 - 0.02, tint(color, -0.05));
            markup += furnOval(w / 2, d / 2, w / 2 - 0.22, d / 2 - 0.22, color);
            markup += furnOval(w / 2, d / 2, Math.min(w, d) * 0.08, Math.min(w, d) * 0.08, tint(color, -0.25));
        } else {
            markup += furnRect(inset, inset, w - inset * 2, d - inset * 2, color, 0.04);
            markup += furnRect(0.06, 0.06, leg, leg, tint(color, -0.35), 0.02);
            markup += furnRect(w - leg - 0.06, 0.06, leg, leg, tint(color, -0.35), 0.02);
            markup += furnRect(0.06, d - leg - 0.06, leg, leg, tint(color, -0.35), 0.02);
            markup += furnRect(w - leg - 0.06, d - leg - 0.06, leg, leg, tint(color, -0.35), 0.02);
        }
        markup += '</g>';
        if (round) {
            markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w / 2 - 0.02) + '" ry="' + num(d / 2 - 0.02) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        }
        return markup;
    }

    function artShelves(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        var count = Math.max(3, Math.round(w / 0.7));
        var gap = 0.08;
        var bookW = (w - gap * (count + 1)) / count;
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.08, 0.08, w - 0.16, 0.08, tint(color, -0.22), 0.02);
        for (index = 0; index < count; index += 1) {
            markup += furnRect(gap + index * (bookW + gap), 0.26, bookW, Math.max(0.18, d - 0.46), index % 2 ? tint(color, 0.4) : tint(color, 0.18), 0.02);
        }
        markup += '</g>';
        return markup;
    }

    function artTv(w, d, color, stroke, sw) {
        var screen = Math.min(0.18, d * 0.16);
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.08, w - 0.24, screen, '#2a3138', 0.02);
        markup += furnRect(0.16, d - 0.16, w - 0.32, 0.08, tint(color, -0.18), 0.02);
        markup += '</g>';
        return markup;
    }

    function artDrawers(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        var knobs = w >= 4 ? 2 : 1;
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, d - 0.2, w - 0.2, 0.1, tint(color, -0.16), 0.02);
        for (index = 0; index < knobs; index += 1) {
            markup += furnOval((w / (knobs + 1)) * (index + 1), d - 0.15, 0.08, 0.08, tint(color, -0.35));
        }
        markup += '</g>';
        return markup;
    }

    function artDoors(w, d, color, stroke, sw) {
        var doors = w >= 4.5 ? 3 : 2;
        var markup = furnBody(w, d, color, stroke, sw, false);
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.08, d - 0.16, w - 0.16, 0.08, tint(color, -0.18), 0.02);
        for (index = 1; index < doors; index += 1) {
            markup += furnRect((w / doors) * index - 0.025, 0.1, 0.05, d - 0.32, tint(color, -0.22), 0);
        }
        markup += '</g>';
        return markup;
    }

    function artBed(w, d, color, stroke, sw) {
        var head = Math.min(0.45, d * 0.12);
        var pillowD = Math.min(1.05, d * 0.22);
        var markup = furnBody(w, d, tint(color, 0.16), stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0, 0, w, head + 0.15, tint(color, -0.28), 0.04);
        markup += furnRect(0.2, head + 0.12, (w - 0.55) / 2, pillowD, '#f7f1e7', 0.08);
        markup += furnRect(w / 2 + 0.08, head + 0.12, (w - 0.55) / 2, pillowD, '#f3eee4', 0.08);
        markup += furnRect(0.18, d - 0.28, w - 0.36, 0.1, tint(color, -0.18), 0.02);
        markup += '</g>';
        return markup;
    }

    function artBench(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.16, w - 0.24, d - 0.32, tint(color, 0.16), 0.04);
        markup += furnRect(0.12, d / 2 - 0.03, w - 0.24, 0.06, tint(color, -0.15), 0);
        markup += '</g>';
        return markup;
    }

    function artSideChair(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, 'transparent', 'none', 0, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.2, 0.06, w * 0.6, d * 0.18, tint(color, -0.15), 0.04);
        markup += furnRect(w * 0.16, d * 0.28, w * 0.68, d * 0.5, color, 0.06);
        markup += furnRect(0.06, 0.08, 0.12, 0.12, tint(color, -0.35), 0.02);
        markup += furnRect(w - 0.18, 0.08, 0.12, 0.12, tint(color, -0.35), 0.02);
        markup += furnRect(0.06, d - 0.2, 0.12, 0.12, tint(color, -0.35), 0.02);
        markup += furnRect(w - 0.18, d - 0.2, 0.12, 0.12, tint(color, -0.35), 0.02);
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.12) + '" y="' + num(d * 0.22) + '" width="' + num(w * 0.76) + '" height="' + num(d * 0.62) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artStool(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.34, d * 0.34, color);
        markup += furnOval(w / 2, d / 2, w * 0.12, d * 0.12, tint(color, -0.2));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.36) + '" ry="' + num(d * 0.36) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artOfficeChair(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.22, 0.08, w * 0.56, d * 0.16, tint(color, -0.1), 0.08);
        markup += furnOval(w / 2, d * 0.52, w * 0.28, d * 0.22, color);
        markup += furnOval(w / 2, d * 0.52, w * 0.1, d * 0.1, tint(color, -0.25));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.52) + '" rx="' + num(w * 0.3) + '" ry="' + num(d * 0.24) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artDesk(w, d, color, stroke, sw) {
        var markup = artTable(w, d, color, stroke, sw, false);
        markup += furnRect(w * 0.3, 0.12, w * 0.4, Math.min(0.14, d * 0.12), '#2a3138', 0.02);
        return markup;
    }

    function artLDesk(w, d, color, stroke, sw) {
        var arm = Math.min(w * 0.42, 2.4);
        var depth = Math.min(d * 0.42, 2.2);
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnRect(0, 0, w, depth, color, 0.06);
        markup += furnRect(0, 0, arm, d, color, 0.06);
        markup += furnRect(arm + 0.2, 0.12, Math.max(0.2, w - arm - 0.45), 0.12, '#2a3138', 0.02);
        markup += '</g>';
        markup += '<rect x="0" y="0" width="' + num(w) + '" height="' + num(depth) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += '<rect x="0" y="0" width="' + num(arm) + '" height="' + num(d) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artToilet(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.12, 0.04, w * 0.76, d * 0.32, tint(color, -0.08), 0.06);
        markup += furnOval(w / 2, d * 0.66, w * 0.34, d * 0.26, color);
        markup += furnOval(w / 2, d * 0.66, w * 0.2, d * 0.14, tint(color, 0.2));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.66) + '" rx="' + num(w * 0.36) + '" ry="' + num(d * 0.28) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        markup += '<rect x="' + num(w * 0.12) + '" y="0.04" width="' + num(w * 0.76) + '" height="' + num(d * 0.32) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artBath(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.16, 0.2, w - 0.32, d - 0.36, tint(color, 0.22), 0.2);
        markup += furnOval(w / 2, 0.28, 0.1, 0.1, tint(color, -0.25));
        markup += '</g>';
        return markup;
    }

    function artShower(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, 0.08), stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.24, tint(color, 0.2), 0.04);
        markup += furnOval(w / 2, d / 2, 0.12, 0.12, tint(color, -0.2));
        markup += furnRect(w - 0.18, 0.2, 0.06, d - 0.4, tint(color, -0.15), 0);
        markup += '</g>';
        return markup;
    }

    function artSink(w, d, color, stroke, sw, count) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        var sinks = count || 1;
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.08, 0.08, w - 0.16, 0.18, tint(color, -0.18), 0.02);
        for (index = 0; index < sinks; index += 1) {
            markup += furnOval((w / sinks) * (index + 0.5), d * 0.58, Math.min(0.38, w / sinks * 0.28), Math.min(0.28, d * 0.22), tint(color, 0.28));
        }
        markup += '</g>';
        return markup;
    }

    function artFridge(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, d * 0.72, w - 0.2, 0.05, tint(color, -0.16), 0);
        markup += furnRect(0.18, d - 0.18, w - 0.36, 0.08, tint(color, -0.28), 0.02);
        markup += '</g>';
        return markup;
    }

    function artRange(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnOval(w * 0.32, d * 0.32, w * 0.16, d * 0.16, '#3a3f44');
        markup += furnOval(w * 0.68, d * 0.32, w * 0.16, d * 0.16, '#3a3f44');
        markup += furnOval(w * 0.32, d * 0.62, w * 0.14, d * 0.14, '#3a3f44');
        markup += furnOval(w * 0.68, d * 0.62, w * 0.14, d * 0.14, '#3a3f44');
        markup += furnRect(0.16, d - 0.18, w - 0.32, 0.08, tint(color, -0.2), 0.02);
        markup += '</g>';
        return markup;
    }

    function artDishwasher(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, d - 0.2, w - 0.2, 0.1, tint(color, -0.22), 0.02);
        markup += '</g>';
        return markup;
    }

    function artIsland(w, d, color, stroke, sw) {
        var markup = artTable(w, d, color, stroke, sw, false);
        markup += furnOval(w * 0.72, d / 2, Math.min(0.45, w * 0.12), Math.min(0.32, d * 0.22), tint(color, 0.25));
        return markup;
    }

    function artCrib(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, 0.12), stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.16, 0.2, w - 0.32, d - 0.4, '#f6f1e8', 0.06);
        markup += furnRect(0.05, 0.12, 0.1, d - 0.24, tint(color, -0.2), 0.03);
        markup += furnRect(w - 0.15, 0.12, 0.1, d - 0.24, tint(color, -0.2), 0.03);
        markup += '</g>';
        return markup;
    }

    function artChanging(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.18, w - 0.24, d - 0.36, '#f4efe6', 0.08);
        markup += furnOval(w * 0.25, 0.32, 0.1, 0.1, '#d6dde4');
        markup += furnOval(w * 0.4, 0.32, 0.08, 0.08, '#c4a484');
        markup += '</g>';
        return markup;
    }

    function artRug(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" rx="0.06" fill="' + color + '" fill-opacity="0.92" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnRect(0.18, 0.18, w - 0.36, d - 0.36, 'none', 0.04);
        markup += '<rect pointer-events="none" x="' + num(0.18) + '" y="' + num(0.18) + '" width="' + num(w - 0.36) + '" height="' + num(d - 0.36) + '" rx="0.04" fill="none" stroke="' + tint(color, -0.28) + '" stroke-width="0.04"></rect>';
        markup += furnRect(0.4, d / 2 - 0.05, w - 0.8, 0.1, tint(color, 0.2), 0);
        markup += '</g>';
        return markup;
    }

    function artPlant(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.36, d * 0.36, color);
        markup += furnOval(w * 0.36, d * 0.42, w * 0.16, d * 0.16, tint(color, 0.16));
        markup += furnOval(w * 0.64, d * 0.46, w * 0.14, d * 0.14, tint(color, -0.12));
        markup += furnOval(w / 2, d / 2, w * 0.1, d * 0.1, '#8a6a4f');
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.38) + '" ry="' + num(d * 0.38) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artLamp(w, d, color, stroke, sw) {
        var markup = '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.34, d * 0.34, tint(color, 0.2));
        markup += furnOval(w / 2, d / 2, w * 0.12, d * 0.12, tint(color, -0.25));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.36) + '" ry="' + num(d * 0.36) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artFire(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, -0.15), stroke, sw, true);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.28, d * 0.28, '#5c3a2e');
        markup += furnOval(w / 2, d / 2, w * 0.14, d * 0.14, '#d4652f');
        markup += '</g>';
        return markup;
    }

    function artHotTub(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, -0.12), stroke, sw, true);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.38, d * 0.38, tint(color, 0.18));
        markup += furnOval(w * 0.38, d * 0.42, w * 0.06, d * 0.06, 'rgba(255,255,255,0.7)');
        markup += furnOval(w * 0.58, d * 0.55, w * 0.05, d * 0.05, 'rgba(255,255,255,0.55)');
        markup += '</g>';
        return markup;
    }

    function artGrill(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.14, 0.14, w - 0.28, d - 0.42, tint(color, 0.1), 0.1);
        markup += furnRect(0.28, d * 0.32, w - 0.56, 0.06, tint(color, -0.22), 0);
        markup += furnRect(0.28, d * 0.48, w - 0.56, 0.06, tint(color, -0.22), 0);
        markup += furnRect(0.22, d - 0.2, w - 0.44, 0.08, tint(color, -0.28), 0.02);
        markup += '</g>';
        return markup;
    }

    function artFireplace(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.16, d * 0.22, w * 0.68, d * 0.5, '#2a2420', 0.04);
        markup += furnOval(w / 2, d * 0.48, Math.min(0.35, w * 0.1), Math.min(0.28, d * 0.16), '#d4652f');
        markup += '</g>';
        return markup;
    }

    function hitRect(w, d) {
        return '<rect x="0" y="0" width="' + num(w) + '" height="' + num(d) + '" fill="transparent"></rect>';
    }

    function artKeys(x, y, width, height, count) {
        var markup = '';
        var keyW = width / count;
        var index;
        for (index = 0; index < count; index += 1) {
            markup += furnRect(x + index * keyW, y, Math.max(keyW - 0.03, 0.05), height, index % 3 === 0 ? '#2a2420' : '#f7f1e7', 0.01);
        }
        return markup;
    }

    function artOttoman(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.14, 0.14, w - 0.28, d - 0.28, tint(color, 0.18), 0.08);
        return markup;
    }

    function artPouf(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.4, d * 0.4, color);
        markup += furnOval(w / 2, d / 2, w * 0.22, d * 0.22, tint(color, 0.18));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.4) + '" ry="' + num(d * 0.4) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artBean(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w * 0.42, d * 0.48, w * 0.32, d * 0.34, color);
        markup += furnOval(w * 0.62, d * 0.42, w * 0.26, d * 0.28, tint(color, 0.12));
        markup += furnOval(w * 0.5, d * 0.62, w * 0.22, d * 0.2, tint(color, -0.1));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.4) + '" ry="' + num(d * 0.4) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artRecliner(w, d, color, stroke, sw) {
        var back = Math.min(0.7, d * 0.24);
        var foot = Math.min(1.15, d * 0.32);
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, 0.08, w - 0.2, back, tint(color, -0.22), 0.06);
        markup += furnRect(0.16, back + 0.08, w - 0.32, d - back - foot - 0.1, tint(color, 0.16), 0.06);
        markup += furnRect(0.28, d - foot, w - 0.56, foot - 0.1, tint(color, 0.28), 0.08);
        markup += '</g>';
        return markup;
    }

    function artRocker(w, d, color, stroke, sw) {
        var markup = artChair(w, d, color, stroke, sw);
        markup += '<g pointer-events="none">';
        markup += furnOval(0.12, d * 0.62, 0.1, Math.min(d * 0.28, 0.7), tint(color, -0.35));
        markup += furnOval(w - 0.12, d * 0.62, 0.1, Math.min(d * 0.28, 0.7), tint(color, -0.35));
        markup += '</g>';
        return markup;
    }

    function artNest(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.02, 0.02, w * 0.7, d * 0.78, tint(color, -0.06), 0.04);
        markup += furnRect(w * 0.32, d * 0.28, w * 0.64, d * 0.66, color, 0.04);
        markup += '</g>';
        markup += '<rect x="0.02" y="0.02" width="' + num(w * 0.7) + '" height="' + num(d * 0.78) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        markup += '<rect x="' + num(w * 0.32) + '" y="' + num(d * 0.28) + '" width="' + num(w * 0.64) + '" height="' + num(d * 0.66) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artBunk(w, d, color, stroke, sw) {
        var rail = Math.min(0.42, w * 0.18);
        var inner = Math.max(w - rail, 0.8);
        var markup = hitRect(w, d);
        var rungs = 4;
        var index;
        markup += artBed(inner, d, color, stroke, sw);
        markup += '<g pointer-events="none">';
        markup += furnRect(inner + 0.04, 0.12, Math.max(rail - 0.08, 0.12), d - 0.24, tint(color, -0.18), 0.03);
        for (index = 0; index < rungs; index += 1) {
            markup += furnRect(inner + 0.06, 0.4 + index * ((d - 0.9) / rungs), Math.max(rail - 0.12, 0.1), 0.08, tint(color, 0.28), 0.02);
        }
        markup += '</g>';
        return markup;
    }

    function artDaybed(w, d, color, stroke, sw) {
        var back = Math.min(0.45, w * 0.2);
        var markup = furnBody(w, d, tint(color, 0.14), stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0, 0, back, d, tint(color, -0.24), 0.04);
        markup += furnRect(back + 0.08, 0.12, w - back - 0.18, Math.min(1.05, d * 0.22), '#f7f1e7', 0.08);
        markup += furnRect(back + 0.1, d - 0.2, w - back - 0.22, 0.08, tint(color, -0.16), 0.02);
        markup += '</g>';
        return markup;
    }

    function artChest(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, d * 0.46, w - 0.2, 0.06, tint(color, -0.22), 0);
        markup += furnOval(w / 2, d - 0.18, Math.min(0.16, w * 0.08), 0.08, tint(color, -0.3));
        markup += '</g>';
        return markup;
    }

    function artHamper(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.4, d * 0.4, color);
        markup += furnRect(w * 0.22, d * 0.46, w * 0.56, 0.06, tint(color, -0.2), 0);
        markup += furnRect(w * 0.46, d * 0.22, 0.06, d * 0.56, tint(color, -0.2), 0);
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.4) + '" ry="' + num(d * 0.4) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artMirror(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.24, '#e7eef3', 0.02);
        return markup;
    }

    function artBoard(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, 0.1, w - 0.2, d - 0.32, '#f7f8fa', 0.02);
        markup += furnRect(0.16, d - 0.16, w - 0.32, 0.08, tint(color, -0.15), 0.02);
        markup += '</g>';
        return markup;
    }

    function artPrinter(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.16, 0.16, w - 0.32, d * 0.42, tint(color, -0.08), 0.04);
        markup += furnRect(0.2, d - 0.28, w - 0.4, 0.14, '#f7f1e7', 0.02);
        markup += '</g>';
        return markup;
    }

    function artPedestal(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.32, 0.06, w * 0.36, d * 0.42, tint(color, -0.08), 0.04);
        markup += furnOval(w / 2, d * 0.62, w * 0.38, d * 0.28, color);
        markup += furnOval(w / 2, d * 0.62, w * 0.2, d * 0.14, tint(color, 0.2));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.62) + '" rx="' + num(w * 0.38) + '" ry="' + num(d * 0.28) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artMicrowave(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.14, 0.16, w * 0.62, d - 0.32, '#2a3138', 0.04);
        markup += furnRect(w - 0.22, d * 0.35, 0.08, d * 0.35, tint(color, -0.25), 0.02);
        markup += '</g>';
        return markup;
    }

    function artOven(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.18, 0.18, w - 0.36, d - 0.48, '#1c242b', 0.04);
        markup += furnRect(0.28, 0.28, w - 0.56, d - 0.7, '#9bb0c2', 0.02);
        markup += furnRect(0.2, d - 0.2, w - 0.4, 0.08, tint(color, -0.2), 0.02);
        markup += '</g>';
        return markup;
    }

    function artHighchair(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.22, 0.06, w * 0.56, d * 0.16, tint(color, -0.16), 0.04);
        markup += furnRect(w * 0.18, d * 0.28, w * 0.64, d * 0.28, color, 0.06);
        markup += furnRect(0.06, d * 0.58, w - 0.12, d * 0.32, tint(color, 0.16), 0.06);
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.16) + '" y="' + num(d * 0.24) + '" width="' + num(w * 0.68) + '" height="' + num(d * 0.36) + '" rx="0.06" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artPlanter(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, d * 0.35, w - 0.2, d * 0.55, '#5c4030', 0.04);
        markup += furnOval(w * 0.3, d * 0.4, w * 0.16, d * 0.28, '#6b7f6a');
        markup += furnOval(w * 0.55, d * 0.32, w * 0.18, d * 0.26, '#8d9a84');
        markup += furnOval(w * 0.75, d * 0.42, w * 0.14, d * 0.24, '#5f6f5e');
        markup += '</g>';
        return markup;
    }

    function artHammock(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<polygon pointer-events="none" points="' + num(w * 0.22) + ',' + num(d * 0.18) + ' ' + num(w * 0.72) + ',' + num(d * 0.62) + ' ' + num(w * 0.84) + ',' + num(d * 0.74) + ' ' + num(w * 0.34) + ',' + num(d * 0.28) + '" fill="' + color + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></polygon>';
        markup += '<g pointer-events="none">';
        markup += furnOval(w * 0.16, d * 0.16, 0.12, 0.12, tint(color, -0.35));
        markup += furnOval(w * 0.84, d * 0.84, 0.12, 0.12, tint(color, -0.35));
        markup += '</g>';
        return markup;
    }

    function artRugRound(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.46, d * 0.46, color);
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.32) + '" ry="' + num(d * 0.32) + '" fill="none" stroke="' + tint(color, -0.28) + '" stroke-width="0.04"></ellipse>';
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.46) + '" ry="' + num(d * 0.46) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artCoat(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d / 2, w * 0.16, d * 0.16, color);
        markup += furnOval(w / 2, d * 0.22, 0.1, 0.1, tint(color, -0.2));
        markup += furnOval(w * 0.22, d / 2, 0.1, 0.1, tint(color, -0.2));
        markup += furnOval(w * 0.78, d / 2, 0.1, 0.1, tint(color, -0.2));
        markup += furnOval(w / 2, d * 0.78, 0.1, 0.1, tint(color, -0.2));
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d / 2) + '" rx="' + num(w * 0.34) + '" ry="' + num(d * 0.34) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artDogbed(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.16, 0.16, w - 0.32, d - 0.32, tint(color, 0.22), 0.16);
        return markup;
    }

    function artCrate(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, tint(color, 0.12), stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w / 2 - 0.03, 0.1, 0.06, d - 0.2, tint(color, -0.25), 0);
        markup += furnRect(0.1, d / 2 - 0.03, w - 0.2, 0.06, tint(color, -0.25), 0);
        markup += '</g>';
        return markup;
    }

    function artCat(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnOval(w / 2, d * 0.32, w * 0.36, d * 0.22, color);
        markup += furnOval(w / 2, d * 0.72, w * 0.24, d * 0.16, tint(color, -0.12));
        markup += furnOval(w / 2, d / 2, 0.1, 0.1, '#6b5344');
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.32) + '" rx="' + num(w * 0.36) + '" ry="' + num(d * 0.22) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artBox(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.14, 0.14, w - 0.28, d - 0.28, tint(color, 0.16), 0.04);
        return markup;
    }

    function artStove(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w / 2 - 0.1, 0.06, 0.2, 0.16, tint(color, -0.2), 0.02);
        markup += furnOval(w / 2, d * 0.58, Math.min(w, d) * 0.28, Math.min(w, d) * 0.28, '#2a2420');
        markup += furnOval(w / 2, d * 0.58, Math.min(w, d) * 0.12, Math.min(w, d) * 0.12, '#d4652f');
        markup += '</g>';
        return markup;
    }

    function artRadiator(w, d, color, stroke, sw) {
        var fins = Math.max(6, Math.round(w / 0.28));
        var gap = (w - 0.16) / fins;
        var markup = furnBody(w, d, color, stroke, sw, false);
        var index;
        markup += '<g pointer-events="none">';
        for (index = 0; index < fins; index += 1) {
            markup += furnRect(0.08 + index * gap, 0.12, Math.max(gap - 0.06, 0.05), d - 0.24, tint(color, -0.12), 0.02);
        }
        markup += '</g>';
        return markup;
    }

    function artDivider(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(w / 2 - 0.03, 0.08, 0.06, d - 0.16, tint(color, -0.25), 0);
        return markup;
    }

    function artWasher(w, d, color, stroke, sw, windowed) {
        var radius = Math.min(w, d) * 0.28;
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.14, 0.08, w - 0.28, 0.16, tint(color, -0.12), 0.02);
        markup += furnOval(w / 2, d * 0.58, radius, radius, windowed ? '#9bb0c2' : tint(color, 0.16));
        markup += furnOval(w / 2, d * 0.58, radius * 0.45, radius * 0.45, windowed ? '#e7eef3' : tint(color, -0.08));
        markup += '</g>';
        return markup;
    }

    function artIron(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<polygon pointer-events="none" points="' + num(w / 2) + ',' + num(d - 0.12) + ' ' + num(w - 0.12) + ',' + num(0.5) + ' ' + num(w - 0.16) + ',0.1 ' + num(0.16) + ',0.1 ' + num(0.12) + ',' + num(0.5) + '" fill="' + color + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></polygon>';
        markup += furnRect(w * 0.28, 0.16, w * 0.44, 0.22, tint(color, -0.25), 0.06);
        return markup;
    }

    function artTreadmill(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.16, 0.08, w * 0.68, 0.28, '#2a3138', 0.04);
        markup += furnRect(w * 0.22, 0.48, w * 0.56, d - 0.7, tint(color, 0.12), 0.04);
        markup += furnRect(w * 0.22, d * 0.48, w * 0.56, 0.06, tint(color, -0.2), 0);
        markup += furnRect(w * 0.22, d * 0.66, w * 0.56, 0.06, tint(color, -0.2), 0);
        markup += '</g>';
        return markup;
    }

    function artBike(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.38, 0.2, w * 0.24, d - 0.45, tint(color, -0.15), 0.06);
        markup += furnOval(w / 2, d * 0.24, w * 0.32, d * 0.1, color);
        markup += furnOval(w / 2, d * 0.5, 0.12, 0.12, tint(color, 0.1));
        markup += furnOval(w / 2, d * 0.78, w * 0.3, d * 0.14, '#2a3138');
        markup += '</g>';
        markup += '<ellipse cx="' + num(w / 2) + '" cy="' + num(d * 0.78) + '" rx="' + num(w * 0.3) + '" ry="' + num(d * 0.14) + '" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></ellipse>';
        return markup;
    }

    function artRower(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.38, 0.2, w * 0.24, d - 0.4, tint(color, -0.18), 0.04);
        markup += furnOval(w / 2, d * 0.32, w * 0.32, d * 0.06, color);
        markup += furnOval(w / 2, d * 0.84, w * 0.28, d * 0.08, '#2a3138');
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.36) + '" y="0.16" width="' + num(w * 0.28) + '" height="' + num(d - 0.32) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artWeights(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.28, 0.45, w * 0.44, d - 0.65, color, 0.08);
        markup += furnRect(0.08, 0.28, w - 0.16, 0.14, '#2a3138', 0.04);
        markup += furnOval(0.22, 0.35, 0.16, 0.16, tint(color, -0.2));
        markup += furnOval(w - 0.22, 0.35, 0.16, 0.16, tint(color, -0.2));
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.26) + '" y="0.42" width="' + num(w * 0.48) + '" height="' + num(d - 0.58) + '" rx="0.08" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artPool(w, d, color, stroke, sw) {
        var pockets = [
            [0.22, 0.22],
            [w / 2, 0.16],
            [w - 0.22, 0.22],
            [0.22, d - 0.22],
            [w / 2, d - 0.16],
            [w - 0.22, d - 0.22]
        ];
        var markup = furnBody(w, d, '#6b4f3a', stroke, sw, false);
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.28, 0.28, w - 0.56, d - 0.56, color, 0.04);
        for (index = 0; index < pockets.length; index += 1) {
            markup += furnOval(pockets[index][0], pockets[index][1], 0.12, 0.12, '#1a1814');
        }
        markup += '</g>';
        return markup;
    }

    function artPing(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.24, tint(color, 0.12), 0.02);
        markup += furnRect(0.12, d / 2 - 0.05, w - 0.24, 0.1, '#f7f1e7', 0);
        markup += furnRect(w / 2 - 0.025, 0.2, 0.05, d - 0.4, 'rgba(255,255,255,0.7)', 0);
        markup += '</g>';
        return markup;
    }

    function artFoos(w, d, color, stroke, sw) {
        var rods = 6;
        var markup = furnBody(w, d, color, stroke, sw, false);
        var index;
        markup += '<g pointer-events="none">';
        markup += furnRect(0.12, 0.16, w - 0.24, d - 0.32, '#2f6b45', 0.02);
        for (index = 0; index < rods; index += 1) {
            var y = 0.35 + index * ((d - 0.7) / rods);
            markup += furnRect(0.04, y, w - 0.08, 0.05, '#d6dde4', 0);
            markup += furnOval(w * 0.35, y + 0.025, 0.08, 0.08, index % 2 ? '#9a3412' : '#2a3138');
            markup += furnOval(w * 0.65, y + 0.025, 0.08, 0.08, index % 2 ? '#9a3412' : '#2a3138');
        }
        markup += '</g>';
        return markup;
    }

    function artPiano(w, d, color, stroke, sw) {
        var keyH = Math.min(0.42, d * 0.32);
        var count = Math.max(8, Math.round(w * 3));
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += artKeys(0.12, d - keyH - 0.08, w - 0.24, keyH, count);
        return markup;
    }

    function artGrand(w, d, color, stroke, sw) {
        var keyTop = Math.max(d * 0.62, d - 1.05);
        var count = Math.max(8, Math.round(w * 3));
        var markup = hitRect(w, d);
        markup += '<path pointer-events="none" d="M ' + num(w * 0.08) + ' ' + num(keyTop) + ' L ' + num(w * 0.92) + ' ' + num(keyTop) + ' L ' + num(w * 0.92) + ' ' + num(d * 0.42) + ' Q ' + num(w * 0.86) + ' ' + num(d * 0.08) + ' ' + num(w * 0.42) + ' ' + num(d * 0.08) + ' Q ' + num(w * 0.08) + ' ' + num(d * 0.14) + ' ' + num(w * 0.08) + ' ' + num(keyTop) + ' Z" fill="' + color + '" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></path>';
        markup += artKeys(w * 0.1, keyTop + 0.06, w * 0.8, Math.max(d - keyTop - 0.14, 0.4), count);
        return markup;
    }

    function artKeyboard(w, d, color, stroke, sw) {
        var count = Math.max(10, Math.round(w * 4));
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += artKeys(0.1, 0.16, w - 0.2, d - 0.32, count);
        return markup;
    }

    function artEasel(w, d, color, stroke, sw) {
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(w * 0.22, 0.12, w * 0.56, d * 0.62, '#f7f1e7', 0.04);
        markup += furnOval(w * 0.2, d * 0.84, 0.1, 0.1, color);
        markup += furnOval(w * 0.8, d * 0.84, 0.1, 0.1, color);
        markup += furnOval(w / 2, d * 0.16, 0.1, 0.1, color);
        markup += '</g>';
        markup += '<rect x="' + num(w * 0.22) + '" y="0.12" width="' + num(w * 0.56) + '" height="' + num(d * 0.62) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artAquarium(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.1, 0.1, w - 0.2, d - 0.2, '#3d7f93', 0.04);
        markup += furnOval(w * 0.32, d * 0.48, Math.min(0.18, w * 0.08), Math.min(0.1, d * 0.16), '#d4652f');
        markup += furnOval(w * 0.62, d * 0.58, Math.min(0.14, w * 0.06), Math.min(0.08, d * 0.14), '#e6c8a0');
        markup += furnRect(0.18, d - 0.28, 0.22, Math.max(d * 0.16, 0.1), '#6b7f6a', 0.04);
        markup += '</g>';
        return markup;
    }

    function artPicnic(w, d, color, stroke, sw) {
        var bench = Math.min(0.7, w * 0.18);
        var tableX = bench + 0.16;
        var tableW = w - tableX * 2;
        var markup = hitRect(w, d);
        markup += '<g pointer-events="none">';
        markup += furnRect(0.04, 0.16, bench, d - 0.32, color, 0.05);
        markup += furnRect(w - bench - 0.04, 0.16, bench, d - 0.32, color, 0.05);
        markup += furnRect(tableX, 0.08, tableW, d - 0.16, tint(color, -0.08), 0.04);
        markup += '</g>';
        markup += '<rect x="' + num(tableX) + '" y="0.08" width="' + num(tableW) + '" height="' + num(d - 0.16) + '" rx="0.04" fill="none" stroke="' + stroke + '" stroke-width="' + num(sw) + '"></rect>';
        return markup;
    }

    function artPlain(w, d, color, stroke, sw) {
        var markup = furnBody(w, d, color, stroke, sw, false);
        markup += furnRect(0.12, 0.12, w - 0.24, d - 0.24, tint(color, 0.12), 0.04);
        return markup;
    }

    function pieceArt(entry, selected) {
        var symbol = symbolFor(entry);
        var stroke = selected ? '#9a3412' : 'rgba(44,42,38,0.34)';
        var sw = selected ? 0.07 : 0.03;
        var w = entry.width;
        var d = entry.depth;
        var color = entry.color;
        if (symbol === 'sofa') {
            return artSofa(w, d, color, stroke, sw);
        }
        if (symbol === 'chair') {
            return artChair(w, d, color, stroke, sw);
        }
        if (symbol === 'lounge') {
            return artLounge(w, d, color, stroke, sw);
        }
        if (symbol === 'chaise') {
            return artRun(w, d, color, stroke, sw, 'right');
        }
        if (symbol === 'sectional') {
            return artRun(w, d, color, stroke, sw, 'left');
        }
        if (symbol === 'table') {
            return artTable(w, d, color, stroke, sw, false);
        }
        if (symbol === 'table-round') {
            return artTable(w, d, color, stroke, sw, true);
        }
        if (symbol === 'shelves') {
            return artShelves(w, d, color, stroke, sw);
        }
        if (symbol === 'tv') {
            return artTv(w, d, color, stroke, sw);
        }
        if (symbol === 'drawers') {
            return artDrawers(w, d, color, stroke, sw);
        }
        if (symbol === 'doors') {
            return artDoors(w, d, color, stroke, sw);
        }
        if (symbol === 'bed') {
            return artBed(w, d, color, stroke, sw);
        }
        if (symbol === 'bench') {
            return artBench(w, d, color, stroke, sw);
        }
        if (symbol === 'side-chair') {
            return artSideChair(w, d, color, stroke, sw);
        }
        if (symbol === 'stool') {
            return artStool(w, d, color, stroke, sw);
        }
        if (symbol === 'office-chair') {
            return artOfficeChair(w, d, color, stroke, sw);
        }
        if (symbol === 'desk') {
            return artDesk(w, d, color, stroke, sw);
        }
        if (symbol === 'ldesk') {
            return artLDesk(w, d, color, stroke, sw);
        }
        if (symbol === 'toilet') {
            return artToilet(w, d, color, stroke, sw);
        }
        if (symbol === 'bath') {
            return artBath(w, d, color, stroke, sw);
        }
        if (symbol === 'shower') {
            return artShower(w, d, color, stroke, sw);
        }
        if (symbol === 'sink') {
            return artSink(w, d, color, stroke, sw, 1);
        }
        if (symbol === 'sink2') {
            return artSink(w, d, color, stroke, sw, 2);
        }
        if (symbol === 'fridge') {
            return artFridge(w, d, color, stroke, sw);
        }
        if (symbol === 'range') {
            return artRange(w, d, color, stroke, sw);
        }
        if (symbol === 'dishwasher') {
            return artDishwasher(w, d, color, stroke, sw);
        }
        if (symbol === 'island') {
            return artIsland(w, d, color, stroke, sw);
        }
        if (symbol === 'crib') {
            return artCrib(w, d, color, stroke, sw);
        }
        if (symbol === 'changing') {
            return artChanging(w, d, color, stroke, sw);
        }
        if (symbol === 'rug') {
            return artRug(w, d, color, stroke, sw);
        }
        if (symbol === 'plant') {
            return artPlant(w, d, color, stroke, sw);
        }
        if (symbol === 'lamp') {
            return artLamp(w, d, color, stroke, sw);
        }
        if (symbol === 'fire') {
            return artFire(w, d, color, stroke, sw);
        }
        if (symbol === 'hottub') {
            return artHotTub(w, d, color, stroke, sw);
        }
        if (symbol === 'grill') {
            return artGrill(w, d, color, stroke, sw);
        }
        if (symbol === 'fireplace') {
            return artFireplace(w, d, color, stroke, sw);
        }
        if (symbol === 'ottoman') {
            return artOttoman(w, d, color, stroke, sw);
        }
        if (symbol === 'pouf') {
            return artPouf(w, d, color, stroke, sw);
        }
        if (symbol === 'bean') {
            return artBean(w, d, color, stroke, sw);
        }
        if (symbol === 'recliner') {
            return artRecliner(w, d, color, stroke, sw);
        }
        if (symbol === 'rocker') {
            return artRocker(w, d, color, stroke, sw);
        }
        if (symbol === 'nest') {
            return artNest(w, d, color, stroke, sw);
        }
        if (symbol === 'bunk') {
            return artBunk(w, d, color, stroke, sw);
        }
        if (symbol === 'daybed') {
            return artDaybed(w, d, color, stroke, sw);
        }
        if (symbol === 'chest') {
            return artChest(w, d, color, stroke, sw);
        }
        if (symbol === 'hamper') {
            return artHamper(w, d, color, stroke, sw);
        }
        if (symbol === 'mirror') {
            return artMirror(w, d, color, stroke, sw);
        }
        if (symbol === 'board') {
            return artBoard(w, d, color, stroke, sw);
        }
        if (symbol === 'printer') {
            return artPrinter(w, d, color, stroke, sw);
        }
        if (symbol === 'pedestal') {
            return artPedestal(w, d, color, stroke, sw);
        }
        if (symbol === 'microwave') {
            return artMicrowave(w, d, color, stroke, sw);
        }
        if (symbol === 'oven') {
            return artOven(w, d, color, stroke, sw);
        }
        if (symbol === 'highchair') {
            return artHighchair(w, d, color, stroke, sw);
        }
        if (symbol === 'planter') {
            return artPlanter(w, d, color, stroke, sw);
        }
        if (symbol === 'hammock') {
            return artHammock(w, d, color, stroke, sw);
        }
        if (symbol === 'rug-round') {
            return artRugRound(w, d, color, stroke, sw);
        }
        if (symbol === 'coat') {
            return artCoat(w, d, color, stroke, sw);
        }
        if (symbol === 'dogbed') {
            return artDogbed(w, d, color, stroke, sw);
        }
        if (symbol === 'crate') {
            return artCrate(w, d, color, stroke, sw);
        }
        if (symbol === 'cat') {
            return artCat(w, d, color, stroke, sw);
        }
        if (symbol === 'box') {
            return artBox(w, d, color, stroke, sw);
        }
        if (symbol === 'stove') {
            return artStove(w, d, color, stroke, sw);
        }
        if (symbol === 'radiator') {
            return artRadiator(w, d, color, stroke, sw);
        }
        if (symbol === 'divider') {
            return artDivider(w, d, color, stroke, sw);
        }
        if (symbol === 'washer') {
            return artWasher(w, d, color, stroke, sw, false);
        }
        if (symbol === 'dryer') {
            return artWasher(w, d, color, stroke, sw, true);
        }
        if (symbol === 'iron') {
            return artIron(w, d, color, stroke, sw);
        }
        if (symbol === 'treadmill') {
            return artTreadmill(w, d, color, stroke, sw);
        }
        if (symbol === 'bike') {
            return artBike(w, d, color, stroke, sw);
        }
        if (symbol === 'rower') {
            return artRower(w, d, color, stroke, sw);
        }
        if (symbol === 'weights') {
            return artWeights(w, d, color, stroke, sw);
        }
        if (symbol === 'pool') {
            return artPool(w, d, color, stroke, sw);
        }
        if (symbol === 'pingpong') {
            return artPing(w, d, color, stroke, sw);
        }
        if (symbol === 'foosball') {
            return artFoos(w, d, color, stroke, sw);
        }
        if (symbol === 'piano') {
            return artPiano(w, d, color, stroke, sw);
        }
        if (symbol === 'grand') {
            return artGrand(w, d, color, stroke, sw);
        }
        if (symbol === 'keyboard') {
            return artKeyboard(w, d, color, stroke, sw);
        }
        if (symbol === 'easel') {
            return artEasel(w, d, color, stroke, sw);
        }
        if (symbol === 'aquarium') {
            return artAquarium(w, d, color, stroke, sw);
        }
        if (symbol === 'picnic') {
            return artPicnic(w, d, color, stroke, sw);
        }
        return artPlain(w, d, color, stroke, sw);
    }

    document.querySelectorAll('[data-room-builder]').forEach(boot);

    function isFullscreen(root) {
        return root.getAttribute('data-layout') === 'fullscreen';
    }

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
        var customWallButton;
        var wallNote;
        var stage;
        var svg;
        var hintEl;
        var statusEl;
        var selectionEl;
        var paletteEl;
        var tablistEl;

        adoptIds();

        if (isFullscreen(root)) {
            if (root.parentNode !== document.documentElement) {
                document.documentElement.appendChild(root);
            }
            document.documentElement.classList.add('room-builder-fullscreen');
        }

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
            var customPoints = data && data.room && data.room.points;
            var savedSegments = readSavedSegments(data && data.room);
            if (kind === 'custom' && savedSegments.length) {
                next.room = {
                    shape: 'custom',
                    kind: 'custom',
                    width: 0,
                    depth: 0,
                    cutW: 0,
                    cutD: 0,
                    points: [],
                    edgeIds: [],
                    segments: savedSegments
                };
                state = next;
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
                        next.openings.push(readOpening(opening));
                    });
                }
                if (data && Array.isArray(data.items)) {
                    data.items.forEach(function (item) {
                        if (!item || !catalogItem(item.catalogId)) {
                            return;
                        }
                        var savedRotation = normalizeRotation(item.rotation);
                        next.items.push({
                            id: String(item.id || uid('f')),
                            catalogId: item.catalogId,
                            x: Number(item.x) || 0,
                            y: Number(item.y) || 0,
                            rotation: savedRotation
                        });
                    });
                }
                state = next;
                applySegmentModel(true);
                return next;
            }
            if (kind === 'custom' && Array.isArray(customPoints) && customPoints.length >= 4) {
                var loadedPoints = [];
                var loadedIds = Array.isArray(data.room.edgeIds) ? data.room.edgeIds.map(String) : [];
                customPoints.forEach(function (point) {
                    if (!point || !isFinite(Number(point[0])) || !isFinite(Number(point[1]))) {
                        return;
                    }
                    loadedPoints.push([Number(point[0]), Number(point[1])]);
                });
                while (loadedIds.length < loadedPoints.length) {
                    loadedIds.push('e' + loadedIds.length);
                }
                loadedIds = loadedIds.slice(0, loadedPoints.length);
                if (loadedPoints.length >= 4 && !polygonProblem(loadedPoints)) {
                    var placed = normalizeOrigin(loadedPoints);
                    next.room = {
                        shape: 'custom',
                        kind: 'custom',
                        width: placed.width,
                        depth: placed.depth,
                        cutW: 0,
                        cutD: 0,
                        points: placed.points,
                        edgeIds: loadedIds,
                        segments: segmentsFromPolygon(placed.points, loadedIds)
                    };
                    state = next;
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
                            next.openings.push(readOpening(opening));
                        });
                    }
                    if (data && Array.isArray(data.items)) {
                        data.items.forEach(function (item) {
                            if (!item || !catalogItem(item.catalogId)) {
                                return;
                            }
                            var customRotation = normalizeRotation(item.rotation);
                            next.items.push({
                                id: String(item.id || uid('f')),
                                catalogId: item.catalogId,
                                x: snap((Number(item.x) || 0) - placed.minX),
                                y: snap((Number(item.y) || 0) - placed.minY),
                                rotation: customRotation
                            });
                        });
                    }
                    state = next;
                    normalizeOpenings();
                    normalizeItems();
                    return next;
                }
            }
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
                    next.openings.push(readOpening(opening));
                });
            }
            if (data && Array.isArray(data.items)) {
                data.items.forEach(function (item) {
                    if (!item || !catalogItem(item.catalogId)) {
                        return;
                    }
                    var rotation = normalizeRotation(item.rotation);
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
            var entries = state.items.concat(state.openings);
            (state.room.segments || []).forEach(function (segment) {
                entries.push(segment);
            });
            entries.forEach(function (entry) {
                var match = String(entry.id).match(/(\d+)$/);
                if (match) {
                    max = Math.max(max, Number(match[1]));
                }
            });
            nextId = max + 1;
        }

        function readOpening(opening) {
            return {
                id: String(opening.id || uid('d')),
                wall: String(opening.wall),
                offset: Number(opening.offset),
                width: Number(opening.width),
                hinge: opening.hinge === 'end' ? 'end' : 'start',
                swing: opening.swing === 'out' ? 'out' : 'in'
            };
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

        function copyPoints(points) {
            return points.map(function (point) {
                return [point[0], point[1]];
            });
        }

        function edgeAxis(a, b) {
            if (Math.abs(a[1] - b[1]) <= 0.001) {
                return 'h';
            }
            if (Math.abs(a[0] - b[0]) <= 0.001) {
                return 'v';
            }
            return '';
        }

        function segmentLength(a, b) {
            return Math.hypot(b[0] - a[0], b[1] - a[1]);
        }

        function orient(p, q, r) {
            var value = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
            if (Math.abs(value) < 0.000001) {
                return 0;
            }
            return value > 0 ? 1 : -1;
        }

        function onSegment(p, q, r) {
            return r[0] <= Math.max(p[0], q[0]) + 0.000001 && r[0] >= Math.min(p[0], q[0]) - 0.000001 && r[1] <= Math.max(p[1], q[1]) + 0.000001 && r[1] >= Math.min(p[1], q[1]) - 0.000001;
        }

        function segmentsCross(a, b, c, d) {
            var o1 = orient(a, b, c);
            var o2 = orient(a, b, d);
            var o3 = orient(c, d, a);
            var o4 = orient(c, d, b);
            if (o1 !== o2 && o3 !== o4) {
                return true;
            }
            if (o1 === 0 && onSegment(a, b, c)) {
                return true;
            }
            if (o2 === 0 && onSegment(a, b, d)) {
                return true;
            }
            if (o3 === 0 && onSegment(c, d, a)) {
                return true;
            }
            if (o4 === 0 && onSegment(c, d, b)) {
                return true;
            }
            return false;
        }

        function polygonProblem(points) {
            var count = points.length;
            var index;
            var other;
            var start;
            var end;
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            if (count < 4) {
                return 'A room needs at least four walls.';
            }
            for (index = 0; index < count; index += 1) {
                start = points[index];
                end = points[(index + 1) % count];
                if (!edgeAxis(start, end)) {
                    return 'Walls stay straight across or straight down.';
                }
                if (segmentLength(start, end) < MIN_WALL - 0.001) {
                    return 'Each wall needs to be at least ' + MIN_WALL + ' ft.';
                }
                minX = Math.min(minX, start[0]);
                minY = Math.min(minY, start[1]);
                maxX = Math.max(maxX, start[0]);
                maxY = Math.max(maxY, start[1]);
            }
            if (maxX - minX > MAX_ROOM + 0.001 || maxY - minY > MAX_ROOM + 0.001) {
                return 'Rooms stay within ' + MAX_ROOM + ' ft on each side.';
            }
            if (maxX - minX < MIN_ROOM - 0.001 || maxY - minY < MIN_ROOM - 0.001) {
                return 'The room needs to stay at least ' + MIN_ROOM + ' ft on each side.';
            }
            for (index = 0; index < count; index += 1) {
                for (other = index + 1; other < count; other += 1) {
                    if (other === index || (other + 1) % count === index || (index + 1) % count === other) {
                        continue;
                    }
                    if (segmentsCross(points[index], points[(index + 1) % count], points[other], points[(other + 1) % count])) {
                        return 'That wall would cross another wall.';
                    }
                }
            }
            return '';
        }

        function normalizeOrigin(points) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            points.forEach(function (point) {
                minX = Math.min(minX, point[0]);
                minY = Math.min(minY, point[1]);
                maxX = Math.max(maxX, point[0]);
                maxY = Math.max(maxY, point[1]);
            });
            return {
                minX: minX,
                minY: minY,
                width: snap(maxX - minX),
                depth: snap(maxY - minY),
                points: points.map(function (point) {
                    return [snap(point[0] - minX), snap(point[1] - minY)];
                })
            };
        }

        function pointInPoly(x, y, poly) {
            var inside = false;
            var index;
            var previous = poly.length - 1;
            var currentX;
            var currentY;
            var previousX;
            var previousY;
            for (index = 0; index < poly.length; index += 1) {
                currentX = poly[index][0];
                currentY = poly[index][1];
                previousX = poly[previous][0];
                previousY = poly[previous][1];
                if (((currentY > y) !== (previousY > y)) && (x < (previousX - currentX) * (y - currentY) / ((previousY - currentY) || 0.000001) + currentX)) {
                    inside = !inside;
                }
                previous = index;
            }
            return inside;
        }

        function distToSegment(px, py, a, b) {
            var dx = b[0] - a[0];
            var dy = b[1] - a[1];
            var len2 = dx * dx + dy * dy || 1;
            var t = ((px - a[0]) * dx + (py - a[1]) * dy) / len2;
            t = Math.max(0, Math.min(1, t));
            return Math.hypot(px - (a[0] + dx * t), py - (a[1] + dy * t));
        }

        function pointNearPoly(x, y, poly) {
            var index;
            if (pointInPoly(x, y, poly)) {
                return true;
            }
            for (index = 0; index < poly.length; index += 1) {
                if (distToSegment(x, y, poly[index], poly[(index + 1) % poly.length]) <= 0.08) {
                    return true;
                }
            }
            return false;
        }

        function rectInPolygon(x, y, width, height, poly) {
            var step = 0.5;
            var sx;
            var sy;
            var sampleX;
            var sampleY;
            if (!pointNearPoly(x + width / 2, y + height / 2, poly)) {
                return false;
            }
            for (sy = y; sy <= y + height + 0.001; sy += step) {
                for (sx = x; sx <= x + width + 0.001; sx += step) {
                    sampleX = Math.min(sx, x + width);
                    sampleY = Math.min(sy, y + height);
                    if (!pointNearPoly(sampleX, sampleY, poly)) {
                        return false;
                    }
                }
            }
            return pointNearPoly(x, y, poly) && pointNearPoly(x + width, y, poly) && pointNearPoly(x, y + height, poly) && pointNearPoly(x + width, y + height, poly);
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

            if (room.kind === 'custom') {
                polygon = room.points && room.points.length >= 4 ? room.points.map(function (point) {
                    return [point[0], point[1]];
                }) : [];
                width = room.width;
                depth = room.depth;
            } else if (room.kind === 'l') {
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
                var reversed = horizontal ? point[0] > next[0] : point[1] > next[1];
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
                if (room.kind === 'custom' && room.edgeIds && room.edgeIds[index]) {
                    id = room.edgeIds[index];
                } else if (horizontal && Math.abs(y1) < 0.01) {
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
                if (room.kind !== 'custom' && used[id]) {
                    id = id + '-' + index;
                }
                used[id] = true;
                return {
                    id: id,
                    index: index,
                    reversed: reversed,
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

        function wallFromSegment(segment) {
            var horizontal = Math.abs(segment.y1 - segment.y2) <= 0.001 && Math.abs(segment.x2 - segment.x1) > 0.001;
            var vertical = Math.abs(segment.x1 - segment.x2) <= 0.001 && Math.abs(segment.y2 - segment.y1) > 0.001;
            var x1 = segment.x1;
            var y1 = segment.y1;
            var x2 = segment.x2;
            var y2 = segment.y2;
            if (!horizontal && !vertical) {
                return null;
            }
            if (horizontal && x1 > x2) {
                x1 = segment.x2;
                x2 = segment.x1;
                y1 = segment.y2;
                y2 = segment.y1;
            }
            if (vertical && y1 > y2) {
                y1 = segment.y2;
                y2 = segment.y1;
                x1 = segment.x2;
                x2 = segment.x1;
            }
            return {
                id: segment.id,
                index: -1,
                reversed: false,
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                length: horizontal ? x2 - x1 : y2 - y1,
                horizontal: horizontal
            };
        }

        function allWalls() {
            var walls = layout().walls.slice();
            var seen = {};
            walls.forEach(function (wall) {
                seen[wall.id] = true;
            });
            (state.room.segments || []).forEach(function (segment) {
                var wall;
                if (seen[segment.id]) {
                    return;
                }
                wall = wallFromSegment(segment);
                if (wall) {
                    walls.push(wall);
                    seen[wall.id] = true;
                }
            });
            return walls;
        }

        function findWall(id) {
            var walls = allWalls();
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
            if (state.room.kind === 'custom') {
                return rectInPolygon(item.x, item.y, size.w, size.d, plan.polygon);
            }
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
            if (state.room.kind === 'custom') {
                return pointInPoly(x, y, plan.polygon);
            }
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
            hintEl.textContent = 'Drag a 2 ft or 6 ft wall onto the plan. Drop an end on a corner to connect it, then drag the wall or its ends to shape the room.';
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

            side.appendChild(wallTray());
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
                swatch.innerHTML = '<svg viewBox="0 0 ' + entry.width + ' ' + entry.depth + '" preserveAspectRatio="xMidYMid meet">' + pieceArt(entry, false) + '</svg>';
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

        function wallTray() {
            var tray = document.createElement('div');
            var heading = document.createElement('div');
            var label = document.createElement('p');
            var row = document.createElement('div');
            tray.className = 'room-builder__wall-tray';
            heading.className = 'room-builder__wall-heading';
            label.className = 'room-builder__shapes-label';
            label.textContent = 'Walls';
            doorButton = makeButton('Add door', 'room-builder__button');
            doorButton.setAttribute('aria-pressed', 'false');
            doorButton.addEventListener('click', function () {
                state.tool = state.tool === 'door' ? 'select' : 'door';
                syncDoorTool();
                setStatus(state.tool === 'door' ? 'Click a wall to add a doorway.' : '');
            });
            heading.appendChild(label);
            heading.appendChild(doorButton);
            row.className = 'room-builder__wall-pieces';
            WALL_PIECES.forEach(function (length) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'room-builder__piece room-builder__wall-piece';
                button.setAttribute('data-wall-length', String(length));
                button.textContent = length + ' ft wall';
                button.addEventListener('pointerdown', onWallPointerDown);
                button.addEventListener('pointermove', onWallPointerMove);
                button.addEventListener('pointerup', onWallPointerUp);
                button.addEventListener('pointercancel', onWallPointerUp);
                row.appendChild(button);
            });
            customWallButton = makeButton('Custom length wall', 'room-builder__button room-builder__wall-piece room-builder__wall-piece--custom');
            customWallButton.setAttribute('aria-pressed', 'false');
            customWallButton.addEventListener('click', function () {
                state.tool = state.tool === 'wall' ? 'select' : 'wall';
                syncDoorTool();
                setStatus('');
            });
            row.appendChild(customWallButton);
            wallNote = document.createElement('p');
            wallNote.className = 'room-builder__wall-note';
            wallNote.textContent = 'Click and drag on the plan.';
            wallNote.hidden = true;
            tray.appendChild(heading);
            tray.appendChild(row);
            tray.appendChild(wallNote);
            return tray;
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

        function ensureCustom() {
            var plan;
            var points;
            if (state.room.kind === 'custom' && state.room.segments && state.room.segments.length) {
                return;
            }
            if (state.room.kind === 'custom' && state.room.points && state.room.points.length >= 4) {
                state.room.segments = segmentsFromPolygon(state.room.points, state.room.edgeIds || []);
                return;
            }
            plan = layout();
            points = plan.polygon.map(function (point) {
                return [point[0], point[1]];
            });
            state.room = {
                shape: 'custom',
                kind: 'custom',
                width: state.room.width,
                depth: state.room.depth,
                cutW: 0,
                cutD: 0,
                points: points,
                edgeIds: plan.walls.map(function (wall) {
                    return wall.id;
                }),
                segments: plan.walls.map(function (wall) {
                    return {
                        id: wall.id,
                        x1: wall.x1,
                        y1: wall.y1,
                        x2: wall.x2,
                        y2: wall.y2
                    };
                })
            };
        }

        function readSavedSegments(room) {
            var list = [];
            if (!room || !Array.isArray(room.segments)) {
                return list;
            }
            room.segments.forEach(function (segment) {
                var x1 = Number(segment && segment.x1);
                var y1 = Number(segment && segment.y1);
                var x2 = Number(segment && segment.x2);
                var y2 = Number(segment && segment.y2);
                if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
                    return;
                }
                list.push({
                    id: String(segment.id || uid('w')),
                    x1: snap(x1),
                    y1: snap(y1),
                    x2: snap(x2),
                    y2: snap(y2)
                });
            });
            return list;
        }

        function segmentsFromPolygon(points, edgeIds) {
            var ids = edgeIds || [];
            return points.map(function (point, index) {
                var next = points[(index + 1) % points.length];
                return {
                    id: ids[index] || ('e' + index),
                    x1: point[0],
                    y1: point[1],
                    x2: next[0],
                    y2: next[1]
                };
            });
        }

        function cloneSegments(list) {
            return (list || []).map(function (segment) {
                return {
                    id: segment.id,
                    x1: segment.x1,
                    y1: segment.y1,
                    x2: segment.x2,
                    y2: segment.y2
                };
            });
        }

        function pointKey(x, y) {
            return snap(x).toFixed(2) + ',' + snap(y).toFixed(2);
        }

        function orderSegment(segment) {
            var swap;
            if (Math.abs(segment.y1 - segment.y2) <= 0.001) {
                segment.y2 = segment.y1;
                if (segment.x1 > segment.x2) {
                    swap = segment.x1;
                    segment.x1 = segment.x2;
                    segment.x2 = swap;
                }
                return;
            }
            if (Math.abs(segment.x1 - segment.x2) <= 0.001) {
                segment.x2 = segment.x1;
                if (segment.y1 > segment.y2) {
                    swap = segment.y1;
                    segment.y1 = segment.y2;
                    segment.y2 = swap;
                }
            }
        }

        function segmentSpan(segment) {
            return Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1);
        }

        function pointsBounds(points) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            (points || []).forEach(function (point) {
                minX = Math.min(minX, point[0]);
                minY = Math.min(minY, point[1]);
                maxX = Math.max(maxX, point[0]);
                maxY = Math.max(maxY, point[1]);
            });
            if (!isFinite(minX)) {
                return { width: 0, depth: 0 };
            }
            return {
                width: snap(maxX - minX),
                depth: snap(maxY - minY)
            };
        }

        function segmentBounds(list) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            (list || []).forEach(function (segment) {
                minX = Math.min(minX, segment.x1, segment.x2);
                minY = Math.min(minY, segment.y1, segment.y2);
                maxX = Math.max(maxX, segment.x1, segment.x2);
                maxY = Math.max(maxY, segment.y1, segment.y2);
            });
            if (!isFinite(minX)) {
                return { minX: 0, minY: 0, width: 0, depth: 0 };
            }
            return {
                minX: minX,
                minY: minY,
                width: snap(maxX - minX),
                depth: snap(maxY - minY)
            };
        }

        function rangesOverlap(a1, a2, b1, b2) {
            return Math.min(Math.max(a1, a2), Math.max(b1, b2)) - Math.max(Math.min(a1, a2), Math.min(b1, b2));
        }

        function pointOnSegment(px, py, segment) {
            if (Math.hypot(px - segment.x1, py - segment.y1) <= 0.02 || Math.hypot(px - segment.x2, py - segment.y2) <= 0.02) {
                return false;
            }
            if (Math.abs(segment.y1 - segment.y2) <= 0.001) {
                return Math.abs(py - segment.y1) <= 0.02 && px > Math.min(segment.x1, segment.x2) + 0.02 && px < Math.max(segment.x1, segment.x2) - 0.02;
            }
            if (Math.abs(segment.x1 - segment.x2) <= 0.001) {
                return Math.abs(px - segment.x1) <= 0.02 && py > Math.min(segment.y1, segment.y2) + 0.02 && py < Math.max(segment.y1, segment.y2) - 0.02;
            }
            return false;
        }

        function collinearOverlap(a, b) {
            var aHorizontal = Math.abs(a.y1 - a.y2) <= 0.001;
            var bHorizontal = Math.abs(b.y1 - b.y2) <= 0.001;
            if (aHorizontal && bHorizontal && Math.abs(a.y1 - b.y1) <= 0.001) {
                return rangesOverlap(a.x1, a.x2, b.x1, b.x2) > 0.05;
            }
            if (!aHorizontal && !bHorizontal && Math.abs(a.x1 - b.x1) <= 0.001 && Math.abs(a.x1 - a.x2) <= 0.001 && Math.abs(b.x1 - b.x2) <= 0.001) {
                return rangesOverlap(a.y1, a.y2, b.y1, b.y2) > 0.05;
            }
            return false;
        }

        function improperCross(a, b) {
            if (collinearOverlap(a, b)) {
                return true;
            }
            if (pointKey(a.x1, a.y1) === pointKey(b.x1, b.y1) || pointKey(a.x1, a.y1) === pointKey(b.x2, b.y2) || pointKey(a.x2, a.y2) === pointKey(b.x1, b.y1) || pointKey(a.x2, a.y2) === pointKey(b.x2, b.y2)) {
                return false;
            }
            if (pointOnSegment(a.x1, a.y1, b) || pointOnSegment(a.x2, a.y2, b) || pointOnSegment(b.x1, b.y1, a) || pointOnSegment(b.x2, b.y2, a)) {
                return false;
            }
            return segmentsCross([a.x1, a.y1], [a.x2, a.y2], [b.x1, b.y1], [b.x2, b.y2]);
        }

        function segmentsOk(list) {
            var index;
            var other;
            var bounds;
            if (!list || !list.length) {
                return true;
            }
            for (index = 0; index < list.length; index += 1) {
                if (Math.abs(list[index].x1 - list[index].x2) > 0.001 && Math.abs(list[index].y1 - list[index].y2) > 0.001) {
                    return false;
                }
                if (segmentSpan(list[index]) < MIN_WALL - 0.001) {
                    return false;
                }
            }
            bounds = segmentBounds(list);
            if (bounds.width > MAX_ROOM + 0.001 || bounds.depth > MAX_ROOM + 0.001) {
                return false;
            }
            for (index = 0; index < list.length; index += 1) {
                for (other = index + 1; other < list.length; other += 1) {
                    if (improperCross(list[index], list[other])) {
                        return false;
                    }
                }
            }
            return true;
        }

        function endpointDegree(list, x, y) {
            var key = pointKey(x, y);
            var count = 0;
            (list || []).forEach(function (segment) {
                if (pointKey(segment.x1, segment.y1) === key) {
                    count += 1;
                }
                if (pointKey(segment.x2, segment.y2) === key) {
                    count += 1;
                }
            });
            return count;
        }

        function signedArea(points) {
            var sum = 0;
            var index;
            var next;
            for (index = 0; index < points.length; index += 1) {
                next = points[(index + 1) % points.length];
                sum += points[index][0] * next[1] - next[0] * points[index][1];
            }
            return sum / 2;
        }

        function bestCycle(list) {
            var adj = {};
            var best = null;
            var seen = {};
            var previous = {};
            (state.room.edgeIds || []).forEach(function (id) {
                previous[id] = true;
            });
            function addEdge(key, entry) {
                if (!adj[key]) {
                    adj[key] = [];
                }
                adj[key].push(entry);
            }
            (list || []).forEach(function (segment) {
                var start = pointKey(segment.x1, segment.y1);
                var end = pointKey(segment.x2, segment.y2);
                if (start === end) {
                    return;
                }
                addEdge(start, { id: segment.id, to: end, x: snap(segment.x2), y: snap(segment.y2) });
                addEdge(end, { id: segment.id, to: start, x: snap(segment.x1), y: snap(segment.y1) });
            });
            function hasPoint(points, key) {
                var index;
                for (index = 0; index < points.length; index += 1) {
                    if (pointKey(points[index][0], points[index][1]) === key) {
                        return true;
                    }
                }
                return false;
            }
            function consider(points, edgeIds) {
                var signature = edgeIds.slice().sort().join('|');
                var area;
                var overlap = 0;
                if (seen[signature] || polygonProblem(points)) {
                    return;
                }
                seen[signature] = true;
                area = Math.abs(signedArea(points));
                edgeIds.forEach(function (id) {
                    if (previous[id]) {
                        overlap += 1;
                    }
                });
                if (!best || area > best.area + 0.05 || (Math.abs(area - best.area) <= 0.05 && overlap > best.overlap)) {
                    best = {
                        points: points.map(function (point) {
                            return [point[0], point[1]];
                        }),
                        edgeIds: edgeIds.slice(),
                        area: area,
                        overlap: overlap
                    };
                }
            }
            function search(startKey, currentKey, points, edgeIds, used) {
                var edges = adj[currentKey] || [];
                var index;
                var edge;
                if (points.length > 16) {
                    return;
                }
                for (index = 0; index < edges.length; index += 1) {
                    edge = edges[index];
                    if (used[edge.id]) {
                        continue;
                    }
                    if (edge.to === startKey) {
                        if (points.length >= 4) {
                            consider(points, edgeIds.concat([edge.id]));
                        }
                        continue;
                    }
                    if (hasPoint(points, edge.to)) {
                        continue;
                    }
                    used[edge.id] = true;
                    points.push([edge.x, edge.y]);
                    edgeIds.push(edge.id);
                    search(startKey, edge.to, points, edgeIds, used);
                    edgeIds.pop();
                    points.pop();
                    used[edge.id] = false;
                }
            }
            Object.keys(adj).forEach(function (startKey) {
                var parts = startKey.split(',');
                search(startKey, startKey, [[Number(parts[0]), Number(parts[1])]], [], {});
            });
            return best;
        }

        function normalizeSegmentOrigin() {
            var bounds = segmentBounds(state.room.segments);
            if (!state.room.segments || !state.room.segments.length) {
                return;
            }
            if (Math.abs(bounds.minX) < 0.001 && Math.abs(bounds.minY) < 0.001) {
                return;
            }
            state.room.segments.forEach(function (segment) {
                segment.x1 = snap(segment.x1 - bounds.minX);
                segment.y1 = snap(segment.y1 - bounds.minY);
                segment.x2 = snap(segment.x2 - bounds.minX);
                segment.y2 = snap(segment.y2 - bounds.minY);
            });
            shiftItems(bounds.minX, bounds.minY);
        }

        function splitAtJunctions() {
            var skipped = {};
            var guard = 0;
            function junctionKey(id, x, y) {
                return id + '@' + pointKey(x, y);
            }
            function findJunction() {
                var hostIndex;
                var otherIndex;
                var host;
                var other;
                var points;
                var pointIndex;
                var along;
                var length;
                for (hostIndex = 0; hostIndex < state.room.segments.length; hostIndex += 1) {
                    host = state.room.segments[hostIndex];
                    length = segmentSpan(host);
                    for (otherIndex = 0; otherIndex < state.room.segments.length; otherIndex += 1) {
                        if (otherIndex === hostIndex) {
                            continue;
                        }
                        other = state.room.segments[otherIndex];
                        points = [[other.x1, other.y1], [other.x2, other.y2]];
                        for (pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
                            if (!pointOnSegment(points[pointIndex][0], points[pointIndex][1], host)) {
                                continue;
                            }
                            if (skipped[junctionKey(host.id, points[pointIndex][0], points[pointIndex][1])]) {
                                continue;
                            }
                            along = Math.abs(host.y1 - host.y2) <= 0.001 ? Math.abs(points[pointIndex][0] - host.x1) : Math.abs(points[pointIndex][1] - host.y1);
                            if (along < MIN_WALL - 0.001 || length - along < MIN_WALL - 0.001) {
                                skipped[junctionKey(host.id, points[pointIndex][0], points[pointIndex][1])] = true;
                                continue;
                            }
                            return {
                                host: host,
                                x: points[pointIndex][0],
                                y: points[pointIndex][1],
                                along: along
                            };
                        }
                    }
                }
                return null;
            }
            while (guard < 24) {
                var junction = findJunction();
                var first;
                var second;
                var index;
                guard += 1;
                if (!junction) {
                    return;
                }
                first = {
                    id: junction.host.id,
                    x1: junction.host.x1,
                    y1: junction.host.y1,
                    x2: junction.x,
                    y2: junction.y
                };
                second = {
                    id: uid('w'),
                    x1: junction.x,
                    y1: junction.y,
                    x2: junction.host.x2,
                    y2: junction.host.y2
                };
                orderSegment(first);
                orderSegment(second);
                index = state.room.segments.indexOf(junction.host);
                state.room.segments.splice(index, 1, first, second);
                state.openings.forEach(function (opening) {
                    if (opening.wall !== junction.host.id) {
                        return;
                    }
                    if (opening.offset >= junction.along - 0.01) {
                        opening.wall = second.id;
                        opening.offset = snap(opening.offset - junction.along);
                    } else if (opening.offset + opening.width > junction.along + 0.01) {
                        opening.width = snap(junction.along - opening.offset);
                    }
                });
            }
        }

        function applySegmentModel(split) {
            var cycle;
            var bounds;
            (state.room.segments || []).forEach(orderSegment);
            normalizeSegmentOrigin();
            if (split) {
                splitAtJunctions();
                (state.room.segments || []).forEach(orderSegment);
            }
            cycle = bestCycle(state.room.segments || []);
            bounds = segmentBounds(state.room.segments || []);
            var floorBounds = cycle ? pointsBounds(cycle.points) : null;
            state.room.kind = 'custom';
            state.room.shape = 'custom';
            state.room.cutW = 0;
            state.room.cutD = 0;
            state.room.points = cycle ? cycle.points : [];
            state.room.edgeIds = cycle ? cycle.edgeIds : [];
            state.room.width = floorBounds ? floorBounds.width : bounds.width;
            state.room.depth = floorBounds ? floorBounds.depth : bounds.depth;
            state.room.spanW = Math.max(state.room.width, bounds.width);
            state.room.spanD = Math.max(state.room.depth, bounds.depth);
            dropUnknownOpenings();
            normalizeOpenings();
            normalizeItems();
            dropMissingSelection();
        }

        function syncFromSegments(split) {
            applySegmentModel(split);
            if (widthInput) {
                syncSizeInputs();
                syncShapeButtons();
            }
        }

        function findSegment(id) {
            var index;
            var list = state.room.segments || [];
            for (index = 0; index < list.length; index += 1) {
                if (list[index].id === id) {
                    return list[index];
                }
            }
            return null;
        }

        function moveEndpoints(segments, points, dx, dy) {
            var keys = {};
            points.forEach(function (point) {
                keys[pointKey(point.x, point.y)] = true;
            });
            segments.forEach(function (segment) {
                if (keys[pointKey(segment.x1, segment.y1)]) {
                    segment.x1 = snap(segment.x1 + dx);
                    segment.y1 = snap(segment.y1 + dy);
                }
                if (keys[pointKey(segment.x2, segment.y2)]) {
                    segment.x2 = snap(segment.x2 + dx);
                    segment.y2 = snap(segment.y2 + dy);
                }
            });
        }

        function pullSquare(segments, ox, oy, nx, ny) {
            var dx = snap(nx) - snap(ox);
            var dy = snap(ny) - snap(oy);
            var moving = {};
            var guard = 0;
            var grew = true;
            moving[pointKey(ox, oy)] = true;
            while (grew && guard < 30) {
                guard += 1;
                grew = false;
                segments.forEach(function (segment) {
                    var vertical = Math.abs(segment.x1 - segment.x2) <= 0.001;
                    var horizontal = Math.abs(segment.y1 - segment.y2) <= 0.001;
                    var across = (Math.abs(dx) > 0.001 && vertical) || (Math.abs(dy) > 0.001 && horizontal);
                    var key1 = pointKey(segment.x1, segment.y1);
                    var key2 = pointKey(segment.x2, segment.y2);
                    if (!across) {
                        return;
                    }
                    if (moving[key1] && !moving[key2]) {
                        moving[key2] = true;
                        grew = true;
                    } else if (moving[key2] && !moving[key1]) {
                        moving[key1] = true;
                        grew = true;
                    }
                });
            }
            segments.forEach(function (segment) {
                var move1 = !!moving[pointKey(segment.x1, segment.y1)];
                var move2 = !!moving[pointKey(segment.x2, segment.y2)];
                if (move1) {
                    segment.x1 = snap(segment.x1 + dx);
                    segment.y1 = snap(segment.y1 + dy);
                }
                if (move2) {
                    segment.x2 = snap(segment.x2 + dx);
                    segment.y2 = snap(segment.y2 + dy);
                }
            });
        }

        function nearestAnchor(x, y, ignoreId, maxDist) {
            var best = null;
            (state.room.segments || []).forEach(function (segment) {
                var dx;
                var dy;
                var len2;
                var t;
                var px;
                var py;
                var dist;
                if (segment.id === ignoreId) {
                    return;
                }
                [[segment.x1, segment.y1], [segment.x2, segment.y2]].forEach(function (point) {
                    dist = Math.hypot(point[0] - x, point[1] - y);
                    if (dist <= maxDist && (!best || dist < best.dist)) {
                        best = { x: point[0], y: point[1], dist: dist };
                    }
                });
                dx = segment.x2 - segment.x1;
                dy = segment.y2 - segment.y1;
                len2 = dx * dx + dy * dy || 1;
                t = ((x - segment.x1) * dx + (y - segment.y1) * dy) / len2;
                if (t <= 0.02 || t >= 0.98) {
                    return;
                }
                px = snap(segment.x1 + dx * t);
                py = snap(segment.y1 + dy * t);
                dist = Math.hypot(px - x, py - y);
                if (dist <= maxDist && (!best || dist < best.dist)) {
                    best = { x: px, y: py, dist: dist };
                }
            });
            return best;
        }

        function openEnds(list) {
            var counts = {};
            var points = [];
            function add(x, y, segment) {
                var key = pointKey(x, y);
                if (!counts[key]) {
                    counts[key] = { x: snap(x), y: snap(y), n: 0, segment: segment };
                    points.push(counts[key]);
                }
                counts[key].n += 1;
            }
            (list || []).forEach(function (segment) {
                add(segment.x1, segment.y1, segment);
                add(segment.x2, segment.y2, segment);
            });
            return points.filter(function (point) {
                return point.n === 1;
            });
        }

        function parkedWall(length, vertical, originX, originY, sign) {
            var segment = {
                id: uid('w'),
                x1: snap(originX),
                y1: snap(originY),
                x2: snap(originX),
                y2: snap(originY)
            };
            if (vertical) {
                segment.y2 = snap(originY + sign * length);
            } else {
                segment.x2 = snap(originX + sign * length);
            }
            orderSegment(segment);
            return segment;
        }

        function snapNewWall(segment) {
            var vertical = Math.abs(segment.x1 - segment.x2) <= 0.001;
            var first = nearestAnchor(segment.x1, segment.y1, segment.id, 0.75);
            var second = nearestAnchor(segment.x2, segment.y2, segment.id, 0.75);
            var pick = null;
            var which = 1;
            if (first && (!second || first.dist <= second.dist)) {
                pick = first;
            } else if (second) {
                pick = second;
                which = 2;
            }
            if (!pick) {
                return;
            }
            var dx = pick.x - (which === 1 ? segment.x1 : segment.x2);
            var dy = pick.y - (which === 1 ? segment.y1 : segment.y2);
            if (vertical && Math.abs(pick.x - segment.x1) > 0.001 && Math.abs(dy) > 0.001 && Math.abs(dx) > 0.001) {
                segment.x1 = snap(segment.x1 + dx);
                segment.x2 = segment.x1;
                segment.y1 = snap(segment.y1 + dy);
                segment.y2 = snap(segment.y2 + dy);
            } else if (!vertical && Math.abs(pick.y - segment.y1) > 0.001 && Math.abs(dx) > 0.001 && Math.abs(dy) > 0.001) {
                segment.y1 = snap(segment.y1 + dy);
                segment.y2 = segment.y1;
                segment.x1 = snap(segment.x1 + dx);
                segment.x2 = snap(segment.x2 + dx);
            } else {
                segment.x1 = snap(segment.x1 + dx);
                segment.y1 = snap(segment.y1 + dy);
                segment.x2 = snap(segment.x2 + dx);
                segment.y2 = snap(segment.y2 + dy);
            }
            orderSegment(segment);
        }

        function wallAt(length, vertical, feet) {
            var segment;
            if (vertical) {
                segment = {
                    id: uid('w'),
                    x1: snap(feet.x),
                    y1: snap(feet.y - length / 2),
                    x2: snap(feet.x),
                    y2: snap(feet.y - length / 2) + length
                };
            } else {
                segment = {
                    id: uid('w'),
                    x1: snap(feet.x - length / 2),
                    y1: snap(feet.y),
                    x2: snap(feet.x - length / 2) + length,
                    y2: snap(feet.y)
                };
            }
            orderSegment(segment);
            snapNewWall(segment);
            return segment;
        }

        function acceptWall(segment) {
            var next = (state.room.segments || []).concat([segment]);
            if (segmentSpan(segment) < MIN_WALL - 0.001 || !segmentsOk(next)) {
                return false;
            }
            state.room.segments = next;
            syncFromSegments(true);
            state.selected = { type: 'wall', id: segment.id };
            persist();
            renderPlan();
            renderSelection();
            if (state.room.points && state.room.points.length >= 4) {
                setStatus('Wall added. Drag a wall or its ends to keep shaping the room.');
            } else {
                setStatus('Wall added. Connect the open ends to close the room.');
            }
            return true;
        }

        function snapDrawPoint(x, y) {
            var points = [];
            var best = null;
            (state.room.segments || []).forEach(function (segment) {
                points.push([segment.x1, segment.y1], [segment.x2, segment.y2]);
            });
            if (!points.length) {
                var corners = state.room.points && state.room.points.length ? state.room.points : layout().polygon;
                corners.forEach(function (point) {
                    points.push(point);
                });
            }
            points.forEach(function (point) {
                var dist = Math.hypot(point[0] - x, point[1] - y);
                if (dist <= 0.75 && (!best || dist < best.dist)) {
                    best = { x: snap(point[0]), y: snap(point[1]), dist: dist };
                }
            });
            if (best) {
                return { x: best.x, y: best.y };
            }
            return { x: snap(x), y: snap(y) };
        }

        function drawnEnd(start, feet) {
            if (Math.abs(feet.y - start.y) > Math.abs(feet.x - start.x)) {
                return { x: start.x, y: snap(feet.y) };
            }
            return { x: snap(feet.x), y: start.y };
        }

        function showDrawPreview(start, end, length) {
            var group = svg.querySelector('.room-builder__draw-preview');
            var midX = (start.x + end.x) / 2;
            var midY = (start.y + end.y) / 2;
            var label = length >= 0.5 ? formatFeet(length) + ' ft' : '';
            if (!group) {
                group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('class', 'room-builder__draw-preview');
                group.setAttribute('pointer-events', 'none');
                svg.appendChild(group);
            }
            group.innerHTML = '<line x1="' + num(start.x) + '" y1="' + num(start.y) + '" x2="' + num(end.x) + '" y2="' + num(end.y) + '"></line>' +
                '<text text-anchor="middle" font-size="0.42" x="' + num(midX) + '" y="' + num(midY - 0.28) + '">' + label + '</text>';
        }

        function clearDrawPreview() {
            var group = svg.querySelector('.room-builder__draw-preview');
            if (group && group.parentNode) {
                group.parentNode.removeChild(group);
            }
        }

        function placeDrawnWall(start, end) {
            var before = captureRoomState();
            var segment;
            ensureCustom();
            segment = {
                id: uid('w'),
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y
            };
            orderSegment(segment);
            snapNewWall(segment);
            if (!acceptWall(segment)) {
                restoreRoomState(before);
                syncShapeButtons();
                renderPlan();
                setStatus('That wall would cross another wall.');
            }
        }

        function placeWallPiece(length, vertical, feet) {
            var before = captureRoomState();
            var ends;
            var signs = [1, -1];
            var index;
            var segment;
            ensureCustom();
            if (!feet) {
                ends = openEnds(state.room.segments);
                if (ends.length) {
                    var source = ends[0].segment;
                    var turnVertical = Math.abs(source.y1 - source.y2) <= 0.001;
                    for (index = 0; index < signs.length; index += 1) {
                        segment = parkedWall(length, turnVertical, ends[0].x, ends[0].y, signs[index]);
                        if (acceptWall(segment)) {
                            return;
                        }
                    }
                }
                segment = parkedWall(length, false, state.room.width || 0, 0, 1);
                if (acceptWall(segment)) {
                    return;
                }
                segment = parkedWall(length, true, state.room.width || 0, 0, 1);
                if (acceptWall(segment)) {
                    return;
                }
                restoreRoomState(before);
                syncShapeButtons();
                renderPlan();
                setStatus('That wall would cross another wall.');
                return;
            }
            segment = wallAt(length, vertical, feet);
            if (!acceptWall(segment)) {
                restoreRoomState(before);
                syncShapeButtons();
                renderPlan();
                setStatus('That wall would cross another wall.');
            }
        }

        function captureRoomState() {
            return JSON.parse(JSON.stringify({
                room: state.room,
                items: state.items,
                openings: state.openings
            }));
        }

        function restoreRoomState(snapshot) {
            state.room = snapshot.room;
            state.items = snapshot.items;
            state.openings = snapshot.openings;
        }

        function applyWallDelta(next, drag, feet) {
            var dx = snap(feet.x - drag.start.x);
            var dy = snap(feet.y - drag.start.y);
            var segment = drag.segment;
            var ox;
            var oy;
            var fx;
            var fy;
            var nx;
            var ny;
            var degree;
            if (drag.kind === 'wall-body') {
                if (drag.degree1 >= 2 || drag.degree2 >= 2) {
                    if (drag.horizontal) {
                        dx = 0;
                    } else {
                        dy = 0;
                    }
                    moveEndpoints(next, [
                        { x: segment.x1, y: segment.y1 },
                        { x: segment.x2, y: segment.y2 }
                    ], dx, dy);
                } else {
                    next.forEach(function (item) {
                        if (item.id !== segment.id) {
                            return;
                        }
                        item.x1 = snap(segment.x1 + dx);
                        item.y1 = snap(segment.y1 + dy);
                        item.x2 = snap(segment.x2 + dx);
                        item.y2 = snap(segment.y2 + dy);
                    });
                }
                return true;
            }
            ox = drag.end === '1' ? segment.x1 : segment.x2;
            oy = drag.end === '1' ? segment.y1 : segment.y2;
            fx = drag.end === '1' ? segment.x2 : segment.x1;
            fy = drag.end === '1' ? segment.y2 : segment.y1;
            var swung = swungEnd(fx, fy, ox, oy, feet, drag.horizontal, segment);
            nx = swung.x;
            ny = swung.y;
            drag.rotated = swung.horizontal !== drag.horizontal;
            if (Math.hypot(nx - fx, ny - fy) < MIN_WALL - 0.001) {
                return false;
            }
            degree = drag.end === '1' ? drag.degree1 : drag.degree2;
            if (degree >= 2 && !drag.rotated) {
                pullSquare(next, ox, oy, nx, ny);
            } else {
                next.forEach(function (item) {
                    if (item.id !== segment.id) {
                        return;
                    }
                    if (drag.end === '1') {
                        item.x1 = nx;
                        item.y1 = ny;
                    } else {
                        item.x2 = nx;
                        item.y2 = ny;
                    }
                });
            }
            return true;
        }

        function previewWallDrag(feet) {
            var next;
            state.items = JSON.parse(JSON.stringify(drag.itemSnapshot));
            state.openings = JSON.parse(JSON.stringify(drag.openingSnapshot));
            state.room.segments = cloneSegments(drag.snapshot);
            next = cloneSegments(drag.snapshot);
            if (!applyWallDelta(next, drag, feet) || !segmentsOk(next)) {
                restoreRoomState(drag.goodState);
                renderPlan();
                return;
            }
            state.room.segments = next;
            syncFromSegments(false);
            if (!drag.rotated && drag.goodState.room.points && drag.goodState.room.points.length >= 4 && (!state.room.points || state.room.points.length < 4)) {
                restoreRoomState(drag.goodState);
                renderPlan();
                return;
            }
            drag.goodState = captureRoomState();
            renderPlan();
        }

        function swungEnd(pivotX, pivotY, originX, originY, feet, wasHorizontal, segment) {
            var along = wasHorizontal ? snap(feet.x) - snap(originX) : snap(feet.y) - snap(originY);
            var across = wasHorizontal ? snap(feet.y) - snap(originY) : snap(feet.x) - snap(originX);
            var length = Math.max(MIN_WALL, wasHorizontal ? Math.abs(segment.x2 - segment.x1) : Math.abs(segment.y2 - segment.y1));
            var delta;
            var resized;
            if (Math.abs(across) > Math.abs(along)) {
                if (wasHorizontal) {
                    return {
                        horizontal: false,
                        x: snap(pivotX),
                        y: snap(pivotY + (across < 0 ? -length : length))
                    };
                }
                return {
                    horizontal: true,
                    x: snap(pivotX + (across < 0 ? -length : length)),
                    y: snap(pivotY)
                };
            }
            delta = wasHorizontal ? snap(feet.x) - snap(pivotX) : snap(feet.y) - snap(pivotY);
            if (Math.abs(delta) < 0.001) {
                delta = wasHorizontal ? (originX >= pivotX ? length : -length) : (originY >= pivotY ? length : -length);
            }
            resized = Math.max(MIN_WALL, Math.abs(delta));
            if (wasHorizontal) {
                return {
                    horizontal: true,
                    x: snap(pivotX + (delta < 0 ? -resized : resized)),
                    y: snap(pivotY)
                };
            }
            return {
                horizontal: false,
                x: snap(pivotX),
                y: snap(pivotY + (delta < 0 ? -resized : resized))
            };
        }

        function snapDraggedWall(current, feet) {
            var segment = findSegment(current.id);
            var anchor;
            var x;
            var y;
            var nx;
            var ny;
            var degree;
            var next;
            var first;
            var second;
            var pick;
            var which;
            var dx;
            var dy;
            if (!segment) {
                return;
            }
            if (current.kind === 'wall-end') {
                var horizontalNow = Math.abs(segment.y1 - segment.y2) <= 0.001;
                var useEnd = current.end === '1' ? 1 : 2;
                if (feet) {
                    var distStart = Math.hypot(segment.x1 - feet.x, segment.y1 - feet.y);
                    var distEnd = Math.hypot(segment.x2 - feet.x, segment.y2 - feet.y);
                    useEnd = distStart <= distEnd ? 1 : 2;
                }
                x = useEnd === 1 ? segment.x1 : segment.x2;
                y = useEnd === 1 ? segment.y1 : segment.y2;
                anchor = nearestAnchor(x, y, segment.id, 0.75);
                if (!anchor) {
                    return;
                }
                if (horizontalNow) {
                    if (Math.abs(anchor.y - y) > 0.001) {
                        return;
                    }
                    nx = anchor.x;
                    ny = y;
                } else {
                    if (Math.abs(anchor.x - x) > 0.001) {
                        return;
                    }
                    nx = x;
                    ny = anchor.y;
                }
                degree = endpointDegree(state.room.segments, x, y);
                next = cloneSegments(state.room.segments);
                if (degree >= 2 && !current.rotated) {
                    pullSquare(next, x, y, nx, ny);
                } else {
                    next.forEach(function (item) {
                        if (item.id !== segment.id) {
                            return;
                        }
                        if (useEnd === 1) {
                            item.x1 = nx;
                            item.y1 = ny;
                        } else {
                            item.x2 = nx;
                            item.y2 = ny;
                        }
                    });
                }
                if (segmentsOk(next)) {
                    state.room.segments = next;
                }
                return;
            }
            if (current.degree1 >= 2 || current.degree2 >= 2) {
                return;
            }
            first = nearestAnchor(segment.x1, segment.y1, segment.id, 0.75);
            second = nearestAnchor(segment.x2, segment.y2, segment.id, 0.75);
            pick = null;
            which = 1;
            if (first && (!second || first.dist <= second.dist)) {
                pick = first;
            } else if (second) {
                pick = second;
                which = 2;
            }
            if (!pick) {
                return;
            }
            dx = pick.x - (which === 1 ? segment.x1 : segment.x2);
            dy = pick.y - (which === 1 ? segment.y1 : segment.y2);
            next = cloneSegments(state.room.segments);
            next.forEach(function (item) {
                if (item.id !== segment.id) {
                    return;
                }
                item.x1 = snap(item.x1 + dx);
                item.y1 = snap(item.y1 + dy);
                item.x2 = snap(item.x2 + dx);
                item.y2 = snap(item.y2 + dy);
            });
            if (segmentsOk(next)) {
                state.room.segments = next;
            }
        }

        function shiftItems(dx, dy) {
            state.items.forEach(function (item) {
                item.x = snap(item.x - dx);
                item.y = snap(item.y - dy);
            });
        }

        function knownWalls() {
            var ids = {};
            (state.room.segments || []).forEach(function (segment) {
                ids[segment.id] = true;
            });
            (state.room.edgeIds || []).forEach(function (id) {
                ids[id] = true;
            });
            return ids;
        }

        function dropUnknownOpenings() {
            var ids = knownWalls();
            state.openings = state.openings.filter(function (opening) {
                return ids[opening.wall];
            });
        }

        function mergeCollinear() {
            var points = state.room.points;
            var edgeIds = state.room.edgeIds;
            var guard = 0;
            var index;
            var count;
            var start;
            var middle;
            var end;
            var along;
            var across;
            var firstLength;
            while (guard < 24) {
                guard += 1;
                count = points.length;
                if (count < 4) {
                    return;
                }
                for (index = 0; index < count; index += 1) {
                    start = points[index];
                    middle = points[(index + 1) % count];
                    end = points[(index + 2) % count];
                    along = [middle[0] - start[0], middle[1] - start[1]];
                    across = [end[0] - middle[0], end[1] - middle[1]];
                    if (!edgeAxis(start, middle) || edgeAxis(start, middle) !== edgeAxis(middle, end)) {
                        continue;
                    }
                    if (along[0] * across[0] + along[1] * across[1] <= 0) {
                        continue;
                    }
                    firstLength = segmentLength(start, middle);
                    state.openings.forEach(function (opening) {
                        if (opening.wall === edgeIds[(index + 1) % count]) {
                            opening.wall = edgeIds[index];
                            opening.offset += firstLength;
                        }
                    });
                    points.splice((index + 1) % count, 1);
                    edgeIds.splice((index + 1) % count, 1);
                    break;
                }
                if (index === count) {
                    return;
                }
            }
        }

        function commitRoomPoints(points, edgeIds) {
            var problem = polygonProblem(points);
            var placed;
            if (problem) {
                setStatus(problem);
                return false;
            }
            placed = normalizeOrigin(points);
            problem = polygonProblem(placed.points);
            if (problem) {
                setStatus(problem);
                return false;
            }
            var previousCycle = {};
            (state.room.edgeIds || []).forEach(function (id) {
                previousCycle[id] = true;
            });
            var loose = (state.room.segments || []).filter(function (segment) {
                return !previousCycle[segment.id];
            }).map(function (segment) {
                return {
                    id: segment.id,
                    x1: snap(segment.x1 - placed.minX),
                    y1: snap(segment.y1 - placed.minY),
                    x2: snap(segment.x2 - placed.minX),
                    y2: snap(segment.y2 - placed.minY)
                };
            });
            shiftItems(placed.minX, placed.minY);
            state.room.points = placed.points;
            state.room.edgeIds = edgeIds.slice();
            state.room.kind = 'custom';
            state.room.shape = 'custom';
            state.room.width = placed.width;
            state.room.depth = placed.depth;
            state.room.cutW = 0;
            state.room.cutD = 0;
            state.room.segments = segmentsFromPolygon(placed.points, edgeIds).concat(loose);
            mergeCollinear();
            state.room.segments = segmentsFromPolygon(state.room.points, state.room.edgeIds).concat(loose);
            dropUnknownOpenings();
            normalizeOpenings();
            normalizeItems();
            dropMissingSelection();
            syncSizeInputs();
            syncShapeButtons();
            persist();
            renderPlan();
            renderSelection();
            return true;
        }

        function setWallLength(wallId, requested) {
            var segment;
            var nextLength;
            var current;
            var next;
            var nx;
            var ny;
            ensureCustom();
            segment = findSegment(wallId);
            nextLength = snap(requested);
            if (!segment || !isFinite(nextLength)) {
                return false;
            }
            orderSegment(segment);
            current = segmentSpan(segment);
            if (Math.abs(nextLength - current) < 0.001) {
                return true;
            }
            if (nextLength < MIN_WALL) {
                setStatus('Each wall needs to be at least ' + MIN_WALL + ' ft.');
                return false;
            }
            next = cloneSegments(state.room.segments);
            if (Math.abs(segment.y1 - segment.y2) <= 0.001) {
                nx = snap(segment.x1 + nextLength);
                ny = segment.y2;
            } else {
                nx = segment.x2;
                ny = snap(segment.y1 + nextLength);
            }
            if (endpointDegree(state.room.segments, segment.x2, segment.y2) >= 2) {
                pullSquare(next, segment.x2, segment.y2, nx, ny);
            } else {
                next.forEach(function (item) {
                    if (item.id !== wallId) {
                        return;
                    }
                    item.x2 = nx;
                    item.y2 = ny;
                });
            }
            if (!segmentsOk(next)) {
                setStatus('That length would cross another wall or leave the plan.');
                return false;
            }
            var beforeLength = captureRoomState();
            state.room.segments = next;
            syncFromSegments(true);
            if (beforeLength.room.points && beforeLength.room.points.length >= 4 && (!state.room.points || state.room.points.length < 4)) {
                restoreRoomState(beforeLength);
                syncSizeInputs();
                syncShapeButtons();
                renderPlan();
                renderSelection();
                setStatus('The room needs to stay at least ' + MIN_ROOM + ' ft on each side.');
                return false;
            }
            persist();
            renderPlan();
            renderSelection();
            setStatus('Wall set to ' + formatFeet(nextLength) + ' ft.');
            return true;
        }

        function sideUnit(a, b, outward) {
            var dx = b[0] - a[0];
            var dy = b[1] - a[1];
            var len = Math.hypot(dx, dy) || 1;
            var lx;
            var ly;
            var outside;
            dx /= len;
            dy /= len;
            lx = dy;
            ly = -dx;
            outside = !pointInside((a[0] + b[0]) / 2 + lx * 0.35, (a[1] + b[1]) / 2 + ly * 0.35);
            if (!outside) {
                lx = -lx;
                ly = -ly;
            }
            if (!outward) {
                lx = -lx;
                ly = -ly;
            }
            return [lx, ly];
        }

        function addJog(wallId, from, span, depth, outward) {
            var wall;
            var points;
            var edgeIds;
            var count;
            var startPoint;
            var endPoint;
            var length;
            var fromStart;
            var directionX;
            var directionY;
            var normal;
            var begin;
            var finish;
            var outerStart;
            var outerEnd;
            var mids = [];
            var ids = [];
            var stubAtStart;
            var stubAtEnd;
            ensureCustom();
            wall = findWall(wallId);
            from = snap(from);
            span = snap(span);
            depth = snap(Math.abs(depth));
            if (!wall) {
                return false;
            }
            if (span < MIN_WALL || depth < MIN_WALL) {
                setStatus('The extra wall needs at least ' + MIN_WALL + ' ft of width and depth.');
                return false;
            }
            if (from < -0.001 || from + span > wall.length + 0.001) {
                setStatus('That extra wall does not fit on this wall.');
                return false;
            }
            stubAtStart = from >= 0.05;
            stubAtEnd = wall.length - from - span >= 0.05;
            if ((stubAtStart && from < MIN_WALL) || (stubAtEnd && wall.length - from - span < MIN_WALL)) {
                setStatus('Leave at least ' + MIN_WALL + ' ft beside the extra wall, or start it at the corner.');
                return false;
            }
            points = copyPoints(state.room.points);
            edgeIds = state.room.edgeIds.slice();
            count = points.length;
            startPoint = points[wall.index];
            endPoint = points[(wall.index + 1) % count];
            length = segmentLength(startPoint, endPoint) || 1;
            fromStart = wall.reversed ? length - from - span : from;
            directionX = (endPoint[0] - startPoint[0]) / length;
            directionY = (endPoint[1] - startPoint[1]) / length;
            normal = sideUnit(startPoint, endPoint, outward);
            begin = [startPoint[0] + directionX * fromStart, startPoint[1] + directionY * fromStart];
            finish = [startPoint[0] + directionX * (fromStart + span), startPoint[1] + directionY * (fromStart + span)];
            outerStart = [begin[0] + normal[0] * depth, begin[1] + normal[1] * depth];
            outerEnd = [finish[0] + normal[0] * depth, finish[1] + normal[1] * depth];
            if (stubAtStart) {
                mids.push(begin);
                ids.push(edgeIds[wall.index]);
            }
            mids.push(outerStart);
            ids.push(uid('e'));
            mids.push(outerEnd);
            ids.push(uid('e'));
            if (stubAtEnd) {
                mids.push(finish);
                ids.push(uid('e'));
            }
            ids.push(uid('e'));
            var previousOpenings = state.openings.map(function (opening) {
                return {
                    id: opening.id,
                    wall: opening.wall,
                    offset: opening.offset,
                    width: opening.width,
                    hinge: opening.hinge,
                    swing: opening.swing
                };
            });
            state.openings = state.openings.filter(function (opening) {
                var openingEnd;
                if (opening.wall !== wall.id) {
                    return true;
                }
                openingEnd = opening.offset + opening.width;
                if (stubAtStart && openingEnd <= from + 0.01) {
                    return true;
                }
                if (stubAtEnd && opening.offset >= from + span - 0.01) {
                    opening.wall = ids[ids.length - 1];
                    opening.offset = snap(opening.offset - from - span);
                    return true;
                }
                return false;
            });
            points.splice.apply(points, [wall.index + 1, 0].concat(mids));
            edgeIds.splice.apply(edgeIds, [wall.index, 1].concat(ids));
            if (!commitRoomPoints(points, edgeIds)) {
                state.openings = previousOpenings;
                return false;
            }
            setStatus(outward ? 'Added a wall that sticks out.' : 'Cut a notch into the wall.');
            return true;
        }

        function jogCapIndex(wall) {
            var points;
            var count;
            var index;
            var previous;
            var after;
            var legOut;
            var legBack;
            if (!wall || state.room.kind !== 'custom' || !state.room.points) {
                return -1;
            }
            points = state.room.points;
            count = points.length;
            index = wall.index;
            previous = (index + count - 1) % count;
            after = (index + 2) % count;
            legOut = segmentLength(points[previous], points[index]);
            legBack = segmentLength(points[(index + 1) % count], points[after]);
            if (Math.abs(legOut - legBack) > 0.05 || legOut < MIN_WALL - 0.001) {
                return -1;
            }
            if (!edgeAxis(points[index], points[(index + 1) % count]) || edgeAxis(points[index], points[(index + 1) % count]) !== edgeAxis(points[previous], points[after])) {
                return -1;
            }
            if (edgeAxis(points[previous], points[index]) === edgeAxis(points[index], points[(index + 1) % count])) {
                return -1;
            }
            return index;
        }

        function removeJog(wallId) {
            var wall = findWall(wallId);
            var index = jogCapIndex(wall);
            var points;
            var edgeIds;
            var drop;
            if (index < 0) {
                return false;
            }
            points = [];
            edgeIds = [];
            drop = {};
            drop[index] = true;
            drop[(index + 1) % state.room.points.length] = true;
            state.room.points.forEach(function (point, pointIndex) {
                if (!drop[pointIndex]) {
                    points.push([point[0], point[1]]);
                    edgeIds.push(state.room.edgeIds[pointIndex]);
                }
            });
            if (!commitRoomPoints(points, edgeIds)) {
                return false;
            }
            state.selected = null;
            renderSelection();
            setStatus('Removed the extra wall.');
            return true;
        }

        function setRoomSize(width, depth) {
            var before = state.items.length;
            var room = state.room;
            var nextWidth = Math.min(MAX_ROOM, Math.max(minRoomSize(), snap(width)));
            var nextDepth = Math.min(MAX_ROOM, Math.max(minRoomSize(), snap(depth)));
            var scaleX;
            var scaleY;
            var scaled;
            if (room.kind === 'custom') {
                if (!room.segments || !room.segments.length || room.width <= 0 || room.depth <= 0) {
                    syncSizeInputs();
                    setStatus('Close the walls into a room before resizing the whole plan.');
                    return;
                }
                scaleX = nextWidth / room.width;
                scaleY = nextDepth / room.depth;
                scaled = cloneSegments(room.segments);
                scaled.forEach(function (segment) {
                    segment.x1 = snap(segment.x1 * scaleX);
                    segment.y1 = snap(segment.y1 * scaleY);
                    segment.x2 = snap(segment.x2 * scaleX);
                    segment.y2 = snap(segment.y2 * scaleY);
                });
                if (!segmentsOk(scaled)) {
                    syncSizeInputs();
                    setStatus('That size would break the walls.');
                    return;
                }
                room.segments = scaled;
                syncFromSegments(true);
                persist();
                renderPlan();
                renderSelection();
                if (state.items.length < before) {
                    setStatus('Some pieces no longer fit and were removed.');
                } else {
                    setStatus('');
                }
                return;
            }
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
            if (template.id === 'custom') {
                ensureCustom();
                syncSizeInputs();
                syncShapeButtons();
                persist();
                renderPlan();
                renderSelection();
                setStatus('Drag a 2 ft or 6 ft wall onto the plan. Drop its ends on corners to change the room.');
                return;
            }
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
            if (state.selected && state.selected.type === 'wall' && !findWall(state.selected.id)) {
                state.selected = null;
            }
        }

        function syncShapeButtons() {
            app.querySelectorAll('[data-shape]').forEach(function (button) {
                button.classList.toggle('is-active', button.getAttribute('data-shape') === state.room.shape);
            });
        }

        function syncDoorTool() {
            var door = state.tool === 'door';
            var wall = state.tool === 'wall';
            doorButton.classList.toggle('is-active', door);
            doorButton.setAttribute('aria-pressed', door ? 'true' : 'false');
            if (customWallButton) {
                customWallButton.classList.toggle('is-active', wall);
                customWallButton.setAttribute('aria-pressed', wall ? 'true' : 'false');
            }
            if (wallNote) {
                wallNote.hidden = !wall;
            }
            stage.classList.toggle('is-door-tool', door);
            stage.classList.toggle('is-wall-tool', wall);
        }

        function setStatus(message) {
            statusEl.hidden = !message;
            statusEl.textContent = message || '';
            hintEl.hidden = !!message || state.tool === 'wall';
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
            var padX = 2.3;
            var padTop = 2.35;
            var padBottom = 1.25;
            var spanWidth = Math.max(room.spanW || room.width || 0, 12);
            var spanDepth = Math.max(room.spanD || room.depth || 0, 8);
            var viewWidth = spanWidth + padX * 2;
            var viewHeight = spanDepth + padTop + padBottom;
            var points = plan.polygon.map(function (point) {
                return num(point[0]) + ',' + num(point[1]);
            }).join(' ');
            var walls = allWalls();
            var shapeName = room.kind === 'custom' ? 'Custom' : shapeTemplate(room.shape).label;
            var title = room.kind === 'custom' && (!room.points || room.points.length < 4)
                ? 'Custom · connect the wall ends'
                : shapeName + ' · ' + formatFeet(room.width) + ' ft × ' + formatFeet(room.depth) + ' ft';

            svg.setAttribute('viewBox', [-padX, -padTop, viewWidth, viewHeight].join(' '));
            if (isFullscreen(root)) {
                svg.style.aspectRatio = '';
            } else {
                svg.style.aspectRatio = viewWidth + ' / ' + viewHeight;
            }

            var markup = '';
            if (points) {
                markup += '<defs><clipPath id="' + clipId + '"><polygon points="' + points + '"></polygon></clipPath></defs>';
                markup += '<polygon class="room-builder__floor" data-kind="floor" points="' + points + '"></polygon>';
                markup += '<g class="room-builder__grid" clip-path="url(#' + clipId + ')" pointer-events="none">' + gridMarkup() + '</g>';
            }
            markup += itemsMarkup(true);
            markup += wallsMarkup(walls);
            markup += wallHitMarkup(walls);
            markup += itemsMarkup(false);
            markup += openingsMarkup();
            markup += selectionMarkup();
            markup += wallLabelMarkup(walls);
            markup += wallHandleMarkup();
            markup += rotateHandleMarkup();
            markup += deleteHandleMarkup();
            markup += '<text pointer-events="none" text-anchor="start" font-size="0.42" x="0" y="-1.75">' + title + '</text>';
            svg.innerHTML = markup;
        }

        function gridMarkup() {
            var lines = '';
            var x;
            var y;
            var gridWidth = state.room.spanW || state.room.width;
            var gridDepth = state.room.spanD || state.room.depth;
            for (x = 1; x < gridWidth; x += 1) {
                lines += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + num(gridDepth) + '"></line>';
            }
            for (y = 1; y < gridDepth; y += 1) {
                lines += '<line x1="0" y1="' + y + '" x2="' + num(gridWidth) + '" y2="' + y + '"></line>';
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

        function wallHitMarkup(walls) {
            return walls.map(function (wall) {
                var selected = state.selected && state.selected.type === 'wall' && state.selected.id === wall.id;
                return '<line class="room-builder__wall-hit' + (selected ? ' is-selected' : '') + '" data-kind="wall" data-id="' + wall.id + '" x1="' + num(wall.x1) + '" y1="' + num(wall.y1) + '" x2="' + num(wall.x2) + '" y2="' + num(wall.y2) + '"></line>';
            }).join('');
        }

        function wallOutward(wall) {
            var midX = (wall.x1 + wall.x2) / 2;
            var midY = (wall.y1 + wall.y2) / 2;
            var dx = wall.length ? (wall.x2 - wall.x1) / wall.length : 1;
            var dy = wall.length ? (wall.y2 - wall.y1) / wall.length : 0;
            var nx = dy;
            var ny = -dx;
            if (pointInside(midX + nx * 0.4, midY + ny * 0.4)) {
                nx = -nx;
                ny = -ny;
            }
            return { x: nx, y: ny };
        }

        function wallHandleMarkup() {
            var wall;
            var cursor;
            if (!state.selected || state.selected.type !== 'wall') {
                return '';
            }
            wall = findWall(state.selected.id);
            if (!wall) {
                return '';
            }
            cursor = 'grab';
            return '<circle class="room-builder__wall-end" data-kind="wall-end" data-end="1" data-id="' + wall.id + '" cx="' + num(wall.x1) + '" cy="' + num(wall.y1) + '" r="0.32" style="cursor:' + cursor + '"></circle>' +
                '<circle class="room-builder__wall-end" data-kind="wall-end" data-end="2" data-id="' + wall.id + '" cx="' + num(wall.x2) + '" cy="' + num(wall.y2) + '" r="0.32" style="cursor:' + cursor + '"></circle>';
        }

        function wallLabelMarkup(walls) {
            return walls.map(function (wall) {
                var outward = wallOutward(wall);
                var x = (wall.x1 + wall.x2) / 2 + outward.x * 1.05;
                var y = (wall.y1 + wall.y2) / 2 + outward.y * 1.05;
                return '<text class="room-builder__wall-label" data-kind="wall" data-id="' + wall.id + '" text-anchor="middle" dominant-baseline="middle" font-size="0.42" x="' + num(x) + '" y="' + num(y) + '">' + formatFeet(wall.length) + ' ft</text>';
            }).join('');
        }

        function itemsMarkup(rugs) {
            return state.items.filter(function (item) {
                var entry = catalogItem(item.catalogId);
                var isRug = entry.kind === 'rug';
                return rugs ? isRug : !isRug;
            }).map(function (item) {
                var entry = catalogItem(item.catalogId);
                var selected = state.selected && state.selected.type === 'item' && state.selected.id === item.id;
                var markup = '<g data-kind="item" data-id="' + item.id + '" transform="' + itemTransform(item, entry) + '">';
                markup += '<title>' + entry.name + '</title>';
                markup += pieceArt(entry, selected);
                if (selected) {
                    markup += '<g class="room-builder__item-size" pointer-events="none">';
                    markup += '<text class="room-builder__item-width" text-anchor="middle" dominant-baseline="hanging" font-size="0.4" x="' + num(entry.width / 2) + '" y="' + num(entry.depth + 0.18) + '">' + formatFeet(entry.width) + ' ft</text>';
                    markup += '<text class="room-builder__item-depth" text-anchor="middle" font-size="0.4" transform="translate(' + num(entry.width + 0.28) + ' ' + num(entry.depth / 2) + ') rotate(-90)">' + formatFeet(entry.depth) + ' ft</text>';
                    markup += '</g>';
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

        function doorSwing(opening, wall) {
            var inward = inwardNormal(wall);
            if (opening.swing === 'out') {
                return { x: -inward.x, y: -inward.y };
            }
            return inward;
        }

        function doorGraphic(opening, wall) {
            var alongX = wall.horizontal ? 1 : 0;
            var alongY = wall.horizontal ? 0 : 1;
            var normal = doorSwing(opening, wall);
            var hingeAtEnd = opening.hinge === 'end';
            var hingeDist = hingeAtEnd ? opening.offset + opening.width : opening.offset;
            var closedDist = hingeAtEnd ? opening.offset : opening.offset + opening.width;
            var hingeX = wall.x1 + alongX * hingeDist;
            var hingeY = wall.y1 + alongY * hingeDist;
            var closedX = wall.x1 + alongX * closedDist;
            var closedY = wall.y1 + alongY * closedDist;
            var openX = hingeX + normal.x * opening.width;
            var openY = hingeY + normal.y * opening.width;
            var dirX = closedX - hingeX;
            var dirY = closedY - hingeY;
            var cross = dirX * normal.y - dirY * normal.x;
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
            return '<rect class="room-builder__selection" pointer-events="none" fill="none" stroke="#9a3412" stroke-width="0.05" stroke-dasharray="0.16 0.1" x="' + num(item.x - 0.1) + '" y="' + num(item.y - 0.1) + '" width="' + num(size.w + 0.2) + '" height="' + num(size.d + 0.2) + '"></rect>';
        }

        function rotateHandleMarkup() {
            var item;
            var point;
            if (!state.selected || state.selected.type !== 'item') {
                return '';
            }
            item = findItem(state.selected.id);
            if (!item) {
                return '';
            }
            point = rotateHandlePoint(item);
            return '<g data-kind="rotate" data-id="' + item.id + '" transform="translate(' + num(point.x) + ' ' + num(point.y) + ')">' +
                '<circle class="room-builder__rotate" cx="0" cy="0" r="0.36"></circle>' +
                '<path pointer-events="none" fill="none" stroke="#9a3412" stroke-width="0.07" d="M -0.16 0.05 A 0.18 0.18 0 1 1 0.12 -0.12"></path>' +
                '<polygon pointer-events="none" fill="#9a3412" points="0.05,-0.24 0.08,-0.02 0.26,-0.1"></polygon>' +
                '</g>';
        }

        function deleteHandleMarkup() {
            var item;
            var size;
            var opening;
            var wall;
            var hit;
            if (!state.selected) {
                return '';
            }
            if (state.selected.type === 'item') {
                item = findItem(state.selected.id);
                if (!item) {
                    return '';
                }
                size = footprint(item);
                return deleteButton(item.x + size.w + 0.08, item.y - 0.08, item.id);
            }
            if (state.selected.type === 'opening') {
                opening = findOpening(state.selected.id);
                wall = opening && findWall(opening.wall);
                if (!opening || !wall) {
                    return '';
                }
                hit = openingHit(opening, wall, inwardNormal(wall));
                return deleteButton(hit.x + hit.w, hit.y, opening.id);
            }
            return '';
        }

        function deleteButton(x, y, id) {
            return '<g class="room-builder__remove" data-kind="remove" data-id="' + id + '" transform="translate(' + num(x) + ' ' + num(y) + ')">' +
                '<circle r="0.34"></circle>' +
                '<path pointer-events="none" fill="none" stroke="#9a3412" stroke-width="0.08" stroke-linecap="round" d="M -0.12 -0.12 L 0.12 0.12 M 0.12 -0.12 L -0.12 0.12"></path>' +
                '</g>';
        }

        function jogField(text, value) {
            var label = document.createElement('label');
            var input = document.createElement('input');
            label.className = 'room-builder__field';
            label.appendChild(document.createTextNode(text));
            input.type = 'number';
            input.min = '0';
            input.max = String(MAX_ROOM);
            input.step = '0.5';
            input.value = String(value);
            label.appendChild(input);
            label.appendChild(document.createTextNode('ft'));
            return { label: label, input: input };
        }

        function renderWallSelection() {
            var wall = findWall(state.selected.id);
            var label;
            var note;
            var lengthLabel;
            var lengthInput;
            if (!wall) {
                state.selected = null;
                return;
            }
            label = document.createElement('p');
            label.textContent = 'Wall · ' + formatFeet(wall.length) + ' ft';
            note = document.createElement('p');
            note.textContent = 'Drag the wall to move it. Drag a handle to swing that end and turn the wall.';
            lengthLabel = document.createElement('label');
            lengthLabel.className = 'room-builder__field';
            lengthLabel.appendChild(document.createTextNode('Length'));
            lengthInput = document.createElement('input');
            lengthInput.type = 'number';
            lengthInput.min = String(MIN_WALL);
            lengthInput.max = String(MAX_ROOM);
            lengthInput.step = '0.5';
            lengthInput.value = String(snap(wall.length));
            lengthLabel.appendChild(lengthInput);
            lengthLabel.appendChild(document.createTextNode('ft'));
            lengthInput.addEventListener('change', function () {
                var current;
                if (!setWallLength(wall.id, parseFloat(lengthInput.value))) {
                    current = findWall(wall.id);
                    lengthInput.value = current ? String(snap(current.length)) : lengthInput.value;
                }
            });
            lengthInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    lengthInput.blur();
                }
            });
            selectionEl.appendChild(label);
            selectionEl.appendChild(note);
            selectionEl.appendChild(lengthLabel);
            selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
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
                var label = document.createElement('p');
                var note = document.createElement('p');
                label.textContent = entry.name + ' · ' + formatFeet(entry.width) + ' × ' + formatFeet(entry.depth) + ' ft · ' + normalizeRotation(item.rotation) + '°';
                note.textContent = 'Drag the arrow around the piece to turn it to any angle. Turn 90° jumps a quarter turn.';
                selectionEl.appendChild(label);
                selectionEl.appendChild(note);
                selectionEl.appendChild(actionButton('Turn 90°', rotateSelected));
                selectionEl.appendChild(actionButton('Delete', deleteSelected, true));
                return;
            }
            if (state.selected.type === 'wall') {
                renderWallSelection();
                return;
            }
            var opening = findOpening(state.selected.id);
            if (!opening || !findWall(opening.wall)) {
                state.selected = null;
                return;
            }
            var doorLabel = document.createElement('p');
            doorLabel.textContent = 'Door · ' + formatFeet(opening.width) + ' ft';
            var widthLabel = document.createElement('label');
            widthLabel.className = 'room-builder__field';
            widthLabel.appendChild(document.createTextNode('Length'));
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
            widthControl.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    widthControl.blur();
                }
            });
            selectionEl.appendChild(doorLabel);
            selectionEl.appendChild(widthLabel);
            selectionEl.appendChild(actionButton('Flip hinge', function () {
                var current = findOpening(opening.id);
                if (!current) {
                    return;
                }
                current.hinge = current.hinge === 'end' ? 'start' : 'end';
                persist();
                renderPlan();
                renderSelection();
                setStatus('The door now swings from the other end.');
            }));
            selectionEl.appendChild(actionButton(opening.swing === 'out' ? 'Swing in' : 'Swing out', function () {
                var current = findOpening(opening.id);
                if (!current) {
                    return;
                }
                current.swing = current.swing === 'out' ? 'in' : 'out';
                persist();
                renderPlan();
                renderSelection();
                setStatus(current.swing === 'out' ? 'The door swings out of the room.' : 'The door swings into the room.');
            }));
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
                setStatus('That length overlaps another doorway.');
                return;
            }
            opening.width = width;
            opening.offset = offset;
            input.value = String(width);
            persist();
            renderPlan();
            renderSelection();
            setStatus('');
        }

        function turnItem(item, rotation, centerX, centerY, nudge) {
            var previousRotation = item.rotation;
            var previousX = item.x;
            var previousY = item.y;
            var before = footprint(item);
            var cx = centerX == null ? item.x + before.w / 2 : centerX;
            var cy = centerY == null ? item.y + before.d / 2 : centerY;
            var after;
            item.rotation = normalizeRotation(rotation);
            after = footprint(item);
            item.x = Math.round((cx - after.w / 2) * 100) / 100;
            item.y = Math.round((cy - after.d / 2) * 100) / 100;
            if (!itemInside(item) && !(nudge && nudgeInside(item))) {
                item.rotation = previousRotation;
                item.x = previousX;
                item.y = previousY;
                return false;
            }
            return true;
        }

        function rotateSelected() {
            var item = state.selected && state.selected.type === 'item' ? findItem(state.selected.id) : null;
            if (!item) {
                return;
            }
            var before = footprint(item);
            var centerX = item.x + before.w / 2;
            var centerY = item.y + before.d / 2;
            var after;
            if (!turnItem(item, item.rotation + 90, null, null, true)) {
                setStatus(catalogItem(item.catalogId).name + ' does not fit that way.');
                return;
            }
            after = footprint(item);
            if (Math.abs(item.x + after.w / 2 - centerX) > 0.2 || Math.abs(item.y + after.d / 2 - centerY) > 0.2) {
                setStatus('Turned 90° and shifted so it stays inside the room.');
            } else {
                setStatus('Turned 90°.');
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
            } else if (state.selected.type === 'wall') {
                ensureCustom();
                var removedId = state.selected.id;
                state.room.segments = (state.room.segments || []).filter(function (segment) {
                    return segment.id !== removedId;
                });
                state.openings = state.openings.filter(function (opening) {
                    return opening.wall !== removedId;
                });
                state.selected = null;
                syncFromSegments(true);
                persist();
                renderPlan();
                renderSelection();
                setStatus(state.room.points && state.room.points.length >= 4 ? 'Wall removed.' : 'Connect the open ends to close the room.');
                return;
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
            allWalls().forEach(function (wall) {
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
                width: DOOR_WIDTH,
                hinge: 'start',
                swing: 'in'
            };
            state.openings.push(opening);
            state.selected = { type: 'opening', id: opening.id };
            state.tool = 'select';
            syncDoorTool();
            persist();
            renderPlan();
            renderSelection();
            setStatus('Door added. Set its length, flip the hinge, or change the swing.');
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

            if (kind === 'remove') {
                if (findItem(id)) {
                    state.selected = { type: 'item', id: id };
                } else if (findOpening(id)) {
                    state.selected = { type: 'opening', id: id };
                }
                deleteSelected();
                event.preventDefault();
                return;
            }

            if (kind === 'rotate') {
                var turning = findItem(id);
                var turnSize;
                if (!turning) {
                    return;
                }
                state.selected = { type: 'item', id: id };
                renderSelection();
                turnSize = footprint(turning);
                drag = {
                    kind: 'rotate',
                    id: id,
                    pointerId: event.pointerId,
                    centerX: turning.x + turnSize.w / 2,
                    centerY: turning.y + turnSize.d / 2,
                    startAngle: Math.atan2(feet.y - (turning.y + turnSize.d / 2), feet.x - (turning.x + turnSize.w / 2)),
                    originRotation: turning.rotation,
                    originX: turning.x,
                    originY: turning.y,
                    goodRotation: turning.rotation,
                    goodX: turning.x,
                    goodY: turning.y,
                    moved: false
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

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

            if (state.tool === 'wall' && kind !== 'item' && kind !== 'opening') {
                drag = {
                    kind: 'draw-wall',
                    pointerId: event.pointerId,
                    start: snapDrawPoint(feet.x, feet.y),
                    moved: false
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            if (kind === 'wall' || kind === 'wall-end') {
                var wallSegment;
                ensureCustom();
                wallSegment = findSegment(id);
                if (!wallSegment) {
                    return;
                }
                state.selected = { type: 'wall', id: id };
                renderSelection();
                renderPlan();
                drag = {
                    kind: kind === 'wall-end' ? 'wall-end' : 'wall-body',
                    id: id,
                    end: target.getAttribute('data-end') || '2',
                    pointerId: event.pointerId,
                    start: feet,
                    segment: {
                        id: wallSegment.id,
                        x1: wallSegment.x1,
                        y1: wallSegment.y1,
                        x2: wallSegment.x2,
                        y2: wallSegment.y2
                    },
                    horizontal: Math.abs(wallSegment.y1 - wallSegment.y2) <= 0.001,
                    degree1: endpointDegree(state.room.segments, wallSegment.x1, wallSegment.y1),
                    degree2: endpointDegree(state.room.segments, wallSegment.x2, wallSegment.y2),
                    snapshot: cloneSegments(state.room.segments),
                    itemSnapshot: JSON.parse(JSON.stringify(state.items)),
                    openingSnapshot: JSON.parse(JSON.stringify(state.openings)),
                    goodState: captureRoomState(),
                    rotated: false,
                    moved: false
                };
                capturePointer(event);
                event.preventDefault();
                return;
            }

            state.selected = null;
            renderSelection();
            renderPlan();
        }

        function clampInside(item, from, to, fixed, horizontal) {
            var best = from;
            var lo = 0;
            var hi = 1;
            var step;
            var candidate;
            item.x = horizontal ? to : fixed;
            item.y = horizontal ? fixed : to;
            if (itemInside(item)) {
                return to;
            }
            for (step = 0; step < 12; step += 1) {
                candidate = from + (to - from) * ((lo + hi) / 2);
                item.x = horizontal ? candidate : fixed;
                item.y = horizontal ? fixed : candidate;
                if (itemInside(item)) {
                    best = candidate;
                    lo = (lo + hi) / 2;
                } else {
                    hi = (lo + hi) / 2;
                }
            }
            item.x = horizontal ? best : fixed;
            item.y = horizontal ? fixed : best;
            return best;
        }

        function slideItem(item, x, y) {
            var lastX = drag.lastX;
            var lastY = drag.lastY;
            item.x = x;
            item.y = y;
            if (itemInside(item)) {
                drag.lastX = item.x;
                drag.lastY = item.y;
                return;
            }
            item.x = clampInside(item, lastX, x, lastY, true);
            item.y = lastY;
            item.y = clampInside(item, lastY, y, item.x, false);
            drag.lastX = item.x;
            drag.lastY = item.y;
        }

        function syncDraggedItem(item) {
            var entry = catalogItem(item.catalogId);
            var node = svg.querySelector('[data-kind="item"][data-id="' + item.id + '"]');
            var box = svg.querySelector('.room-builder__selection');
            var handle = svg.querySelector('[data-kind="rotate"]');
            var size = footprint(item);
            var point = rotateHandlePoint(item);
            if (!node || !box || !handle) {
                renderPlan();
                return;
            }
            node.setAttribute('transform', itemTransform(item, entry));
            box.setAttribute('x', num(item.x - 0.1));
            box.setAttribute('y', num(item.y - 0.1));
            box.setAttribute('width', num(size.w + 0.2));
            box.setAttribute('height', num(size.d + 0.2));
            handle.setAttribute('transform', 'translate(' + num(point.x) + ' ' + num(point.y) + ')');
            var remove = svg.querySelector('[data-kind="remove"]');
            if (remove) {
                remove.setAttribute('transform', 'translate(' + num(item.x + size.w + 0.08) + ' ' + num(item.y - 0.08) + ')');
            }
        }

        function onPlanPointerMove(event) {
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            if (drag.kind === 'draw-wall') {
                var drawEnd = drawnEnd(drag.start, clientToFeet(event.clientX, event.clientY));
                var drawLength = Math.abs(drawEnd.x - drag.start.x) + Math.abs(drawEnd.y - drag.start.y);
                drag.moved = drawLength >= 0.25;
                showDrawPreview(drag.start, drawEnd, drawLength);
                return;
            }
            if (drag.kind === 'rotate') {
                var spinning = findItem(drag.id);
                var spinFeet = clientToFeet(event.clientX, event.clientY);
                var spinAngle;
                var spinDelta;
                var spinNext;
                if (!spinning) {
                    return;
                }
                spinAngle = Math.atan2(spinFeet.y - drag.centerY, spinFeet.x - drag.centerX);
                spinDelta = spinAngle - drag.startAngle;
                while (spinDelta > Math.PI) {
                    spinDelta -= Math.PI * 2;
                }
                while (spinDelta < -Math.PI) {
                    spinDelta += Math.PI * 2;
                }
                if (Math.abs(spinDelta) > 0.03) {
                    drag.moved = true;
                }
                spinNext = drag.originRotation + spinDelta * (180 / Math.PI);
                spinning.rotation = drag.originRotation;
                spinning.x = drag.originX;
                spinning.y = drag.originY;
                if (turnItem(spinning, spinNext, drag.centerX, drag.centerY)) {
                    drag.goodRotation = spinning.rotation;
                    drag.goodX = spinning.x;
                    drag.goodY = spinning.y;
                } else {
                    spinning.rotation = drag.goodRotation;
                    spinning.x = drag.goodX;
                    spinning.y = drag.goodY;
                }
                syncDraggedItem(spinning);
                return;
            }
            if (drag.kind === 'item') {
                var item = findItem(drag.id);
                var feet = clientToFeet(event.clientX, event.clientY);
                var rawX;
                var rawY;
                if (!item) {
                    return;
                }
                rawX = Math.round((drag.originX + (feet.x - drag.start.x)) * 100) / 100;
                rawY = Math.round((drag.originY + (feet.y - drag.start.y)) * 100) / 100;
                slideItem(item, rawX, rawY);
                syncDraggedItem(item);
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
                return;
            }
            if (drag.kind === 'wall-body' || drag.kind === 'wall-end') {
                var wallFeet = clientToFeet(event.clientX, event.clientY);
                if (Math.abs(wallFeet.x - drag.start.x) > 0.2 || Math.abs(wallFeet.y - drag.start.y) > 0.2) {
                    drag.moved = true;
                }
                previewWallDrag(wallFeet);
            }
        }

        function onPlanPointerUp(event) {
            if (!drag || drag.pointerId !== event.pointerId) {
                return;
            }
            var current = drag;
            drag = null;
            if (current.kind === 'draw-wall') {
                var finished = drawnEnd(current.start, clientToFeet(event.clientX, event.clientY));
                var finishedLength = Math.abs(finished.x - current.start.x) + Math.abs(finished.y - current.start.y);
                clearDrawPreview();
                if (finishedLength >= MIN_WALL - 0.001) {
                    placeDrawnWall(current.start, finished);
                }
                return;
            }
            if (current.kind === 'place-door') {
                var moved = Math.abs(event.clientX - current.startX) > 5 || Math.abs(event.clientY - current.startY) > 5;
                if (!moved) {
                    placeDoor(clientToFeet(event.clientX, event.clientY));
                }
                return;
            }
            if (current.kind === 'wall-body' || current.kind === 'wall-end') {
                if (current.moved) {
                    var closedBeforeSnap = state.room.points && state.room.points.length >= 4;
                    var beforeSnap = captureRoomState();
                    snapDraggedWall(current, clientToFeet(event.clientX, event.clientY));
                    syncFromSegments(true);
                    if (closedBeforeSnap && (!state.room.points || state.room.points.length < 4)) {
                        restoreRoomState(beforeSnap);
                    }
                    persist();
                    renderPlan();
                    renderSelection();
                    if (!(state.room.points && state.room.points.length >= 4)) {
                        setStatus('Connect the open ends to close the room.');
                    } else if (JSON.stringify(state.room.segments) === JSON.stringify(current.snapshot)) {
                        setStatus('');
                    } else {
                        setStatus('Room updated.');
                    }
                }
                return;
            }
            if (current.kind === 'rotate') {
                var turned = findItem(current.id);
                if (turned && !current.moved && !turnItem(turned, current.originRotation + 90, current.centerX, current.centerY, true)) {
                    setStatus(catalogItem(turned.catalogId).name + ' does not fit that way.');
                } else if (turned && turned.rotation !== current.originRotation) {
                    var turnedSize = footprint(turned);
                    var shifted = Math.abs(turned.x + turnedSize.w / 2 - current.centerX) > 0.2 || Math.abs(turned.y + turnedSize.d / 2 - current.centerY) > 0.2;
                    if (current.moved) {
                        setStatus('Turned to ' + turned.rotation + '°.' + (shifted ? ' Shifted so it stays inside the room.' : ''));
                    } else {
                        setStatus(shifted ? 'Turned 90° and shifted so it stays inside the room.' : 'Turned 90°.');
                    }
                } else {
                    setStatus('');
                }
                persist();
                renderPlan();
                renderSelection();
                return;
            }
            if (current.kind === 'item') {
                var dropped = findItem(current.id);
                var freeX;
                var freeY;
                if (dropped) {
                    freeX = dropped.x;
                    freeY = dropped.y;
                    dropped.x = Math.round(dropped.x * 4) / 4;
                    dropped.y = Math.round(dropped.y * 4) / 4;
                    if (!itemInside(dropped)) {
                        dropped.x = freeX;
                        dropped.y = freeY;
                    }
                }
                persist();
                renderPlan();
                renderSelection();
                return;
            }
            if (current.kind === 'opening') {
                persist();
            }
        }

        function onWallPointerDown(event) {
            if (event.button !== 0) {
                return;
            }
            drag = {
                kind: 'wall-piece',
                length: Number(event.currentTarget.getAttribute('data-wall-length')),
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                moved: false,
                vertical: false
            };
            try {
                event.currentTarget.setPointerCapture(event.pointerId);
            } catch (error) {
                return;
            }
            event.preventDefault();
        }

        function onWallPointerMove(event) {
            if (!drag || drag.kind !== 'wall-piece' || drag.pointerId !== event.pointerId) {
                return;
            }
            if (Math.abs(event.clientX - drag.startX) > 5 || Math.abs(event.clientY - drag.startY) > 5) {
                drag.moved = true;
                drag.vertical = Math.abs(event.clientY - drag.startY) > Math.abs(event.clientX - drag.startX);
                ensureGhost(drag.length + ' ft wall', event.clientX, event.clientY);
            }
        }

        function onWallPointerUp(event) {
            if (!drag || drag.kind !== 'wall-piece' || drag.pointerId !== event.pointerId) {
                return;
            }
            var current = drag;
            var bounds;
            var overPlan;
            drag = null;
            removeGhost();
            if (!current.moved) {
                placeWallPiece(current.length, false, null);
                return;
            }
            bounds = stage.getBoundingClientRect();
            overPlan = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
            if (!overPlan) {
                return;
            }
            placeWallPiece(current.length, current.vertical, clientToFeet(event.clientX, event.clientY));
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
            if (event.key === 'Escape' && (state.tool === 'door' || state.tool === 'wall')) {
                state.tool = 'select';
                syncDoorTool();
                setStatus('');
                event.preventDefault();
                return;
            }
            if ((event.key === 'r' || event.key === 'R') && state.selected && state.selected.type === 'item') {
                rotateSelected();
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
