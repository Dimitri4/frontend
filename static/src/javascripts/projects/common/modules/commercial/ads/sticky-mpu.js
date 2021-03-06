define([
    'common/utils/config',
    'common/modules/ui/sticky',
    'common/utils/fastdom-promise'
], function (
    config,
    Sticky,
    fastdom
) {

    function stickyMpu($adSlot) {
        if ($adSlot.data('name') !== 'right') {
            return;
        }

        var referenceElement = document.querySelector(config.page.hasShowcaseMainElement ? '.media-primary' : '.content__article-body');
        if (!referenceElement) {
            return;
        }

        return fastdom.read(function () {
            return (referenceElement[config.page.hasShowcaseMainElement ? 'offsetHeight' : 'offsetTop']) + $adSlot[0].offsetHeight;
        }).then(function (newHeight) {
            return fastdom.write(function () {
                $adSlot.parent().css('height', newHeight + 'px');
            });
        }).then(function () {
            //if there is a sticky 'paid by' band move the sticky mpu down so it will be always visible
            var options = config.page.isAdvertisementFeature ? {top: 43} : {};
            return new Sticky($adSlot[0], options).init();
        });
    }

    return stickyMpu;

});
