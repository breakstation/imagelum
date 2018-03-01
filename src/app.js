
/**
 * BACKGROUND_IMAGE_SELECTOR
 * Sets the selector to replace the background image with image/overlay
 * @type {String}
 */
const BACKGROUND_IMAGE_SELECTOR   = '.image_background';

/**
 * BACKGROUND_COLOR_RGB
 * Base RGB background color, i.e.: rgba(BACKGROUND_COLOR_RGB, $alpha)
 * @type {String}
 */
const BACKGROUND_COLOR_RGB        = '0,0,0';

/**
 * DARKNESS_COEFFICIENT
 * Detemines overlay darkness. Divides [luminosity]/DARKNESS_COEFFICIENT to get overlay opacity.
 * Must be > 1 (under 1 and you'll get opacities greater than 1.0) and < ~4 (over 4 you'll pretty much lose all opacity no matter how bright the image).
 * Somewhere between 1.25 - 2.5 seems best, but design guidelines, text color, treatments, etc. should help further dictate this
 * @type {String}
*/
const DARKNESS_COEFFICIENT = 1.85;


(function(){

  let image_elements = document.querySelectorAll(BACKGROUND_IMAGE_SELECTOR);

  image_elements.forEach(function(element) {
    element.style.background = "url('" + element.dataset.background + "')";

    /**
     * Create a new image object and process in Canvas
     */
    let background = new Image();
    background.src = element.dataset.background;
    background.onload = () => {
      let luminosity = getLuminosity(background);
      let gradient_opacity = luminosity / DARKNESS_COEFFICIENT;
      element.style.background = "linear-gradient(rgba(" + BACKGROUND_COLOR_RGB + "," + gradient_opacity + "), rgba(0,0,0," + gradient_opacity + ")), url('" + element.dataset.background + "')";

      // DEBUG: remove this for production
      debugDetails(element, luminosity);
    }
})

/**
 * Debug helper - outputs data-attr and appends content for development
 * @param  {[type]} element    [description]
 * @param  {[type]} luminosity [description]
 * @return {[type]}            [description]
 */
function debugDetails(element, luminosity)
{
  // add luminosity data attr to our main element for debugging
  element.dataset.luminosity = luminosity;
  // appends the luminosity & opacity to the .content div for debugging:
  element.innerHTML +=  "Image lum : " + Math.floor(luminosity*100) + "% | Overlay opacity: " + + Math.floor((luminosity / DARKNESS_COEFFICIENT)*100) + "%";
}


/**--------------------------------------------------------------------
 *  Image functions
 *--------------------------------------------------------------------*/

/**
 * Returns this images luminosity value
 * @param  image img image to process
 * @return float     image luminosity: between 0 and 1
 *
 * Converting RGB -> Luma for for better human perception, as different colors are perceived having diffferent brightnesses:
 * https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color/596241#596241
 */
  function getLuminosity(img)
  {
    let rgb = getAverageColor(img)
    console.log(rgb);
    let luminosity = ((rgb.r * 2 + rgb.g *3 + rgb.b) / 6)  / 255;

    return luminosity;
  }

/**
 * Creates a new Canvas objec in order to process and return the image's average color as an object
 * @param  image img
 * @return obj   object containing average RGB colors {r: [redValue], g: [greenValue], b: [blueValue]]}
 */
  function getAverageColor(img)
  {
    let canvas  = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let width   = canvas.width = img.naturalWidth;
    let height  = canvas.height = img.naturalHeight;

    // redraw our image for further processing
    context.drawImage(img, 0, 0);

    let image_data = context.getImageData(0, 0, width, height);
    let data = image_data.data;

    let r = 0; g = 0; b = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
    }

    r = getChannelAverageColor(r, data.length);
    g = getChannelAverageColor(g, data.length);
    b = getChannelAverageColor(b, data.length);

    return { r: r, g: g, b: b };
  }

  /**
   * Returns the average color for each color channel (RGB)
   * @param  int channel length of individual color channel
   * @param  int length  length of composite image
   * @return int         calculated length of this color channel
   */
  function getChannelAverageColor(channel, length)
  {
    let value = Math.floor(channel / (length / 4));

    return value;
  }

}());
