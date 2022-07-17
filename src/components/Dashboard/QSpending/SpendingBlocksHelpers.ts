import type { SpendingBlock } from './SpendingBlocks';

const roundToCents = (spendingBlocks: SpendingBlock[]) =>
  spendingBlocks.map((spendingBlock) => ({
    ...spendingBlock,
    spent: +spendingBlock.spent.toFixed(2),
  }));

export { roundToCents };
