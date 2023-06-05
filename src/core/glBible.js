/**
 * @typedef {string} ResourceLink a valid url path pointing to a Bible resource
 * @typedef {string} GlBibleRepoName the name of a glBible (e.g: "hi_gst")
 * @param {GlBibleRepoName} glBible
 * @param {string} owner the owner of a repository (e.g: 'Door43-Catalog')
 * @returns {ResourceLink} the resource link for the glBible
 * @todo TEST!
 */
export const glBibleToResourceLink = (owner, glBible) => `${owner}/${glBibleLangId(glBible)}/${glBibleBible(glBible)}/master`;

/**
 * @param {GlBibleRepoName} glBible
 * @returns {undefined|string} the language id of the glBible
 * @todo TEST!
 */
export const glBibleLangId = (glBible) => glBible.split('_')[0];

/**
 *
 * @param {GlBibleRepoName} glBible
 * @returns {undefined | string} the bible of the glBible
 * @todo TEST!
 */
export const glBibleBible = (glBible) => glBible.split('_')[1];