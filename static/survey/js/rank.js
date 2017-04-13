setupFunction = null;

(function (interact) {

    'use strict';

    var transformProp;

    interact.maxInteractions(Infinity);

    // setup draggable elements.
    interact('.js-drag')
        .draggable({ max: Infinity })
        .on('dragstart', function (event) {
            event.interaction.x = parseInt(window.getComputedStyle(event.target).left.slice(0, -2), 10);
            event.interaction.y = parseInt(window.getComputedStyle(event.target).top.slice(0, -2), 10);
            //event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 1000;
            //event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 10;
        })
        .on('dragmove', function (event) {
            event.interaction.x += event.dx;
            event.interaction.y += event.dy;

            if (transformProp) {
                event.target.style[transformProp] =
                    'translate(' + event.interaction.x + 'px, ' + event.interaction.y + 'px)';
            }
            else {
                event.target.style.left = event.interaction.x + 'px';
                event.target.style.top  = event.interaction.y + 'px';
            }
        })
        .on('dragend', function (event) {
            //event.target.setAttribute('data-x', event.interaction.x);
            //event.target.setAttribute('data-y', event.interaction.y);
        });

    // setup drop areas.
    // dropzone #1 accepts draggable #1
    //setupDropzone('#drop1', '#drag1');
    // dropzone #2 accepts draggable #1 and #2
    //setupDropzone('#drop2', '#drag1, #drag2');
    // every dropzone accepts draggable #3
    /*var ids = document.getElementById('ids_to_drop').innerHTML;
    setupDropzone('.js-drop', ids);
    /*for (var i=0; i<all_ids.arrayLength; i++){
        setupDropzone('.js-drop', all_ids[i])
    }*/
    //setupDropzone('.js-drop', '#drag1, #drag2, #drag3');
    



    /**
     * Setup a given element as a dropzone.
     *
     * @param {HTMLElement|String} el
     * @param {String} accept
     */
    function setupDropzone(el, accept) {
        interact(el)
            .dropzone({
                accept: accept,
                ondropactivate: function (event) {
                    addClass(event.relatedTarget, '-drop-possible');
                    event.relatedTarget.setAttribute('valid', 'false');
                    document.getElementById('saver_form_tag').setAttribute('value', event.relatedTarget.getAttribute('id'));
                },
                ondropdeactivate: function (event) {
                    removeClass(event.relatedTarget, '-drop-possible');
                    if (event.relatedTarget.getAttribute('valid') === 'false') {
                        event.relatedTarget.style.left = "";
                        event.relatedTarget.style.top = "";
                        document.getElementById('saver_form_rank').setAttribute('value', '-1');
                    } else {
                        document.getElementById('saver_form_rank').setAttribute('value', event.target.getAttribute('id').slice(9));
                    }
                    event.relatedTarget.removeAttribute('valid');
                    document.getElementById('rank_saver').submit()
                }
            })
            .on('dropactivate', function (event) {
                var active = event.target.getAttribute('active')|0;

                // change style if it was previously not active
                if (active === 0) {
                    addClass(event.target, '-drop-possible');
                    //event.target.textContent = 'Drop me here!';
                }

                event.target.setAttribute('active', active + 1);
            })
            .on('dropdeactivate', function (event) {
                var active = event.target.getAttribute('active')|0;

                // change style if it was previously active
                // but will no longer be active
                if (active === 1) {
                    removeClass(event.target, '-drop-possible');
                    //event.target.textContent = 'Dropzone';
                }

                event.target.setAttribute('active', active - 1);
            })
            .on('dragenter', function (event) {
                addClass(event.target, '-drop-over');
                event.relatedTarget.setAttribute('valid', 'true');
                //event.relatedTarget.textContent = 'I\'m in';
            })
            .on('dragleave', function (event) {
                removeClass(event.target, '-drop-over');
                event.relatedTarget.setAttribute('valid', 'false');
                //event.relatedTarget.textContent = 'Drag me…';
            })
            .on('drop', function (event) {
                removeClass(event.target, '-drop-over');
                //event.relatedTarget.textContent = 'Dropped';
            });
    }

    function addClass (element, className) {
        if (element.classList) {
            return element.classList.add(className);
        }
        else {
            element.className += ' ' + className;
        }
    }

    function removeClass (element, className) {
        if (element.classList) {
            return element.classList.remove(className);
        }
        else {
            element.className = element.className.replace(new RegExp(className + ' *', 'g'), '');
        }
    }

    interact(document).on('ready', function () {
        transformProp = 'transform' in document.body.style
            ? 'transform': 'webkitTransform' in document.body.style
            ? 'webkitTransform': 'mozTransform' in document.body.style
            ? 'mozTransform': 'oTransform' in document.body.style
            ? 'oTransform': 'msTransform' in document.body.style
            ? 'msTransform': null;
    });

    setupFunction = setupDropzone;

}(window.interact));