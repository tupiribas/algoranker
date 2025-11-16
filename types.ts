
export interface Player {
  id: number;
  name: string;
  score: number;
}

export enum SortAlgorithm {
  QuickSort = 'QuickSort',
  MergeSort = 'MergeSort',
  BubbleSort = 'BubbleSort',
}

export interface AlgorithmInfo {
  name: string;
  description: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
}

export interface AnimationStep {
  array: Player[];
  highlight: number[];
  sorted: number[];
}
