const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const PATH_PREFIX = '/dir/';

const listOps = dir =>
  fs.readdirSync(dir)
    .reduce((files, file) => {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        files.push(...listOps(path.join(dir, file)))
      } else if(file === 'op.yml') {
        const opYmlPath = path.join(dir, file);
        const op = jsYaml.safeLoad(fs.readFileSync(opYmlPath))
        files.push({
          path: opYmlPath.slice(PATH_PREFIX.length),
          name: op.name,
        });
      }
      return files;
    },
    []);

fs.writeFileSync('/ops', JSON.stringify(listOps(PATH_PREFIX)));