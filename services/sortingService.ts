import { Player, AnimationStep } from '../types';

export const getBubbleSortAnimations = (array: Player[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const auxiliaryArray = [...array];
  const n = auxiliaryArray.length;
  const sortedIndices: number[] = [];

  animations.push({ array: [...auxiliaryArray], highlight: [], sorted: [...sortedIndices] });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push({ array: [...auxiliaryArray], highlight: [j, j + 1], sorted: [...sortedIndices] });
      if (auxiliaryArray[j].score < auxiliaryArray[j + 1].score) {
        const temp = auxiliaryArray[j];
        auxiliaryArray[j] = auxiliaryArray[j + 1];
        auxiliaryArray[j + 1] = temp;
        animations.push({ array: [...auxiliaryArray], highlight: [j, j + 1], sorted: [...sortedIndices] });
      }
    }
    sortedIndices.push(n - 1 - i);
  }
  if (n > 0) sortedIndices.push(0);
  animations.push({ array: [...auxiliaryArray], highlight: [], sorted: sortedIndices });
  return animations;
};


function mergeSortHelper(
    mainArray: Player[],
    startIdx: number,
    endIdx: number,
    animations: AnimationStep[],
    sortedIndices: number[],
) {
    if (startIdx >= endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(mainArray, startIdx, middleIdx, animations, sortedIndices);
    mergeSortHelper(mainArray, middleIdx + 1, endIdx, animations, sortedIndices);
    doMerge(mainArray, startIdx, middleIdx, endIdx, animations, sortedIndices);
}

function doMerge(
    mainArray: Player[],
    startIdx: number,
    middleIdx: number,
    endIdx: number,
    animations: AnimationStep[],
    sortedIndices: number[],
) {
    // Collect the merged result in a new array to avoid corrupting mainArray during the merge logic.
    const merged: Player[] = [];
    let i = 0; 
    let j = 0; 

    // Create copies of the sub-arrays to merge.
    const leftHalf = mainArray.slice(startIdx, middleIdx + 1);
    const rightHalf = mainArray.slice(middleIdx + 1, endIdx + 1);

    // Pointers to original indices for highlighting
    let leftHighlightIdx = startIdx;
    let rightHighlightIdx = middleIdx + 1;

    // Merge left and right halves into the 'merged' array.
    while (i < leftHalf.length && j < rightHalf.length) {
        // Highlight elements being compared.
        animations.push({ array: [...mainArray], highlight: [leftHighlightIdx, rightHighlightIdx], sorted: [...sortedIndices] });
        if (leftHalf[i].score >= rightHalf[j].score) {
            merged.push(leftHalf[i]);
            i++;
            leftHighlightIdx++;
        } else {
            merged.push(rightHalf[j]);
            j++;
            rightHighlightIdx++;
        }
    }

    // Add remaining elements from left half, if any.
    while (i < leftHalf.length) {
        animations.push({ array: [...mainArray], highlight: [leftHighlightIdx], sorted: [...sortedIndices] });
        merged.push(leftHalf[i]);
        i++;
        leftHighlightIdx++;
    }

    // Add remaining elements from right half, if any.
    while (j < rightHalf.length) {
        animations.push({ array: [...mainArray], highlight: [rightHighlightIdx], sorted: [...sortedIndices] });
        merged.push(rightHalf[j]);
        j++;
        rightHighlightIdx++;
    }

    // Now, copy the sorted 'merged' array back into the main array,
    // creating an animation step for each element placement.
    // This phase will overwrite the segment in mainArray, which is the visualization of the sort.
    for (let k = 0; k < merged.length; k++) {
        const targetIdx = startIdx + k;
        mainArray[targetIdx] = merged[k];
        animations.push({ array: [...mainArray], highlight: [targetIdx], sorted: [...sortedIndices] });
    }
}


export const getMergeSortAnimations = (array: Player[]): AnimationStep[] => {
    const animations: AnimationStep[] = [];
    if (array.length <= 1) return animations;
    const auxiliaryArray = [...array];
    const sortedIndices: number[] = [];

    animations.push({ array: [...auxiliaryArray], highlight: [], sorted: [...sortedIndices] });
    mergeSortHelper(auxiliaryArray, 0, array.length - 1, animations, sortedIndices);
    
    for(let i = 0; i < auxiliaryArray.length; i++) sortedIndices.push(i);
    animations.push({ array: [...auxiliaryArray], highlight: [], sorted: [...sortedIndices] });
    return animations;
};


export const getQuickSortAnimations = (array: Player[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const auxiliaryArray = [...array];
  const sortedIndices: number[] = [];
  
  animations.push({ array: [...auxiliaryArray], highlight: [], sorted: [...sortedIndices] });
  quickSortHelper(auxiliaryArray, 0, auxiliaryArray.length - 1, animations, sortedIndices);
  for(let i=0; i < auxiliaryArray.length; i++) sortedIndices.push(i);
  animations.push({ array: [...auxiliaryArray], highlight: [], sorted: [...sortedIndices] });
  return animations;
};

function quickSortHelper(
  arr: Player[],
  low: number,
  high: number,
  animations: AnimationStep[],
  sortedIndices: number[],
) {
  if (low < high) {
    const pi = partition(arr, low, high, animations, sortedIndices);
    sortedIndices.push(pi);
    animations.push({ array: [...arr], highlight: [], sorted: [...sortedIndices] });
    quickSortHelper(arr, low, pi - 1, animations, sortedIndices);
    quickSortHelper(arr, pi + 1, high, animations, sortedIndices);
  } else if (low === high && low >= 0 && low < arr.length) {
      if(!sortedIndices.includes(low)) sortedIndices.push(low);
  }
}

function partition(
  arr: Player[],
  low: number,
  high: number,
  animations: AnimationStep[],
  sortedIndices: number[],
): number {
  const pivot = arr[high].score;
  let i = low - 1;

  for (let j = low; j < high; j++) {
    animations.push({ array: [...arr], highlight: [j, high], sorted: [...sortedIndices] });
    if (arr[j].score > pivot) {
      i++;
      animations.push({ array: [...arr], highlight: [i, j], sorted: [...sortedIndices] });
      [arr[i], arr[j]] = [arr[j], arr[i]];
      animations.push({ array: [...arr], highlight: [i, j], sorted: [...sortedIndices] });
    }
  }

  animations.push({ array: [...arr], highlight: [i + 1, high], sorted: [...sortedIndices] });
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  animations.push({ array: [...arr], highlight: [i + 1, high], sorted: [...sortedIndices] });
  
  return i + 1;
}