var colors = require('colors');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('upath');
var Validator = require('jsonschema').Validator;
var v = new Validator();


var mappingsSchema = {
    'type': 'object',
    'id': '/Mappings',
    'properties': {
      'directories': {
        'type': 'object',
        'properties': {
          'mainInput': { 'type': 'string' },
          'mainOutput': { 'type': 'string' },
          'input': {
            'type': 'object',
            'properties': {
              'native': { 'type': 'string' },
              'text': { 'type': 'string' },
              'converted': { 'type': 'string' },
              'data': { 'type': 'string' }
            }
          },
          'output': {
            'type': 'object',
            'properties': {
              'native': { 'type': 'string' },
              'text': { 'type': 'string' },
              'converted': { 'type': 'string' },
              'scripts': { 'type': 'string' },
              'backup': { 'type': 'string' }
            }
          }
        }
      },
      'input': { 'type': 'object' },
      'macros': { 'type': 'object' },
      'priority': { 'type': 'object' },
      'config': {
        'type': 'object',
        'properties': {
          'uuidPadding': { 'type': 'number' },
          'overwrite': { 'type': 'boolean' },
          'maxFamilyDepth': { 'type': 'number' }
        }
      },
      'output': {
        'type': 'object',
        'properties': {
          'to': { 'type': 'string' },
          'cc': { 'type': 'string' },
          'from': { 'type': 'string' },
          'bcc': { 'type': 'string' },
          'toDomain': { 'type': 'string' },
          'mppDomain': { 'type': 'string' },
          'familyId': { 'type': 'string' },
          'familyRoot': { 'type': 'string' },
          'familyDate': { 'type': 'string' },
          'type': { 'type': 'string' },
          'isAttachment': { 'type': 'string' },
          'textLink': { 'type': 'textLink' },
          'nativeLink': { 'type': 'string' },
          'bestDate': { 'type': 'string' },
          'pageCount': { 'type': 'string' },
          'projectCode': { 'type': 'string' },
          'urn': { 'type': 'string' },
          'asResultOf': { 'type': 'string' },
          'exhibitLabel': { 'type': 'string' },
          'md5': { 'type': 'string' }
        }
      }
    }
  };

 v.addSchema(mappingsSchema, '/Mappings');

module.exports = function(directoryInput, directoryOutput) {
  console.group('Getting mappings')
  let outputMappings;
  let defaultMappings = require('../../constants/mappings')(directoryInput, directoryOutput);

  let files = glob.sync(path.join(directoryInput, 'mappings.json'))

  if (files.length === 1) {
    console.log(`Found mappings file in root, validating`.green);
    try {
      let out = fs.readJsonSync(files[0]);
      if (v.validate(out, mappingsSchema)) {
        outputMappings = out
      }
    } catch (err) {
      console.log(`Error parsing mappings file: ${err.toString()}`.red)
      process.exit();
    }
  } else {
    v.validate(defaultMappings, mappingsSchema)
    outputMappings = defaultMappings
  }

  return outputMappings
}
