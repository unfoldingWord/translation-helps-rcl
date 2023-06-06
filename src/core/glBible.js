/**
 * This module encodes the GlBible type which encapsulates strings of the format: `${languageId}_${bibleName}`
 * @module core/glBible 
 * 
 * @typedef {string} ResourceLink a valid url path pointing to a Bible resource
 * @typedef {string} GlBible the name of a glBible (e.g: "hi_gst")
 * @typedef {string} LangId 
 * @typedef {string} BibleName 
 * @typedef {string} Owner 
 */

/**
 * A constructor for creating new GlBible. Th
 * 
 * @param {LangId} langId the languageId of the glBible
 * @param {BibleName} bibleName the bible name of the glBible
 * @returns {GlBible} a new glBible
 * @throws {InvalidArgumentException} the language id is invalid
 * @throws {InvalidArgumentException} the bible name is invalid
 */
export const glBible = (langId, bibleName) => `${langId}_${bibleName}`

/** 
 * @param {GlBible} glBible
 * @param {Owner} owner the owner of a repository (e.g: 'Door43-Catalog')
 * @returns {ResourceLink} the resource link for the glBible
 * @todo TEST!
 */
export const resourceLink = (owner, glBible) => `${owner}/${langId(glBible)}/${bibleName(glBible)}/master`;

/**
 * @param {GlBible} glBible
 * @returns {undefined | LangId} the language id of the glBible
 * @todo TEST!
 */
export const langId = (glBible) => glBible.split('_')[0];

/**
 *
 * @param {GlBible} glBible
 * @returns {undefined | BibleName} the bible name of the glBible
 * @todo TEST!
 */
export const bibleName = (glBible) => glBible.split('_')[1];