// started :28-08-2025
// will do 3 dsa per day
// will revise every concept per day

// day 1: Learning sorting from striver
// topics : merge sort, recursive bubble sort,recusive insersion sort,quick sort
// The basics from gemini:

// what is sorting :The process of arranging anything in any sepcific order(ascending,decending,alphabetical,numeric) is called sorting.
// sorting is a process of rearranging a collection of item.

// Bubble sort: swap them if they are in the wrong order.
// selection sort: repetedly find the minimum element from unsorted part of the array and puting it at the begingin.
// merge sort: works on divide and conquore strategy.
//  divide: keep dividing the element in two parts unitll you have lists of size 1, size 1 element is always sorted.
// conqure: start merging the smaller sorted lists back together into larger sorted list until you have one single sorted list.
// QUick sort :Faster than the merge sort , work in same divide and conquore

// merge sort and selection sort time complexity is O(nlogn) so its used in production environment. And the Bubble sort and selectetion sort is having time complexity is more O(n2) , so it should not use in the production.

// examples

// bubble sort

let arr1 = [38, 27, 43, 3, 9, 82, 10];

const bubbleSort = (array) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[i] < array[j]) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
};
console.log(bubbleSort(arr1));

// selection sort

let arr = [38, 27, 43, 3, 9, 82, 10, -4, 3000];

const selectionSort = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }
  return arr;
};
console.log(selectionSort(arr));

// Merge sort

let unsortedArray = [38, 27, 43, 3, 9, 82, 10];
const merge = (left, right) => {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
};

const mergeSort = (arr) => {
  let n = arr.length;
  if (n <= 1) return arr;

  let middle = Math.floor(n / 2);
  const leftHalf = arr.slice(0, middle);
  const rightHalf = arr.slice(middle);

  const sortedLeft = mergeSort(leftHalf);
  const sortedRight = mergeSort(rightHalf);

  return merge(sortedLeft, sortedRight);
};
console.log(mergeSort(unsortedArray));

// Quick Sort

const partition = (arr, left, right) => {
  pivotValue = arr[right];
  pivotIndex = left;
  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      pivotIndex++;
    }
  }

  [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
  return pivotIndex;
};

const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left < right) {
    let pivotIndex = partition(arr, left, right);

    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
};

console.log(quickSort([10, 7, 8, 9, 1, 5]));
