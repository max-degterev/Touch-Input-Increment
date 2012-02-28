/* Author:
    Max Degterev @suprMax
    
    Designed by @el_banano
*/

;(function($) {
    $.fn.mod_inputIncrement = function(options) {
        var s = $.extend({
            min: -Infinity,
            max: Infinity,
            step: 1
        }, options);
        
        this.forEach(function(elem, index) {
            var el = $(elem),

                input = el.children('input'),
                fakeinput = el.children('.mod-ii-fakeinput'),
                controlNeg = el.children('.mod-ii-neg'),
                controlPos = el.children('.mod-ii-pos'),

                min = (el.data('min') !== null) ? +el.data('min') : s.min,
                max = (el.data('max') !== null) ? +el.data('max') : s.max,
                step = (el.data('step') !== null) ? +el.data('step') : s.step;
            
            var handleControls = function(e) {
                var el = $(this);
                
                e.stopPropagation();
                e.preventDefault();

                if (el.hasClass('locked')) {
                    return;
                }
                else {
                    el.hasClass('mod-ii-neg') ? valUpdate(-step) : valUpdate(step);
                }
                el.trigger('change');
            }
            var valUpdate = function(num) {
                if (input.attr('disabled')) {// Can change any time. Check first
                    return;
                }
                input.val(+input.val() + num).trigger('change');
            };
            var handleChange = function() {
                var val = Math.min(Math.max(min, +this.value || 0), max);

                this.value = val;
                fakeinput.html(val);
                
                handleLimits(val);
            };
            var handleLimits = function(val) {
                if (val === max) {
                    controlPos.hasClass('locked') || controlPos.addClass('locked');
                }
                else if (val === min) {
                    controlNeg.hasClass('locked') || controlNeg.addClass('locked');
                }
                else if (val < max && val > min) {
                    controlPos.hasClass('locked') && controlPos.removeClass('locked');
                    controlNeg.hasClass('locked') && controlNeg.removeClass('locked');
                }
            };

            if (typeof $.fn.onpress === 'function') {
                //onpress plugin available
                controlNeg.onpress(handleControls);
                controlPos.onpress(handleControls);
            }
            else {
                controlNeg.on('click', handleControls);
                controlPos.on('click', handleControls);
            }
            
            input.on('change', handleChange);
            
            handleChange.call(input[0]);
        });
    };
})(Zepto);
