"use strict";

module.exports = initDataOrder;

const range = (end) => {
  const length = typeof end === "number" && !isNaN(end) ? end : 0;
  return Array.from(Array(length), (_, i) => i);
};

function initDataOrder(g, nodeOrder) {
  let simpleNodes = g.nodes().filter(v => !g.children(v).length);
  let maxRank = Math.max(...simpleNodes.map(v => g.node(v).rank));
  let layers = range(maxRank + 1).map(() => []);

  nodeOrder.forEach(n => {
    let node = g.node(n);
    if (node.dummy) {
      return;
    }
    node.fixorder = layers[node.rank].length;
    layers[node.rank].push(n);
  });
}
