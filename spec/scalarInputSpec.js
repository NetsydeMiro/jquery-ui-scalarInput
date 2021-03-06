(function() {
  describe('scalarInput', function() {
    describe('#constructor', function() {
      it('can handle single unit', function() {
        var si;
        si = $('<input>').scalarInput({
          units: 'meters'
        }).scalarInput('instance');
        return expect(si.option('units')).toEqual('meters');
      });
      it('can handle multiple units', function() {
        var si;
        si = $('<input>').scalarInput({
          units: ['meters', 'centimeters']
        }).scalarInput('instance');
        return expect(si.option('units')).toEqual(['meters', 'centimeters']);
      });
      it('gets proper prefixed default', function() {
        var si;
        si = $('<input>').scalarInput({
          units: ['meters']
        }).scalarInput('instance');
        return expect(si.option('prefixed')).toBe(false);
      });
      return it('complains if applied to non-input element', function() {
        var bomb;
        bomb = function() {
          return $('<div></div>').scalarInput({
            units: ['meters']
          });
        };
        return expect(bomb).toThrow();
      });
    });
    describe('units dropdown', function() {
      beforeEach(function() {
        return $('body').append("<div id='testEnvelope'><input id='testTarget'></div>");
      });
      afterEach(function() {
        return $('#testEnvelope').remove();
      });
      describe('select element', function() {
        it("isn't added if no units specified", function() {
          var si;
          si = $('#testTarget').scalarInput();
          return expect(si.next().length).toBe(0);
        });
        it("isn't added if blank unit specified", function() {
          var si;
          si = $('#testTarget').scalarInput({
            units: ''
          });
          return expect(si.next().length).toBe(0);
        });
        it('is added if single unit specified', function() {
          var select, si;
          si = $('#testTarget').scalarInput({
            units: 'meters'
          });
          select = si.next();
          return expect(select.is('select')).toBe(true);
        });
        it('is disabled if single unit specified', function() {
          var select, si;
          si = $('#testTarget').scalarInput({
            units: 'meters'
          });
          select = si.next();
          return expect(select.prop('disabled')).toBe(true);
        });
        it('is disabled if single unit specified via array', function() {
          var select, si;
          si = $('#testTarget').scalarInput({
            units: ['meters']
          });
          select = si.next();
          return expect(select.prop('disabled')).toBe(true);
        });
        it('is added if multiple units specified', function() {
          var select, si;
          si = $('#testTarget').scalarInput({
            units: ['meters', 'inches']
          });
          select = si.next();
          return expect(select.is('select')).toBe(true);
        });
        it('is enabled if multiple units specified', function() {
          var select, si;
          si = $('#testTarget').scalarInput({
            units: ['meters', 'inches']
          });
          select = si.next();
          return expect(select.prop('disabled')).toBe(false);
        });
        return it('is added before magnitude if prefixed specified', function() {
          var empty, select, si;
          si = $('#testTarget').scalarInput({
            prefixed: true,
            units: ['meters', 'inches']
          });
          select = si.prev();
          empty = si.next();
          expect(select.is('select')).toBe(true);
          return expect(empty.length).toBe(0);
        });
      });
      return describe('option elements', function() {
        it('are correct if single unit specified', function() {
          var option, si;
          si = $('#testTarget').scalarInput({
            units: 'meters'
          });
          option = si.next().children();
          expect(option.is('option')).toBe(true);
          expect(option.text()).toEqual('meters');
          return expect(option.val()).toEqual('meters');
        });
        it('are correct if single unit specified via array', function() {
          var option, si;
          si = $('#testTarget').scalarInput({
            units: ['meters']
          });
          option = si.next().children();
          expect(option.is('option')).toBe(true);
          expect(option.text()).toEqual('meters');
          return expect(option.val()).toEqual('meters');
        });
        return it('are correct if multiple units specified', function() {
          var options, si;
          si = $('#testTarget').scalarInput({
            units: ['meters', 'inches']
          });
          options = si.next().children();
          expect(options.first().is('option')).toBe(true);
          expect(options.last().is('option')).toBe(true);
          expect(options.first().text()).toEqual('meters');
          expect(options.first().val()).toEqual('meters');
          expect(options.last().text()).toEqual('inches');
          return expect(options.last().val()).toEqual('inches');
        });
      });
    });
    describe('accessors', function() {
      var envelope, inputMagnitude, inputUnit, scalarInstance;
      envelope = scalarInstance = inputMagnitude = inputUnit = null;
      beforeEach(function() {
        var inputScalar;
        envelope = $("<div id='testEnvelope'></div>").appendTo('body');
        inputMagnitude = $("<input id='testTarget' value='10'>").appendTo(envelope);
        inputScalar = $(inputMagnitude).scalarInput({
          units: ['meters', 'feet']
        });
        inputUnit = inputMagnitude.next();
        return scalarInstance = inputScalar.scalarInput('instance');
      });
      afterEach(function() {
        return envelope.remove();
      });
      describe('#magnitude()', function() {
        it('gets initialized magnitude', function() {
          return expect(scalarInstance.magnitude()).toEqual('10');
        });
        return it('gets changed magnitude', function() {
          inputMagnitude.val('20');
          return expect(scalarInstance.magnitude()).toEqual('20');
        });
      });
      describe('#unit()', function() {
        it('gets initialized unit', function() {
          return expect(scalarInstance.unit()).toEqual('meters');
        });
        return it('gets changed unit', function() {
          inputUnit.val('feet');
          return expect(scalarInstance.unit()).toEqual('feet');
        });
      });
      return describe('#val()', function() {
        it('gets initialized value', function() {
          return expect(scalarInstance.val()).toEqual('10 meters');
        });
        it('gets changed value', function() {
          inputMagnitude.val('20');
          expect(scalarInstance.val()).toEqual('20 meters');
          inputUnit.val('feet');
          return expect(scalarInstance.val()).toEqual('20 feet');
        });
        return it('can have default format overridden', function() {
          scalarInstance.options.valueFormat = '{{unit}} were {{magnitude}}';
          return expect(scalarInstance.val()).toEqual('meters were 10');
        });
      });
    });
    return describe('change event', function() {
      var callback, envelope, inputMagnitude, inputScalar, inputUnit;
      callback = envelope = inputMagnitude = inputScalar = inputUnit = null;
      beforeEach(function() {
        callback = jasmine.createSpy('callback');
        envelope = $("<div id='testEnvelope'></div>").appendTo('body');
        inputMagnitude = $("<input id='testTarget' value='10'>").appendTo(envelope);
        inputScalar = $(inputMagnitude).scalarInput({
          units: ['meters', 'feet'],
          change: callback
        });
        return inputUnit = inputScalar.next();
      });
      afterEach(function() {
        return envelope.remove();
      });
      it('is triggered when user changes magnitude', function() {
        inputMagnitude.change();
        expect(callback).toHaveBeenCalled();
        return expect(callback.calls.count()).toEqual(1);
      });
      it('is triggered when user changes unit', function() {
        inputUnit.change();
        expect(callback).toHaveBeenCalled();
        return expect(callback.calls.count()).toEqual(1);
      });
      it('passes correct arguments when magnitude changed', function() {
        var args;
        inputMagnitude.val(33).change();
        args = callback.calls.first().args;
        return expect(args[1]).toEqual({
          changed: 'magnitude',
          magnitude: '33',
          value: '33 meters'
        });
      });
      return it('passes correct arguments when unit changed', function() {
        var args;
        inputUnit.val('feet').change();
        args = callback.calls.first().args;
        return expect(args[1]).toEqual({
          changed: 'unit',
          unit: 'feet',
          value: '10 feet'
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=scalarInputSpec.js.map
