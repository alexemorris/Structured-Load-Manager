import elasticlunr from 'elasticlunr';
import path from 'upath';
import fs from 'fs-extra';
import uuidv1 from 'uuid';

export default class SearchIndex {
  constructor(columns, fulltext) {
    this.columns = columns.filter(col => col.settings.indexed);
    this.searchIndex = elasticlunr();
    this.searchIndex.addField('uuid');
    this.searchIndex.setRef('uuid');
    this.fullTextField = uuidv1();
    this.fulltext = fulltext === true;
    if (this.fulltext) {
      this.searchIndex.addField(this.fullTextField);
    }
    this.searchIndex.saveDocument(false);
    this.columns.forEach(x => this.searchIndex.addField(x.uuid));
    this.inverseLookup = {};
  }

  addDoc(doc, uuid, inputText, inputNative) {
    const search = this.columns
      .reduce((acc, curr) => (
        { ...acc, [curr.uuid]: doc[curr.uuid] }
      ), { uuid });

    if (this.fulltext) {
      let fullText = '';
      if (inputText && ['.pdf', '.txt', '.doc', '.docx'].indexOf(path.extname(inputNative)) !== -1) {
        try {
          fullText = fs.readFileSync(inputText).toString();
        } catch (err) {
          console.log(err);
        }
      }
      search[this.fullTextField] = fullText;
    }
    this.inverseLookup[uuid] = doc;
    this.searchIndex.addDoc(search);
  }

  search(query, config) {
    return this.searchIndex
      .search(query, { bool: 'AND', ...config })
      .map(x => this.inverseLookup[x.ref]);
  }

  toJSON() {
    return this.searchIndex.toJSON();
  }
}
