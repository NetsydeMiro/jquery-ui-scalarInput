$.widget("netsyde.scalarInput", {

  options: {
    units: [],
    prefixed: false, 
    valueFormat: '{{magnitude}} {{unit}}'
  }, 

  _create: function(){
    var unitIndex, noUnits, singleUnit = false;

    // store reference to magnitude input
    this._inputMagnitude = this.element;

    // throw exceptions if we've incorrect config
    this._validate();

    if (!(noUnits = this._noUnit()))
      // disable dropdown if only one unit type specified
      this._addSelect(singleUnit = this._singleUnit());

    // add units as select options
    if (singleUnit){
      this._addSelect(true);
      this._addSelectOption(singleUnit);
    }else if (!noUnits){
      this._addSelect();
      for(unitIndex in this.options.units)
        this._addSelectOption(this.options.units[unitIndex]);
    }

    // track changes to child controls (_inputMagnitude & _inputUnit)
    this._registerCallbacks();

  }, 

  // accessor functions
  magnitude: function(){
    return this._inputMagnitude.val();
  },
  unit: function(){
    return this._inputUnit.children('option:selected').val();
  },
  val: function(){
    return this.options.valueFormat.
      replace('{{magnitude}}', this.magnitude()).
      replace('{{unit}}', this.unit());
  },

  // private setup methods
  _validate: function(){
    if (!this.element.is('input'))
      throw 'scalarInput must be applied to input element';

    var unitsType = $.type(this.options.units);
    if (!(unitsType == 'array' || unitsType == 'string'))
      throw "Units must be specified as string or array (of strings)";

    return true;
  },

  // if no unit specified
  _noUnit: function(){
    return this.options.units === '' || this.options.units.length === 0;
  }, 

  // if string or single element array used to specify units, we return it
  _singleUnit: function(){
    var unitsType;

    return (unitsType = $.type(this.options.units)) == 'string' && 
      this.options.units !== '' && 
      this.options.units ||

      (unitsType == 'array' && 
       this.options.units.length == 1 && 
       this.options.units[0]);
  }, 

  _registerCallbacks: function(){
    var scalarInput = this;

    this._inputMagnitude.change(function(e){
      scalarInput._trigger('change', e, {
        changed: 'magnitude', 
        magnitude: scalarInput.magnitude(), 
        value: scalarInput.val()
      });
    });

    if (this._inputUnit){
      this._inputUnit.change(function(e){
        scalarInput._trigger('change', e, {
          changed: 'unit', 
          unit: scalarInput.unit(), 
          value: scalarInput.val()
        });
      });
    }
  }, 

  _addSelect: function(disabled){
    disabled = disabled || false;
    var markup = '<select></select>';
    this._inputUnit = $(markup);
    if (disabled) this._inputUnit.prop('disabled', true);

    if (this.options.prefixed)
      this._inputUnit.insertBefore(this._inputMagnitude);
    else
      this._inputUnit.insertAfter(this._inputMagnitude);
  },

  _addSelectOption: function(unit){
    this._inputUnit.append('<option>' + unit + '</option>');
  },

});
