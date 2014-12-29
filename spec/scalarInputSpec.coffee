describe 'scalarInput', -> 

  describe '#constructor', -> 

    it 'can handle single unit', -> 
      si = $('<input>').scalarInput(units: 'meters').scalarInput('instance')
      expect(si.option 'units').toEqual 'meters'

    it 'can handle multiple units', -> 
      si = $('<input>').scalarInput(units: ['meters','centimeters']).scalarInput('instance')
      expect(si.option 'units').toEqual ['meters', 'centimeters']

    it 'gets proper prefixed default', -> 
      si = $('<input>').scalarInput(units: ['meters']).scalarInput('instance')
      expect(si.option 'prefixed').toBe false

    it 'complains if applied to non-input element', -> 
      bomb = -> 
        $('<div></div>').scalarInput(units: ['meters'])
      expect(bomb).toThrow()

  describe 'units dropdown', -> 

    beforeEach -> 
      $('body').append "<div id='testEnvelope'><input id='testTarget'></div>"

    afterEach -> 
      $('#testEnvelope').remove()

    describe 'select element', -> 

      it "isn't added if no units specified", -> 
        si = $('#testTarget').scalarInput()
        expect(si.next().length).toBe 0

      it "isn't added if blank unit specified", -> 
        si = $('#testTarget').scalarInput({units: ''})
        expect(si.next().length).toBe 0
    
      it 'is added if single unit specified', -> 
        si = $('#testTarget').scalarInput({units: 'meters'})
        select = si.next()
        expect(select.is('select')).toBe true

      it 'is disabled if single unit specified', -> 
        si = $('#testTarget').scalarInput({units: 'meters'})
        select = si.next()
        expect(select.prop('disabled')).toBe true

      it 'is disabled if single unit specified via array', -> 
        si = $('#testTarget').scalarInput(units: ['meters'])
        select = si.next()
        expect(select.prop('disabled')).toBe true

      it 'is added if multiple units specified', -> 
        si = $('#testTarget').scalarInput({units: ['meters', 'inches']})
        select = si.next()
        expect(select.is('select')).toBe true

      it 'is enabled if multiple units specified', -> 
        si = $('#testTarget').scalarInput({units: ['meters', 'inches']})
        select = si.next()
        expect(select.prop('disabled')).toBe false

      it 'is added before magnitude if prefixed specified', -> 
        si = $('#testTarget').scalarInput({prefixed: true, units: ['meters', 'inches']})
        select = si.prev()
        empty = si.next()
        expect(select.is('select')).toBe true
        expect(empty.length).toBe 0

    describe 'option elements', -> 

      it 'are correct if single unit specified', -> 
        si = $('#testTarget').scalarInput({units: 'meters'})
        option = si.next().children()
        expect(option.is('option')).toBe true
        expect(option.text()).toEqual 'meters'
        expect(option.val()).toEqual 'meters'

      it 'are correct if single unit specified via array', -> 
        si = $('#testTarget').scalarInput(units: ['meters'])
        option = si.next().children()
        expect(option.is('option')).toBe true
        expect(option.text()).toEqual 'meters'
        expect(option.val()).toEqual 'meters'

      it 'are correct if multiple units specified', -> 
        si = $('#testTarget').scalarInput({units: ['meters', 'inches']})
        options = si.next().children()
        expect(options.first().is('option')).toBe true
        expect(options.last().is('option')).toBe true
        expect(options.first().text()).toEqual 'meters'
        expect(options.first().val()).toEqual 'meters'
        expect(options.last().text()).toEqual 'inches'
        expect(options.last().val()).toEqual 'inches'

  describe 'accessors', -> 

    envelope = scalarInstance = inputMagnitude = inputUnit = null

    beforeEach -> 
      envelope = $("<div id='testEnvelope'></div>").appendTo 'body'
      inputMagnitude = $("<input id='testTarget' value='10'>").appendTo(envelope);
      inputScalar = $(inputMagnitude).scalarInput({units: ['meters', 'feet']})
      inputUnit = inputMagnitude.next()
      scalarInstance = inputScalar.scalarInput 'instance'

    afterEach -> 
      envelope.remove()

    describe '#magnitude()', -> 

      it 'gets initialized magnitude', -> 
        expect(scalarInstance.magnitude()).toEqual '10'

      it 'gets changed magnitude', -> 
        inputMagnitude.val '20'
        expect(scalarInstance.magnitude()).toEqual '20'

    describe '#unit()', -> 

      it 'gets initialized unit', -> 
        expect(scalarInstance.unit()).toEqual 'meters'

      it 'gets changed unit', -> 
        inputUnit.val 'feet'
        expect(scalarInstance.unit()).toEqual 'feet'

    describe '#val()', -> 

      it 'gets initialized value', -> 
        expect(scalarInstance.val()).toEqual '10 meters'

      it 'gets changed value', -> 
        inputMagnitude.val '20'
        expect(scalarInstance.val()).toEqual '20 meters'
        inputUnit.val 'feet'
        expect(scalarInstance.val()).toEqual '20 feet'

      it 'can have default format overridden', -> 
        scalarInstance.options.valueFormat = '{{unit}} were {{magnitude}}'
        expect(scalarInstance.val()).toEqual 'meters were 10'

  describe 'change event', -> 

    callback = envelope = inputMagnitude = inputScalar = inputUnit = null

    beforeEach -> 
      callback = jasmine.createSpy('callback')
      envelope = $("<div id='testEnvelope'></div>").appendTo 'body'
      inputMagnitude = $("<input id='testTarget' value='10'>").appendTo(envelope);
      inputScalar = $(inputMagnitude).scalarInput(
        units: ['meters', 'feet'],
        change: callback
      )
      inputUnit = inputScalar.next()

    afterEach -> 
      envelope.remove()

    it 'is triggered when user changes magnitude', -> 
      inputMagnitude.change()
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.count()).toEqual 1

    it 'is triggered when user changes unit', -> 
      inputUnit.change()
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.count()).toEqual 1

    it 'passes correct arguments when magnitude changed', -> 
      inputMagnitude.val(33).change()
      args = callback.calls.first().args
      # first arg (args[0]) is original jQuery event... not really sure how to test for that
      expect(args[1]).toEqual {changed: 'magnitude', magnitude: '33', value: '33 meters'}

    it 'passes correct arguments when unit changed', -> 
      inputUnit.val('feet').change()
      args = callback.calls.first().args
      # first arg (args[0]) is original jQuery event... not really sure how to test for that
      expect(args[1]).toEqual {changed: 'unit', unit: 'feet', value: '10 feet'}

