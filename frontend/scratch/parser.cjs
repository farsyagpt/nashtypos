const fs = require('fs');

function processMockup(sourceHtmlPath, outCssPath, outJsxPath) {
  if (!fs.existsSync(sourceHtmlPath)) {
    console.log(`Source not found: ${sourceHtmlPath}`);
    return;
  }
  const html = fs.readFileSync(sourceHtmlPath, 'utf-8');
  
  // Extract styles
  const styleMatches = [...html.matchAll(/<style>([\s\S]*?)<\/style>/gi)];
  let cssContent = '';
  styleMatches.forEach(m => cssContent += m[1] + '\n');
  if (cssContent) {
    fs.writeFileSync(outCssPath, cssContent);
    console.log(`Extracted CSS to ${outCssPath}`);
  }

  // Extract body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    let jsx = bodyMatch[1];
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
    jsx = jsx.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
    jsx = jsx.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');
    jsx = jsx.replace(/<br([^>]*?)(?<!\/)>/g, '<br$1 />');
    jsx = jsx.replace(/<hr([^>]*?)(?<!\/)>/g, '<hr$1 />');
    jsx = jsx.replace(/style=\"([^\"]*)\"/g, (match, styleStr) => {
      const styleObj = {};
      styleStr.split(';').forEach(rule => {
        let splitIdx = rule.indexOf(':');
        if (splitIdx > -1) {
          let key = rule.substring(0, splitIdx).trim();
          let val = rule.substring(splitIdx + 1).trim();
          key = key.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
          styleObj[key] = val;
        }
      });
      return 'style={{ ' + Object.entries(styleObj).map(([k,v]) => k + ':\'' + v.replace(/'/g, "\\\\'") + '\'').join(', ') + ' }}';
    });
    // some SVG fixes
    jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
    jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
    jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
    jsx = jsx.replace(/fill-rule=/g, 'fillRule=');
    jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    fs.writeFileSync(outJsxPath, jsx);
    console.log(`Extracted JSX to ${outJsxPath}`);
  }
}

// Process POS
processMockup(
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/NASHTY_POS_Mockup.html',
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/pos/POSPage.css',
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/pos/pos_body.jsx'
);

// Process KDS
processMockup(
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/NASHTY_KDS_Mockup.html',
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/kds/KDSPage.css',
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/kds/kds_body.jsx'
);

// Process Backoffice
processMockup(
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/NASHTY_Backoffice_Mockup_8.html',
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/backoffice/BackofficePage.css',
  'c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/backoffice/backoffice_body.jsx'
);
