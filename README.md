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
});
imagesViewer.show(images, {
  activeImage: 'url',
  title: 'Wonderful images gallery'
});
~~~

That's all.

Have fun. Send PR if you find any glitches or want to make improvements.

:)
