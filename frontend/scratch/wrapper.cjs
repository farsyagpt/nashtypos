const fs = require('fs');

['pos', 'kds', 'backoffice'].forEach(mod => {
  const compMap = { pos: 'POSPage', kds: 'KDSPage', backoffice: 'BackofficePage' };
  const jsxPath = `c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/${mod}/${mod}_body.jsx`;
  const tsxPath = `c:/Users/zaidu/OneDrive/Documents/nashtyfull/frontend/src/pages/${mod}/${compMap[mod]}.tsx`;
  if(fs.existsSync(jsxPath)) {
    let content = fs.readFileSync(jsxPath, 'utf8');
    const wrap = `import React from 'react';\nimport './${compMap[mod]}.css';\n\nconst ${compMap[mod]} = () => {\n  return (\n    <>\n${content}\n    </>\n  );\n};\n\nexport default ${compMap[mod]};\n`;
    fs.writeFileSync(tsxPath, wrap);
    console.log('Wrapped ' + mod);
  }
});
