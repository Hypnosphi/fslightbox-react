import React from 'react';
import { mount } from "enzyme";
import Image from "../../../../src/components/sources/properSources/Image";
import { testSourceDimensions } from "../../../schemas/testVariables";

/**
 * @class ImageMock
 * @param { FsLightbox } fsLightbox
 */
export function ImageMock(fsLightbox) {
    let index;
    let onFirstSourceLoad;
    let imageMock

    this.fakeSourceDimensions = () => {
        fsLightbox.sourcesData.sourcesDimensions[0] = testSourceDimensions;
    };

    this.setIndex = (i) => {
        index = i;
    };

    this.setOnFirstSourceLoad = (func) => {
        onFirstSourceLoad = func;
    };

    this.createImageMock = () => {
         imageMock = mount(<Image
             urls={ fsLightbox.data.urls }
             sourcesData={ fsLightbox.sourcesData }
             sources={ fsLightbox.elements.sources }
             i={ (index) ? index : 0 }
             onFirstSourceLoad={ (onFirstSourceLoad) ? onFirstSourceLoad : jest.fn }
         />);

         return returnObjectWithGetImageMockFunction();
    };

    const returnObjectWithGetImageMockFunction = () => {
        return {
            getImageMock: () => imageMock
        }
    };
}