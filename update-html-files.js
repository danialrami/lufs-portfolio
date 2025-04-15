// Update index.html to include new CSS and JS files

// 1. First, let's modify the index.html file to include our new CSS and JS files
document.addEventListener('DOMContentLoaded', function() {
  // Get all HTML files in the project directory
  const htmlFiles = [
    'index.html',
    'sound-design.html',
    'music-composition.html',
    'technical-audio.html',
    'case-study-template.html',
    'project-template.html'
  ];
  
  // Process each HTML file
  htmlFiles.forEach(file => {
    updateHtmlFile(file);
  });
  
  function updateHtmlFile(filename) {
    // Read the HTML file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', filename);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add new CSS files before the closing </head> tag
    const cssInsert = `
    <link rel="stylesheet" href="css/mobile-menu.css">
    <link rel="stylesheet" href="css/font-implementation.css">`;
    
    content = content.replace('</head>', `${cssInsert}\n</head>`);
    
    // Replace the three-background.js with our optimized version
    // content = content.replace(
    //   '<script src="js/three-background.js"></script>',
    //   '<script src="js/optimized-three-background.js"></script>'
    // );
    
    // Add mobile-menu.js before the closing </body> tag
    const jsInsert = `
    <script src="js/mobile-menu.js"></script>`;
    
    content = content.replace('</body>', `${jsInsert}\n</body>`);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename}`);
  }
});
