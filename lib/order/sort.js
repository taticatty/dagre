let util = require("../util");

module.exports = sort;

function sort(entries, biasRight, usePrev) {
  let parts = util.partition(entries, entry => {
    return (
      entry.hasOwnProperty("barycenter") ||
      (entry.hasOwnProperty("fixorder") && !isNaN(entry.fixorder))
    );
  });
  let sortable = parts.lhs,
    unsortable = parts.rhs.sort((a, b) => b.i - a.i),
    vs = [],
    sum = 0,
    weight = 0,
    vsIndex = 0;

  sortable.sort(compareWithBias(!!biasRight, !!usePrev));

  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

  sortable.forEach(entry => {
    vsIndex += entry.vs.length;
    vs.push(entry.vs);
    sum += entry.barycenter * entry.weight;
    weight += entry.weight;
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  });

  let result = { vs: vs.flat(true) };
  if (weight) {
    result.barycenter = sum / weight;
    result.weight = weight;
  }
  return result;
}

function consumeUnsortable(vs, unsortable, index) {
  let last;
  while (unsortable.length && (last = unsortable[unsortable.length - 1]).i <= index) {
    unsortable.pop();
    vs.push(last.vs);
    index++;
  }
  return index;
}

function compareWithBias(bias, usePrev) {
  return (entryV, entryW) => {
    if (entryV.fixorder !== undefined && entryW.fixorder !== undefined) {
      return entryV.fixorder - entryW.fixorder;
    }
    if (entryV.barycenter < entryW.barycenter) {
      return -1;
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1;
    }
    if (usePrev && entryV.order !== undefined && entryW.order !== undefined) {
      if (entryV.order < entryW.order) {
        return -1;
      } else if (entryV.order > entryW.order) {
        return 1;
      }
    }

    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
  };
}
