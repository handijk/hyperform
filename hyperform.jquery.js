(function($) {

    function isValueMissing($element) {
        
    }

    function isTypeMismatch($element) {

    }

    function isPatternMismatch($element) {

    }

    function isTooLong($element) {

    }

    function isRangeUnderflow($element) {

    }

    function isRangeOverflow($element) {

    }

    function isStepMismatch($element) {

    }

    function isCustomError($element) {

    }

    function ValidityState($element) {

        var _valueMissing,
            _typeMismatch,
            _patternMismatch,
            _tooLong,
            _rangeUnderflow,
            _rangeOverflow,
            _stepMismatch,
            _customError,
            _valid;

        function _update() {
            _valueMissing       = isValueMissing($element);
            _typeMismatch       = isTypeMismatch($element);
            _patternMismatch    = isPatternMismatch($element);
            _tooLong            = isTooLong($element);
            _rangeUnderflow     = isRangeUnderflow($element);
            _rangeOverflow      = isRangeOverflow($element);
            _stepMismatch       = isStepMismatch($element);
            _customError        = isCustomError($element);
            _valid              = !_valueMissing
                               && !_typeMismatch
                               && !_patternMismatch
                               && !_tooLong
                               && !_rangeUnderflow
                               && !_rangeOverflow
                               && !_stepMismatch
                               && !_customError;
        }

        _update();
        _$element.bind('change', _update);
    }

    $.fn.hyperElement = function() {

        return this.each(function() {

            var _$this,
                _willValidate,
                _message,
                _customMessage = null,
                _ValidityState = new ValidityState(_$this);

            function _setWillValidate() {
                _willValidate = null;
            }

            function _getValidationMessage() {
                return _customMessage || _message;
            }

            function _setCustomValidity(message) {
                _customMessage = (message === '') ? null : message;
            }

            this.checkValidity = function() {
                if (!_ValidityState.valid) $this.fire('invalid');
                return _ValidityState.valid;
            }
        });
    }
    
    $.fn.hyperform = function(options){
        
        var defaults = {},
            settings = $.extend(defaults, options),
            attributes = {
                accept          : null,
                alt             : true,
                autocomplete    : Modernizr.input.autocomplete, // to do
                checked         : true,
                dirname         : null,
                formaction      : null,
                formenctype     : null,
                formmethod      : null,
                formonvalidate  : null,
                formtarget      : null,
                height          : true,
                list            : Modernizr.input.list, // got em (not in IE9, datalist bug)
                max             : Modernizr.input.max,
                maxlength       : true,
                min             : Modernizr.input.min,
                multiple        : Modernizr.input.multiple,
                pattern         : Modernizr.input.pattern, // to do
                placeholder     : Modernizr.input.placeholder, // got em
                readonly        : null,       
                required        : Modernizr.input.required, // to do
                size            : true,
                src             : true,
                step            : Modernizr.input.step,
                width           : true,
//            },
//            types = {
                hidden          : true,
                text            : true,
                search          : Modernizr.inputtypes.search,
                tel             : Modernizr.inputtypes.tel,
                url             : Modernizr.inputtypes.url,
                email           : Modernizr.inputtypes.email,
                password        : true,
                datetime        : Modernizr.inputtypes.datetime,
                date            : Modernizr.inputtypes.date,
                month           : Modernizr.inputtypes.month,
                week            : Modernizr.inputtypes.week,
                time            : Modernizr.inputtypes.time,
                'datetime-local': Modernizr.inputtypes['datetime-local'],
                number          : Modernizr.inputtypes.number,
                range           : Modernizr.inputtypes.range,
                color           : Modernizr.inputtypes.color,
                checkbox        : true,
                radio           : true,
                file            : true,
                submit          : true,
                image           : true,
                reset           : true,
                button          : true
            };

        function _filterInvalid() {

            var $this   = $(this),
                val     = $this.val(),
                pattern = $this.attr('pattern'),
                required= $this.attr('required'),
                regexp  = (pattern)
                        ? new RegExp('^(?:' + pattern + ')$')
                        : false;

            console.log(this.validity);

            return (required && val === '')
                   || (pattern && !pattern.test(val));
        }

        function _addErrorLabel() {

            var $this   = $(this),
                $error  = ($this.data('error'))
                        ? $this.data('error')
                        : $('<div></div>').addClass('error-text ui-state-error ui-corner-all'),
                title   = ($this.attr('title') && $this.attr('title') !== '')
                        ?  ' <br />' + $this.attr('title')
                        : '';

                console.log($this);

                if (!($this.data('error'))) {
                    $this.data('error', $error);
                    $('body').append($error);
                }

                $error.html('<p><strong>Vul dit veld in.</strong>' + title + '</p>');
        }
        
        $.fn.extend({
            datalist: function() {
                
                this.each(function() {
                    
                    var $this       = $(this),
                        $list       = $('#' + $this.attr('list')),
                        $options    = ($list.get(0).nodeName.toLowerCase() === 'datalist') ? $list.children('option') : false,
                        $source      = [];
                        
                    function addSource() {
                        var option = {
                            label: (this.label !== '') ? this.label : undefined,
                            value: (this.value !== '') ? this.value : undefined
                        };
                        $source.push(option);                                         
                    }
                    
                    if ($options) $options.each(addSource);
                    
                    $this.autocomplete({
                        source: $source
                    });
                });
            },
            placeholder: function() {
               
                this.each(function() {
                    
                    var $this           = $(this),
                        $placeholder    = $('<input type="text"></input>'),
                        properties      = {
                            color           : 'darkGray',
                            borderColor     : 'transparent',
                            backgroundColor : 'transparent',
                            marginLeft      : -1 * ($this.outerWidth(true) - parseInt($this.css('marginLeft')))
                        };
                        
                    function hide(e) {
                        $placeholder.hide();
                        if (e.type === 'mousedown') $this.trigger('focus');
                        return false;
                    }
                    
                    function show(e) {
                        if ($this.attr('value') === '') $placeholder.show();                     
                    }
                   
                    $placeholder
                        .addClass('placeholder')
                        .css(properties)
                        .text($this.attr('placeholder'))
                        .val($this.attr('placeholder'))
                        .mousedown(hide);
                        
                    $this
                        .bind('focus', hide)
                        .bind('blur', show)
                        .after($placeholder);                
                });
            },
            required: function() {

                this.addClass('error')
                    .first()
                    .trigger('focus')
                    .each(function() {


                    }
                );

                return this;
            }
        });
        
        return this.each(function(i, form){
            
            // get all unsupported input attributes
            
            $(form).find('input[list]').datalist();
            $(form).find('input[placeholder], textarea[placeholder]').placeholder();

            // find inputs to validate
            var elements = $('input');
            elements.each(function() {
                console.log(this.willValidate);
            });

            console.log(elements);

            
            /*$(form).find('input[required], textarea[required]').required();*/
            
            $(form).bind('submit', function() {

                return $(this).find('input[required], textarea[required], input[pattern], textarea[pattern]')
                              .filter(_filterInvalid)
                              .addClass('error')
                              .first()
                              .each(_addErrorLabel)
                              .trigger('focus')
                              .length === 0;
            });
        });
    };
})(jQuery);