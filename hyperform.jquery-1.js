(function( $ ) {
    
    // implemented validation api
    
    var validationMessages = {
        VALUE_MISSING       : 'Enter this field',
        TYPE_MISMATCH_EMAIL : 'Enter a valid e-mail address',
        TYPE_MISMATCH_TEL   : 'Enter a valid telephone number',
        TYPE_MISMATCH_URL   : 'Enter a valid url',
        PATTERN_MISMATCH    : 'Enter a value in the required pattern',
        TOO_LONG            : 'Entered value is too long',
        RANGE_UNDERFLOW     : 'Entered value is too low',
        RANGE_OVERFLOW      : 'Entered value is too high',
        STEP_MISMATCH       : 'Enter a value in the required scale'
    }
   
    function ValidityWrapper(_element, _native) {
        
        var _state = {
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
        
        function _isValueMissing() {
            //todo
        }
    
        function _isTypeMismatch() {
            //todo
        }
        
        function _isPatternMismatch() {
            //todo
        }
        
        function _isTooLong() {
            //todo
        }
        
        function _isRangeUnderflow() {
            //todo
        }
    
        function _isRangeOverflow() {
            //todo
        }
        
        function _isStepMismatch() {
            //todo
        }
        
        function _isCustomError() {
            return (_customError === '')
                ? false
                : true;
        }
        
        function _check() {
            
            _state.valueMissing     = _isValueMissing();
            _state.typeMismatch     = _isTypeMismatch();
            _state.patternMismatch  = _isPatternMismatch();
            _state.tooLong          = _isTooLong();
            _state.rangeUnderflow   = _isRangeUnderflow();
            _state.rangeOverflow    = _isRangeOverflow();
            _state.stepMismatch     = _isStepMismatch();
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
        
        this.setCustomError = function(message) {
            _customError = message;
            _check();
        }
        
        this.get = function(state) {
            return state
                ? _state[state]
                : {
                    valueMissing    : (_native)
                                        ? _element.validity.valueMissing
                                        : _state.valueMissing,
                    typeMismatch    : (_native)
                                        ? _element.validity.typeMismatch
                                        : _state.typeMismatch,
                    patternMismatch : (_native)
                                        ? _element.validity.patternMismatch
                                        : _state.patternMismatch,
                    tooLong         : (_native)
                                        ? _element.validity.tooLong
                                        : _state.tooLong,
                    rangeUnderflow  : (_native)
                                        ? _element.validity.rangeUnderflow
                                        : _state.rangeUnderflow,
                    rangeOverflow   : (_native)
                                        ? _element.validity.rangeOverflow
                                        : _state.rangeOverflow,
                    stepMismatch    : (_native)
                                        ? _element.validity.stepMismatch
                                        : _state.stepMismatch,
                    customError     : (_native)
                                        ? _element.validity.customError
                                        : _state.customError,
                    valid           : (_native)
                                        ? _element.validity.valid
                                        : _state.valid
                };
        }

        if (!_native) {
            _check();
            if (!native) $(_element).bind('change', _check);
        }
    }
    
    function HTML5FormElement(_element) {
        
        var _self           = this,
            _native         = false,
            _willValidate   = false,
            _customValidity = '',
            _validity       = new ValidityWrapper(_element, _native);
        
        function _getValidationMessage() {
            //todo             
        }
        
        function _getValidity() {
            return _validity.get('valid');
        }
        
        function _setCustomValidity(message) {
            _customValidity = '' + message;
        }        
    }
    
    var p = HTML5FormElement.prototype;
  
    p.validity = function(state) {
        
        return state
            ? _validity[state]
                || _validity.get(state)
            : {
                valueMissing    : _validity.get('valueMissing'),
                typeMismatch    : _validity.get('typeMismatch'),
                patternMismatch : _validity.get('patternMismatch'),
                tooLong         : _validity.get('tooLong'),
                rangeUnderflow  : _validity.get('rangeUnderflow'),
                rangeOverflow   : _validity.get('rangeOverflow'),
                stepMismatch    : _validity.get('stepMismatch'),
                customError     : _validity.get('customError'),
                valid           : _validity.get('valid')
            }
    }
    
    //todo
    p.willValidate = function() {
        return (_native)
            ? this.willValidate
            : _willValidate;
    }

    p.validationMessage = function() {
        return (_native)
            ? this.validationMessage
            : _getValidationMessage();
    }
    
    p.checkValidity = function() {
        
        $(this).trigger('validate');
        
        var valid = (_native)
            ? this.checkValidity()
            : _getValidity();
            
        if (!valid)
            $(this).trigger('invalid');
        else
            $(this).trigger('valid');
        
        return valid;
    }
    
    p.setCustomValidity = function(message) {

        (_native)
            ? this.setCustomValidity(message)
            : _setCustomValidity(message);
    }
    
    $.fn.HTML5FormElement = function(method) {
        
        var val = [];
        
        this.each(function() {
            
            var api = (!$(this).data('html5api'))
                ? $(this).data('html5api', new HTML5FormElement(this))
                : $(this).data('html5api');
            
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