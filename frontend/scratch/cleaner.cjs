const fs = require('fs');
['pos', 'kds', 'backoffice'].forEach(mod => {
  const compMap = { pos: 'POSPage', kds: 'KDSPage', backoffice: 'BackofficePage' };
  const htmlPath = `c:/Users/zaidu/OneDrive/Documents/nashtyfull/NASHTY_${mod === 'pos' ? 'POS_Mockup' : mod === 'kds' ? 'KDS_Mockup' : 'Backoffice_Mockup_8'}.html`;
  const tsxPath = `c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/${mod}/${compMap[mod]}.tsx`;
  
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      let jsx = bodyMatch[1];
      // Remove all script tags
      jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      jsx = jsx.replace(/class=/g, 'className=');
      jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
      jsx = jsx.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
      jsx = jsx.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');
      jsx = jsx.replace(/<br([^>]*?)(?<!\/)>/g, '<br$1 />');
      jsx = jsx.replace(/<hr([^>]*?)(?<!\/)>/g, '<hr$1 />');
      jsx = jsx.replace(/onclick=\"[^\"]*\"/g, 'onClick={() => {}}');
      jsx = jsx.replace(/oninput=\"[^\"]*\"/g, 'onChange={() => {}}');
      jsx = jsx.replace(/onfocus=\"[^\"]*\"/g, 'onFocus={() => {}}');
      jsx = jsx.replace(/onblur=\"[^\"]*\"/g, 'onBlur={() => {}}');
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
        return 'style={{ ' + Object.entries(styleObj).map(([k,v]) => k + ':\'' + v.replace(/'/g, "\\'") + '\'').join(', ') + ' }}';
      });
      jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
      jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
      jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
      jsx = jsx.replace(/fill-rule=/g, 'fillRule=');
      jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
      jsx = jsx.replace(/for=/g, 'htmlFor=');
      
      const wrap = `import React from 'react';\nimport './${compMap[mod]}.css';\n\nconst ${compMap[mod]} = () => {\n  return (\n    <>\n${jsx}\n    </>\n  );\n};\n\nexport default ${compMap[mod]};\n`;
      fs.writeFileSync(tsxPath, wrap);
      console.log('Cleaned and wrapped ' + mod);
    }
  }
});
