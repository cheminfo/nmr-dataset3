const { statSync, readFileSync, readdirSync, writeFileSync } = require('fs');
const { join } = require('path');

const URL_FOLDER = '.';
const DATA_FOLDER = 'multiplet';
const DATA_DIR = join(__dirname, DATA_FOLDER);

const dirs = readdirSync(DATA_DIR).filter((dir) => dir.match(/^.*$/)).filter(dir => statSync(join(DATA_DIR, dir)).isDirectory())
const template = JSON.parse(
  readFileSync(join(__dirname, './1h_template.json'), 'utf8'),
);
let index = 0;
let toc = [];
for (const dir of dirs) {
  index++;
  console.log(index, dir);
  let json = JSON.parse(JSON.stringify(template));
  let molfiles = readdirSync(join(DATA_DIR, dir)).filter(filename => filename.endsWith('.mol'))
  console.log(molfiles)
  for (let molfileName of molfiles) {
    let molfile = readFileSync(join(DATA_DIR, dir, molfileName), 'utf8');
    json.molecules.push({ molfile });
  }
  let jcamps = readdirSync(join(DATA_DIR, dir)).filter(filename => filename.endsWith('dx'))
  json.spectra[0].source.jcampURL = URL_FOLDER + '/' + dir + '/' + jcamps[0];
  json.spectra[0].display.name = dir;
  writeFileSync(
    join(DATA_DIR, dir, '1h.json'),
    JSON.stringify(json, undefined, 2),
    'utf8',
  );
  toc.push({
    file: URL_FOLDER + '/' + dir + '/1h.json',
    title: dir,
    view: '',
  });
}

writeFileSync(
  join(DATA_DIR, 'toc-new.json'),
  JSON.stringify(toc, undefined, 2),
  'utf8',
);
