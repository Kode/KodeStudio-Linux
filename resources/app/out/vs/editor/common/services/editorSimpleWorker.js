/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/base/common/diff/diffChange", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.DifferenceType = {
        Add: 0,
        Remove: 1,
        Change: 2
    };
    /**
     * Represents information about a specific difference between two sequences.
     */
    var DiffChange = (function () {
        /**
         * Constructs a new DiffChange with the given sequence information
         * and content.
         */
        function DiffChange(originalStart, originalLength, modifiedStart, modifiedLength) {
            //Debug.Assert(originalLength > 0 || modifiedLength > 0, "originalLength and modifiedLength cannot both be <= 0");
            this.originalStart = originalStart;
            this.originalLength = originalLength;
            this.modifiedStart = modifiedStart;
            this.modifiedLength = modifiedLength;
        }
        /**
         * The type of difference.
         */
        DiffChange.prototype.getChangeType = function () {
            if (this.originalLength === 0) {
                return exports.DifferenceType.Add;
            }
            else if (this.modifiedLength === 0) {
                return exports.DifferenceType.Remove;
            }
            else {
                return exports.DifferenceType.Change;
            }
        };
        /**
         * The end point (exclusive) of the change in the original sequence.
         */
        DiffChange.prototype.getOriginalEnd = function () {
            return this.originalStart + this.originalLength;
        };
        /**
         * The end point (exclusive) of the change in the modified sequence.
         */
        DiffChange.prototype.getModifiedEnd = function () {
            return this.modifiedStart + this.modifiedLength;
        };
        return DiffChange;
    }());
    exports.DiffChange = DiffChange;
});

define("vs/base/common/diff/diff", ["require", "exports", 'vs/base/common/diff/diffChange'], function (require, exports, diffChange_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    //
    // The code below has been ported from a C# implementation in VS
    //
    var Debug = (function () {
        function Debug() {
        }
        Debug.Assert = function (condition, message) {
            if (!condition) {
                throw new Error(message);
            }
        };
        return Debug;
    }());
    exports.Debug = Debug;
    var MyArray = (function () {
        function MyArray() {
        }
        /**
         * Copies a range of elements from an Array starting at the specified source index and pastes
         * them to another Array starting at the specified destination index. The length and the indexes
         * are specified as 64-bit integers.
         * sourceArray:
         *		The Array that contains the data to copy.
         * sourceIndex:
         *		A 64-bit integer that represents the index in the sourceArray at which copying begins.
         * destinationArray:
         *		The Array that receives the data.
         * destinationIndex:
         *		A 64-bit integer that represents the index in the destinationArray at which storing begins.
         * length:
         *		A 64-bit integer that represents the number of elements to copy.
         */
        MyArray.Copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
            for (var i = 0; i < length; i++) {
                destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
        };
        return MyArray;
    }());
    exports.MyArray = MyArray;
    //*****************************************************************************
    // LcsDiff.cs
    //
    // An implementation of the difference algorithm described in
    // "An O(ND) Difference Algorithm and its letiations" by Eugene W. Myers
    //
    // Copyright (C) 2008 Microsoft Corporation @minifier_do_not_preserve
    //*****************************************************************************
    // Our total memory usage for storing history is (worst-case):
    // 2 * [(MaxDifferencesHistory + 1) * (MaxDifferencesHistory + 1) - 1] * sizeof(int)
    // 2 * [1448*1448 - 1] * 4 = 16773624 = 16MB
    var MaxDifferencesHistory = 1447;
    //let MaxDifferencesHistory = 100;
    /**
     * A utility class which helps to create the set of DiffChanges from
     * a difference operation. This class accepts original DiffElements and
     * modified DiffElements that are involved in a particular change. The
     * MarktNextChange() method can be called to mark the separation between
     * distinct changes. At the end, the Changes property can be called to retrieve
     * the constructed changes.
     */
    var DiffChangeHelper = (function () {
        /**
         * Constructs a new DiffChangeHelper for the given DiffSequences.
         */
        function DiffChangeHelper() {
            this.m_changes = [];
            this.m_originalStart = Number.MAX_VALUE;
            this.m_modifiedStart = Number.MAX_VALUE;
            this.m_originalCount = 0;
            this.m_modifiedCount = 0;
        }
        /**
         * Marks the beginning of the next change in the set of differences.
         */
        DiffChangeHelper.prototype.MarkNextChange = function () {
            // Only add to the list if there is something to add
            if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
                // Add the new change to our list
                this.m_changes.push(new diffChange_1.DiffChange(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));
            }
            // Reset for the next change
            this.m_originalCount = 0;
            this.m_modifiedCount = 0;
            this.m_originalStart = Number.MAX_VALUE;
            this.m_modifiedStart = Number.MAX_VALUE;
        };
        /**
         * Adds the original element at the given position to the elements
         * affected by the current change. The modified index gives context
         * to the change position with respect to the original sequence.
         * @param originalIndex The index of the original element to add.
         * @param modifiedIndex The index of the modified element that provides corresponding position in the modified sequence.
         */
        DiffChangeHelper.prototype.AddOriginalElement = function (originalIndex, modifiedIndex) {
            // The 'true' start index is the smallest of the ones we've seen
            this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
            this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
            this.m_originalCount++;
        };
        /**
         * Adds the modified element at the given position to the elements
         * affected by the current change. The original index gives context
         * to the change position with respect to the modified sequence.
         * @param originalIndex The index of the original element that provides corresponding position in the original sequence.
         * @param modifiedIndex The index of the modified element to add.
         */
        DiffChangeHelper.prototype.AddModifiedElement = function (originalIndex, modifiedIndex) {
            // The 'true' start index is the smallest of the ones we've seen
            this.m_originalStart = Math.min(this.m_originalStart, originalIndex);
            this.m_modifiedStart = Math.min(this.m_modifiedStart, modifiedIndex);
            this.m_modifiedCount++;
        };
        /**
         * Retrieves all of the changes marked by the class.
         */
        DiffChangeHelper.prototype.getChanges = function () {
            if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
                // Finish up on whatever is left
                this.MarkNextChange();
            }
            return this.m_changes;
        };
        DiffChangeHelper.prototype.getReverseChanges = function () {
            /// <summary>
            /// Retrieves all of the changes marked by the class in the reverse order
            /// </summary>
            if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
                // Finish up on whatever is left
                this.MarkNextChange();
            }
            this.m_changes.reverse();
            return this.m_changes;
        };
        return DiffChangeHelper;
    }());
    /**
     * An implementation of the difference algorithm described in
     * "An O(ND) Difference Algorithm and its letiations" by Eugene W. Myers
     */
    var LcsDiff = (function () {
        /**
         * Constructs the DiffFinder
         */
        function LcsDiff(originalSequence, newSequence, continueProcessingPredicate) {
            if (continueProcessingPredicate === void 0) { continueProcessingPredicate = null; }
            this.OriginalSequence = originalSequence;
            this.ModifiedSequence = newSequence;
            this.ContinueProcessingPredicate = continueProcessingPredicate;
            this.m_originalIds = [];
            this.m_modifiedIds = [];
            this.m_forwardHistory = [];
            this.m_reverseHistory = [];
            this.ComputeUniqueIdentifiers();
        }
        LcsDiff.prototype.ComputeUniqueIdentifiers = function () {
            var originalSequenceLength = this.OriginalSequence.getLength();
            var modifiedSequenceLength = this.ModifiedSequence.getLength();
            this.m_originalIds = new Array(originalSequenceLength);
            this.m_modifiedIds = new Array(modifiedSequenceLength);
            // Create a new hash table for unique elements from the original
            // sequence.
            var hashTable = {};
            var currentUniqueId = 1;
            var i;
            // Fill up the hash table for unique elements
            for (i = 0; i < originalSequenceLength; i++) {
                var originalElementHash = this.OriginalSequence.getElementHash(i);
                if (!hashTable.hasOwnProperty(originalElementHash)) {
                    // No entry in the hashtable so this is a new unique element.
                    // Assign the element a new unique identifier and add it to the
                    // hash table
                    this.m_originalIds[i] = currentUniqueId++;
                    hashTable[originalElementHash] = this.m_originalIds[i];
                }
                else {
                    this.m_originalIds[i] = hashTable[originalElementHash];
                }
            }
            // Now match up modified elements
            for (i = 0; i < modifiedSequenceLength; i++) {
                var modifiedElementHash = this.ModifiedSequence.getElementHash(i);
                if (!hashTable.hasOwnProperty(modifiedElementHash)) {
                    this.m_modifiedIds[i] = currentUniqueId++;
                    hashTable[modifiedElementHash] = this.m_modifiedIds[i];
                }
                else {
                    this.m_modifiedIds[i] = hashTable[modifiedElementHash];
                }
            }
        };
        LcsDiff.prototype.ElementsAreEqual = function (originalIndex, newIndex) {
            return this.m_originalIds[originalIndex] === this.m_modifiedIds[newIndex];
        };
        LcsDiff.prototype.ComputeDiff = function () {
            return this._ComputeDiff(0, this.OriginalSequence.getLength() - 1, 0, this.ModifiedSequence.getLength() - 1);
        };
        /**
         * Computes the differences between the original and modified input
         * sequences on the bounded range.
         * @returns An array of the differences between the two input sequences.
         */
        LcsDiff.prototype._ComputeDiff = function (originalStart, originalEnd, modifiedStart, modifiedEnd) {
            var quitEarlyArr = [false];
            return this.ComputeDiffRecursive(originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr);
        };
        /**
         * Private helper method which computes the differences on the bounded range
         * recursively.
         * @returns An array of the differences between the two input sequences.
         */
        LcsDiff.prototype.ComputeDiffRecursive = function (originalStart, originalEnd, modifiedStart, modifiedEnd, quitEarlyArr) {
            quitEarlyArr[0] = false;
            // Find the start of the differences
            while (originalStart <= originalEnd && modifiedStart <= modifiedEnd && this.ElementsAreEqual(originalStart, modifiedStart)) {
                originalStart++;
                modifiedStart++;
            }
            // Find the end of the differences
            while (originalEnd >= originalStart && modifiedEnd >= modifiedStart && this.ElementsAreEqual(originalEnd, modifiedEnd)) {
                originalEnd--;
                modifiedEnd--;
            }
            // In the special case where we either have all insertions or all deletions or the sequences are identical
            if (originalStart > originalEnd || modifiedStart > modifiedEnd) {
                var changes = void 0;
                if (modifiedStart <= modifiedEnd) {
                    Debug.Assert(originalStart === originalEnd + 1, 'originalStart should only be one more than originalEnd');
                    // All insertions
                    changes = [
                        new diffChange_1.DiffChange(originalStart, 0, modifiedStart, modifiedEnd - modifiedStart + 1)
                    ];
                }
                else if (originalStart <= originalEnd) {
                    Debug.Assert(modifiedStart === modifiedEnd + 1, 'modifiedStart should only be one more than modifiedEnd');
                    // All deletions
                    changes = [
                        new diffChange_1.DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, 0)
                    ];
                }
                else {
                    Debug.Assert(originalStart === originalEnd + 1, 'originalStart should only be one more than originalEnd');
                    Debug.Assert(modifiedStart === modifiedEnd + 1, 'modifiedStart should only be one more than modifiedEnd');
                    // Identical sequences - No differences
                    changes = [];
                }
                return changes;
            }
            // This problem can be solved using the Divide-And-Conquer technique.
            var midOriginalArr = [0], midModifiedArr = [0];
            var result = this.ComputeRecursionPoint(originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr);
            var midOriginal = midOriginalArr[0];
            var midModified = midModifiedArr[0];
            if (result !== null) {
                // Result is not-null when there was enough memory to compute the changes while
                // searching for the recursion point
                return result;
            }
            else if (!quitEarlyArr[0]) {
                // We can break the problem down recursively by finding the changes in the
                // First Half:   (originalStart, modifiedStart) to (midOriginal, midModified)
                // Second Half:  (midOriginal + 1, minModified + 1) to (originalEnd, modifiedEnd)
                // NOTE: ComputeDiff() is inclusive, therefore the second range starts on the next point
                var leftChanges = this.ComputeDiffRecursive(originalStart, midOriginal, modifiedStart, midModified, quitEarlyArr);
                var rightChanges = [];
                if (!quitEarlyArr[0]) {
                    rightChanges = this.ComputeDiffRecursive(midOriginal + 1, originalEnd, midModified + 1, modifiedEnd, quitEarlyArr);
                }
                else {
                    // We did't have time to finish the first half, so we don't have time to compute this half.
                    // Consider the entire rest of the sequence different.
                    rightChanges = [
                        new diffChange_1.DiffChange(midOriginal + 1, originalEnd - (midOriginal + 1) + 1, midModified + 1, modifiedEnd - (midModified + 1) + 1)
                    ];
                }
                return this.ConcatenateChanges(leftChanges, rightChanges);
            }
            // If we hit here, we quit early, and so can't return anything meaningful
            return [
                new diffChange_1.DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
            ];
        };
        LcsDiff.prototype.WALKTRACE = function (diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr) {
            var forwardChanges = null, reverseChanges = null;
            // First, walk backward through the forward diagonals history
            var changeHelper = new DiffChangeHelper();
            var diagonalMin = diagonalForwardStart;
            var diagonalMax = diagonalForwardEnd;
            var diagonalRelative = (midOriginalArr[0] - midModifiedArr[0]) - diagonalForwardOffset;
            var lastOriginalIndex = Number.MIN_VALUE;
            var historyIndex = this.m_forwardHistory.length - 1;
            var diagonal;
            do {
                // Get the diagonal index from the relative diagonal number
                diagonal = diagonalRelative + diagonalForwardBase;
                // Figure out where we came from
                if (diagonal === diagonalMin || (diagonal < diagonalMax && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1])) {
                    // Vertical line (the element is an insert)
                    originalIndex = forwardPoints[diagonal + 1];
                    modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
                    if (originalIndex < lastOriginalIndex) {
                        changeHelper.MarkNextChange();
                    }
                    lastOriginalIndex = originalIndex;
                    changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex);
                    diagonalRelative = (diagonal + 1) - diagonalForwardBase; //Setup for the next iteration
                }
                else {
                    // Horizontal line (the element is a deletion)
                    originalIndex = forwardPoints[diagonal - 1] + 1;
                    modifiedIndex = originalIndex - diagonalRelative - diagonalForwardOffset;
                    if (originalIndex < lastOriginalIndex) {
                        changeHelper.MarkNextChange();
                    }
                    lastOriginalIndex = originalIndex - 1;
                    changeHelper.AddOriginalElement(originalIndex, modifiedIndex + 1);
                    diagonalRelative = (diagonal - 1) - diagonalForwardBase; //Setup for the next iteration
                }
                if (historyIndex >= 0) {
                    forwardPoints = this.m_forwardHistory[historyIndex];
                    diagonalForwardBase = forwardPoints[0]; //We stored this in the first spot
                    diagonalMin = 1;
                    diagonalMax = forwardPoints.length - 1;
                }
            } while (--historyIndex >= -1);
            // Ironically, we get the forward changes as the reverse of the
            // order we added them since we technically added them backwards
            forwardChanges = changeHelper.getReverseChanges();
            if (quitEarlyArr[0]) {
                // TODO: Calculate a partial from the reverse diagonals.
                //       For now, just assume everything after the midOriginal/midModified point is a diff
                var originalStartPoint = midOriginalArr[0] + 1;
                var modifiedStartPoint = midModifiedArr[0] + 1;
                if (forwardChanges !== null && forwardChanges.length > 0) {
                    var lastForwardChange = forwardChanges[forwardChanges.length - 1];
                    originalStartPoint = Math.max(originalStartPoint, lastForwardChange.getOriginalEnd());
                    modifiedStartPoint = Math.max(modifiedStartPoint, lastForwardChange.getModifiedEnd());
                }
                reverseChanges = [
                    new diffChange_1.DiffChange(originalStartPoint, originalEnd - originalStartPoint + 1, modifiedStartPoint, modifiedEnd - modifiedStartPoint + 1)
                ];
            }
            else {
                // Now walk backward through the reverse diagonals history
                changeHelper = new DiffChangeHelper();
                diagonalMin = diagonalReverseStart;
                diagonalMax = diagonalReverseEnd;
                diagonalRelative = (midOriginalArr[0] - midModifiedArr[0]) - diagonalReverseOffset;
                lastOriginalIndex = Number.MAX_VALUE;
                historyIndex = (deltaIsEven) ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
                do {
                    // Get the diagonal index from the relative diagonal number
                    diagonal = diagonalRelative + diagonalReverseBase;
                    // Figure out where we came from
                    if (diagonal === diagonalMin || (diagonal < diagonalMax && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1])) {
                        // Horizontal line (the element is a deletion))
                        originalIndex = reversePoints[diagonal + 1] - 1;
                        modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
                        if (originalIndex > lastOriginalIndex) {
                            changeHelper.MarkNextChange();
                        }
                        lastOriginalIndex = originalIndex + 1;
                        changeHelper.AddOriginalElement(originalIndex + 1, modifiedIndex + 1);
                        diagonalRelative = (diagonal + 1) - diagonalReverseBase; //Setup for the next iteration
                    }
                    else {
                        // Vertical line (the element is an insertion)
                        originalIndex = reversePoints[diagonal - 1];
                        modifiedIndex = originalIndex - diagonalRelative - diagonalReverseOffset;
                        if (originalIndex > lastOriginalIndex) {
                            changeHelper.MarkNextChange();
                        }
                        lastOriginalIndex = originalIndex;
                        changeHelper.AddModifiedElement(originalIndex + 1, modifiedIndex + 1);
                        diagonalRelative = (diagonal - 1) - diagonalReverseBase; //Setup for the next iteration
                    }
                    if (historyIndex >= 0) {
                        reversePoints = this.m_reverseHistory[historyIndex];
                        diagonalReverseBase = reversePoints[0]; //We stored this in the first spot
                        diagonalMin = 1;
                        diagonalMax = reversePoints.length - 1;
                    }
                } while (--historyIndex >= -1);
                // There are cases where the reverse history will find diffs that
                // are correct, but not intuitive, so we need shift them.
                reverseChanges = changeHelper.getChanges();
            }
            return this.ConcatenateChanges(forwardChanges, reverseChanges);
        };
        /**
         * Given the range to compute the diff on, this method finds the point:
         * (midOriginal, midModified)
         * that exists in the middle of the LCS of the two sequences and
         * is the point at which the LCS problem may be broken down recursively.
         * This method will try to keep the LCS trace in memory. If the LCS recursion
         * point is calculated and the full trace is available in memory, then this method
         * will return the change list.
         * @param originalStart The start bound of the original sequence range
         * @param originalEnd The end bound of the original sequence range
         * @param modifiedStart The start bound of the modified sequence range
         * @param modifiedEnd The end bound of the modified sequence range
         * @param midOriginal The middle point of the original sequence range
         * @param midModified The middle point of the modified sequence range
         * @returns The diff changes, if available, otherwise null
         */
        LcsDiff.prototype.ComputeRecursionPoint = function (originalStart, originalEnd, modifiedStart, modifiedEnd, midOriginalArr, midModifiedArr, quitEarlyArr) {
            var originalIndex, modifiedIndex;
            var diagonalForwardStart = 0, diagonalForwardEnd = 0;
            var diagonalReverseStart = 0, diagonalReverseEnd = 0;
            var numDifferences;
            // To traverse the edit graph and produce the proper LCS, our actual
            // start position is just outside the given boundary
            originalStart--;
            modifiedStart--;
            // We set these up to make the compiler happy, but they will
            // be replaced before we return with the actual recursion point
            midOriginalArr[0] = 0;
            midModifiedArr[0] = 0;
            // Clear out the history
            this.m_forwardHistory = [];
            this.m_reverseHistory = [];
            // Each cell in the two arrays corresponds to a diagonal in the edit graph.
            // The integer value in the cell represents the originalIndex of the furthest
            // reaching point found so far that ends in that diagonal.
            // The modifiedIndex can be computed mathematically from the originalIndex and the diagonal number.
            var maxDifferences = (originalEnd - originalStart) + (modifiedEnd - modifiedStart);
            var numDiagonals = maxDifferences + 1;
            var forwardPoints = new Array(numDiagonals);
            var reversePoints = new Array(numDiagonals);
            // diagonalForwardBase: Index into forwardPoints of the diagonal which passes through (originalStart, modifiedStart)
            // diagonalReverseBase: Index into reversePoints of the diagonal which passes through (originalEnd, modifiedEnd)
            var diagonalForwardBase = (modifiedEnd - modifiedStart);
            var diagonalReverseBase = (originalEnd - originalStart);
            // diagonalForwardOffset: Geometric offset which allows modifiedIndex to be computed from originalIndex and the
            //    diagonal number (relative to diagonalForwardBase)
            // diagonalReverseOffset: Geometric offset which allows modifiedIndex to be computed from originalIndex and the
            //    diagonal number (relative to diagonalReverseBase)
            var diagonalForwardOffset = (originalStart - modifiedStart);
            var diagonalReverseOffset = (originalEnd - modifiedEnd);
            // delta: The difference between the end diagonal and the start diagonal. This is used to relate diagonal numbers
            //   relative to the start diagonal with diagonal numbers relative to the end diagonal.
            // The Even/Oddn-ness of this delta is important for determining when we should check for overlap
            var delta = diagonalReverseBase - diagonalForwardBase;
            var deltaIsEven = (delta % 2 === 0);
            // Here we set up the start and end points as the furthest points found so far
            // in both the forward and reverse directions, respectively
            forwardPoints[diagonalForwardBase] = originalStart;
            reversePoints[diagonalReverseBase] = originalEnd;
            // Remember if we quit early, and thus need to do a best-effort result instead of a real result.
            quitEarlyArr[0] = false;
            // A couple of points:
            // --With this method, we iterate on the number of differences between the two sequences.
            //   The more differences there actually are, the longer this will take.
            // --Also, as the number of differences increases, we have to search on diagonals further
            //   away from the reference diagonal (which is diagonalForwardBase for forward, diagonalReverseBase for reverse).
            // --We extend on even diagonals (relative to the reference diagonal) only when numDifferences
            //   is even and odd diagonals only when numDifferences is odd.
            var diagonal, tempOriginalIndex;
            for (numDifferences = 1; numDifferences <= (maxDifferences / 2) + 1; numDifferences++) {
                var furthestOriginalIndex = 0;
                var furthestModifiedIndex = 0;
                // Run the algorithm in the forward direction
                diagonalForwardStart = this.ClipDiagonalBound(diagonalForwardBase - numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
                diagonalForwardEnd = this.ClipDiagonalBound(diagonalForwardBase + numDifferences, numDifferences, diagonalForwardBase, numDiagonals);
                for (diagonal = diagonalForwardStart; diagonal <= diagonalForwardEnd; diagonal += 2) {
                    // STEP 1: We extend the furthest reaching point in the present diagonal
                    // by looking at the diagonals above and below and picking the one whose point
                    // is further away from the start point (originalStart, modifiedStart)
                    if (diagonal === diagonalForwardStart || (diagonal < diagonalForwardEnd && forwardPoints[diagonal - 1] < forwardPoints[diagonal + 1])) {
                        originalIndex = forwardPoints[diagonal + 1];
                    }
                    else {
                        originalIndex = forwardPoints[diagonal - 1] + 1;
                    }
                    modifiedIndex = originalIndex - (diagonal - diagonalForwardBase) - diagonalForwardOffset;
                    // Save the current originalIndex so we can test for false overlap in step 3
                    tempOriginalIndex = originalIndex;
                    // STEP 2: We can continue to extend the furthest reaching point in the present diagonal
                    // so long as the elements are equal.
                    while (originalIndex < originalEnd && modifiedIndex < modifiedEnd && this.ElementsAreEqual(originalIndex + 1, modifiedIndex + 1)) {
                        originalIndex++;
                        modifiedIndex++;
                    }
                    forwardPoints[diagonal] = originalIndex;
                    if (originalIndex + modifiedIndex > furthestOriginalIndex + furthestModifiedIndex) {
                        furthestOriginalIndex = originalIndex;
                        furthestModifiedIndex = modifiedIndex;
                    }
                    // STEP 3: If delta is odd (overlap first happens on forward when delta is odd)
                    // and diagonal is in the range of reverse diagonals computed for numDifferences-1
                    // (the previous iteration; we haven't computed reverse diagonals for numDifferences yet)
                    // then check for overlap.
                    if (!deltaIsEven && Math.abs(diagonal - diagonalReverseBase) <= (numDifferences - 1)) {
                        if (originalIndex >= reversePoints[diagonal]) {
                            midOriginalArr[0] = originalIndex;
                            midModifiedArr[0] = modifiedIndex;
                            if (tempOriginalIndex <= reversePoints[diagonal] && MaxDifferencesHistory > 0 && numDifferences <= (MaxDifferencesHistory + 1)) {
                                // BINGO! We overlapped, and we have the full trace in memory!
                                return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
                            }
                            else {
                                // Either false overlap, or we didn't have enough memory for the full trace
                                // Just return the recursion point
                                return null;
                            }
                        }
                    }
                }
                // Check to see if we should be quitting early, before moving on to the next iteration.
                var matchLengthOfLongest = ((furthestOriginalIndex - originalStart) + (furthestModifiedIndex - modifiedStart) - numDifferences) / 2;
                if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(furthestOriginalIndex, this.OriginalSequence, matchLengthOfLongest)) {
                    // We can't finish, so skip ahead to generating a result from what we have.
                    quitEarlyArr[0] = true;
                    // Use the furthest distance we got in the forward direction.
                    midOriginalArr[0] = furthestOriginalIndex;
                    midModifiedArr[0] = furthestModifiedIndex;
                    if (matchLengthOfLongest > 0 && MaxDifferencesHistory > 0 && numDifferences <= (MaxDifferencesHistory + 1)) {
                        // Enough of the history is in memory to walk it backwards
                        return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
                    }
                    else {
                        // We didn't actually remember enough of the history.
                        //Since we are quiting the diff early, we need to shift back the originalStart and modified start
                        //back into the boundary limits since we decremented their value above beyond the boundary limit.
                        originalStart++;
                        modifiedStart++;
                        return [
                            new diffChange_1.DiffChange(originalStart, originalEnd - originalStart + 1, modifiedStart, modifiedEnd - modifiedStart + 1)
                        ];
                    }
                }
                // Run the algorithm in the reverse direction
                diagonalReverseStart = this.ClipDiagonalBound(diagonalReverseBase - numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
                diagonalReverseEnd = this.ClipDiagonalBound(diagonalReverseBase + numDifferences, numDifferences, diagonalReverseBase, numDiagonals);
                for (diagonal = diagonalReverseStart; diagonal <= diagonalReverseEnd; diagonal += 2) {
                    // STEP 1: We extend the furthest reaching point in the present diagonal
                    // by looking at the diagonals above and below and picking the one whose point
                    // is further away from the start point (originalEnd, modifiedEnd)
                    if (diagonal === diagonalReverseStart || (diagonal < diagonalReverseEnd && reversePoints[diagonal - 1] >= reversePoints[diagonal + 1])) {
                        originalIndex = reversePoints[diagonal + 1] - 1;
                    }
                    else {
                        originalIndex = reversePoints[diagonal - 1];
                    }
                    modifiedIndex = originalIndex - (diagonal - diagonalReverseBase) - diagonalReverseOffset;
                    // Save the current originalIndex so we can test for false overlap
                    tempOriginalIndex = originalIndex;
                    // STEP 2: We can continue to extend the furthest reaching point in the present diagonal
                    // as long as the elements are equal.
                    while (originalIndex > originalStart && modifiedIndex > modifiedStart && this.ElementsAreEqual(originalIndex, modifiedIndex)) {
                        originalIndex--;
                        modifiedIndex--;
                    }
                    reversePoints[diagonal] = originalIndex;
                    // STEP 4: If delta is even (overlap first happens on reverse when delta is even)
                    // and diagonal is in the range of forward diagonals computed for numDifferences
                    // then check for overlap.
                    if (deltaIsEven && Math.abs(diagonal - diagonalForwardBase) <= numDifferences) {
                        if (originalIndex <= forwardPoints[diagonal]) {
                            midOriginalArr[0] = originalIndex;
                            midModifiedArr[0] = modifiedIndex;
                            if (tempOriginalIndex >= forwardPoints[diagonal] && MaxDifferencesHistory > 0 && numDifferences <= (MaxDifferencesHistory + 1)) {
                                // BINGO! We overlapped, and we have the full trace in memory!
                                return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
                            }
                            else {
                                // Either false overlap, or we didn't have enough memory for the full trace
                                // Just return the recursion point
                                return null;
                            }
                        }
                    }
                }
                // Save current vectors to history before the next iteration
                if (numDifferences <= MaxDifferencesHistory) {
                    // We are allocating space for one extra int, which we fill with
                    // the index of the diagonal base index
                    var temp = new Array(diagonalForwardEnd - diagonalForwardStart + 2);
                    temp[0] = diagonalForwardBase - diagonalForwardStart + 1;
                    MyArray.Copy(forwardPoints, diagonalForwardStart, temp, 1, diagonalForwardEnd - diagonalForwardStart + 1);
                    this.m_forwardHistory.push(temp);
                    temp = new Array(diagonalReverseEnd - diagonalReverseStart + 2);
                    temp[0] = diagonalReverseBase - diagonalReverseStart + 1;
                    MyArray.Copy(reversePoints, diagonalReverseStart, temp, 1, diagonalReverseEnd - diagonalReverseStart + 1);
                    this.m_reverseHistory.push(temp);
                }
            }
            // If we got here, then we have the full trace in history. We just have to convert it to a change list
            // NOTE: This part is a bit messy
            return this.WALKTRACE(diagonalForwardBase, diagonalForwardStart, diagonalForwardEnd, diagonalForwardOffset, diagonalReverseBase, diagonalReverseStart, diagonalReverseEnd, diagonalReverseOffset, forwardPoints, reversePoints, originalIndex, originalEnd, midOriginalArr, modifiedIndex, modifiedEnd, midModifiedArr, deltaIsEven, quitEarlyArr);
        };
        /**
         * Concatenates the two input DiffChange lists and returns the resulting
         * list.
         * @param The left changes
         * @param The right changes
         * @returns The concatenated list
         */
        LcsDiff.prototype.ConcatenateChanges = function (left, right) {
            var mergedChangeArr = [];
            var result = null;
            if (left.length === 0 || right.length === 0) {
                return (right.length > 0) ? right : left;
            }
            else if (this.ChangesOverlap(left[left.length - 1], right[0], mergedChangeArr)) {
                // Since we break the problem down recursively, it is possible that we
                // might recurse in the middle of a change thereby splitting it into
                // two changes. Here in the combining stage, we detect and fuse those
                // changes back together
                result = new Array(left.length + right.length - 1);
                MyArray.Copy(left, 0, result, 0, left.length - 1);
                result[left.length - 1] = mergedChangeArr[0];
                MyArray.Copy(right, 1, result, left.length, right.length - 1);
                return result;
            }
            else {
                result = new Array(left.length + right.length);
                MyArray.Copy(left, 0, result, 0, left.length);
                MyArray.Copy(right, 0, result, left.length, right.length);
                return result;
            }
        };
        /**
         * Returns true if the two changes overlap and can be merged into a single
         * change
         * @param left The left change
         * @param right The right change
         * @param mergedChange The merged change if the two overlap, null otherwise
         * @returns True if the two changes overlap
         */
        LcsDiff.prototype.ChangesOverlap = function (left, right, mergedChangeArr) {
            Debug.Assert(left.originalStart <= right.originalStart, 'Left change is not less than or equal to right change');
            Debug.Assert(left.modifiedStart <= right.modifiedStart, 'Left change is not less than or equal to right change');
            if (left.originalStart + left.originalLength >= right.originalStart || left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
                var originalStart = left.originalStart;
                var originalLength = left.originalLength;
                var modifiedStart = left.modifiedStart;
                var modifiedLength = left.modifiedLength;
                if (left.originalStart + left.originalLength >= right.originalStart) {
                    originalLength = right.originalStart + right.originalLength - left.originalStart;
                }
                if (left.modifiedStart + left.modifiedLength >= right.modifiedStart) {
                    modifiedLength = right.modifiedStart + right.modifiedLength - left.modifiedStart;
                }
                mergedChangeArr[0] = new diffChange_1.DiffChange(originalStart, originalLength, modifiedStart, modifiedLength);
                return true;
            }
            else {
                mergedChangeArr[0] = null;
                return false;
            }
        };
        /**
         * Helper method used to clip a diagonal index to the range of valid
         * diagonals. This also decides whether or not the diagonal index,
         * if it exceeds the boundary, should be clipped to the boundary or clipped
         * one inside the boundary depending on the Even/Odd status of the boundary
         * and numDifferences.
         * @param diagonal The index of the diagonal to clip.
         * @param numDifferences The current number of differences being iterated upon.
         * @param diagonalBaseIndex The base reference diagonal.
         * @param numDiagonals The total number of diagonals.
         * @returns The clipped diagonal index.
         */
        LcsDiff.prototype.ClipDiagonalBound = function (diagonal, numDifferences, diagonalBaseIndex, numDiagonals) {
            if (diagonal >= 0 && diagonal < numDiagonals) {
                // Nothing to clip, its in range
                return diagonal;
            }
            // diagonalsBelow: The number of diagonals below the reference diagonal
            // diagonalsAbove: The number of diagonals above the reference diagonal
            var diagonalsBelow = diagonalBaseIndex;
            var diagonalsAbove = numDiagonals - diagonalBaseIndex - 1;
            var diffEven = (numDifferences % 2 === 0);
            if (diagonal < 0) {
                var lowerBoundEven = (diagonalsBelow % 2 === 0);
                return (diffEven === lowerBoundEven) ? 0 : 1;
            }
            else {
                var upperBoundEven = (diagonalsAbove % 2 === 0);
                return (diffEven === upperBoundEven) ? numDiagonals - 1 : numDiagonals - 2;
            }
        };
        return LcsDiff;
    }());
    exports.LcsDiff = LcsDiff;
});

define("vs/base/common/filters", ["require", "exports", 'vs/base/common/strings'], function (require, exports, strings) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // Combined filters
    /**
     * @returns A filter which combines the provided set
     * of filters with an or. The *first* filters that
     * matches defined the return value of the returned
     * filter.
     */
    function or() {
        var filter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filter[_i - 0] = arguments[_i];
        }
        return function (word, wordToMatchAgainst) {
            for (var i = 0, len = filter.length; i < len; i++) {
                var match = filter[i](word, wordToMatchAgainst);
                if (match) {
                    return match;
                }
            }
            return null;
        };
    }
    exports.or = or;
    /**
     * @returns A filter which combines the provided set
     * of filters with an and. The combines matches are
     * returned if *all* filters match.
     */
    function and() {
        var filter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filter[_i - 0] = arguments[_i];
        }
        return function (word, wordToMatchAgainst) {
            var result = [];
            for (var i = 0, len = filter.length; i < len; i++) {
                var match = filter[i](word, wordToMatchAgainst);
                if (!match) {
                    return null;
                }
                result = result.concat(match);
            }
            return result;
        };
    }
    exports.and = and;
    // Prefix
    exports.matchesStrictPrefix = function (word, wordToMatchAgainst) { return _matchesPrefix(false, word, wordToMatchAgainst); };
    exports.matchesPrefix = function (word, wordToMatchAgainst) { return _matchesPrefix(true, word, wordToMatchAgainst); };
    function _matchesPrefix(ignoreCase, word, wordToMatchAgainst) {
        if (wordToMatchAgainst.length === 0 || wordToMatchAgainst.length < word.length) {
            return null;
        }
        if (ignoreCase) {
            word = word.toLowerCase();
            wordToMatchAgainst = wordToMatchAgainst.toLowerCase();
        }
        for (var i = 0; i < word.length; i++) {
            if (word[i] !== wordToMatchAgainst[i]) {
                return null;
            }
        }
        return word.length > 0 ? [{ start: 0, end: word.length }] : [];
    }
    // Contiguous Substring
    function matchesContiguousSubString(word, wordToMatchAgainst) {
        var index = wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());
        if (index === -1) {
            return null;
        }
        return [{ start: index, end: index + word.length }];
    }
    exports.matchesContiguousSubString = matchesContiguousSubString;
    // Substring
    function matchesSubString(word, wordToMatchAgainst) {
        return _matchesSubString(word.toLowerCase(), wordToMatchAgainst.toLowerCase(), 0, 0);
    }
    exports.matchesSubString = matchesSubString;
    function _matchesSubString(word, wordToMatchAgainst, i, j) {
        if (i === word.length) {
            return [];
        }
        else if (j === wordToMatchAgainst.length) {
            return null;
        }
        else {
            if (word[i] === wordToMatchAgainst[j]) {
                var result = null;
                if (result = _matchesSubString(word, wordToMatchAgainst, i + 1, j + 1)) {
                    return join({ start: j, end: j + 1 }, result);
                }
            }
            return _matchesSubString(word, wordToMatchAgainst, i, j + 1);
        }
    }
    // CamelCase
    function isLower(code) {
        return 97 <= code && code <= 122;
    }
    function isUpper(code) {
        return 65 <= code && code <= 90;
    }
    function isNumber(code) {
        return 48 <= code && code <= 57;
    }
    function isWhitespace(code) {
        return [32, 9, 10, 13].indexOf(code) > -1;
    }
    function isAlphanumeric(code) {
        return isLower(code) || isUpper(code) || isNumber(code);
    }
    function join(head, tail) {
        if (tail.length === 0) {
            tail = [head];
        }
        else if (head.end === tail[0].start) {
            tail[0].start = head.start;
        }
        else {
            tail.unshift(head);
        }
        return tail;
    }
    function nextAnchor(camelCaseWord, start) {
        for (var i = start; i < camelCaseWord.length; i++) {
            var c = camelCaseWord.charCodeAt(i);
            if (isUpper(c) || isNumber(c) || (i > 0 && !isAlphanumeric(camelCaseWord.charCodeAt(i - 1)))) {
                return i;
            }
        }
        return camelCaseWord.length;
    }
    function _matchesCamelCase(word, camelCaseWord, i, j) {
        if (i === word.length) {
            return [];
        }
        else if (j === camelCaseWord.length) {
            return null;
        }
        else if (word[i] !== camelCaseWord[j].toLowerCase()) {
            return null;
        }
        else {
            var result = null;
            var nextUpperIndex = j + 1;
            result = _matchesCamelCase(word, camelCaseWord, i + 1, j + 1);
            while (!result && (nextUpperIndex = nextAnchor(camelCaseWord, nextUpperIndex)) < camelCaseWord.length) {
                result = _matchesCamelCase(word, camelCaseWord, i + 1, nextUpperIndex);
                nextUpperIndex++;
            }
            return result === null ? null : join({ start: j, end: j + 1 }, result);
        }
    }
    // Heuristic to avoid computing camel case matcher for words that don't
    // look like camelCaseWords.
    function isCamelCaseWord(word) {
        if (word.length > 60) {
            return false;
        }
        var upper = 0, lower = 0, alpha = 0, numeric = 0, code = 0;
        for (var i = 0; i < word.length; i++) {
            code = word.charCodeAt(i);
            if (isUpper(code)) {
                upper++;
            }
            if (isLower(code)) {
                lower++;
            }
            if (isAlphanumeric(code)) {
                alpha++;
            }
            if (isNumber(code)) {
                numeric++;
            }
        }
        var upperPercent = upper / word.length;
        var lowerPercent = lower / word.length;
        var alphaPercent = alpha / word.length;
        var numericPercent = numeric / word.length;
        return lowerPercent > 0.2 && upperPercent < 0.8 && alphaPercent > 0.6 && numericPercent < 0.2;
    }
    // Heuristic to avoid computing camel case matcher for words that don't
    // look like camel case patterns.
    function isCamelCasePattern(word) {
        var upper = 0, lower = 0, code = 0, whitespace = 0;
        for (var i = 0; i < word.length; i++) {
            code = word.charCodeAt(i);
            if (isUpper(code)) {
                upper++;
            }
            if (isLower(code)) {
                lower++;
            }
            if (isWhitespace(code)) {
                whitespace++;
            }
        }
        if ((upper === 0 || lower === 0) && whitespace === 0) {
            return word.length <= 30;
        }
        else {
            return upper <= 5;
        }
    }
    function matchesCamelCase(word, camelCaseWord) {
        if (camelCaseWord.length === 0) {
            return null;
        }
        if (!isCamelCasePattern(word)) {
            return null;
        }
        if (!isCamelCaseWord(camelCaseWord)) {
            return null;
        }
        var result = null;
        var i = 0;
        while (i < camelCaseWord.length && (result = _matchesCamelCase(word.toLowerCase(), camelCaseWord, 0, i)) === null) {
            i = nextAnchor(camelCaseWord, i + 1);
        }
        return result;
    }
    exports.matchesCamelCase = matchesCamelCase;
    // Fuzzy
    (function (SubstringMatching) {
        SubstringMatching[SubstringMatching["Contiguous"] = 0] = "Contiguous";
        SubstringMatching[SubstringMatching["Separate"] = 1] = "Separate";
    })(exports.SubstringMatching || (exports.SubstringMatching = {}));
    var SubstringMatching = exports.SubstringMatching;
    var fuzzyContiguousFilter = or(exports.matchesPrefix, matchesCamelCase, matchesContiguousSubString);
    var fuzzySeparateFilter = or(exports.matchesPrefix, matchesCamelCase, matchesSubString);
    var fuzzyRegExpCache = {};
    function matchesFuzzy(word, wordToMatchAgainst, enableSeparateSubstringMatching) {
        if (enableSeparateSubstringMatching === void 0) { enableSeparateSubstringMatching = false; }
        // Form RegExp for wildcard matches
        var regexp = fuzzyRegExpCache[word];
        if (!regexp) {
            regexp = new RegExp(strings.convertSimple2RegExpPattern(word), 'i');
            fuzzyRegExpCache[word] = regexp;
        }
        // RegExp Filter
        var match = regexp.exec(wordToMatchAgainst);
        if (match) {
            return [{ start: match.index, end: match.index + match[0].length }];
        }
        // Default Filter
        return enableSeparateSubstringMatching ? fuzzySeparateFilter(word, wordToMatchAgainst) : fuzzyContiguousFilter(word, wordToMatchAgainst);
    }
    exports.matchesFuzzy = matchesFuzzy;
});

define("vs/base/common/uri", ["require", "exports", 'vs/base/common/platform'], function (require, exports, platform) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
    function fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); });
    }
    /**
     * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
     * This class is a simple parser which creates the basic component paths
     * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
     * and encoding.
     *
     *       foo://example.com:8042/over/there?name=ferret#nose
     *       \_/   \______________/\_________/ \_________/ \__/
     *        |           |            |            |        |
     *     scheme     authority       path        query   fragment
     *        |   _____________________|__
     *       / \ /                        \
     *       urn:example:animal:ferret:nose
     *
     *
     */
    var URI = (function () {
        function URI() {
            this._scheme = URI._empty;
            this._authority = URI._empty;
            this._path = URI._empty;
            this._query = URI._empty;
            this._fragment = URI._empty;
        }
        Object.defineProperty(URI.prototype, "scheme", {
            /**
             * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part before the first colon.
             */
            get: function () {
                return this._scheme;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "authority", {
            /**
             * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part between the first double slashes and the next slash.
             */
            get: function () {
                return this._authority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "path", {
            /**
             * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "query", {
            /**
             * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._query;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fragment", {
            /**
             * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._fragment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fsPath", {
            /**
             * Returns a string representing the corresponding file system path of this URI.
             * Will handle UNC paths and normalize windows drive letters to lower-case. Also
             * uses the platform specific path separator. Will *not* validate the path for
             * invalid characters and semantics. Will *not* look at the scheme of this URI.
             */
            get: function () {
                if (!this._fsPath) {
                    var value;
                    if (this._authority && this.scheme === 'file') {
                        // unc path: file://shares/c$/far/boo
                        value = "//" + this._authority + this._path;
                    }
                    else if (URI._driveLetterPath.test(this._path)) {
                        // windows drive letter: file:///c:/far/boo
                        value = this._path[1].toLowerCase() + this._path.substr(2);
                    }
                    else {
                        // other path
                        value = this._path;
                    }
                    if (platform.isWindows) {
                        value = value.replace(/\//g, '\\');
                    }
                    this._fsPath = value;
                }
                return this._fsPath;
            },
            enumerable: true,
            configurable: true
        });
        // ---- modify to new -------------------------
        URI.prototype.with = function (scheme, authority, path, query, fragment) {
            var ret = new URI();
            ret._scheme = scheme || this.scheme;
            ret._authority = authority || this.authority;
            ret._path = path || this.path;
            ret._query = query || this.query;
            ret._fragment = fragment || this.fragment;
            URI._validate(ret);
            return ret;
        };
        URI.prototype.withScheme = function (value) {
            return this.with(value, undefined, undefined, undefined, undefined);
        };
        URI.prototype.withAuthority = function (value) {
            return this.with(undefined, value, undefined, undefined, undefined);
        };
        URI.prototype.withPath = function (value) {
            return this.with(undefined, undefined, value, undefined, undefined);
        };
        URI.prototype.withQuery = function (value) {
            return this.with(undefined, undefined, undefined, value, undefined);
        };
        URI.prototype.withFragment = function (value) {
            return this.with(undefined, undefined, undefined, undefined, value);
        };
        // ---- parse & validate ------------------------
        URI.parse = function (value) {
            var ret = new URI();
            var data = URI._parseComponents(value);
            ret._scheme = data.scheme;
            ret._authority = decodeURIComponent(data.authority);
            ret._path = decodeURIComponent(data.path);
            ret._query = decodeURIComponent(data.query);
            ret._fragment = decodeURIComponent(data.fragment);
            URI._validate(ret);
            return ret;
        };
        URI.file = function (path) {
            path = path.replace(/\\/g, '/');
            path = path.replace(/%/g, '%25');
            path = path.replace(/#/g, '%23');
            path = path.replace(/\?/g, '%3F');
            // makes sure something like 'C:/Users' isn't
            // parsed as scheme='C', path='Users'
            path = URI._driveLetter.test(path)
                ? '/' + path
                : path;
            var data = URI._parseComponents(path);
            if (data.scheme || data.fragment || data.query) {
                throw new Error('Path contains a scheme, fragment or a query. Can not convert it to a file uri.');
            }
            var ret = new URI();
            ret._scheme = 'file';
            ret._authority = data.authority;
            ret._path = decodeURIComponent(data.path[0] === '/' ? data.path : '/' + data.path); // path starts with slash
            ret._query = data.query;
            ret._fragment = data.fragment;
            URI._validate(ret);
            return ret;
        };
        URI._parseComponents = function (value) {
            var ret = {
                scheme: URI._empty,
                authority: URI._empty,
                path: URI._empty,
                query: URI._empty,
                fragment: URI._empty,
            };
            var match = URI._regexp.exec(value);
            if (match) {
                ret.scheme = match[2] || ret.scheme;
                ret.authority = match[4] || ret.authority;
                ret.path = match[5] || ret.path;
                ret.query = match[7] || ret.query;
                ret.fragment = match[9] || ret.fragment;
            }
            return ret;
        };
        URI.create = function (scheme, authority, path, query, fragment) {
            return new URI().with(scheme, authority, path, query, fragment);
        };
        URI._validate = function (ret) {
            // validation
            // path, http://tools.ietf.org/html/rfc3986#section-3.3
            // If a URI contains an authority component, then the path component
            // must either be empty or begin with a slash ("/") character.  If a URI
            // does not contain an authority component, then the path cannot begin
            // with two slash characters ("//").
            if (ret.authority && ret.path && ret.path[0] !== '/') {
                throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
            }
            if (!ret.authority && ret.path.indexOf('//') === 0) {
                throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
            }
        };
        URI.prototype.toString = function () {
            if (!this._formatted) {
                var parts = [];
                if (this._scheme) {
                    parts.push(this._scheme);
                    parts.push(':');
                }
                if (this._authority || this._scheme === 'file') {
                    parts.push('//');
                }
                if (this._authority) {
                    var authority = this._authority, idx;
                    authority = authority.toLowerCase();
                    idx = authority.indexOf(':');
                    if (idx === -1) {
                        parts.push(fixedEncodeURIComponent(authority));
                    }
                    else {
                        parts.push(fixedEncodeURIComponent(authority.substr(0, idx)));
                        parts.push(authority.substr(idx));
                    }
                }
                if (this._path) {
                    // encode every segment of the path
                    var path = this._path, segments;
                    // lower-case win drive letters in /C:/fff
                    if (URI._driveLetterPath.test(path)) {
                        path = '/' + path[1].toLowerCase() + path.substr(2);
                    }
                    else if (URI._driveLetter.test(path)) {
                        path = path[0].toLowerCase() + path.substr(1);
                    }
                    segments = path.split('/');
                    for (var i = 0, len = segments.length; i < len; i++) {
                        segments[i] = fixedEncodeURIComponent(segments[i]);
                    }
                    parts.push(segments.join('/'));
                }
                if (this._query) {
                    // in http(s) querys often use 'key=value'-pairs and
                    // ampersand characters for multiple pairs
                    var encoder = /https?/i.test(this.scheme)
                        ? encodeURI
                        : fixedEncodeURIComponent;
                    parts.push('?');
                    parts.push(encoder(this._query));
                }
                if (this._fragment) {
                    parts.push('#');
                    parts.push(fixedEncodeURIComponent(this._fragment));
                }
                this._formatted = parts.join('');
            }
            return this._formatted;
        };
        URI.prototype.toJSON = function () {
            return {
                scheme: this.scheme,
                authority: this.authority,
                path: this.path,
                fsPath: this.fsPath,
                query: this.query,
                fragment: this.fragment.replace(/URL_MARSHAL_REMOVE.*$/, ''),
                external: this.toString().replace(/#?URL_MARSHAL_REMOVE.*$/, ''),
                $mid: 1
            };
        };
        URI.revive = function (data) {
            var result = new URI();
            result._scheme = data.scheme;
            result._authority = data.authority;
            result._path = data.path;
            result._query = data.query;
            result._fragment = data.fragment;
            result._fsPath = data.fsPath;
            result._formatted = data.external;
            URI._validate(result);
            return result;
        };
        URI._empty = '';
        URI._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
        URI._driveLetterPath = /^\/[a-zA-z]:/;
        URI._driveLetter = /^[a-zA-z]:/;
        return URI;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = URI;
});

define("vs/editor/common/core/arrays", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Arrays;
    (function (Arrays) {
        /**
         * Given a sorted array of natural number segments, find the segment containing a natural number.
         *    For example, the segments [0, 5), [5, 9), [9, infinity) will be represented in the following manner:
         *       [{ startIndex: 0 }, { startIndex: 5 }, { startIndex: 9 }]
         *    Searching for 0, 1, 2, 3 or 4 will return 0.
         *    Searching for 5, 6, 7 or 8 will return 1.
         *    Searching for 9, 10, 11, ... will return 2.
         * @param arr A sorted array representing natural number segments
         * @param desiredIndex The search
         * @return The index of the containing segment in the array.
         */
        function findIndexInSegmentsArray(arr, desiredIndex) {
            var low = 0, high = arr.length - 1, mid;
            while (low < high) {
                mid = low + Math.ceil((high - low) / 2);
                if (arr[mid].startIndex > desiredIndex) {
                    high = mid - 1;
                }
                else {
                    low = mid;
                }
            }
            return low;
        }
        Arrays.findIndexInSegmentsArray = findIndexInSegmentsArray;
    })(Arrays = exports.Arrays || (exports.Arrays = {}));
});

define("vs/editor/common/core/position", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var Position = (function () {
        function Position(lineNumber, column) {
            this.lineNumber = lineNumber;
            this.column = column;
        }
        Position.prototype.equals = function (other) {
            return Position.equals(this, other);
        };
        Position.equals = function (a, b) {
            if (!a && !b) {
                return true;
            }
            return (!!a &&
                !!b &&
                a.lineNumber === b.lineNumber &&
                a.column === b.column);
        };
        Position.prototype.isBefore = function (other) {
            return Position.isBefore(this, other);
        };
        Position.isBefore = function (a, b) {
            if (a.lineNumber < b.lineNumber) {
                return true;
            }
            if (b.lineNumber < a.lineNumber) {
                return false;
            }
            return a.column < b.column;
        };
        Position.prototype.isBeforeOrEqual = function (other) {
            return Position.isBeforeOrEqual(this, other);
        };
        Position.isBeforeOrEqual = function (a, b) {
            if (a.lineNumber < b.lineNumber) {
                return true;
            }
            if (b.lineNumber < a.lineNumber) {
                return false;
            }
            return a.column <= b.column;
        };
        Position.prototype.clone = function () {
            return new Position(this.lineNumber, this.column);
        };
        Position.prototype.toString = function () {
            return '(' + this.lineNumber + ',' + this.column + ')';
        };
        // ---
        Position.lift = function (pos) {
            return new Position(pos.lineNumber, pos.column);
        };
        Position.isIPosition = function (obj) {
            return (obj
                && (typeof obj.lineNumber === 'number')
                && (typeof obj.column === 'number'));
        };
        Position.asEmptyRange = function (position) {
            return {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            };
        };
        Position.startPosition = function (range) {
            return {
                lineNumber: range.startLineNumber,
                column: range.startColumn
            };
        };
        Position.endPosition = function (range) {
            return {
                lineNumber: range.endLineNumber,
                column: range.endColumn
            };
        };
        return Position;
    }());
    exports.Position = Position;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/editor/common/core/range", ["require", "exports", 'vs/editor/common/core/position'], function (require, exports, position_1) {
    'use strict';
    var Range = (function () {
        function Range(startLineNumber, startColumn, endLineNumber, endColumn) {
            if ((startLineNumber > endLineNumber) || (startLineNumber === endLineNumber && startColumn > endColumn)) {
                this.startLineNumber = endLineNumber;
                this.startColumn = endColumn;
                this.endLineNumber = startLineNumber;
                this.endColumn = startColumn;
            }
            else {
                this.startLineNumber = startLineNumber;
                this.startColumn = startColumn;
                this.endLineNumber = endLineNumber;
                this.endColumn = endColumn;
            }
        }
        Range.prototype.isEmpty = function () {
            return Range.isEmpty(this);
        };
        Range.prototype.containsPosition = function (position) {
            return Range.containsPosition(this, position);
        };
        Range.prototype.containsRange = function (range) {
            return Range.containsRange(this, range);
        };
        Range.prototype.plusRange = function (range) {
            return Range.plusRange(this, range);
        };
        Range.prototype.intersectRanges = function (range) {
            return Range.intersectRanges(this, range);
        };
        Range.prototype.equalsRange = function (other) {
            return Range.equalsRange(this, other);
        };
        Range.prototype.getEndPosition = function () {
            return new position_1.Position(this.endLineNumber, this.endColumn);
        };
        Range.prototype.getStartPosition = function () {
            return new position_1.Position(this.startLineNumber, this.startColumn);
        };
        Range.prototype.cloneRange = function () {
            return new Range(this.startLineNumber, this.startColumn, this.endLineNumber, this.endColumn);
        };
        Range.prototype.toString = function () {
            return '[' + this.startLineNumber + ',' + this.startColumn + ' -> ' + this.endLineNumber + ',' + this.endColumn + ']';
        };
        Range.prototype.setEndPosition = function (endLineNumber, endColumn) {
            return new Range(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
        };
        Range.prototype.setStartPosition = function (startLineNumber, startColumn) {
            return new Range(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
        };
        Range.prototype.collapseToStart = function () {
            return new Range(this.startLineNumber, this.startColumn, this.startLineNumber, this.startColumn);
        };
        // ---
        Range.lift = function (range) {
            if (!range) {
                return null;
            }
            return new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
        };
        Range.isIRange = function (obj) {
            return (obj
                && (typeof obj.startLineNumber === 'number')
                && (typeof obj.startColumn === 'number')
                && (typeof obj.endLineNumber === 'number')
                && (typeof obj.endColumn === 'number'));
        };
        Range.isEmpty = function (range) {
            return (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn);
        };
        Range.containsPosition = function (range, position) {
            if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
                return false;
            }
            if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
                return false;
            }
            if (position.lineNumber === range.endLineNumber && position.column > range.endColumn) {
                return false;
            }
            return true;
        };
        Range.containsRange = function (range, otherRange) {
            if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
                return false;
            }
            if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
                return false;
            }
            if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn < range.startColumn) {
                return false;
            }
            if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn > range.endColumn) {
                return false;
            }
            return true;
        };
        Range.areIntersectingOrTouching = function (a, b) {
            // Check if `a` is before `b`
            if (a.endLineNumber < b.startLineNumber || (a.endLineNumber === b.startLineNumber && a.endColumn < b.startColumn)) {
                return false;
            }
            // Check if `b` is before `a`
            if (b.endLineNumber < a.startLineNumber || (b.endLineNumber === a.startLineNumber && b.endColumn < a.startColumn)) {
                return false;
            }
            // These ranges must intersect
            return true;
        };
        Range.intersectRanges = function (a, b) {
            var resultStartLineNumber = a.startLineNumber, resultStartColumn = a.startColumn, resultEndLineNumber = a.endLineNumber, resultEndColumn = a.endColumn, otherStartLineNumber = b.startLineNumber, otherStartColumn = b.startColumn, otherEndLineNumber = b.endLineNumber, otherEndColumn = b.endColumn;
            if (resultStartLineNumber < otherStartLineNumber) {
                resultStartLineNumber = otherStartLineNumber;
                resultStartColumn = otherStartColumn;
            }
            else if (resultStartLineNumber === otherStartLineNumber) {
                resultStartColumn = Math.max(resultStartColumn, otherStartColumn);
            }
            if (resultEndLineNumber > otherEndLineNumber) {
                resultEndLineNumber = otherEndLineNumber;
                resultEndColumn = otherEndColumn;
            }
            else if (resultEndLineNumber === otherEndLineNumber) {
                resultEndColumn = Math.min(resultEndColumn, otherEndColumn);
            }
            // Check if selection is now empty
            if (resultStartLineNumber > resultEndLineNumber) {
                return null;
            }
            if (resultStartLineNumber === resultEndLineNumber && resultStartColumn > resultEndColumn) {
                return null;
            }
            return new Range(resultStartLineNumber, resultStartColumn, resultEndLineNumber, resultEndColumn);
        };
        Range.plusRange = function (a, b) {
            var startLineNumber, startColumn, endLineNumber, endColumn;
            if (b.startLineNumber < a.startLineNumber) {
                startLineNumber = b.startLineNumber;
                startColumn = b.startColumn;
            }
            else if (b.startLineNumber === a.startLineNumber) {
                startLineNumber = b.startLineNumber;
                startColumn = Math.min(b.startColumn, a.startColumn);
            }
            else {
                startLineNumber = a.startLineNumber;
                startColumn = a.startColumn;
            }
            if (b.endLineNumber > a.endLineNumber) {
                endLineNumber = b.endLineNumber;
                endColumn = b.endColumn;
            }
            else if (b.endLineNumber === a.endLineNumber) {
                endLineNumber = b.endLineNumber;
                endColumn = Math.max(b.endColumn, a.endColumn);
            }
            else {
                endLineNumber = a.endLineNumber;
                endColumn = a.endColumn;
            }
            return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
        };
        Range.equalsRange = function (a, b) {
            return (!!a &&
                !!b &&
                a.startLineNumber === b.startLineNumber &&
                a.startColumn === b.startColumn &&
                a.endLineNumber === b.endLineNumber &&
                a.endColumn === b.endColumn);
        };
        /**
         * A function that compares ranges, useful for sorting ranges
         * It will first compare ranges on the startPosition and then on the endPosition
         */
        Range.compareRangesUsingStarts = function (a, b) {
            if (a.startLineNumber === b.startLineNumber) {
                if (a.startColumn === b.startColumn) {
                    if (a.endLineNumber === b.endLineNumber) {
                        return a.endColumn - b.endColumn;
                    }
                    return a.endLineNumber - b.endLineNumber;
                }
                return a.startColumn - b.startColumn;
            }
            return a.startLineNumber - b.startLineNumber;
        };
        /**
         * A function that compares ranges, useful for sorting ranges
         * It will first compare ranges on the endPosition and then on the startPosition
         */
        Range.compareRangesUsingEnds = function (a, b) {
            if (a.endLineNumber === b.endLineNumber) {
                if (a.endColumn === b.endColumn) {
                    if (a.startLineNumber === b.startLineNumber) {
                        return a.startColumn - b.startColumn;
                    }
                    return a.startLineNumber - b.startLineNumber;
                }
                return a.endColumn - b.endColumn;
            }
            return a.endLineNumber - b.endLineNumber;
        };
        Range.spansMultipleLines = function (range) {
            return range.endLineNumber > range.startLineNumber;
        };
        Range.collapseToStart = function (range) {
            return {
                startLineNumber: range.startLineNumber,
                startColumn: range.startColumn,
                endLineNumber: range.startLineNumber,
                endColumn: range.startColumn
            };
        };
        return Range;
    }());
    exports.Range = Range;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/diff/diffComputer", ["require", "exports", 'vs/base/common/diff/diff', 'vs/base/common/strings'], function (require, exports, diff_1, strings) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var MAXIMUM_RUN_TIME = 5000; // 5 seconds
    var MINIMUM_MATCHING_CHARACTER_LENGTH = 3;
    function computeDiff(originalSequence, modifiedSequence, continueProcessingPredicate) {
        var diffAlgo = new diff_1.LcsDiff(originalSequence, modifiedSequence, continueProcessingPredicate);
        return diffAlgo.ComputeDiff();
    }
    var MarkerSequence = (function () {
        function MarkerSequence(buffer, startMarkers, endMarkers) {
            this.buffer = buffer;
            this.startMarkers = startMarkers;
            this.endMarkers = endMarkers;
        }
        MarkerSequence.prototype.equals = function (other) {
            if (!(other instanceof MarkerSequence)) {
                return false;
            }
            var otherMarkerSequence = other;
            if (this.getLength() !== otherMarkerSequence.getLength()) {
                return false;
            }
            for (var i = 0, len = this.getLength(); i < len; i++) {
                var myElement = this.getElementHash(i);
                var otherElement = otherMarkerSequence.getElementHash(i);
                if (myElement !== otherElement) {
                    return false;
                }
            }
            return true;
        };
        MarkerSequence.prototype.getLength = function () {
            return this.startMarkers.length;
        };
        MarkerSequence.prototype.getElementHash = function (i) {
            return this.buffer.substring(this.startMarkers[i].offset, this.endMarkers[i].offset);
        };
        MarkerSequence.prototype.getStartLineNumber = function (i) {
            if (i === this.startMarkers.length) {
                // This is the special case where a change happened after the last marker
                return this.startMarkers[i - 1].lineNumber + 1;
            }
            return this.startMarkers[i].lineNumber;
        };
        MarkerSequence.prototype.getStartColumn = function (i) {
            return this.startMarkers[i].column;
        };
        MarkerSequence.prototype.getEndLineNumber = function (i) {
            return this.endMarkers[i].lineNumber;
        };
        MarkerSequence.prototype.getEndColumn = function (i) {
            return this.endMarkers[i].column;
        };
        return MarkerSequence;
    }());
    var LineMarkerSequence = (function (_super) {
        __extends(LineMarkerSequence, _super);
        function LineMarkerSequence(lines, shouldIgnoreTrimWhitespace) {
            var i, length, pos;
            var buffer = '';
            var startMarkers = [], endMarkers = [], startColumn, endColumn;
            for (pos = 0, i = 0, length = lines.length; i < length; i++) {
                buffer += lines[i];
                startColumn = 1;
                endColumn = lines[i].length + 1;
                if (shouldIgnoreTrimWhitespace) {
                    startColumn = LineMarkerSequence._getFirstNonBlankColumn(lines[i], 1);
                    endColumn = LineMarkerSequence._getLastNonBlankColumn(lines[i], 1);
                }
                startMarkers.push({
                    offset: pos + startColumn - 1,
                    lineNumber: i + 1,
                    column: startColumn
                });
                endMarkers.push({
                    offset: pos + endColumn - 1,
                    lineNumber: i + 1,
                    column: endColumn
                });
                pos += lines[i].length;
            }
            _super.call(this, buffer, startMarkers, endMarkers);
        }
        LineMarkerSequence._getFirstNonBlankColumn = function (txt, defaultValue) {
            var r = strings.firstNonWhitespaceIndex(txt);
            if (r === -1) {
                return defaultValue;
            }
            return r + 1;
        };
        LineMarkerSequence._getLastNonBlankColumn = function (txt, defaultValue) {
            var r = strings.lastNonWhitespaceIndex(txt);
            if (r === -1) {
                return defaultValue;
            }
            return r + 2;
        };
        LineMarkerSequence.prototype.getCharSequence = function (startIndex, endIndex) {
            var startMarkers = [], endMarkers = [], index, i, startMarker, endMarker;
            for (index = startIndex; index <= endIndex; index++) {
                startMarker = this.startMarkers[index];
                endMarker = this.endMarkers[index];
                for (i = startMarker.offset; i < endMarker.offset; i++) {
                    startMarkers.push({
                        offset: i,
                        lineNumber: startMarker.lineNumber,
                        column: startMarker.column + (i - startMarker.offset)
                    });
                    endMarkers.push({
                        offset: i + 1,
                        lineNumber: startMarker.lineNumber,
                        column: startMarker.column + (i - startMarker.offset) + 1
                    });
                }
            }
            return new MarkerSequence(this.buffer, startMarkers, endMarkers);
        };
        return LineMarkerSequence;
    }(MarkerSequence));
    var CharChange = (function () {
        function CharChange(diffChange, originalCharSequence, modifiedCharSequence) {
            if (diffChange.originalLength === 0) {
                this.originalStartLineNumber = 0;
                this.originalStartColumn = 0;
                this.originalEndLineNumber = 0;
                this.originalEndColumn = 0;
            }
            else {
                this.originalStartLineNumber = originalCharSequence.getStartLineNumber(diffChange.originalStart);
                this.originalStartColumn = originalCharSequence.getStartColumn(diffChange.originalStart);
                this.originalEndLineNumber = originalCharSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
                this.originalEndColumn = originalCharSequence.getEndColumn(diffChange.originalStart + diffChange.originalLength - 1);
            }
            if (diffChange.modifiedLength === 0) {
                this.modifiedStartLineNumber = 0;
                this.modifiedStartColumn = 0;
                this.modifiedEndLineNumber = 0;
                this.modifiedEndColumn = 0;
            }
            else {
                this.modifiedStartLineNumber = modifiedCharSequence.getStartLineNumber(diffChange.modifiedStart);
                this.modifiedStartColumn = modifiedCharSequence.getStartColumn(diffChange.modifiedStart);
                this.modifiedEndLineNumber = modifiedCharSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
                this.modifiedEndColumn = modifiedCharSequence.getEndColumn(diffChange.modifiedStart + diffChange.modifiedLength - 1);
            }
        }
        return CharChange;
    }());
    function postProcessCharChanges(rawChanges) {
        if (rawChanges.length <= 1) {
            return rawChanges;
        }
        var result = [rawChanges[0]];
        var i, len, originalMatchingLength, modifiedMatchingLength, matchingLength, prevChange = result[0], currChange;
        for (i = 1, len = rawChanges.length; i < len; i++) {
            currChange = rawChanges[i];
            originalMatchingLength = currChange.originalStart - (prevChange.originalStart + prevChange.originalLength);
            modifiedMatchingLength = currChange.modifiedStart - (prevChange.modifiedStart + prevChange.modifiedLength);
            // Both of the above should be equal, but the continueProcessingPredicate may prevent this from being true
            matchingLength = Math.min(originalMatchingLength, modifiedMatchingLength);
            if (matchingLength < MINIMUM_MATCHING_CHARACTER_LENGTH) {
                // Merge the current change into the previous one
                prevChange.originalLength = (currChange.originalStart + currChange.originalLength) - prevChange.originalStart;
                prevChange.modifiedLength = (currChange.modifiedStart + currChange.modifiedLength) - prevChange.modifiedStart;
            }
            else {
                // Add the current change
                result.push(currChange);
                prevChange = currChange;
            }
        }
        return result;
    }
    var LineChange = (function () {
        function LineChange(diffChange, originalLineSequence, modifiedLineSequence, continueProcessingPredicate, shouldPostProcessCharChanges) {
            if (diffChange.originalLength === 0) {
                this.originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart) - 1;
                this.originalEndLineNumber = 0;
            }
            else {
                this.originalStartLineNumber = originalLineSequence.getStartLineNumber(diffChange.originalStart);
                this.originalEndLineNumber = originalLineSequence.getEndLineNumber(diffChange.originalStart + diffChange.originalLength - 1);
            }
            if (diffChange.modifiedLength === 0) {
                this.modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart) - 1;
                this.modifiedEndLineNumber = 0;
            }
            else {
                this.modifiedStartLineNumber = modifiedLineSequence.getStartLineNumber(diffChange.modifiedStart);
                this.modifiedEndLineNumber = modifiedLineSequence.getEndLineNumber(diffChange.modifiedStart + diffChange.modifiedLength - 1);
            }
            if (diffChange.originalLength !== 0 && diffChange.modifiedLength !== 0 && continueProcessingPredicate()) {
                var originalCharSequence = originalLineSequence.getCharSequence(diffChange.originalStart, diffChange.originalStart + diffChange.originalLength - 1);
                var modifiedCharSequence = modifiedLineSequence.getCharSequence(diffChange.modifiedStart, diffChange.modifiedStart + diffChange.modifiedLength - 1);
                var rawChanges = computeDiff(originalCharSequence, modifiedCharSequence, continueProcessingPredicate);
                if (shouldPostProcessCharChanges) {
                    rawChanges = postProcessCharChanges(rawChanges);
                }
                this.charChanges = [];
                for (var i = 0, length = rawChanges.length; i < length; i++) {
                    this.charChanges.push(new CharChange(rawChanges[i], originalCharSequence, modifiedCharSequence));
                }
            }
        }
        return LineChange;
    }());
    var DiffComputer = (function () {
        function DiffComputer(originalLines, modifiedLines, opts) {
            this.shouldPostProcessCharChanges = opts.shouldPostProcessCharChanges;
            this.shouldIgnoreTrimWhitespace = opts.shouldIgnoreTrimWhitespace;
            this.maximumRunTimeMs = MAXIMUM_RUN_TIME;
            this.original = new LineMarkerSequence(originalLines, this.shouldIgnoreTrimWhitespace);
            this.modified = new LineMarkerSequence(modifiedLines, this.shouldIgnoreTrimWhitespace);
            if (opts.shouldConsiderTrimWhitespaceInEmptyCase && this.shouldIgnoreTrimWhitespace && this.original.equals(this.modified)) {
                // Diff would be empty with `shouldIgnoreTrimWhitespace`
                this.shouldIgnoreTrimWhitespace = false;
                this.original = new LineMarkerSequence(originalLines, this.shouldIgnoreTrimWhitespace);
                this.modified = new LineMarkerSequence(modifiedLines, this.shouldIgnoreTrimWhitespace);
            }
        }
        DiffComputer.prototype.computeDiff = function () {
            this.computationStartTime = (new Date()).getTime();
            var rawChanges = computeDiff(this.original, this.modified, this._continueProcessingPredicate.bind(this));
            var lineChanges = [];
            for (var i = 0, length = rawChanges.length; i < length; i++) {
                lineChanges.push(new LineChange(rawChanges[i], this.original, this.modified, this._continueProcessingPredicate.bind(this), this.shouldPostProcessCharChanges));
            }
            return lineChanges;
        };
        DiffComputer.prototype._continueProcessingPredicate = function () {
            if (this.maximumRunTimeMs === 0) {
                return true;
            }
            var now = (new Date()).getTime();
            return now - this.computationStartTime < this.maximumRunTimeMs;
        };
        return DiffComputer;
    }());
    exports.DiffComputer = DiffComputer;
});

define("vs/editor/common/modes/linkComputer", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // State machine for http:// or https://
    var STATE_MAP = [], START_STATE = 1, END_STATE = 9, ACCEPT_STATE = 10;
    STATE_MAP[1] = { 'h': 2, 'H': 2 };
    STATE_MAP[2] = { 't': 3, 'T': 3 };
    STATE_MAP[3] = { 't': 4, 'T': 4 };
    STATE_MAP[4] = { 'p': 5, 'P': 5 };
    STATE_MAP[5] = { 's': 6, 'S': 6, ':': 7 };
    STATE_MAP[6] = { ':': 7 };
    STATE_MAP[7] = { '/': 8 };
    STATE_MAP[8] = { '/': 9 };
    var CharacterClass;
    (function (CharacterClass) {
        CharacterClass[CharacterClass["None"] = 0] = "None";
        CharacterClass[CharacterClass["ForceTermination"] = 1] = "ForceTermination";
        CharacterClass[CharacterClass["CannotEndIn"] = 2] = "CannotEndIn";
    })(CharacterClass || (CharacterClass = {}));
    var getCharacterClasses = (function () {
        var FORCE_TERMINATION_CHARACTERS = ' \t<>\'\"';
        var CANNOT_END_WITH_CHARACTERS = '.,;';
        var _cachedResult = null;
        var findLargestCharCode = function (str) {
            var r = 0;
            for (var i = 0, len = str.length; i < len; i++) {
                r = Math.max(r, str.charCodeAt(i));
            }
            return r;
        };
        var set = function (str, toWhat) {
            for (var i = 0, len = str.length; i < len; i++) {
                _cachedResult[str.charCodeAt(i)] = toWhat;
            }
        };
        return function () {
            if (_cachedResult === null) {
                // Find cachedResult size
                var largestCharCode = Math.max(findLargestCharCode(FORCE_TERMINATION_CHARACTERS), findLargestCharCode(CANNOT_END_WITH_CHARACTERS));
                // Initialize cachedResult
                _cachedResult = [];
                for (var i = 0; i < largestCharCode; i++) {
                    _cachedResult[i] = CharacterClass.None;
                }
                // Fill in cachedResult
                set(FORCE_TERMINATION_CHARACTERS, CharacterClass.ForceTermination);
                set(CANNOT_END_WITH_CHARACTERS, CharacterClass.CannotEndIn);
            }
            return _cachedResult;
        };
    })();
    var _openParens = '('.charCodeAt(0);
    var _closeParens = ')'.charCodeAt(0);
    var _openSquareBracket = '['.charCodeAt(0);
    var _closeSquareBracket = ']'.charCodeAt(0);
    var _openCurlyBracket = '{'.charCodeAt(0);
    var _closeCurlyBracket = '}'.charCodeAt(0);
    var LinkComputer = (function () {
        function LinkComputer() {
        }
        LinkComputer._createLink = function (line, lineNumber, linkBeginIndex, linkEndIndex) {
            return {
                range: {
                    startLineNumber: lineNumber,
                    startColumn: linkBeginIndex + 1,
                    endLineNumber: lineNumber,
                    endColumn: linkEndIndex + 1
                },
                url: line.substring(linkBeginIndex, linkEndIndex)
            };
        };
        LinkComputer.computeLinks = function (model) {
            var i, lineCount, result = [];
            var line, j, lastIncludedCharIndex, len, characterClasses = getCharacterClasses(), characterClassesLength = characterClasses.length, linkBeginIndex, state, ch, chCode, chClass, resetStateMachine, hasOpenParens, hasOpenSquareBracket, hasOpenCurlyBracket;
            for (i = 1, lineCount = model.getLineCount(); i <= lineCount; i++) {
                line = model.getLineContent(i);
                j = 0;
                len = line.length;
                linkBeginIndex = 0;
                state = START_STATE;
                hasOpenParens = false;
                hasOpenSquareBracket = false;
                hasOpenCurlyBracket = false;
                while (j < len) {
                    ch = line.charAt(j);
                    chCode = line.charCodeAt(j);
                    resetStateMachine = false;
                    if (state === ACCEPT_STATE) {
                        switch (chCode) {
                            case _openParens:
                                hasOpenParens = true;
                                chClass = CharacterClass.None;
                                break;
                            case _closeParens:
                                chClass = (hasOpenParens ? CharacterClass.None : CharacterClass.ForceTermination);
                                break;
                            case _openSquareBracket:
                                hasOpenSquareBracket = true;
                                chClass = CharacterClass.None;
                                break;
                            case _closeSquareBracket:
                                chClass = (hasOpenSquareBracket ? CharacterClass.None : CharacterClass.ForceTermination);
                                break;
                            case _openCurlyBracket:
                                hasOpenCurlyBracket = true;
                                chClass = CharacterClass.None;
                                break;
                            case _closeCurlyBracket:
                                chClass = (hasOpenCurlyBracket ? CharacterClass.None : CharacterClass.ForceTermination);
                                break;
                            default:
                                chClass = (chCode < characterClassesLength ? characterClasses[chCode] : CharacterClass.None);
                        }
                        // Check if character terminates link
                        if (chClass === CharacterClass.ForceTermination) {
                            // Do not allow to end link in certain characters...
                            lastIncludedCharIndex = j - 1;
                            do {
                                chCode = line.charCodeAt(lastIncludedCharIndex);
                                chClass = (chCode < characterClassesLength ? characterClasses[chCode] : CharacterClass.None);
                                if (chClass !== CharacterClass.CannotEndIn) {
                                    break;
                                }
                                lastIncludedCharIndex--;
                            } while (lastIncludedCharIndex > linkBeginIndex);
                            result.push(LinkComputer._createLink(line, i, linkBeginIndex, lastIncludedCharIndex + 1));
                            resetStateMachine = true;
                        }
                    }
                    else if (state === END_STATE) {
                        chClass = (chCode < characterClassesLength ? characterClasses[chCode] : CharacterClass.None);
                        // Check if character terminates link
                        if (chClass === CharacterClass.ForceTermination) {
                            resetStateMachine = true;
                        }
                        else {
                            state = ACCEPT_STATE;
                        }
                    }
                    else {
                        if (STATE_MAP[state].hasOwnProperty(ch)) {
                            state = STATE_MAP[state][ch];
                        }
                        else {
                            resetStateMachine = true;
                        }
                    }
                    if (resetStateMachine) {
                        state = START_STATE;
                        hasOpenParens = false;
                        hasOpenSquareBracket = false;
                        hasOpenCurlyBracket = false;
                        // Record where the link started
                        linkBeginIndex = j + 1;
                    }
                    j++;
                }
                if (state === ACCEPT_STATE) {
                    result.push(LinkComputer._createLink(line, i, linkBeginIndex, len));
                }
            }
            return result;
        };
        return LinkComputer;
    }());
    /**
     * Returns an array of all links contains in the provided
     * document. *Note* that this operation is computational
     * expensive and should not run in the UI thread.
     */
    function computeLinks(model) {
        if (!model || typeof model.getLineCount !== 'function' || typeof model.getLineContent !== 'function') {
            // Unknown caller!
            return [];
        }
        return LinkComputer.computeLinks(model);
    }
    exports.computeLinks = computeLinks;
});

define("vs/editor/common/modes/modesFilters", ["require", "exports", 'vs/base/common/arrays', 'vs/base/common/filters'], function (require, exports, arrays_1, filters) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    function wrapBaseFilter(filter) {
        return function (word, suggestion) {
            var result = filter(word, suggestion.filterText || suggestion.label);
            return arrays_1.isFalsyOrEmpty(result) ? undefined : result;
        };
    }
    exports.StrictPrefix = wrapBaseFilter(filters.matchesStrictPrefix);
    exports.Prefix = wrapBaseFilter(filters.matchesPrefix);
    exports.CamelCase = wrapBaseFilter(filters.matchesCamelCase);
    exports.ContiguousSubString = wrapBaseFilter(filters.matchesContiguousSubString);
    // Combined Filters
    function or(first, second) {
        return function (word, suggestion) { return first(word, suggestion) || second(word, suggestion); };
    }
    exports.or = or;
    function and(first, second) {
        return function (word, suggestion) { return first(word, suggestion) && second(word, suggestion); };
    }
    exports.and = and;
    exports.DefaultFilter = or(or(exports.Prefix, exports.CamelCase), exports.ContiguousSubString);
});

define("vs/editor/common/modes/supports/inplaceReplaceSupport", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var BasicInplaceReplace = (function () {
        function BasicInplaceReplace() {
            this._defaultValueSet = [
                ['true', 'false'],
                ['True', 'False'],
                ['Private', 'Public', 'Friend', 'ReadOnly', 'Partial', 'Protected', 'WriteOnly'],
                ['public', 'protected', 'private'],
            ];
        }
        BasicInplaceReplace.prototype.navigateValueSet = function (range1, text1, range2, text2, up) {
            if (range1 && text1) {
                var result = this.doNavigateValueSet(text1, up);
                if (result) {
                    return {
                        range: range1,
                        value: result
                    };
                }
            }
            if (range2 && text2) {
                var result = this.doNavigateValueSet(text2, up);
                if (result) {
                    return {
                        range: range2,
                        value: result
                    };
                }
            }
            return null;
        };
        BasicInplaceReplace.prototype.doNavigateValueSet = function (text, up) {
            var numberResult = this.numberReplace(text, up);
            if (numberResult !== null) {
                return numberResult;
            }
            return this.textReplace(text, up);
        };
        BasicInplaceReplace.prototype.numberReplace = function (value, up) {
            var precision = Math.pow(10, value.length - (value.lastIndexOf('.') + 1)), n1 = Number(value), n2 = parseFloat(value);
            if (!isNaN(n1) && !isNaN(n2) && n1 === n2) {
                if (n1 === 0 && !up) {
                    return null; // don't do negative
                }
                else {
                    n1 = Math.floor(n1 * precision);
                    n1 += up ? precision : -precision;
                    return String(n1 / precision);
                }
            }
            return null;
        };
        BasicInplaceReplace.prototype.textReplace = function (value, up) {
            return this.valueSetsReplace(this._defaultValueSet, value, up);
        };
        BasicInplaceReplace.prototype.valueSetsReplace = function (valueSets, value, up) {
            var result = null;
            for (var i = 0, len = valueSets.length; result === null && i < len; i++) {
                result = this.valueSetReplace(valueSets[i], value, up);
            }
            return result;
        };
        BasicInplaceReplace.prototype.valueSetReplace = function (valueSet, value, up) {
            var idx = valueSet.indexOf(value);
            if (idx >= 0) {
                idx += up ? +1 : -1;
                if (idx < 0) {
                    idx = valueSet.length - 1;
                }
                else {
                    idx %= valueSet.length;
                }
                return valueSet[idx];
            }
            return null;
        };
        BasicInplaceReplace.INSTANCE = new BasicInplaceReplace();
        return BasicInplaceReplace;
    }());
    exports.BasicInplaceReplace = BasicInplaceReplace;
});

define("vs/editor/common/services/editorSimpleWorkerCommon", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var EditorSimpleWorker = (function () {
        function EditorSimpleWorker() {
        }
        EditorSimpleWorker.prototype.acceptNewModel = function (data) {
            throw new Error('Not implemented!');
        };
        EditorSimpleWorker.prototype.acceptModelChanged = function (modelUrl, events) {
            throw new Error('Not implemented!');
        };
        EditorSimpleWorker.prototype.acceptRemovedModel = function (modelUrl) {
            throw new Error('Not implemented!');
        };
        EditorSimpleWorker.prototype.computeDiff = function (originalUrl, modifiedUrl, ignoreTrimWhitespace) {
            throw new Error('Not implemented!');
        };
        EditorSimpleWorker.prototype.computeDirtyDiff = function (originalUrl, modifiedUrl, ignoreTrimWhitespace) {
            throw new Error('Not implemented!');
        };
        EditorSimpleWorker.prototype.computeLinks = function (modelUrl) {
            throw new Error('Not implemented!');
        };
        EditorSimpleWorker.prototype.textualSuggest = function (modelUrl, position, wordDef, wordDefFlags) {
            throw new Error('Not implemented!');
        };
        EditorSimpleWorker.prototype.navigateValueSet = function (modelUrl, range, up, wordDef, wordDefFlags) {
            throw new Error('Not implemented!');
        };
        return EditorSimpleWorker;
    }());
    exports.EditorSimpleWorker = EditorSimpleWorker;
});

define("vs/editor/common/viewModel/prefixSumComputer", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var PrefixSumComputer = (function () {
        function PrefixSumComputer(values) {
            this.values = values;
            this.prefixSum = [];
            for (var i = 0, len = this.values.length; i < len; i++) {
                this.prefixSum[i] = 0;
            }
            this.prefixSumValidIndex = -1;
        }
        PrefixSumComputer.prototype.getCount = function () {
            return this.values.length;
        };
        PrefixSumComputer.prototype.insertValue = function (insertIndex, value) {
            this.values.splice(insertIndex, 0, value);
            this.prefixSum.splice(insertIndex, 0, 0);
            if (insertIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = insertIndex - 1;
            }
        };
        PrefixSumComputer.prototype.insertValues = function (insertIndex, values) {
            if (values.length === 0) {
                return;
            }
            this.values = this.values.slice(0, insertIndex).concat(values).concat(this.values.slice(insertIndex));
            this.prefixSum = this.prefixSum.slice(0, insertIndex).concat(PrefixSumComputer._zeroArray(values.length)).concat(this.prefixSum.slice(insertIndex));
            if (insertIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = insertIndex - 1;
            }
        };
        PrefixSumComputer._zeroArray = function (count) {
            var r = new Array(count);
            for (var i = 0; i < count; i++) {
                r[i] = 0;
            }
            return r;
        };
        PrefixSumComputer.prototype.changeValue = function (index, value) {
            if (this.values[index] === value) {
                return;
            }
            this.values[index] = value;
            if (index - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = index - 1;
            }
        };
        PrefixSumComputer.prototype.removeValues = function (startIndex, cnt) {
            this.values.splice(startIndex, cnt);
            this.prefixSum.splice(startIndex, cnt);
            if (startIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = startIndex - 1;
            }
        };
        PrefixSumComputer.prototype.getTotalValue = function () {
            if (this.values.length === 0) {
                return 0;
            }
            return this.getAccumulatedValue(this.values.length - 1);
        };
        PrefixSumComputer.prototype.getAccumulatedValue = function (index) {
            if (index < 0) {
                return 0;
            }
            if (index <= this.prefixSumValidIndex) {
                return this.prefixSum[index];
            }
            var startIndex = this.prefixSumValidIndex + 1;
            if (startIndex === 0) {
                this.prefixSum[0] = this.values[0];
                startIndex++;
            }
            if (index >= this.values.length) {
                index = this.values.length - 1;
            }
            for (var i = startIndex; i <= index; i++) {
                this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
            }
            this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, index);
            return this.prefixSum[index];
        };
        PrefixSumComputer.prototype.getIndexOf = function (accumulatedValue, result) {
            var low = 0, high = this.values.length - 1, mid, midStart, midStop;
            while (low <= high) {
                mid = low + ((high - low) / 2) | 0;
                midStop = this.getAccumulatedValue(mid);
                midStart = midStop - this.values[mid];
                if (accumulatedValue < midStart) {
                    high = mid - 1;
                }
                else if (accumulatedValue >= midStop) {
                    low = mid + 1;
                }
                else {
                    break;
                }
            }
            result.index = mid;
            result.remainder = accumulatedValue - midStart;
        };
        return PrefixSumComputer;
    }());
    exports.PrefixSumComputer = PrefixSumComputer;
});

define("vs/editor/common/model/mirrorModel2", ["require", "exports", 'vs/editor/common/viewModel/prefixSumComputer'], function (require, exports, prefixSumComputer_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var MirrorModel2 = (function () {
        function MirrorModel2(uri, lines, eol, versionId) {
            this._uri = uri;
            this._lines = lines;
            this._eol = eol;
            this._versionId = versionId;
        }
        MirrorModel2.prototype.dispose = function () {
            this._lines.length = 0;
        };
        Object.defineProperty(MirrorModel2.prototype, "version", {
            get: function () {
                return this._versionId;
            },
            enumerable: true,
            configurable: true
        });
        MirrorModel2.prototype.getText = function () {
            return this._lines.join(this._eol);
        };
        MirrorModel2.prototype.onEvents = function (events) {
            var newEOL = null;
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                if (e.eol) {
                    newEOL = e.eol;
                }
            }
            if (newEOL && newEOL !== this._eol) {
                this._eol = newEOL;
                this._lineStarts = null;
            }
            // Update my lines
            var lastVersionId = -1;
            for (var i = 0, len = events.length; i < len; i++) {
                var e = events[i];
                this._acceptDeleteRange(e.range);
                this._acceptInsertText({
                    lineNumber: e.range.startLineNumber,
                    column: e.range.startColumn
                }, e.text);
                lastVersionId = Math.max(lastVersionId, e.versionId);
            }
            if (lastVersionId !== -1) {
                this._versionId = lastVersionId;
            }
        };
        MirrorModel2.prototype._ensureLineStarts = function () {
            if (!this._lineStarts) {
                var lineStartValues = [];
                var eolLength = this._eol.length;
                for (var i = 0, len = this._lines.length; i < len; i++) {
                    lineStartValues.push(this._lines[i].length + eolLength);
                }
                this._lineStarts = new prefixSumComputer_1.PrefixSumComputer(lineStartValues);
            }
        };
        /**
         * All changes to a line's text go through this method
         */
        MirrorModel2.prototype._setLineText = function (lineIndex, newValue) {
            this._lines[lineIndex] = newValue;
            if (this._lineStarts) {
                // update prefix sum
                this._lineStarts.changeValue(lineIndex, this._lines[lineIndex].length + this._eol.length);
            }
        };
        MirrorModel2.prototype._acceptDeleteRange = function (range) {
            if (range.startLineNumber === range.endLineNumber) {
                if (range.startColumn === range.endColumn) {
                    // Nothing to delete
                    return;
                }
                // Delete text on the affected line
                this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1)
                    + this._lines[range.startLineNumber - 1].substring(range.endColumn - 1));
                return;
            }
            // Take remaining text on last line and append it to remaining text on first line
            this._setLineText(range.startLineNumber - 1, this._lines[range.startLineNumber - 1].substring(0, range.startColumn - 1)
                + this._lines[range.endLineNumber - 1].substring(range.endColumn - 1));
            // Delete middle lines
            this._lines.splice(range.startLineNumber, range.endLineNumber - range.startLineNumber);
            if (this._lineStarts) {
                // update prefix sum
                this._lineStarts.removeValues(range.startLineNumber, range.endLineNumber - range.startLineNumber);
            }
        };
        MirrorModel2.prototype._acceptInsertText = function (position, insertText) {
            if (insertText.length === 0) {
                // Nothing to insert
                return;
            }
            var insertLines = insertText.split(/\r\n|\r|\n/);
            if (insertLines.length === 1) {
                // Inserting text on one line
                this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1)
                    + insertLines[0]
                    + this._lines[position.lineNumber - 1].substring(position.column - 1));
                return;
            }
            // Append overflowing text from first line to the end of text to insert
            insertLines[insertLines.length - 1] += this._lines[position.lineNumber - 1].substring(position.column - 1);
            // Delete overflowing text from first line and insert text on first line
            this._setLineText(position.lineNumber - 1, this._lines[position.lineNumber - 1].substring(0, position.column - 1)
                + insertLines[0]);
            // Insert new lines & store lengths
            var newLengths = new Array(insertLines.length - 1);
            for (var i = 1; i < insertLines.length; i++) {
                this._lines.splice(position.lineNumber + i - 1, 0, insertLines[i]);
                newLengths[i - 1] = insertLines[i].length + this._eol.length;
            }
            if (this._lineStarts) {
                // update prefix sum
                this._lineStarts.insertValues(position.lineNumber, newLengths);
            }
        };
        return MirrorModel2;
    }());
    exports.MirrorModel2 = MirrorModel2;
});

define("vs/nls!vs/editor/common/config/defaultConfig",['vs/nls', 'vs/nls!vs/editor/common/services/editorSimpleWorker'], function(nls, data) { return nls.create("vs/editor/common/config/defaultConfig", data); });
define("vs/editor/common/config/defaultConfig", ["require", "exports", 'vs/nls!vs/editor/common/config/defaultConfig'], function (require, exports, nls) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    exports.USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
    exports.DEFAULT_INDENTATION = {
        tabSize: 4,
        insertSpaces: true,
        detectIndentation: true
    };
    var ConfigClass = (function () {
        function ConfigClass() {
            this.editor = {
                experimentalScreenReader: true,
                rulers: [],
                wordSeparators: exports.USUAL_WORD_SEPARATORS,
                selectionClipboard: false,
                ariaLabel: nls.localize(0, null),
                lineNumbers: true,
                selectOnLineNumbers: true,
                lineNumbersMinChars: 5,
                glyphMargin: false,
                lineDecorationsWidth: 10,
                revealHorizontalRightPadding: 30,
                roundedSelection: true,
                theme: 'vs',
                readOnly: false,
                scrollbar: {
                    verticalScrollbarSize: 14,
                    horizontal: 'auto',
                    useShadows: true,
                    verticalHasArrows: false,
                    horizontalHasArrows: false
                },
                overviewRulerLanes: 2,
                cursorBlinking: 'blink',
                cursorStyle: 'line',
                fontLigatures: false,
                hideCursorInOverviewRuler: false,
                scrollBeyondLastLine: true,
                automaticLayout: false,
                wrappingColumn: 300,
                wrappingIndent: 'same',
                wordWrapBreakBeforeCharacters: '{([+',
                wordWrapBreakAfterCharacters: ' \t})]?|&,;',
                wordWrapBreakObtrusiveCharacters: '.',
                tabFocusMode: false,
                // stopLineTokenizationAfter
                // stopRenderingLineAfter
                longLineBoundary: 300,
                forcedTokenizationBoundary: 1000,
                // Features
                hover: true,
                contextmenu: true,
                mouseWheelScrollSensitivity: 1,
                quickSuggestions: true,
                quickSuggestionsDelay: 10,
                iconsInSuggestions: true,
                autoClosingBrackets: true,
                formatOnType: false,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: true,
                selectionHighlight: true,
                outlineMarkers: false,
                referenceInfos: true,
                folding: true,
                renderWhitespace: false,
                fontFamily: '',
                fontSize: 0,
                lineHeight: 0
            };
        }
        return ConfigClass;
    }());
    exports.DefaultConfig = new ConfigClass();
});

define("vs/editor/common/modes/nullMode", ["require", "exports", 'vs/editor/common/config/defaultConfig'], function (require, exports, defaultConfig_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var NullState = (function () {
        function NullState(mode, stateData) {
            this.mode = mode;
            this.stateData = stateData;
        }
        NullState.prototype.clone = function () {
            var stateDataClone = (this.stateData ? this.stateData.clone() : null);
            return new NullState(this.mode, stateDataClone);
        };
        NullState.prototype.equals = function (other) {
            if (this.mode !== other.getMode()) {
                return false;
            }
            var otherStateData = other.getStateData();
            if (!this.stateData && !otherStateData) {
                return true;
            }
            if (this.stateData && otherStateData) {
                return this.stateData.equals(otherStateData);
            }
            return false;
        };
        NullState.prototype.getMode = function () {
            return this.mode;
        };
        NullState.prototype.tokenize = function (stream) {
            stream.advanceToEOS();
            return { type: '' };
        };
        NullState.prototype.getStateData = function () {
            return this.stateData;
        };
        NullState.prototype.setStateData = function (stateData) {
            this.stateData = stateData;
        };
        return NullState;
    }());
    exports.NullState = NullState;
    var NullMode = (function () {
        function NullMode() {
            this.richEditSupport = {
                wordDefinition: NullMode.DEFAULT_WORD_REGEXP
            };
        }
        /**
         * Create a word definition regular expression based on default word separators.
         * Optionally provide allowed separators that should be included in words.
         *
         * The default would look like this:
         * /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
         */
        NullMode.createWordRegExp = function (allowInWords) {
            if (allowInWords === void 0) { allowInWords = ''; }
            var usualSeparators = defaultConfig_1.USUAL_WORD_SEPARATORS;
            var source = '(-?\\d*\\.\\d\\w*)|([^';
            for (var i = 0; i < usualSeparators.length; i++) {
                if (allowInWords.indexOf(usualSeparators[i]) >= 0) {
                    continue;
                }
                source += '\\' + usualSeparators[i];
            }
            source += '\\s]+)';
            return new RegExp(source, 'g');
        };
        NullMode.prototype.getId = function () {
            return NullMode.ID;
        };
        NullMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        // catches numbers (including floating numbers) in the first group, and alphanum in the second
        NullMode.DEFAULT_WORD_REGEXP = NullMode.createWordRegExp();
        NullMode.ID = 'vs.editor.modes.nullMode';
        return NullMode;
    }());
    exports.NullMode = NullMode;
    function nullTokenize(mode, buffer, state, deltaOffset, stopAtOffset) {
        if (deltaOffset === void 0) { deltaOffset = 0; }
        var tokens = [
            {
                startIndex: deltaOffset,
                type: ''
            }
        ];
        var modeTransitions = [
            {
                startIndex: deltaOffset,
                mode: mode
            }
        ];
        return {
            tokens: tokens,
            actualStopOffset: deltaOffset + buffer.length,
            endState: state,
            modeTransitions: modeTransitions
        };
    }
    exports.nullTokenize = nullTokenize;
});

define("vs/editor/common/model/textModelWithTokensHelpers", ["require", "exports", 'vs/editor/common/core/arrays', 'vs/editor/common/modes/nullMode'], function (require, exports, arrays_1, nullMode_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    var WordHelper = (function () {
        function WordHelper() {
        }
        WordHelper._safeGetWordDefinition = function (mode) {
            return (mode.richEditSupport ? mode.richEditSupport.wordDefinition : null);
        };
        WordHelper.ensureValidWordDefinition = function (wordDefinition) {
            var result = nullMode_1.NullMode.DEFAULT_WORD_REGEXP;
            if (wordDefinition && (wordDefinition instanceof RegExp)) {
                if (!wordDefinition.global) {
                    var flags = 'g';
                    if (wordDefinition.ignoreCase) {
                        flags += 'i';
                    }
                    if (wordDefinition.multiline) {
                        flags += 'm';
                    }
                    result = new RegExp(wordDefinition.source, flags);
                }
                else {
                    result = wordDefinition;
                }
            }
            result.lastIndex = 0;
            return result;
        };
        WordHelper.massageWordDefinitionOf = function (mode) {
            return WordHelper.ensureValidWordDefinition(WordHelper._safeGetWordDefinition(mode));
        };
        WordHelper.getWords = function (textSource, lineNumber) {
            if (!textSource._lineIsTokenized(lineNumber)) {
                return WordHelper._getWordsInText(textSource.getLineContent(lineNumber), WordHelper.massageWordDefinitionOf(textSource.getMode()));
            }
            var r = [], txt = textSource.getLineContent(lineNumber);
            if (txt.length > 0) {
                var modeTransitions = textSource._getLineModeTransitions(lineNumber), i, len, k, lenK, currentModeStartIndex, currentModeEndIndex, currentWordDefinition, currentModeText, words, startWord, endWord, word;
                // Go through all the modes
                for (i = 0, currentModeStartIndex = 0, len = modeTransitions.length; i < len; i++) {
                    currentWordDefinition = WordHelper.massageWordDefinitionOf(modeTransitions[i].mode);
                    currentModeStartIndex = modeTransitions[i].startIndex;
                    currentModeEndIndex = (i + 1 < len ? modeTransitions[i + 1].startIndex : txt.length);
                    currentModeText = txt.substring(currentModeStartIndex, currentModeEndIndex);
                    words = currentModeText.match(currentWordDefinition);
                    if (!words) {
                        continue;
                    }
                    endWord = 0;
                    for (k = 0, lenK = words.length; k < lenK; k++) {
                        word = words[k];
                        if (word.length > 0) {
                            startWord = currentModeText.indexOf(word, endWord);
                            endWord = startWord + word.length;
                            r.push({
                                start: currentModeStartIndex + startWord,
                                end: currentModeStartIndex + endWord
                            });
                        }
                    }
                }
            }
            return r;
        };
        WordHelper._getWordsInText = function (text, wordDefinition) {
            var words = text.match(wordDefinition) || [], k, startWord, endWord, startColumn, endColumn, word, r = [];
            for (k = 0; k < words.length; k++) {
                word = words[k].trim();
                if (word.length > 0) {
                    startWord = text.indexOf(word, endWord);
                    endWord = startWord + word.length;
                    startColumn = startWord;
                    endColumn = endWord;
                    r.push({
                        start: startColumn,
                        end: endColumn
                    });
                }
            }
            return r;
        };
        WordHelper._getWordAtColumn = function (txt, column, modeIndex, modeTransitions) {
            var modeStartIndex = modeTransitions[modeIndex].startIndex, modeEndIndex = (modeIndex + 1 < modeTransitions.length ? modeTransitions[modeIndex + 1].startIndex : txt.length), mode = modeTransitions[modeIndex].mode;
            return WordHelper._getWordAtText(column, WordHelper.massageWordDefinitionOf(mode), txt.substring(modeStartIndex, modeEndIndex), modeStartIndex);
        };
        WordHelper.getWordAtPosition = function (textSource, position) {
            if (!textSource._lineIsTokenized(position.lineNumber)) {
                return WordHelper._getWordAtText(position.column, WordHelper.massageWordDefinitionOf(textSource.getMode()), textSource.getLineContent(position.lineNumber), 0);
            }
            var result = null;
            var txt = textSource.getLineContent(position.lineNumber), modeTransitions = textSource._getLineModeTransitions(position.lineNumber), columnIndex = position.column - 1, modeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, columnIndex);
            result = WordHelper._getWordAtColumn(txt, position.column, modeIndex, modeTransitions);
            if (!result && modeIndex > 0 && modeTransitions[modeIndex].startIndex === columnIndex) {
                // The position is right at the beginning of `modeIndex`, so try looking at `modeIndex` - 1 too
                result = WordHelper._getWordAtColumn(txt, position.column, modeIndex - 1, modeTransitions);
            }
            return result;
        };
        WordHelper._getWordAtText = function (column, wordDefinition, text, textOffset) {
            // console.log('_getWordAtText: ', column, text, textOffset);
            var words = text.match(wordDefinition), k, startWord, endWord, startColumn, endColumn, word;
            if (words) {
                for (k = 0; k < words.length; k++) {
                    word = words[k].trim();
                    if (word.length > 0) {
                        startWord = text.indexOf(word, endWord);
                        endWord = startWord + word.length;
                        startColumn = textOffset + startWord + 1;
                        endColumn = textOffset + endWord + 1;
                        if (startColumn <= column && column <= endColumn) {
                            return {
                                word: word,
                                startColumn: startColumn,
                                endColumn: endColumn
                            };
                        }
                    }
                }
            }
            return null;
        };
        return WordHelper;
    }());
    exports.WordHelper = WordHelper;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("vs/editor/common/services/editorSimpleWorker", ["require", "exports", 'vs/base/common/uri', 'vs/base/common/winjs.base', 'vs/editor/common/core/range', 'vs/editor/common/diff/diffComputer', 'vs/editor/common/model/mirrorModel2', 'vs/editor/common/model/textModelWithTokensHelpers', 'vs/editor/common/modes/linkComputer', 'vs/editor/common/modes/modesFilters', 'vs/editor/common/modes/supports/inplaceReplaceSupport', 'vs/editor/common/services/editorSimpleWorkerCommon'], function (require, exports, uri_1, winjs_base_1, range_1, diffComputer_1, mirrorModel2_1, textModelWithTokensHelpers_1, linkComputer_1, modesFilters_1, inplaceReplaceSupport_1, editorSimpleWorkerCommon_1) {
    'use strict';
    var MirrorModel = (function (_super) {
        __extends(MirrorModel, _super);
        function MirrorModel() {
            _super.apply(this, arguments);
        }
        MirrorModel.prototype.getLinesContent = function () {
            return this._lines.slice(0);
        };
        MirrorModel.prototype.getLineCount = function () {
            return this._lines.length;
        };
        MirrorModel.prototype.getLineContent = function (lineNumber) {
            return this._lines[lineNumber - 1];
        };
        MirrorModel.prototype.getWordAtPosition = function (position, wordDefinition) {
            var wordAtText = textModelWithTokensHelpers_1.WordHelper._getWordAtText(position.column, textModelWithTokensHelpers_1.WordHelper.ensureValidWordDefinition(wordDefinition), this._lines[position.lineNumber - 1], 0);
            if (wordAtText) {
                return new range_1.Range(position.lineNumber, wordAtText.startColumn, position.lineNumber, wordAtText.endColumn);
            }
            return null;
        };
        MirrorModel.prototype.getWordUntilPosition = function (position, wordDefinition) {
            var wordAtPosition = this.getWordAtPosition(position, wordDefinition);
            if (!wordAtPosition) {
                return {
                    word: '',
                    startColumn: position.column,
                    endColumn: position.column
                };
            }
            return {
                word: this._lines[position.lineNumber - 1].substring(wordAtPosition.startColumn - 1, position.column - 1),
                startColumn: wordAtPosition.startColumn,
                endColumn: position.column
            };
        };
        MirrorModel.prototype._getAllWords = function (wordDefinition) {
            var _this = this;
            var result = [];
            this._lines.forEach(function (line) {
                _this._wordenize(line, wordDefinition).forEach(function (info) {
                    result.push(line.substring(info.start, info.end));
                });
            });
            return result;
        };
        MirrorModel.prototype.getAllUniqueWords = function (wordDefinition, skipWordOnce) {
            var foundSkipWord = false;
            var uniqueWords = {};
            return this._getAllWords(wordDefinition).filter(function (word) {
                if (skipWordOnce && !foundSkipWord && skipWordOnce === word) {
                    foundSkipWord = true;
                    return false;
                }
                else if (uniqueWords[word]) {
                    return false;
                }
                else {
                    uniqueWords[word] = true;
                    return true;
                }
            });
        };
        //	// TODO@Joh, TODO@Alex - remove these and make sure the super-things work
        MirrorModel.prototype._wordenize = function (content, wordDefinition) {
            var result = [];
            var match;
            while (match = wordDefinition.exec(content)) {
                if (match[0].length === 0) {
                    // it did match the empty string
                    break;
                }
                result.push({ start: match.index, end: match.index + match[0].length });
            }
            return result;
        };
        MirrorModel.prototype.getValueInRange = function (range) {
            if (range.startLineNumber === range.endLineNumber) {
                return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
            }
            var lineEnding = this._eol, startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i]);
            }
            resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        return MirrorModel;
    }(mirrorModel2_1.MirrorModel2));
    var EditorSimpleWorkerImpl = (function (_super) {
        __extends(EditorSimpleWorkerImpl, _super);
        function EditorSimpleWorkerImpl() {
            _super.call(this);
            this._models = Object.create(null);
        }
        EditorSimpleWorkerImpl.prototype.acceptNewModel = function (data) {
            this._models[data.url] = new MirrorModel(uri_1.default.parse(data.url), data.value.lines, data.value.EOL, data.versionId);
        };
        EditorSimpleWorkerImpl.prototype.acceptModelChanged = function (strURL, events) {
            if (!this._models[strURL]) {
                return;
            }
            var model = this._models[strURL];
            model.onEvents(events);
        };
        EditorSimpleWorkerImpl.prototype.acceptRemovedModel = function (strURL) {
            if (!this._models[strURL]) {
                return;
            }
            delete this._models[strURL];
        };
        // ---- BEGIN diff --------------------------------------------------------------------------
        EditorSimpleWorkerImpl.prototype.computeDiff = function (originalUrl, modifiedUrl, ignoreTrimWhitespace) {
            var original = this._models[originalUrl];
            var modified = this._models[modifiedUrl];
            if (!original || !modified) {
                return null;
            }
            var originalLines = original.getLinesContent();
            var modifiedLines = modified.getLinesContent();
            var diffComputer = new diffComputer_1.DiffComputer(originalLines, modifiedLines, {
                shouldPostProcessCharChanges: true,
                shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
                shouldConsiderTrimWhitespaceInEmptyCase: true
            });
            return winjs_base_1.TPromise.as(diffComputer.computeDiff());
        };
        EditorSimpleWorkerImpl.prototype.computeDirtyDiff = function (originalUrl, modifiedUrl, ignoreTrimWhitespace) {
            var original = this._models[originalUrl];
            var modified = this._models[modifiedUrl];
            if (!original || !modified) {
                return null;
            }
            var originalLines = original.getLinesContent();
            var modifiedLines = modified.getLinesContent();
            var diffComputer = new diffComputer_1.DiffComputer(originalLines, modifiedLines, {
                shouldPostProcessCharChanges: false,
                shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
                shouldConsiderTrimWhitespaceInEmptyCase: false
            });
            return winjs_base_1.TPromise.as(diffComputer.computeDiff());
        };
        // ---- END diff --------------------------------------------------------------------------
        EditorSimpleWorkerImpl.prototype.computeLinks = function (modelUrl) {
            var model = this._models[modelUrl];
            if (!model) {
                return null;
            }
            return winjs_base_1.TPromise.as(linkComputer_1.computeLinks(model));
        };
        // ---- BEGIN suggest --------------------------------------------------------------------------
        EditorSimpleWorkerImpl.prototype.textualSuggest = function (modelUrl, position, wordDef, wordDefFlags) {
            var model = this._models[modelUrl];
            if (!model) {
                return null;
            }
            return winjs_base_1.TPromise.as(this._suggestFiltered(model, position, new RegExp(wordDef, wordDefFlags)));
        };
        EditorSimpleWorkerImpl.prototype._suggestFiltered = function (model, position, wordDefRegExp) {
            var value = this._suggestUnfiltered(model, position, wordDefRegExp);
            var accept = modesFilters_1.DefaultFilter;
            // filter suggestions
            return [{
                    currentWord: value.currentWord,
                    suggestions: value.suggestions.filter(function (element) { return !!accept(value.currentWord, element); }),
                    incomplete: value.incomplete
                }];
        };
        EditorSimpleWorkerImpl.prototype._suggestUnfiltered = function (model, position, wordDefRegExp) {
            var currentWord = model.getWordUntilPosition(position, wordDefRegExp).word;
            var allWords = model.getAllUniqueWords(wordDefRegExp, currentWord);
            var suggestions = allWords.filter(function (word) {
                return !(/^-?\d*\.?\d/.test(word)); // filter out numbers
            }).map(function (word) {
                return {
                    type: 'text',
                    label: word,
                    codeSnippet: word,
                    noAutoAccept: true
                };
            });
            return {
                currentWord: currentWord,
                suggestions: suggestions
            };
        };
        // ---- END suggest --------------------------------------------------------------------------
        EditorSimpleWorkerImpl.prototype.navigateValueSet = function (modelUrl, range, up, wordDef, wordDefFlags) {
            var model = this._models[modelUrl];
            if (!model) {
                return null;
            }
            var wordDefRegExp = new RegExp(wordDef, wordDefFlags);
            if (range.startColumn === range.endColumn) {
                range.endColumn += 1;
            }
            var selectionText = model.getValueInRange(range);
            var wordRange = model.getWordAtPosition({ lineNumber: range.startLineNumber, column: range.startColumn }, wordDefRegExp);
            var word = null;
            if (wordRange !== null) {
                word = model.getValueInRange(wordRange);
            }
            var result = inplaceReplaceSupport_1.BasicInplaceReplace.INSTANCE.navigateValueSet(range, selectionText, wordRange, word, up);
            return winjs_base_1.TPromise.as(result);
        };
        return EditorSimpleWorkerImpl;
    }(editorSimpleWorkerCommon_1.EditorSimpleWorker));
    exports.EditorSimpleWorkerImpl = EditorSimpleWorkerImpl;
    /**
     * Called on the worker side
     */
    function create() {
        return new EditorSimpleWorkerImpl();
    }
    exports.create = create;
});

//# sourceMappingURL=editorSimpleWorker.js.map
