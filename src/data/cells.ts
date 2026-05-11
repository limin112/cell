import raw from './cells.json';
import type { Cell, CellsBundle } from '../types/cells';

const bundle = raw as unknown as CellsBundle;
export const cells: Cell[] = bundle.cells;
export default cells;
