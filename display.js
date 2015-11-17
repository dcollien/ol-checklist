var numCompleted, numTotal, itemClickHandler, update, state;

itemClickHandler = function() {
    var $item = $(this);
    var updates = {};
    var isChecked = $item.prop('checked');
    updates[$item.attr('id')] = isChecked;
    state[$item.attr('id')] = isChecked;

    // tell OpenLearning that there was some kind of interaction
    OL.user.logInteraction();

    // update the user's saved state
    $item.addClass('saving');
    OL.user.update({'checked': updates}, 'set', function() {
        $item.removeClass('saving');
        if (isChecked) {
            numCompleted++;
        } else {
            numCompleted--;
        }

        // submit an object of all item states e.g. 
        /*
            {
                'item-id-1': true,
                'item-id-2': false
            }
          to compare against the completion criteria
          (to update the user's progress)
        */
        OL.user.submit(state);

        // update the UI
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
    var checklist = OL.setup.data.checklist || [{'id': '1', 'text': "I've completed this!"}];
    state = OL.user.data.checked || {};

    $('.completed').text(OL.setup.data.doneMessage || 'All done!');
    
    numCompleted = 0;
    numTotal = checklist.length;

    // build the checklist
    $.each(checklist, function(i, item) {
        var $item = $('<div>', {'class': 'checkbox checkbox-primary'})
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
                        $('<div>', {'class': 'item-text'}).text(item.text)
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