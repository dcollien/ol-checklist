var $content = $('#content');
var update, save, removeHandler, makeChangeHandler, addHandler;
var newItem;
var checklist;

uuid = function() {
    var _uuid = function(ph) {
        if (ph) {
            return (ph ^ Math.random() * 16 >> ph/4).toString(16);
        } else {
            return (
                    [1e7] + // 10000000 +
                    -1e3  + // -1000 +
                    -4e3  + // -4000 +
                    -8e3  + // -80000000 +
                    -1e11   // -100000000000,
                ).replace(
                    /[018]/g, // zeroes, ones, and eights with
                    _uuid     // random hex digits
            );
        }
    };

    return _uuid();
};

update = function() {
    $content.empty();
    $.each(checklist, function(i, item) {
        var $input = $('<input>', {'type': 'text', 'class': 'item-text'}).val(item.text);
        var $remove = $('<button>', {'class': 'btn btn-default btn-flat btn-remove'}).html('&times;');
        var $item = $('<div>', {'class': 'checkbox'})
            .append(
                $('<label>')
                    .append(
                        $('<input>', {
                            'type': 'checkbox',
                            'id': item.id
                        }).prop('checked', true).prop('disabled', true)
                    )
                    .append(
                        $('<span>', {'class': 'checkbox-material'})
                            .append($('<span>', {'class': 'check'}))
                    )
                    .append($input)
            )
            .append($remove)
        ;

        $input.data( 'parent', $item).data('index', i);
        $remove.data('parent', $item).data('index', i);

        if (i !== 0) {
            $remove.hide();
        }

        $remove.on('click', removeHandler);

        $input.on('keydown change', makeChangeHandler());

        $content.append($item);
    });

    var $removals = $content.find('.btn-remove');
    $removals.show();
    
    if ($removals.length === 1) {
        $removals.first().hide();
    }
};

save = function(callback) {
    OL.setup.replace({
        'checklist': checklist
    }, function(result) {
        checklist = result.data.checklist;
        callback && callback();
    });
};

makeChangeHandler = function() {
    var changeHandler = function() {
        var $input = $(this);
        var listIndex = $input.data('index');
        checklist[listIndex].text = $input.val();
        save(function() {
            $input.removeClass('saving').prev('.checkbox-material').removeClass('saving');
        });
    };

    var debouncedChangeHandler = _.debounce(changeHandler, 500);

    return function() {
        $(this).addClass('saving').prev('.checkbox-material').addClass('saving');
        debouncedChangeHandler.call(this);
    };
};

removeHandler = function() {
    alert('remove');
    var updates = {};
    var $btn = $(this);
    var $item = $btn.data('parent');
    var listIndex = $btn.data('index');
    
    checklist.splice(listIndex, 1);

    $item.addClass('deleting');
    save(function() {
        $item.remove();
        update();
    });
};

newItem = function() {
    return {'id': uuid(), 'text': "I've completed this!"};
};

addHandler = function() {
    alert('add');
    checklist.push(newItem());
    $('input.item-text').prop('disabled', true);
    save(function() {
        update();
    });
};

OL(function() {
    checklist = OL.setup.data.checklist || [newItem()];    
    update();
    $('button.btn-add').on('click', addHandler);

    OL.on('save', save);
});
