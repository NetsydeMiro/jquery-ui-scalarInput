$.widget("netsyde.scalarInput", {

  options: {
    units: [],
    prefixed: false, 
    valueFormat: '{{magnitude}} {{unit}}'
  }, 

  _create: function(){
    var units = this.options.units;
    var unitIndex;

    this._inputMagnitude = this.element;

    if (!this.element.is('input'))
      throw 'scalarInput must be applied to input element';

    switch($.type(units)){

      case 'array':

        if(units.length == 1){
          this._addSelect(true);
          this._addUnit(units[0]);
          this._registerCallbacks();

        }else if(units.length > 1){
          this._addSelect();

          for(unitIndex in units){
            this._addUnit(units[unitIndex]);
          }

          this._registerCallbacks();
        }
        break;

      case 'string':
        if(units !== ''){
          this._addSelect(true);
          this._addUnit(units);
          this._registerCallbacks();
        }
        break;

      default:
        throw "Units must be specified as string or array of strings";
    }
  }, 

  magnitude: function(){
    return this._inputMagnitude.val();
  },

  unit: function(){
    return this._inputUnit.children('option:selected').val();
  },

  val: function(){
    return this.magnitude() + ' ' + this.unit();
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

    this._inputUnit.change(function(e){
      scalarInput._trigger('change', e, {
        changed: 'unit', 
        unit: scalarInput.unit(), 
        value: scalarInput.val()
      });
    });
  }, 

  _addSelect: function(disabled){
    disabled = disabled || false;
    var markup = '<select></select>';
    this._inputUnit = $(markup);
    if (disabled) this._inputUnit.prop('disabled', true);
    this._inputUnit.insertAfter(this._inputMagnitude);
  },

  _addUnit: function(unit){
    this._inputUnit.append('<option>' + unit + '</option>');
  },

});
