class JSONConverter {
  static convert(state) {
    const REPLACER = null;
    const SPACES = 2;
    return JSON.stringify(state.treeData, REPLACER, SPACES);
  }
}
module.exports = JSONConverter;
