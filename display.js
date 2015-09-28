var numCompleted, numTotal, itemClickHandler, update, state;

itemClickHandler = function() {
    var $item = $(this);
    var updates = {};
    var isChecked = $item.prop('checked');
    updates[$item.attr('id')] = isChecked;
    state[$item.attr('id')] = isChecked;

    $item.addClass('saving');
    OL.user.update({'checked': updates}, 'set', function() {
        $item.removeClass('saving');
        if (isChecked) {
            numCompleted++;
        } else {
            numCompleted--;
        }

        OL.user.submit(state);

        update();
    });
};

update = function() {
    $('.completed').toggle(numCompleted === numTotal);
    $('.progress').toggle(numTotal > 1);
    $('.progress-bar').css('width', 100*numCompleted/numTotal + '%');
}; 

OL(function() {
    var $content = $('#content');
    var checklist = OL.setup.data.checklist || [{'id': 1, 'text': "I've completed this!"}];
    state = OL.user.data.checked || {};

    $('.completed').text(OL.setup.data.completedText || 'All done!');
    
    numCompleted = 0;
    numTotal = checklist.length;

    $.each(checklist, function(i, item) {
        var $item = $('<div>', {'class': 'checkbox'})
            .append(
                $('<label>')
                    .append(
                        $('<input>', {
                            'type': 'checkbox',
                            'id': item.id
                        }).prop('checked', Boolean(state[item.id]))
                    )
                    .append(
                        $('<span>', {'class': 'checkbox-material'})
                            .append($('<span>', {'class': 'check'}))
                    )
                    .append(
                        $('<span>', {'class': 'item-text'}).text(item.text)
                    )
            )
        ;

        if (state[item.id]) {
            numCompleted++;
        }

        $content.append($item);
        $item.find('input').on('click', itemClickHandler);
    });
    
    update();
});