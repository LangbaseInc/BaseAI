/**
 * Compares two arrays of documents and determines the relationship between them.
 *
 * @param {Object} params - The parameters for comparing the document lists.
 * @param {string[]} params.localDocs - The array of local documents.
 * @param {string[]} params.prodDocs - The array of production documents.
 *
 * @returns {Object} - An object containing the comparison results.
 * @property {boolean} areListsSame - Indicates whether the document lists are the same.
 * @property {boolean} isProdSubsetOfLocal - Indicates whether the production documents are a subset of the local documents.
 * @property {boolean} isProdSupersetOfLocal - Indicates whether the production documents are a superset of the local documents.
 */
export function compareDocumentLists({
	localDocs,
	prodDocs
}: {
	localDocs: string[];
	prodDocs: string[];
}) {
	const localSet = new Set(localDocs);
	const prodSet = new Set(prodDocs);

	// Case 1: Lists are the same
	const areListsSame =
		localSet.size === prodSet.size &&
		localDocs.every(doc => prodSet.has(doc));

	// Case 2: Prod is a subset of local
	const isProdSubsetOfLocal = prodDocs.every(doc => localSet.has(doc));

	// Case 3: Prod is a superset of local
	const isProdSupersetOfLocal = localDocs.every(doc => prodSet.has(doc));

	// Case 4: Lists are totally different
	const areMutuallyExclusive =
		!localDocs.some(doc => prodSet.has(doc)) &&
		!prodDocs.some(doc => localSet.has(doc));

	return {
		areListsSame,
		isProdSubsetOfLocal,
		isProdSupersetOfLocal,
		areMutuallyExclusive
	};
}
