import { ipcRenderer, remote } from 'electron';
import fs from 'fs-extra';
import path from 'upath';
import asar from 'asar';
import cp from 'child_process';
import md5 from 'md5';
import uuidv1 from 'uuid';
// import filenamify from 'filenamify';
import nm from 'nanomatch';
import Progress from '../progress';
import { encrypt } from '../../../utils/crytpography';

import {
  SET_PACKAGING_PROGRESS,
  SET_PACKAGING_COMPLETE,
  SET_ENCRYPTING_COMPLETE,
  SET_PACKAGING_FAILED
} from '../../ui/features/steps/packaging/duck';

const writeEncryptedBuffer = (bufferInput, fileOutput, password) => {
  fs.writeFileSync(fileOutput, encrypt(bufferInput, password));
};

const writeEncryptedFile = (fileInput, fileOutput, password) => {
  fs.writeFileSync(fileOutput, encrypt(fs.readFileSync(fileInput), password));
};

const writeEncryptedString = (stringInput, fileOutput, password) => {
  fs.writeFileSync(fileOutput, encrypt(stringInput, password));
};

const getBundle = (bundle) => {
  let output = {
    title: bundle.name,
    value: bundle.settings.filterValue,
    id: bundle.settings.id || null,
    column: bundle.settings.filterColumn,
    bundles: bundle.nodes ? bundle.nodes.map(getBundle) : []
  };

  if (bundle.nodes.length) {
    output = { ...output, bundles: bundle.nodes.map(getBundle) };
  }
  return output;
};

const getColumn = (column) => ({
  name: column.uuid,
  description: column.name,
  type: column.settings.type === 'date' ? 'string' : column.settings.type,
  visible: column.settings.visible
});

export default (values, inMapping, columns, bundles, settings, searchIndex,
  nativeList, textList, password, metadatadir, outputFileName) => {
  console.log(`Starting packaging with password ${password}`);
  const progress = new Progress(values.length, 'packaging');
  const passwordHash = md5(`${password}ebundler`);
  const tempOut = path.join(metadatadir, `TEMP_PACKAGING_EBUNDLE_DO_NOT_DELETE_${passwordHash}`);
  fs.ensureDirSync(tempOut);

  const mappings = {
    ...inMapping,
    nativeGUID: uuidv1(),
    textGUID: uuidv1(),
    thumbGUID: uuidv1(),
    filename: uuidv1(),
    thumb: uuidv1()
  };

  const nativeMap = nativeList.filter(x => x.full).reduce((acc, curr) => (
    { ...acc, [curr.uuid]: curr.full }
  ), {});

  const textMap = textList.filter(x => x.full).reduce((acc, curr) => (
    { ...acc, [curr.uuid]: curr.full }
  ), {});

  const thumbdir = process.env.NODE_ENV === 'development' ? `${__dirname}/packaging/thumbs` :
    `${remote.app.getAppPath()}/_renderer/processing/packaging_new/thumbs`;
  const placeholders = fs.readdirSync(thumbdir).filter(x => x.endsWith('.png')).reduce((acc, curr) => {
    const guid = `placeholder${uuidv1()}.png`;
    writeEncryptedFile(path.join(thumbdir, curr), path.join(tempOut, guid), password);
    return {
      ...acc,
      [path.removeExt(curr, '.png')]: guid
    };
  }, {});

  const index = values.map(entry => {
    const uuid = entry[mappings.uuid];
    const title = entry[mappings.title];
    const filepath = nativeMap[uuid];
    if (!filepath) {
      return null;
    }

    const textpath = textMap[uuid];
    const fileext = path.extname(filepath);

    let basename;
    if (entry[mappings.title]) {
      basename = `${entry[mappings.title]} (${entry[mappings.uuid]})`;
    } else {
      basename = entry[mappings.uuid];
    }
    const filename = path.addExt(basename, fileext);
    progress.increment(1, `Encrypting ${title}`);

    const nguid = `native${md5(`${filename}${password}`)}${fileext}`;
    let iguid = `thumb${md5(`${filename}${password}thumb`)}.png`;
    const tguid = `text${md5(`${filename}${password}text`)}.txt`;

    let thumb = false;
    const nativeOut = path.join(tempOut, nguid);
    const imageOut = path.join(tempOut, iguid);
    const textOut = path.join(tempOut, tguid);

    if (filepath && fs.existsSync(filepath) && !fs.existsSync(nativeOut)) {
      writeEncryptedFile(filepath, nativeOut, password);

      if (fileext === '.pdf' && !fs.existsSync(imageOut)) {
        try {
          const thumbnail = cp.execSync(`gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r100 -dFirstPage=1 -dLastPage=1 -sOutputFile=%stdout '${filepath}'`, {
            timeout: 10000
          });
          writeEncryptedBuffer(thumbnail, path.join(tempOut, iguid), password);
          thumb = true;
        } catch (err) {
          console.log(`Error producing thumbnail for ${filepath} ${err.toString()}`);
        }
      }
    }

    if (!thumb && !fs.existsSync(imageOut)) {
      let matches = Object.keys(placeholders).filter(x => nm.isMatch(fileext, `.${x}`));
      if (matches.length > 1) {
        matches = matches.filter(x => x !== '*');
      }
      if (matches.length === 1) {
        iguid = placeholders[matches[0]];
      } else {
        iguid = placeholders['*'];
      }
      thumb = true;
    }

    if (filepath && fs.existsSync(textpath) && !fs.existsSync(textOut)) {
      writeEncryptedFile(textpath, textOut, password);
    }

    const output = {
      ...entry,
      [mappings.nativeGUID]: nguid,
      [mappings.textGUID]: tguid,
      [mappings.thumbGUID]: iguid,
      [mappings.filename]: filename,
      [mappings.thumb]: thumb
    };
    return output;
  }).filter(x => x);

  progress.increment(0, 'Encrypting Metadata');

  const data = {
    index,
    columns: columns.map(getColumn),
    bundles: bundles.map(getBundle),
    mappings
  };

  writeEncryptedString(JSON.stringify(searchIndex.toJSON()), path.join(tempOut, 'search.json'), password);
  writeEncryptedString(JSON.stringify(data), path.join(tempOut, 'data.json'), password);
  fs.writeJsonSync(path.join(tempOut, 'info.json'), settings);

  ipcRenderer.send(SET_ENCRYPTING_COMPLETE);
  progress.indeterminate('Packaging ebundle output');

  asar.createPackage(tempOut, outputFileName, () => {
    ipcRenderer.send(SET_PACKAGING_COMPLETE, { filename: outputFileName });
    progress.complete();
  });
};
