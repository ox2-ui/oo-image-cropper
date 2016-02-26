//
//      ooImageCropper: Lifecycle Hooks
//

Template.ooImageCropper.onCreated(function() {
  console.log(this.data);
  // this.output = new ReactiveVar('');
  // this.outputResized = new ReactiveVar('');
  // this.el = {};
  // this.uploading = new ReactiveVar(false);
  // this.link = new ReactiveVar('');
  // this.deleteHash = new ReactiveVar('');
  this.imageData = new ReactiveVar('');
  this.cropperSettings = new ReactiveVar(this.data.cropperSettings);
});



//
//      ooImageCropper: Helpers
//

Template.ooImageCropper.helpers({
  // uploading() {
  //   return Template.instance().uploading.get();
  // },
  imageData() {
    return Template.instance().imageData.get();
  },
});

//
//      ooImageCropper: Event Handlers
//

Template.ooImageCropper.events({
  'change .js-file'(e, t) {
    const file = e.target.files[0];
    if (file) {
      const imageType = /^image\//;

      if (imageType.test(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          // t.imageData.set(reader.result);
            ooModalOpen({
              id: 'ooImageCropperModalId',
              oo: 'type:fullscreen level:1',
              ooColor: 'back:backdrop-alt',
              modalTemplate: 'ooImageCropperModal',
              docId: this.docId,
              collection: this.collection,
              dataURL: reader.result,
              cropperSettings: t.cropperSettings.get(),
            });
          };

          t.$('.js-file').val('');
        reader.readAsDataURL(file);
        };
      } else {
        oo.log('red', `not an image`);
      }
  },
  // 'click .js-getCroppedCanvas'(e, t) {
  //   t.output.set(t.el.cropper('getCroppedCanvas').toDataURL());
  //   t.outputResized.set(t.el.cropper('getCroppedCanvas', {width: 600, height: 600}).toDataURL());
  // },
});

Template.ooImageCropperModal.onCreated(function() {
  this.uploading = new ReactiveVar(false);
});

/**
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth Source area width
 * @param {Number} srcHeight Source area height
 * @param {Number} maxWidth Fittable area maximum available width
 * @param {Number} maxHeight Fittable area maximum available height
 * @return {Object} { width, heigth }
 */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

Template.ooImageCropperModal.onRendered(function() {
  const img = document.querySelector('.ooImage');
  loadImage(this.data.dataURL, (imgData) => {
    img.src = imgData.src;
    this.el = $(img).cropper(this.data.cropperSettings);
  }, { maxWidth: 964,
    maxHeight: 964,
   }
  );
  // img.src = this.data.dataURL;

  // img.onload = () => {
  //   const longEndge = '';
  //   if (img.width > img.height) {
  //     longEdge = 'width';
  //   } else {
  //     longEdge = 'height';
  //   }
  //   if (img[longEdge] > 964) {
  //     const metrics = calculateAspectRatioFit(img.width, img.height, 964, 964);
  //     // if img > 1200, resize proportionally
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');
  //     canvas.width = metrics.width;
  //     canvas.height = metrics.height;
  //     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //     img.src = canvas.toDataURL();
  //   }
  //   // set the cropper element to current instance
  //   this.el = $(img).cropper(this.data.cropperSettings);
  // };
});

Template.ooImageCropperModal.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
});

Template.ooImageCropperModal.events({
  'click .js-upload'(e, t) {
    const outputResult = t.el.cropper('getCroppedCanvas').toDataURL();
    // t.outputResized.set(t.el.cropper('getCroppedCanvas', {width: 600, height: 600}).toDataURL());
    t.uploading.set(true);
    Imgur.upload({
      image: outputResult,
      type: 'base64',
      apiKey: 'ef011b34c77b0b0',
      mashapeKey: 'ecMZbM7NdSmsh1zc7n78tbVpk0Mrp15VSGMjsnYYpX0xJ8uP9D',
    }, (error, data) => {
      t.uploading.set(false);
      if (error) {
        console.log(error);
      } else {
        const query = {
          $addToSet: {
            deleteHash: data.deletehash,
          },
          $set: {},
        };
        query.$set[this.fieldName ? this.fieldName : 'picture'] = data.link;
        if (this.collection && this.docId && !!Collection[this.collection]) {
          Collection[this.collection].update({_id: this.docId}, query, (err, res) => {
            if (err) {
              console.log(err);
              ooModalClose('ooImageCropperModalId');
            } else {
              ooModalClose('ooImageCropperModalId');
            }
          });
        } else {
          console.log(`Not enough parameters passed : collection:${this.collection}, docId:${this.docId}`);
        }
      }
    });
  },
  'click .js-cancel'() {
    ooModalClose('ooImageCropperModalId');
  },
  'click .js-rotateCounterClockWise'(e, t) {
    t.el.cropper('rotate', -90);
  },
  'click .js-rotateClockWise'(e, t) {
    t.el.cropper('rotate', 90);
  },
});
