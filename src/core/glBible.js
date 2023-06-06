/**
 * @typedef {string} ResourceLink a valid url path pointing to a Bible resource
 * @typedef {string} GlBible the name of a glBible (e.g: "hi_gst")
 */

/** 
 * @param {GlBible} glBible
 * @param {string} owner the owner of a repository (e.g: 'Door43-Catalog')
 * @returns {ResourceLink} the resource link for the glBible
 * @todo TEST!
 */
export const resourceLink = (owner, glBible) => `${owner}/${langId(glBible)}/${bibleName(glBible)}/master`;

/**
 * @param {GlBible} glBible
 * @returns {undefined | string} the language id of the glBible
 * @todo TEST!
 */
export const langId = (glBible) => glBible.split('_')[0];

/**
 *
 * @param {GlBible} glBible
 * @returns {undefined | string} the bible name of the glBible
 * @todo TEST!
 */
export const bibleName = (glBible) => glBible.split('_')[1];