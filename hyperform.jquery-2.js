(function( $ ) {
    
    // implemented validation api

    var defaults = {
        messages: {
            en: {

            }
        }
    }
    
    var validationMessages = {
        VALUE_MISSING               : 'Enter this field',
        TYPE_MISMATCH_EMAIL         : 'Enter a valid e-mail address',
        TYPE_MISMATCH_URL           : 'Enter a valid url',
        TYPE_MISMATCH_TEL           : 'Enter a valid telephone number',
        TYPE_MISMATCH_DATETIME      : 'Enter a valid date and time',
        TYPE_MISMATCH_DATE          : 'Enter a valid date',
        TYPE_MISMATCH_MONTH         : 'Enter a valid month',
        TYPE_MISMATCH_WEEK          : 'Enter a valid week',
        TYPE_MISMATCH_TIME          : 'Enter a valid time',
        TYPE_MISMATCH_DATETIMELOCAL : 'Enter a valid local date and time',
        TYPE_MISMATCH_NUMBER        : 'Enter a number',
        TYPE_MISMATCH_COLOR         : 'Enter a valid color',
        PATTERN_MISMATCH            : 'Enter a value matching the required pattern',
        TOO_LONG                    : 'Entered value is too long',
        RANGE_UNDERFLOW             : 'Entered value is too low',
        RANGE_OVERFLOW              : 'Entered value is too high',
        STEP_MISMATCH               : 'Enter a value matching the required scale'
    };
    
    var validationElements = [
        'button',
        'input',
        'keygen',
        'object',
        'select',
        'textarea'
    ];

    var strictTypes = [
	'email',
	'url',
	'tel',
	'datetime',
	'date',
	'month',
	'week',
	'time',
	'datetime-local',
	'number',
        'range',
	'color'
    ];
    
    var validationRegex = {
        email           : /^([A-Za-z0-9_\+\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        url             : /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        datetime        : /^$/, //todo
        date            : /^$/, //todo
        month           : /^$/, //todo
        week            : /^$/, //todo
        time            : /^$/, //todo
        datetime-local  : /^$/, //todo
        number          : /^$/, //todo
	range           : /^$/, //todo
        color           : /^$/ //todo
    };
   
    function ValidityWrapper(_element, _native) {
        
        var _self = this,
            _state = {
                valueMissing:       false,
                typeMismatch:       false,
                patternMismatch:    false,
                tooLong:            false,
                rangeUnderflow:     false,
                rangeOverflow:      false,
                stepMismatch:       false,
                customError:        false,
                valid:              true
            },
            _customError = '';

        function _check() {

            _state.valueMissing     = !hasValueRequired()  || isValueMissing();
            _state.typeMismatch     = !hasStrictType()     || isTypeMismatch();
            _state.patternMismatch  = !hasPattern()        || isPatternMismatch();
            _state.tooLong          = !hasMaxLength()      || isTooLong();
            _state.rangeUnderflow   = !hasMaxRange()       || isRangeUnderflow();
            _state.rangeOverflow    = !hasMinRange()       || isRangeOverflow();
            _state.stepMismatch     = !hasStep()           || isStepMismatch();
            _state.customError      = _isCustomError();
            _state.valid            = !_state.valueMissing
                                        && !_state.typeMismatch
                                        && !_state.patternMismatch
                                        && !_state.tooLong
                                        && !_state.rangeUnderflow
                                        && !_state.rangeOverflow
                                        && !_state.stepMismatch
                                        && !_state.customError;
        }
        
        if (!_native) {
            _check();
            $(_element).bind('change', _check);
        }

        this.validity = function(state) {

            return state
                ? (_native)
                    ? _state[state]
                    : _element.validity[state]
                : (_native)
                    ? {
                        valueMissing    : _element.validity.valueMissing,
                        typeMismatch    : _element.validity.typeMismatch,
                        patternMismatch : _element.validity.patternMismatch,
                        tooLong         : _element.validity.tooLong,
                        rangeUnderflow  : _element.validity.rangeUnderflow,
                        rangeOverflow   : _element.validity.rangeOverflow,
                        stepMismatch    : _element.validity.stepMismatch,
                        customError     : _element.validity.customError,
                        valid           : _element.validity.valid
                    }
                    : {
                        valueMissing    : _state.valueMissing,
                        typeMismatch    : _state.typeMismatch,
                        patternMismatch : _state.patternMismatch,
                        tooLong         : _state.tooLong,
                        rangeUnderflow  : _state.rangeUnderflow,
                        rangeOverflow   : _state.rangeOverflow,
                        stepMismatch    : _state.stepMismatch,
                        customError     : _state.customError,
                        valid           : _state.valid
                    }
        }
        
        this.checkValidity = function() {
            
            return !_self.willValidate()
                || _native
                    ? _element.checkValidity()
                    : _validity.get('valid');
        }
        
        this.validationMessage = function() {
            
            //todo
        }
            
        this.setCustomValidity = function(message) {
           
            if (_native) {
                _element.setCustomValidity(message || '');
            } else {
                _customError = '' + message || '';
                _check();
            }
        }

        this.isCustomError() {
            return _customError;
        }
    }

    var p = {};

    p.init = function() {
    
    };

    p.willValidate = function() {
        return (validationElements.indexOf(this.nodeName.toLowerCase())) ? true : false;
    };

    p.isValueRequired = function() {
	
	var required	= false,
	    $elements	= ($(this).attr('type') === 'radio') 
			    ? $('input[name="' + $(this).attr('name') + '"]') 
		 	    : $(this);
	
	$elements.each(function() {
            required = $(this).attr('required') ? true : required;
	});

        return required;
    };

    p.isStrictType = function() {
	return (strictTypes.indexOf($(this).attr('type'))) ? true : false;
    };

    p.isValueMissing = function() {
	return 
	    ($(this).hyperForm('isValueRequired'))
	    && (
		( $(this).attr('type') === 'radio' ) 
		    ? $('input[name="' + $(this).attr('name') + '"]:checked').val() 
		    : $(this).val() === '' );
    };

    p.isTypeMismatch = function() {
       return $(this).hyperForm('isStrictType') && !validationRegex[$(this).attr('type')].test($(this).val());
    };

    p.isPatternMismatch = function() {
	return $(this).attr('pattern') && !new RegExp('^(?:' + $(this).attr('pattern') + ')$').test($(this).val());
    };

    p.isTooLong = function() {
        return $(this).atrr('maxlength') 
	    && parseInt($(this).attr('maxlength')) > $(this).val().length); 
    };

    p.isRangeUnderflow = function() {
    	return $(this).attr('min') && parseInt($(this).attr('min')) > parseInt($(this).val()); 
    };

    p.isRangeOverflow = function() {
	return $(this).attr('max') && parseInt($(this).attr('max')) < parseInt($(this).val())
    };

    p.isStepMismatch = function() {
    
    };

    p.isCustomError = function() {
        return $(this).data('hyperform').isCustomError();
    };

    $.fn.HTML5FormElement = function(method) {
        
        var val = [];
        
        this.each(function() {
            
            if (!$(this).data('html5api')) $(this).data('html5api', new ValidityWrapper(this, false));
            var api = $(this).data('html5api');
                
            if (api[method]) {
                val.push(api[method].apply(this, Array.prototype.slice.call(arguments, 1)));
            } else {
                $.error('Method ' +  method + ' does not exist on jQuery.HTML5FormElement');
            }
        });
        
        return (val.length === 1)
            ? val[0]
            : val;
    }
    
})( jQuery );
