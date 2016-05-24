define([
    'bonzo',
    'fastdom',
    'qwery',
    'common/utils/$',
    'common/modules/commercial/create-ad-slot',
    'common/modules/user-prefs',
    'helpers/fixtures',
    'helpers/injector',
    'text!fixtures/commercial/slice-adverts.html'
], function (
    bonzo,
    fastdom,
    qwery,
    $,
    createAdSlot,
    userPrefs,
    fixtures,
    Injector,
    sliceAdvertsHtml
) {
    describe('Slice Adverts', function () {

        var fixturesConfig = {
                id: 'slice-adverts',
                fixtures: [sliceAdvertsHtml]
            },
            $fixtureContainer,
            injector = new Injector(),
            sliceAdverts, config, detect, commercialFeatures;

        var createSlotSpy = jasmine.createSpy('create-ad-slot').and.callFake(createAdSlot);

        beforeEach(function (done) {
            createSlotSpy.calls.reset();
            injector.mock('common/modules/commercial/create-ad-slot', createSlotSpy);

            injector.require([
                'common/modules/commercial/slice-adverts',
                'common/modules/commercial/commercial-features',
                'common/utils/config',
                'common/utils/detect'
            ], function () {
                sliceAdverts = arguments[0];
                commercialFeatures = arguments[1];
                config = arguments[2];
                detect = arguments[3];

                config.page = {
                    pageId: 'uk/commentisfree',
                    isFront: true
                };

                config.switches = {
                    fabricAdverts : false
                };

                detect.getBreakpoint = function () {
                    return 'desktop';
                };

                commercialFeatures.sliceAdverts = true;

                $fixtureContainer = fixtures.render(fixturesConfig);
                done();
            });
        });

        afterEach(function () {
            fixtures.clean(fixturesConfig.id);
            userPrefs.remove('container-states');
        });

        it('should exist', function () {
            expect(sliceAdverts).toBeDefined();
        });

        it('should only create a maximum of 3 advert slots', function (done) {
            sliceAdverts.init();

            fastdom.defer(function () {
                expect(qwery('.ad-slot', $fixtureContainer).length).toEqual(3);
                done();
            });
        });

        it('should remove the "fc-slice__item--no-mpu" class', function (done) {
            sliceAdverts.init();

            fastdom.defer(function () {
                $('.ad-slot', $fixtureContainer).each(function (adSlot) {
                    expect(bonzo(adSlot).parent().hasClass('fc-slice__item--no-mpu')).toBe(false);
                });

                done();
            });
        });

        it('should have the correct ad names', function (done) {
            sliceAdverts.init();

            fastdom.defer(function () {
                var $adSlots = $('.ad-slot', $fixtureContainer).map(function (slot) { return $(slot); });

                expect($adSlots[0].data('name')).toEqual('inline1');
                expect($adSlots[1].data('name')).toEqual('inline2');
                expect($adSlots[2].data('name')).toEqual('inline3');

                done();
            });
        });

        it('should have the correct ad names on mobile', function (done) {
            detect.getBreakpoint = function () {
                return 'mobile';
            };
            sliceAdverts.init();

            fastdom.defer(function () {
                var $adSlots = $('.ad-slot', $fixtureContainer).map(function (slot) { return $(slot); });

                expect($adSlots[0].data('name')).toEqual('inline1');
                expect($adSlots[1].data('name')).toEqual('inline2');
                expect($adSlots[2].data('name')).toEqual('inline3');

                done();
            });
        });

        it('should have the correct size mappings', function (done) {
            sliceAdverts.init();

            fastdom.defer(function () {
                $('.ad-slot--inline1', $fixtureContainer).each(function (adSlot) {
                    var $adSlot = bonzo(adSlot);

                    expect($adSlot.data('mobile')).toEqual('1,1|300,250');
                    expect($adSlot.data('mobile-landscape')).toEqual('1,1|300,250');
                    expect($adSlot.data('tablet')).toEqual('1,1|300,250');
                });
                $('.ad-slot--inline2', $fixtureContainer).each(function (adSlot) {
                    var $adSlot = bonzo(adSlot);

                    expect($adSlot.data('mobile')).toEqual('1,1|300,250');
                    expect($adSlot.data('mobile-landscape')).toEqual('1,1|300,250');
                    expect($adSlot.data('tablet')).toEqual('1,1|300,250');
                });

                done();
            });
        });

        it('should have at least one non-advert containers between advert containers', function (done) {
            sliceAdverts.init();

            fastdom.defer(function () {
                expect(qwery('.fc-container-first .ad-slot', $fixtureContainer).length).toBe(1);
                expect(qwery('.fc-container-third .ad-slot', $fixtureContainer).length).toBe(1);
                done();
            });
        });

        it('should not display ad slot if disabled in commercial-features', function () {
            commercialFeatures.sliceAdverts = false;

            expect(sliceAdverts.init()).toBe(false);
            expect(qwery('.ad-slot', $fixtureContainer).length).toBe(0);
        });

        it('should not add ad to first container if network front', function (done) {
            config.page.pageId = 'uk';
            sliceAdverts.init();

            fastdom.defer(function () {
                expect(qwery('.fc-container-first .ad-slot', $fixtureContainer).length).toBe(0);
                expect(qwery('.fc-container-third .ad-slot', $fixtureContainer).length).toBe(1);
                expect(qwery('.fc-container-fifth .ad-slot', $fixtureContainer).length).toBe(1);
                done();
            });
        });

        it('should not add ad to container if it is closed', function (done) {
            var containerId = '9cd2-e508-2bc1-5afd',
                prefs       = {};
            prefs[containerId] = 'closed';
            $('.fc-container-first', $fixtureContainer).attr('data-id', containerId);
            userPrefs.set('container-states', prefs);
            sliceAdverts.init();

            fastdom.defer(function () {
                expect(qwery('.fc-container-third .ad-slot', $fixtureContainer).length).toBe(1);
                expect(qwery('.fc-container-fifth .ad-slot', $fixtureContainer).length).toBe(1);
                done();
            });
        });

        describe('Top slot replacement', function () {
            beforeEach(function () {
                config.switches.fabricAdverts = true;
                // To be sure that any slots added are top slot replacements, we set the page to a network front,
                // where adverts will normally never appear on the first container.
                config.page.pageId = 'uk';
            });

            it('is added on mobile', function () {
                detect.isBreakpoint = function () {
                    // expecting check for breakpoint <= phablet
                    return true;
                };
                detect.getBreakpoint = function () {
                    return 'mobile';
                };

                sliceAdverts.init();

                expect(getCreatedSlotTypes()[0]).toBe('inline1-fabric');
            });

            it('is not added on desktop', function () {
                detect.isBreakpoint = function () {
                    // expecting check for breakpoint <= phablet
                    return false;
                };
                detect.getBreakpoint = function () {
                    return 'desktop';
                };

                sliceAdverts.init();

                expect(getCreatedSlotTypes().indexOf('inline1-fabric')).toBe(-1);
            });

            function getCreatedSlotTypes() {
                return createSlotSpy.calls.allArgs().map(function (args) {
                    return args[0];
                });
            }
        });

        //TODO: get data if we need to reintroduce this again
        xit('should add one slot for tablet, one slot for mobile after container', function (done) {
            sliceAdverts.init();

            fastdom.defer(function () {
                expect($('.fc-container-first .ad-slot', $fixtureContainer).hasClass('ad-slot--not-mobile'))
                    .toBe(true);
                expect($('.fc-container-first + .ad-slot', $fixtureContainer).hasClass('ad-slot--mobile'))
                    .toBe(true);
                done();
            });
        });
    });
});
