# Images Viewer.

Simple, lightweight pure JavaScript component that implement images viewer.

## Demo

https://jagermesh.github.io/js-images-viewer/

## Usage:

1) Include the script:

~~~
<script type="text/javascript" src="images-viewer.js"></script>
~~~

2) Create ImagesViewer instance

~~~
const imagesViewer = new ImagesViewer();
~~~

3) Activate when needed

~~~
const images = [];
images.push({
  url: 'url,
  video_url: 'url' // optional
  title: 'title' // optionsl
});
imagesViewer.show(images, {
  activeImage: 'url', // optional
  title: 'Wonderful images gallery' // optional
});
~~~

That's all.

Have fun. Send PR if you find any glitches or want to make improvements.

:)
