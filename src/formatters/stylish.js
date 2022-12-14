import _ from 'lodash';

const indent = (level, spacesCount = 4) => ' '.repeat((level - 1) * spacesCount);

const writeNote = (value, level) => {
  if (_.isObject(value)) {
    const note = Object.keys(value)
      .map((item) => `${indent(level)}    ${item}: ${writeNote(value[item], level + 1)}`)
      .join('\n');
    return `{\n${note}\n${indent(level)}}`;
  }
  return value;
};

const iterStylish = (node, level) => node.map((item) => {
  switch (item.status) {
    case 'node':
      return `${indent(level)}    ${item.key}: {\n${iterStylish(item.children, level + 1)}\n${indent(level)}    }`;
    case 'changed':
      return `${indent(level)}  - ${item.key}: ${writeNote(item.value1, level + 1)}\n${indent(level)}  + ${item.key}: ${writeNote(item.value2, level + 1)}`;
    case 'unchanged':
      return `${indent(level)}    ${item.key}: ${writeNote(item.value, level + 1)}`;
    case 'added':
      return `${indent(level)}  + ${item.key}: ${writeNote(item.value, level + 1)}`;
    case 'deleted':
      return `${indent(level)}  - ${item.key}: ${writeNote(item.value, level + 1)}`;
    default:
      throw new Error('error, unknown node status');
  }
})
  .join('\n');

const toStylish = (diff) => `{\n${iterStylish(diff, 1)}\n}`;

export default toStylish;
