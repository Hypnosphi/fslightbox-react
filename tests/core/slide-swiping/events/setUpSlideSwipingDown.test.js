import { setUpSlideSwipingDown } from "../../../../src/core/slide-swiping/events/setUpSlideSwipingDown";
import * as getClientXFromEventObject from "../../../../src/helpers/events/getClientXFromEvent";

const slideSwipingDown = {};
const fsLightbox = {
    data: {
        isSwipingSlides: false,
        sourcesCount: 0
    },
    elements: {
        container: {
            current: document.createElement('div')
        }
    },
    core: {
        slideSwiping: {
            down: slideSwipingDown
        }
    }
};

let event = {
    target: {
        classList: {
            contains: () => {}
        }
    },
    preventDefault: () => {}
};
let swipingProps = {
    isSourceDownEventTarget: false,
    downClientX: 0
};

setUpSlideSwipingDown(fsLightbox, swipingProps);

const recreateSlideSwipingDownAndCallListener = () => {
    setUpSlideSwipingDown(fsLightbox, swipingProps);
    slideSwipingDown.listener(event);
};

describe('setting isSwipingSlides in data object to true', () => {
    beforeAll(() => {
        recreateSlideSwipingDownAndCallListener();
    });

    it('should set hasMovedWhileSwiping state to true', () => {
        expect(fsLightbox.data.isSwipingSlides).toBeTruthy();
    });
});


describe('calling or not calling preventDefault', () => {
    beforeEach(() => {
        event = {
            target: {
                classList: {
                    contains: () => {
                    }
                }
            },
            preventDefault: jest.fn(),
        };
    });

    describe('not calling preventDefault', () => {
        it('should not call preventDefault due to tag name equals VIDEO', () => {
            event.target.tagName = 'VIDEO';
            slideSwipingDown.listener(event);
            expect(event.preventDefault).not.toBeCalled();
        });

        // we are using passive events so we cannot preventDefault if event is touch event
        it(`should not call preventDefault due to event is touchstart,
             even if tag name is set and it's not VIDEO`, () => {
            // if we set touch event we need to set clientX because it is required in listener
            event.touches = [{ clientX: 0 }];
            event.target.tagName = 'IMAGE';
            slideSwipingDown.listener(event);
            expect(event.preventDefault).not.toBeCalled();
        });

        it(`should call preventDefault due to tagName equals VIDEO,
        even if event is not touchstart`, () => {
            event.target.tagName = 'VIDEO';
            slideSwipingDown.listener(event);
            expect(event.preventDefault).not.toBeCalled();
        });
    });

    describe('calling prevent default', () => {
        it('should call preventDefault because tag name isnt video and user is not on mobile device', () => {
            event.target.tagName = 'IMAGE';
            slideSwipingDown.listener(event);
            expect(event.preventDefault).toBeCalled();
        });
    });
});


describe('setting isSourceDownEventTarget if sources is target', () => {
    beforeAll(() => {
        swipingProps = {
            downClientX: 0,
            isAfterSwipeAnimationRunning: false,
            swipedDifference: 0,
            isSourceDownEventTarget: false,
        };
        setUpSlideSwipingDown(fsLightbox, swipingProps);
    });

    describe('not setting isSourceDownEventTarget', () => {
        beforeAll(() => {
            event.target.classList.contains = () => false;
            slideSwipingDown.listener(event);
        });

        it('should not set isSourceDownEventTarget', () => {
            expect(swipingProps.isSourceDownEventTarget).toBeFalsy();
        });
    });

    describe('setting isSourceDownEventTarget', () => {
        beforeAll(() => {
            event.target.classList.contains = () => true;
            slideSwipingDown.listener(event);
        });

        it('should set isSourceDownEventTarget to true', () => {
            expect(swipingProps.isSourceDownEventTarget).toBeTruthy();
        });
    });

    describe('setting isSourceDownEventTarget from true to false', () => {
        beforeAll(() => {
            swipingProps.isSourceDownEventTarget = true;
            event.target.classList.contains = () => false;
            slideSwipingDown.listener(event);
        });

        it('should set isSourceDownEventTarget to true', () => {
            expect(swipingProps.isSourceDownEventTarget).toBeFalsy();
        });
    });
});


describe('setting down client x', () => {
    beforeEach(() => {
        getClientXFromEventObject.getClientXFromEvent = (eventToGetClientX) => {
            if (Object.is(eventToGetClientX, event)) {
                return 1500;
            }
        };
        recreateSlideSwipingDownAndCallListener();
    });

    it('should attach to downClientX value from getClientXFromEvent', () => {
        expect(swipingProps.downClientX).toBe(1500);
    });
});

describe('resetting swipedDifference', () => {
    beforeEach(() => {
        swipingProps = {
            downClientX: 0,
            isAfterSwipeAnimationRunning: false,
            swipedDifference: 1000,
        };
        recreateSlideSwipingDownAndCallListener();
    });

    it('should set swipedDifference swiping prop to 0', () => {
        expect(swipingProps.swipedDifference).toEqual(0);
    });
});
