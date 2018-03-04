import { walk } from '../components/vendor/tree-data-utils';
import { defaultGetNodeKey } from '../components/vendor/default-handlers';

class MarkDownConverter {
  static convert(state) {
    let markdown = '';
    walk({
      treeData: state.treeData,
      getNodeKey: defaultGetNodeKey,
      callback: (node) => {
        markdown += MarkDownConverter.makeRow(node);
      }
    });
    return markdown;
  }

  static makeRow(task) {
    // calc tabs counts
    const spaces = Array.from(Array(task.path.length - 1), x => '	').join('');
    const isDone = task.node.complete ? '- [x]' : '- [ ]';
    const title  = task.node.title;
    // const time   = 'xxxx h yy m hh s';
    return `${spaces}${isDone} ${title}\n`;
  }

}
module.exports = MarkDownConverter;
