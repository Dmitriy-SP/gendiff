import _ from 'lodash';

const buildKeys = (tree1, tree2) => _.sortBy(_.uniq([
  ...Object.keys(tree1), ...Object.keys(tree2),
]));

const buildDiff = (tree1, tree2) => {
  const keys = buildKeys(tree1, tree2);
  return keys.map((key) => {
    if (_.isObject(tree1[key]) && _.isObject(tree2[key])) {
      return { key, children: buildDiff(tree1[key], tree2[key]), status: 'node' };
    }
    if (!Object.hasOwn(tree1, key)) {
      return { key, value: tree2[key], status: 'added' };
    }
    if (!Object.hasOwn(tree2, key)) {
      return { key, value: tree1[key], status: 'deleted' };
    }
    if (tree1[key] === tree2[key]) {
      return { key, value: tree1[key], status: 'unchanged' };
    }
    return {
      key, value1: tree1[key], value2: tree2[key], status: 'changed',
    };
  });
};

export default buildDiff;
