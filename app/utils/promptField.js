var colors = require('colors');
var readlineSync = require('readline-sync');


module.exports = function(mappings, data) {
  const header = Object.keys(data[0]);
  const hs = header.reduce((acc, curr) => (
    Object.assign({}, acc, {[curr.toLowerCase()]: curr})
  ), {})

  const config = require('./mappingConfig');

  const mappingsVerified = require('./validateInput')(mappings)
  console.group('Starting mappings process');
  const output = config.reduce((acc, entry) => {
    let best;
    let out;
    let valid = new Set(Object.values(hs))

    if (acc[entry]) {
      return acc;
    }

    if (entry.dependencies) {
      const skip = (entry.dependencies.constructor === Array ? entry.dependencies : [entry.dependencies]).some(x => {
          if (!acc[x]) {
            console.log(`Skipping mappings for ${entry.name} as dependency ${x} not available`.yellow)
            return true
          }
          return false
        })
      if (skip) {
        return acc;
      }
    }

    if (entry.equal) {
      const equalMatches = (entry.equal.constructor === Array ? entry.equal :
        [entry.equal].filter(x => valid.has(x.toLowerCase())))
      if (equalMatches.length === 1) {
        out = hs[equalMatches[0].toLowerCase()]
        console.log(`Auto mapping ${entry.name} -> ${equalMatches[0]}`.grey);
        return Object.assign({}, acc, {[entry.name]: out})
        }
      }

    let mappedFields = new Set(Object.values(acc))


    if (entry.fields) {
      const set = new Set(entry.equal ? entry.equal.map(x => x.toLowerCase()) : []);
      best = header.filter(y => set.has(y.toLowerCase()))
    } else {
      let orContains = []
      let andContains = []
      let notContains = []
      if (entry.orContains) {
        if (entry.orContains.constructor === Array) {
          orContains = entry.orContains.map(y => y.toLowerCase());
        } else {
          orContains = [entry.orContains.toLowerCase()]
        }
      }

      if (entry.andContains) {
        if (entry.andContains.constructor === Array) {
          andContains = entry.andContains.map(y => y.toLowerCase());
        } else {
          andContains = [entry.andContains.toLowerCase()]
        }
      }

      if (entry.notContains) {
        if (entry.notContains.constructor === Array) {
          notContains = entry.notContains.map(y => y.toLowerCase());
        } else {
          notContains = [entry.notContains.toLowerCase()]
        }
      }

      if (entry.contains) {
        if (entry.contains.constructor === Array) {
          orContains = entry.contains.map(y => y.toLowerCase());
        } else {
          orContains = [entry.contains.toLowerCase()]
        }
      }

      // console.log(orContains);
      // console.log(andContains);
      // console.log(notContains)

      best = header.filter(y => (
        (
          orContains.some(z => y.toLowerCase().match(z) !== null) &&
          andContains.every(z => y.toLowerCase().match(z) !== null)
        ) && (
          notContains.every(z => y.toLowerCase().match(z) === null)
        )
      ));
    }
    if (best.length !== 1 || acc[entry.name]) {
      const set = new Set(best);
      const potential = header.filter(y => set.has(y)).map(y => y.green);
      const remaining = header.filter(y => !set.has(y) && !mappedFields.has(y)).map(y => y.grey)
      const mapped = header.filter(y => !set.has(y) && mappedFields.has(y)).map(y => y.red)
      const available = [...potential, ...remaining, ...mapped]

      console.log(`Options: `.cyan + available.join('\n               '.grey));

      let input;

      let required = entry.required ? true : false;
      if (entry.requiredIfEmpty) {
          // let dependencies = entry.dependencies.constructor === Array ? entry.dependencies [entry.dependencies]
          if (!acc[entry.requiredIfEmpty]) {
            console.log(`${entry.name} is required as ${entry.requiredIfEmpty} is empty`.cyan);
            required = true
          } else {
            valid.delete(acc[entry.requiredIfEmpty])
          }
      }


      do {
        input = readlineSync.question('* * '.blue + `Please choose a field to map for ${entry.name} > `.cyan);
        if (!input && !required) {
          console.log(`Skipping mappings for ${entry.name}`.yellow)
          return acc
        } else if (!input && required) {
          console.log(`This mappings is required`.yellow)
        }

      } while (!valid.has(hs[input.toLowerCase()]))
      out = hs[input.toLowerCase()]
      console.log(`Mapping `.grey + `${entry.name}` +` -> ${out}`.grey)
    } else {
      console.log(`Auto mapping ${entry.name} -> ${best[0]}`.grey);
      out = hs[best[0].toLowerCase()]
    }
    return Object.assign({}, acc, {[entry.name]: out})

  }, mappingsVerified.input);
  console.groupEnd();
  const outputProc = Object.assign({}, mappings, {input: output})
  return outputProc

}
