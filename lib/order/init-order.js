"use strict";

let util = require("../util");

module.exports = initOrder;

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
function initOrder(g) {
  let visited = {};
  let simpleNodes = g.nodes().filter(v => !g.children(v).length);
  let maxRank = Math.max(...simpleNodes.map(v => g.node(v).rank));
  let layers = util.range(maxRank + 1).map(() => []);

  function dfs(v) {
    if (visited[v]) return;
    visited[v] = true;
    let node = g.node(v);
    layers[node.rank].push(v);
    g.successors(v).forEach(dfs);
  }

  let orderedVs = simpleNodes.sort((a, b) => g.node(a).rank - g.node(b).rank);

  let fixOrderNodes = orderedVs
    .filter((n) => g.node(n).fixorder !== undefined)
    .sort((a, b) => g.node(a).fixorder - g.node(b).fixorder);

  fixOrderNodes.forEach((n) => {
    layers[g.node(n).rank].push(n);
    visited[n] = true;
  });

  orderedVs.forEach(dfs);

  return layers;
}
