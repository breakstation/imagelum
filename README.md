# ImageLum
__Image brightness / luminosity normalizer for text over image__

A JS/Canvas based cross-browser _(support back to IE 9)_ method of applying a fade/overlay to a containers background images. Useful when using full-size/background: cover style images behind text blocks.

Differs from other methods:
- adding seperate, absolutely positioned overlay element with opacity (unnecessary markup)
- adding a static background gradient to every image via CSS (works but has no granular/individual image support)

... in that it calculates the average luminosity, based on human sight preferences [more info](https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color/596241#596241), of each individual image to determine the overlay value required. This means that images that are darker will receive a less opaque overlay, brighter images will receive a more opaque overlay.

The overlay is generated on the container using CSS background, eg: `background: linear-gradient(rgba(0,0,0,[calculatedOpacity]),rgba(0,0,0,[calculatedOpacity])) url('path/to/image/file.jpg')`.

## Usage

- Set `const BACKGROUND_IMAGE_SELECTOR   = '.image_background';` in `src/app/js` to define your selector.
- Image URLs will need to be added to the above containers with `data-background='full/path/to/your/image.jpg'`
- The defined `data-background` image will be processed to find it's luminosity, then set the background with a linear-gradient and the image URL.


That's it.

See `example/` for a example usage.
