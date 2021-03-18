const { existsSync, readFileSync, readdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const URL_FOLDER = '.';
const DATA_FOLDER = 'multiplet';
const DATA_DIR = join(__dirname, DATA_FOLDER);

const dirs = readdirSync(DATA_DIR).filter((dir) => dir.match(/^.*$/));
console.log(dirs)
const template = JSON.parse(
  readFileSync(join(__dirname, './1h_template.json'), 'utf8'),
);
let index = 0;
let toc = [];
for (const dir of dirs) {
  index++;
  console.log(index, dir);
  let json = JSON.parse(JSON.stringify(template));
  let molfileName = join(DATA_DIR, dir, 'structure.mol')
  if (existsSync(molfileName)) {
    let molfile = readFileSync(molfileName, 'utf8');
    json.molecules[0].molfile = molfile;
  }
  json.spectra[0].source.jcampURL = URL_FOLDER + '/' + dir + '/1h.dx';
  json.spectra[0].display.name = 'Exercise ' + index;
  writeFileSync(
    join(DATA_DIR, dir, '1h.json'),
    JSON.stringify(json, undefined, 2),
    'utf8',
  );
  toc.push({
    file: URL_FOLDER + '/' + dir + '/1h.json',
    title: 'Exercise ' + index,
    view: 'Exercise',
  });
}

writeFileSync(
  join(DATA_DIR, 'toc-new.json'),
  JSON.stringify(toc, undefined, 2),
  'utf8',
);
