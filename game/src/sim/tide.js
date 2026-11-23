// Tide and depth bands, driven only by maree.csv and maree_effets.csv.
export function createTide(rows) {
  const last = rows.length - 1;
  const find = (t) => {
    if (t <= rows[0].t) return 0;
    if (t >= rows[last].t) return last;
    let lo = 0, hi = last;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (rows[mid].t <= t) lo = mid; else hi = mid; }
    return lo;
  };
  return {
    duration: rows[last].t,
    levelAt(t) {
      if (t <= rows[0].t) return rows[0].level;
      if (t >= rows[last].t) return rows[last].level;
      const i = find(t), a = rows[i], b = rows[i + 1];
      return a.level + ((b.level - a.level) * (t - a.t)) / (b.t - a.t);
    },
    /** Trend (-1 falling, 0 slack, 1 rising) of the table row at or before t. */
    trendAt(t) { return rows[find(t)].trend; },
    phaseAt(t) { return rows[find(t)].phase; },
  };
}

export function createBands(rows) {
  return {
    list: rows,
    classify(d) {
      for (const b of rows) if (d >= b.depthMin && d < b.depthMax) return b;
      return d < rows[0].depthMin ? rows[0] : rows[rows.length - 1];
    },
    byId(id) { return rows.find((b) => b.id === id); },
  };
}
