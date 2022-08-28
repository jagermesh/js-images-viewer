(function(window) {

  class ImagesViewer {
    constructor() {
      const _this = this;

      _this.holder = null;

      const styles = `
        .image-viewer-backdrop {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: black;
          z-index: 10000;
          opacity: 0.75;
        }
        .image-viewer-container {
          position: fixed;
          left: 20px;
          right: 20px;
          top: 20px;
          bottom: 20px;
          background-color: white;
          z-index: 10001;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          background-color: black;
        }
        .image-viewer-current-image {
          position: absolute;
          left: 40px;
          right: 40px;
          top: 0;
          bottom: 120px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
        .image-viewer-current-image iframe {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .image-viewer-images {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 120px;
          overflow-x: auto;
          white-space: nowrap;
          background-color: black;
          border-top: 1px solid #888;
          display: flex;
        }
        .image-viewer-title {
          position: absolute;
          bottom: 0;
          right: 2px;
          background-color: #222;
          color: white;
          font-size: 20px;
          padding: 5px;
          padding-left: 10px;
          padding-right: 10px;
          opacity: 0.75;
          color: white;
        }
        .image-viewer-index {
          position: absolute;
          top: 0;
          right: 2px;
          background-color: #222;
          color: white;
          font-size: 20px;
          padding: 5px;
          padding-left: 10px;
          padding-right: 10px;
          opacity: 0.75;
          color: white;
        }
        .action-image-viewer-close-viewer {
          position: absolute;
          right: -40px;
          top: 0;
          width: 40px;
          height: 40px;
          background-color: #222;
          text-align: center;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          opacity: 0.75;
          color: white;
          border-top-right-radius: 5px;
        }
        .action-image-viewer-prev-image {
          position: absolute;
          left: -40px;
          bottom: 0;
          width: 40px;
          top: 0;
          background-color: #222;
          text-align: center;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          opacity: 0.75;
          color: white;
          border-top-left-radius: 5px;
        }
        .action-image-viewer-next-image {
          position:absolute;
          right: -40px;
          bottom: 0;
          width: 40px;
          top: 42px;
          background-color: #222;
          text-align: center;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          opacity: 0.75;
          color: white;
        }
        .action-image-viewer-close-viewer:hover,
        .action-image-viewer-prev-image:hover,
        .action-image-viewer-next-image:hover {
          opacity: 1;
          color: black;
          background-color: #AAAAAA;
        }
        .image-viewer-image {
          height: 100%;
          border: 1px solid transparent;
        }
        .image-viewer-image.active {
          border: 1px solid white;
          cursor: pointer;
        }
        .action-image-viewer-close-viewer,
        .action-image-viewer-prev-image,
        .action-image-viewer-next-image {
          cursor: pointer;
        }

        @media (max-height: 400px) {
          .image-viewer-images {
            height: 60px;
          }
          .image-viewer-current-image {
            bottom: 60px;
          }
        }
      `;

      let stylesContainer = document.head.querySelectorAll('style.image-viewer');

      if (stylesContainer.length === 0) {
        stylesContainer = document.createElement('style');
        stylesContainer.className = 'image-viewer';
        stylesContainer.textContent = styles;
        document.head.append(stylesContainer);
      }

      _this.viewerTemplate = `
        <div class="image-viewer-backdrop">
        </div>
        <div class="image-viewer-container">
          <div class="image-viewer-current-image">
            <iframe frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:none;">
            </iframe>
            <div class="image-viewer-title">

            </div>
            <div class="image-viewer-index">

            </div>
            <div class="action-image-viewer-close-viewer">
              <i class="fas fa-times"></i>
            </div>
            <div class="action-image-viewer-prev-image" >
              <i class="fas fa-chevron-left"></i>
            </div>
            <div class="action-image-viewer-next-image">
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          <div class="image-viewer-images">
          </div>
        </div>
      `;

      const handledKeyCodes = [
        'ArrowRight',
        'ArrowLeft',
        'Escape',
        'Enter',
      ];

      document.addEventListener('keydown', (evt) => {
        if (_this.holder && (handledKeyCodes.indexOf(evt.code) !== -1)) {
          if (evt.code == 'ArrowRight') {
            _this.activateNext();
          }
          if (evt.code == 'ArrowLeft') {
            _this.activatePrev();
          }
          if (evt.code == 'Escape') {
            _this.hide();
          }
          if (evt.code == 'Enter') {
            _this.hide();
          }
          evt.preventDefault();
        }
      }, { capture: true });
    }

    hide() {
      const _this = this;
      document.body.style.overflow = '';
      _this.holder.remove();
      _this.holder = null;
    }

    getElementIndex(el) {
      if (!el) {
        return 0;
      }
      let i = 0;
      while ((el = el.previousElementSibling)) {
        i++;
      }
      return i;
    }

    activateImage(image) {
      const _this = this;

      const src = image.getAttribute('src');

      for(const oneImage of _this.imagesBank) {
        oneImage.classList.remove('active');
      }

      image.classList.add('active');

      const curIndex = _this.getElementIndex(image) + 1;

      _this.activeImageIndexContainer.textContent = `${curIndex}/${_this.imagesBank.length}`;

      const videoUrl = image.getAttribute('data-video-url');

      if (videoUrl) {
        _this.currentImageContainer.style.backgroundImage = ''
        _this.currentVideoContainer.setAttribute('src', videoUrl);
        _this.currentVideoContainer.style.display = '';
      } else {
        _this.currentImageContainer.style.backgroundImage = `url("${src}")`;
        _this.currentVideoContainer.setAttribute('src', '');
        _this.currentVideoContainer.style.display = 'none';
      }

      image.scrollIntoViewIfNeeded(true);
    }

    activateNext() {
      const _this = this;

      const image = _this.holder.querySelector('.image-viewer-image.active');

      if (image) {
        let nextImage = image.nextElementSibling;

        if (!nextImage) {
          if (_this.imagesBank.length > 0) {
            nextImage = _this.imagesBank[0];
          }
        }

        if (nextImage) {
          _this.activateImage(nextImage);
        }
      }
    }

    activatePrev() {
      const _this = this;

      const image = _this.holder.querySelector('.image-viewer-image.active');

      if (image) {
        let nextImage = image.previousElementSibling;

        if (!nextImage) {
          if (_this.imagesBank.length > 0) {
            nextImage = _this.imagesBank[_this.imagesBank.length - 1];
          }
        }

        if (nextImage) {
          _this.activateImage(nextImage);
        }
      }
    }

    show(images, settings) {
      const _this = this;

      let params = Object.assign({
        activeImage: null,
        title: '',
      }, settings);

      _this.holder = document.createElement('div');
      _this.holder.innerHTML = _this.viewerTemplate;

      _this.currentImageContainer = _this.holder.querySelector('.image-viewer-current-image');
      _this.currentVideoContainer = _this.currentImageContainer.querySelector('iframe');
      _this.activeImageIndexContainer = _this.holder.querySelector('.image-viewer-index')
      _this.imageViewerTitleContainer = _this.holder.querySelector('.image-viewer-title')
      _this.imagesContainer = _this.holder.querySelector('.image-viewer-images')

      _this.imageViewerTitleContainer.innerHTML = params.title;

      images.forEach(function(image) {
        let img = document.createElement('img');
        img.classList.add('image-viewer-image');
        img.setAttribute('src', image.url);
        if (image.video_url) {
          img.setAttribute('data-video-url', image.video_url);
        }
        _this.imagesContainer.appendChild(img);
      });

      document.body.appendChild(_this.holder);
      document.body.style.overflow = 'hidden';

      _this.imagesBank = _this.holder.querySelectorAll('.image-viewer-image');

      let activateCandidate;

      if (params.activeImage) {
        activateCandidate = _this.holder.querySelector(`.image-viewer-image[src="${params.activeImage}"]`);
      }

      if (!activateCandidate || (activateCandidate.length === 0)) {
        activateCandidate = _this.holder.querySelector('.image-viewer-image');
      }

      _this.activateImage(activateCandidate);

      for(const oneImage of _this.imagesBank) {
        oneImage.addEventListener('click', function() {
          _this.activateImage(this);
        });
      }

      _this.holder.querySelector('.action-image-viewer-close-viewer').addEventListener('click', function() {
        _this.hide();
        this.blur();
      });

      _this.holder.querySelector('.action-image-viewer-prev-image').addEventListener('click', function() {
        _this.activatePrev();
        this.blur();
      });

      _this.holder.querySelector('.action-image-viewer-next-image').addEventListener('click', function() {
        _this.activateNext();
        this.blur();
      });

      _this.holder.querySelector('.image-viewer-backdrop').addEventListener('click', function() {
        _this.hide();
      });

      let xDown = null;
      let yDown = null;
      let swipeDirection = null;

      _this.currentImageContainer.addEventListener('touchstart', function(evt) {
        if (evt.touches) {
          xDown = evt.touches[0].clientX;
          yDown = evt.touches[0].clientY;
        }
      });

      _this.currentImageContainer.addEventListener('touchmove', function(evt) {
        if (!xDown || !yDown) {
          return;
        }
        if (evt.touches) {
          let xUp = evt.touches[0].clientX;
          let yUp = evt.touches[0].clientY;
          let xDiff = xDown - xUp;
          let yDiff = yDown - yUp;
          if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
              swipeDirection = 'right';
            } else {
              swipeDirection = 'left';
            }
          } else
          if (yDiff > 0) {
            swipeDirection = 'right';
          } else {
            swipeDirection = 'left';
          }
          xDown = null;
          yDown = null;
        }
      });

      _this.currentImageContainer.addEventListener('touchend', function() {
        if (swipeDirection == 'left') {
          _this.activatePrev();
        } else
        if (swipeDirection == 'right') {
          _this.activateNext();
        }
        swipeDirection = null;
      });
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ImagesViewer; else window.ImagesViewer = ImagesViewer;

})(window);
