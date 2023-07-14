const fs = require("fs");
const Terser = require("terser");

async function minifyCode() {
  // Read the file
  const code = fs.readFileSync(
    "/Users/davide/Documents/coding/chainstack-dlp/lib/compromise.js",
    "utf8"
  );

  try {
    console.log("Minifying...");
    // Minify the code
    const minified = await Terser.minify(code);

    // Handle any errors during minification
    if (minified.error) {
      console.log("Error during minification:", minified.error);
      return;
    }

    // Write the minified code to a new file
    fs.writeFileSync(
      "/Users/davide/Documents/coding/chainstack-dlp/lib/minified/compromise.min.js",
      minified.code
    );
  } catch (error) {
    console.log("Error:", error);
  }
}

// Call the function
minifyCode();
